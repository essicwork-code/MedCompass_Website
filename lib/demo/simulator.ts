import { buildRoute, TRIPS } from "./data";
import type { LatLng, Trip, TripStatus } from "./types";

/*
 * Client-side fleet simulation.
 *
 * The prototype ships as a static export, so there is no server pushing GPS
 * pings. This module fabricates that motion in the browser instead. It is the
 * single seam between "demo" and "real": swapping to live data means replacing
 * `createFleetSimulation` with a subscription to the driver-location API and
 * leaving every consumer untouched.
 */

/** Nominal city speed. Chicago arterials with lights, not highway speed. */
const AVG_SPEED_KMH = 32;

/**
 * Wall-clock is too slow to show anything in a demo — a 20-minute ride would
 * take 20 minutes. Compress it so motion is visible within a few seconds
 * without looking like the vans are teleporting.
 *
 * Tuned down from an initial 45x, which finished every trip in about twelve
 * seconds and left the "live" homepage demo sitting on "Arrived".
 */
const TIME_COMPRESSION = 11;

/** Ticks a van waits at a curb before the next stage. Keeps arrivals readable. */
const DWELL_TICKS = 6;

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function routeLengthKm(route: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) total += haversineKm(route[i - 1], route[i]);
  return total;
}

/** Interpolates a position at `t` (0..1) measured by distance, not by index. */
export function pointAlong(route: LatLng[], t: number): LatLng {
  if (route.length === 0) return [0, 0];
  if (route.length === 1) return route[0];
  const clamped = Math.min(1, Math.max(0, t));
  const target = routeLengthKm(route) * clamped;

  let travelled = 0;
  for (let i = 1; i < route.length; i++) {
    const segment = haversineKm(route[i - 1], route[i]);
    if (travelled + segment >= target) {
      const within = segment === 0 ? 0 : (target - travelled) / segment;
      return [
        route[i - 1][0] + (route[i][0] - route[i - 1][0]) * within,
        route[i - 1][1] + (route[i][1] - route[i - 1][1]) * within,
      ];
    }
    travelled += segment;
  }
  return route[route.length - 1];
}

