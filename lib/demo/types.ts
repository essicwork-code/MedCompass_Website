export type LatLng = [lat: number, lng: number];

export type MobilityType = "ambulatory" | "wheelchair" | "stretcher" | "bariatric";

/** Ordered lifecycle. Index position is meaningful — the client timeline renders in this order. */
export const TRIP_STAGES = [
  "scheduled",
  "assigned",
  "en_route_pickup",
  "arrived_pickup",
  "onboard",
  "arrived_dest",
  "completed",
] as const;

export type TripStatus = (typeof TRIP_STAGES)[number] | "cancelled";

export type PlaceKind =
  | "hospital"
  | "dialysis"
  | "snf"
  | "clinic"
  | "imaging"
  | "residence";

export interface Place {
  id: string;
  name: string;
  kind: PlaceKind;
  /** Street line only. Demo data — not a real address. */
  address: string;
  city: string;
  coord: LatLng;
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  /** Years with MedCompass. Used as a trust signal in the client portal. */
  tenureYears: number;
  certifications: string[];
  rating: number;
  completedTrips: number;
}

export interface Vehicle {
  id: string;
  /** Fleet-facing unit number, e.g. "MC-114". Shown to clients instead of a plate. */
  unit: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  supports: MobilityType[];
  wheelchairPositions: number;
  ambulatorySeats: number;
  /** ISO date. Drives the compliance column in the admin fleet table. */
  lastInspection: string;
}

export interface Trip {
  id: string;
  /** Short human code used on the phone with dispatch, e.g. "MC-4821". */
  code: string;
  /** Rider initials only in list views; full name is gated behind the detail pane. */
  riderName: string;
  riderInitials: string;
  mobility: MobilityType;
  status: TripStatus;
  pickup: Place;
  dropoff: Place;
  /** ISO timestamp of the scheduled pickup. */
  scheduledAt: string;
  /** ISO timestamp of the appointment the ride is serving, when known. */
  appointmentAt?: string;
  vehicleId: string;
  driverId: string;
  /** Precomputed polyline the simulator walks along. */
  route: LatLng[];
  /** 0..1 position along `route`. Advanced by the simulator. */
  progress: number;
  /** Whether this trip is a recurring standing order (dialysis, infusion). */
  recurring: boolean;
  isReturnLeg: boolean;
  notes?: string;
}

/**
 * The minimum a public share-link viewer is allowed to see.
 *
 * Deliberately excludes rider name, mobility type, notes, and the destination's
 * facility name — a link forwarded to a group chat should not leak a diagnosis.
 * See CLAUDE.md "PHI boundary".
 */
export interface PublicTripView {
  code: string;
  status: TripStatus;
  vehicleUnit: string;
  driverFirstName: string;
  position: LatLng;
  etaMinutes: number | null;
  /** Coarse label like "a dialysis appointment" — never the facility name. */
  destinationLabel: string;
  updatedAt: string;
}
