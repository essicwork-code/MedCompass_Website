"use client";

import { useEffect, useState } from "react";
import { createFleetSimulation, type FleetSnapshot, type LiveTrip } from "./simulator";

/**
 * Subscribes to the fleet simulation.
 *
 * Consumers never touch the simulator directly, so replacing it with a real
 * driver-location feed later is a change to this file alone.
 */
export function useFleet(tripIds?: string[]): LiveTrip[] {
  const [snapshot, setSnapshot] = useState<FleetSnapshot>({ trips: [], at: 0 });

  useEffect(() => {
    return createFleetSimulation(setSnapshot, { tripIds });
    // tripIds is a stable literal at every call site; joining keeps the effect
    // from resubscribing on each render when callers pass an inline array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripIds?.join(",")]);

  return snapshot.trips;
}

export function useTrip(tripId: string): LiveTrip | undefined {
  const trips = useFleet([tripId]);
  return trips[0];
}