/** Compass bearing in degrees, used to rotate the vehicle marker. */
export function bearingAlong(route: LatLng[], t: number): number {
  const here = pointAlong(route, t);
  const ahead = pointAlong(route, Math.min(1, t + 0.02));
  const dLng = toRad(ahead[1] - here[1]);
  const lat1 = toRad(here[0]);
  const lat2 = toRad(ahead[0]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * The leg a van is physically driving right now.
 *
 * Before pickup the van is approaching from wherever its last drop-off left it;
 * that staging point is a simulation artifact, not domain data, so it is
 * derived here rather than stored on the trip.
 */
function approachLeg(trip: Trip): LatLng[] {
  const [lat, lng] = trip.pickup.coord;
  // Deterministic offset from the trip id so a van doesn't jump between reloads.
  const seed = trip.id.charCodeAt(trip.id.length - 1);
  const angle = (seed % 8) * (Math.PI / 4);
  const staging: LatLng = [lat + Math.sin(angle) * 0.028, lng + Math.cos(angle) * 0.034];
  return buildRoute(staging, trip.pickup.coord, seed);
}

const PRE_PICKUP: TripStatus[] = ["scheduled", "assigned", "en_route_pickup"];

export function activeLeg(trip: Trip): LatLng[] {
  return PRE_PICKUP.includes(trip.status) ? approachLeg(trip) : trip.route;
}

export interface LiveTrip {
  trip: Trip;
  position: LatLng;
  bearing: number;
  /** Minutes until the end of the current leg. Null once the trip is closed. */
  etaMinutes: number | null;
  /** Distance remaining on the current leg, in miles. */
  milesRemaining: number;
  progress: number;
}

/** Everything moving right now, plus the moment it was measured. */
export interface FleetSnapshot {
  trips: LiveTrip[];
  at: number;
}

function project(trip: Trip, progress: number): LiveTrip {
  const leg = activeLeg(trip);
  const remainingKm = routeLengthKm(leg) * (1 - progress);
  const closed = trip.status === "completed" || trip.status === "cancelled";

  return {
    trip,
    position: pointAlong(leg, progress),
    bearing: bearingAlong(leg, progress),
    etaMinutes: closed ? null : Math.max(1, Math.round((remainingKm / AVG_SPEED_KMH) * 60)),
    milesRemaining: remainingKm * 0.621371,
    progress,
  };
}

interface StepState {
  progress: number;
  status: TripStatus;
  /** Ticks remaining at a curb. Zero means the van is driving. */
  dwell: number;
}

/**
 * Advances a trip one tick and rolls its status forward when a leg finishes.
 *
 * Only two statuses involve driving — `en_route_pickup` covers the approach and
 * `onboard` covers the ride itself. The arrival statuses are stationary dwells,
 * so they burn down a tick counter instead of traversing a route; without that
 * an "arrived" van would immediately drive the whole route a second time.
 */
function step(
  trip: Trip,
  state: StepState,
  dtSeconds: number,
  loop: boolean,
): StepState {
  const { progress, status, dwell } = state;

  if (status === "cancelled") return state;

  // Stationary stages: wait, then hand off to the next stage.
  if (status === "arrived_pickup") {
    if (dwell > 0) return { ...state, dwell: dwell - 1 };
    return { progress: 0, status: "onboard", dwell: 0 };
  }

  if (status === "arrived_dest") {
    if (dwell > 0) return { ...state, dwell: dwell - 1 };
    return { progress: 1, status: "completed", dwell: DWELL_TICKS };
  }

  if (status === "completed" || status === "scheduled") {
    // Looping keeps the marketing pages in perpetual motion; without it the
    // homepage hero settles on "Arrived" within a minute and stays there.
    if (loop && status === "completed") {
      if (dwell > 0) return { ...state, dwell: dwell - 1 };
      return { progress: 0, status: "en_route_pickup", dwell: 0 };
    }
    return state;
  }

  const leg = activeLeg(trip);
  const lengthKm = routeLengthKm(leg);
  if (lengthKm === 0) return { progress: 1, status, dwell: 0 };

  const kmThisTick = (AVG_SPEED_KMH * (dtSeconds * TIME_COMPRESSION)) / 3600;
  const next = progress + kmThisTick / lengthKm;

  if (next < 1) return { progress: next, status, dwell: 0 };

  switch (status) {
    case "en_route_pickup":
      return { progress: 0, status: "arrived_pickup", dwell: DWELL_TICKS };
    case "onboard":
      return { progress: 1, status: "arrived_dest", dwell: DWELL_TICKS };
    default:
      return { progress: 1, status, dwell: 0 };
  }
}

export type FleetListener = (snapshot: FleetSnapshot) => void;

/**
 * Starts the simulation and returns an unsubscribe function.
 *
 * `tripIds` narrows the simulation to a subset — the client portal watches one
 * trip, the dispatch board watches everything.
 */
export function createFleetSimulation(
  listener: FleetListener,
  options: { tripIds?: string[]; tickMs?: number; loop?: boolean } = {},
): () => void {
  const tickMs = options.tickMs ?? 1000;
  const loop = options.loop ?? true;
  const watched = options.tripIds
    ? TRIPS.filter((t) => options.tripIds!.includes(t.id))
    : TRIPS;

  // Local mutable copies so the simulation never mutates the exported fixtures.
  // `seedStatus` records how a trip started: a fixture seeded as completed is
  // history, so looping it would resurrect a finished trip onto the dispatch
  // board while the client portal still lists it under past rides.
  const state = watched.map((t) => ({
    trip: { ...t },
    progress: t.progress,
    status: t.status,
    seedStatus: t.status,
    dwell: 0,
  }));

  const emit = () => {
    listener({
      trips: state.map((s) => project({ ...s.trip, status: s.status }, s.progress)),
      at: Date.now(),
    });
  };

  emit();

  const id = setInterval(() => {
    for (const s of state) {
      const next = step(
        { ...s.trip, status: s.status },
        { progress: s.progress, status: s.status, dwell: s.dwell },
        tickMs / 1000,
        loop && s.seedStatus !== "completed" && s.seedStatus !== "cancelled",
      );
      s.progress = next.progress;
      s.status = next.status;
      s.dwell = next.dwell;
    }
    emit();
  }, tickMs);

  return () => clearInterval(id);
}

export const STATUS_COPY: Record<TripStatus, { label: string; client: string }> = {
  scheduled: { label: "Scheduled", client: "Your ride is booked and confirmed." },
  assigned: { label: "Driver assigned", client: "A driver and van have been assigned." },
  en_route_pickup: { label: "En route to pickup", client: "Your driver is on the way to you." },
  arrived_pickup: { label: "Arrived at pickup", client: "Your driver has arrived and is waiting." },
  onboard: { label: "On board", client: "You're on your way." },
  arrived_dest: { label: "Arrived", client: "You've arrived at your destination." },
  completed: { label: "Completed", client: "This trip is complete." },
  cancelled: { label: "Cancelled", client: "This trip was cancelled." },
};
