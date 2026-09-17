export type LatLng = [lat: number, lng: number];

export type MobilityType = "ambulatory" | "wheelchair" | "stretcher" | "bariatric";

export type PlaceKind = "hospital";

export interface Place {
  id: string;
  name: string;
  kind: PlaceKind;
  /** Street line only. */
  address: string;
  city: string;
  coord: LatLng;
}

