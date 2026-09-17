export type LatLng = [lat: number, lng: number];

export type MobilityType = "ambulatory" | "wheelchair" | "stretcher" | "bariatric";

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

