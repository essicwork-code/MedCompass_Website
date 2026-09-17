import type { LatLng } from "./demo/types";
import { COURIER_STAT_FEE, type Service } from "./content";

/*
 * Shared quote math, used by both the booking wizard and the standalone cost
 * calculator so the two never quietly drift apart on how a price is derived.
 */

/** Straight-line distance underestimates driving; city grids add roughly 25%. */
export const ROAD_FACTOR = 1.25;
export const KM_TO_MILES = 0.621371;

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two lat/lng points, in kilometers. */
export function haversineKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface Quote {
  miles: number;
  oneWay: number;
  /** Courier STAT surcharge, charged once per order; 0 otherwise. */
  rushFee: number;
  total: number;
}

export function computeQuote(
  service: Service,
  from: LatLng,
  to: LatLng,
  roundTrip: boolean,
  stat = false,
): Quote {
  const miles = haversineKm(from, to) * KM_TO_MILES * ROAD_FACTOR;
  const oneWay = service.fromPrice + miles * service.perMile;
  const rushFee = stat && service.slug === "courier" ? COURIER_STAT_FEE : 0;
  const total = (roundTrip ? oneWay * 2 : oneWay) + rushFee;
  return { miles, oneWay, rushFee, total };
}
