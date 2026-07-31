import { haversineKm } from "./demo/simulator";
import type { LatLng } from "./demo/types";
import type { Service } from "./content";

/*
 * Shared quote math, used by both the booking wizard and the standalone cost
 * calculator so the two never quietly drift apart on how a price is derived.
 */

/** Straight-line distance underestimates driving; city grids add roughly 25%. */
export const ROAD_FACTOR = 1.25;
export const KM_TO_MILES = 0.621371;

export interface Quote {
  miles: number;
  oneWay: number;
  total: number;
}

export function computeQuote(service: Service, from: LatLng, to: LatLng, roundTrip: boolean): Quote {
  const miles = haversineKm(from, to) * KM_TO_MILES * ROAD_FACTOR;
  const oneWay = service.fromPrice + miles * service.perMile;
  const total = roundTrip ? oneWay * 2 : oneWay;
  return { miles, oneWay, total };
}
