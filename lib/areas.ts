import { PLACES, SERVICE_CENTER } from "./demo/data";
import type { LatLng, Place } from "./demo/types";
import { KM_TO_MILES, ROAD_FACTOR, haversineKm } from "./quote";

/*
 * Community pages. Every figure on those pages is derived from real
 * coordinates (town centers and hospitals verified against OpenStreetMap)
 * and the published rates, so each page carries information specific to
 * that town rather than the same copy with the name swapped.
 */

export type CoverageTier = "core" | "extended" | "scheduled";

export interface Area {
  slug: string;
  name: string;
  county: string;
  center: LatLng;
  /** One line of local context a resident would recognise. */
  context: string;
}

/** Radii match the rings drawn on the service-area map (components/CoverageMap.tsx). */
export const CORE_RADIUS_KM = 19;
export const EXTENDED_RADIUS_KM = 36;

export const AREAS: Area[] = [
  {
    slug: "chicago",
    name: "Chicago",
    county: "Cook County",
    center: [41.8756, -87.6244],
    context: "From the Loop and the Illinois Medical District out to the far North, West and South Sides.",
  },
  {
    slug: "cicero",
    name: "Cicero",
    county: "Cook County",
    center: [41.8455, -87.754],
    context: "Cicero sits just west of Chicago, a short run to the Illinois Medical District and to Loyola in Maywood.",
  },
  {
    slug: "berwyn",
    name: "Berwyn",
    county: "Cook County",
    center: [41.8506, -87.7937],
    context: "Berwyn is home to MacNeal Hospital, one of the most common pickup and drop-off points on the near west side.",
  },
  {
    slug: "oak-park",
    name: "Oak Park",
    county: "Cook County",
    center: [41.8878, -87.7888],
    context: "Oak Park has Rush Oak Park Hospital in town and sits minutes from Loyola and the Illinois Medical District.",
  },
  {
    slug: "maywood",
    name: "Maywood",
    county: "Cook County",
    center: [41.879, -87.8436],
    context: "Maywood is where Loyola University Medical Center is, with the Hines VA Hospital right next door.",
  },
  {
    slug: "evanston",
    name: "Evanston",
    county: "Cook County",
    center: [42.047, -87.6846],
    context: "Evanston has Evanston Hospital on Ridge Avenue, and many riders here travel into downtown Chicago for specialist care.",
  },
  {
    slug: "skokie",
    name: "Skokie",
    county: "Cook County",
    center: [42.0263, -87.7521],
    context: "Skokie borders Evanston, with Evanston Hospital and Lutheran General in Park Ridge both close by.",
  },
  {
    slug: "park-ridge",
    name: "Park Ridge",
    county: "Cook County",
    center: [42.0112, -87.8406],
    context: "Park Ridge is home to Advocate Lutheran General Hospital on Dempster Street.",
  },
  {
    slug: "des-plaines",
    name: "Des Plaines",
    county: "Cook County",
    center: [42.0416, -87.8874],
    context: "Des Plaines sits by O'Hare, next to Park Ridge and Lutheran General Hospital.",
  },
  {
    slug: "oak-lawn",
    name: "Oak Lawn",
    county: "Cook County",
    center: [41.7109, -87.7581],
    context: "Oak Lawn is home to Advocate Christ Medical Center, a major southwest-side destination for discharges and dialysis.",
  },
  {
    slug: "orland-park",
    name: "Orland Park",
    county: "Cook County",
    center: [41.6307, -87.8536],
    context: "Orland Park riders most often travel to Christ Medical Center in Oak Lawn or into the city for specialists.",
  },
  {
    slug: "tinley-park",
    name: "Tinley Park",
    county: "Cook and Will Counties",
    center: [41.5734, -87.7845],
    context: "Tinley Park straddles Cook and Will Counties on the far southwest side of the metro.",
  },
  {
    slug: "elmhurst",
    name: "Elmhurst",
    county: "DuPage County",
    center: [41.8995, -87.9403],
    context: "Elmhurst is in eastern DuPage County, a short drive from Loyola and the Hines VA in Maywood.",
  },
  {
    slug: "downers-grove",
    name: "Downers Grove",
    county: "DuPage County",
    center: [41.7937, -88.0102],
    context: "Downers Grove is in DuPage County along the I-88 and I-355 corridors.",
  },
  {
    slug: "naperville",
    name: "Naperville",
    county: "DuPage and Will Counties",
    center: [41.7729, -88.1479],
    context: "Naperville spans DuPage and Will Counties, and many trips from here head east to Loyola or into Chicago.",
  },
  {
    slug: "aurora",
    name: "Aurora",
    county: "Kane County",
    center: [41.7572, -88.3148],
    context: "Aurora is Illinois' second-largest city, at the western edge of the metro in Kane County.",
  },
];

export const AREA_BY_SLUG: Record<string, Area> = Object.fromEntries(AREAS.map((a) => [a.slug, a]));

export function distanceFromBaseKm(area: Area): number {
  return haversineKm(SERVICE_CENTER, area.center);
}

export function coverageTier(area: Area): CoverageTier {
  const km = distanceFromBaseKm(area);
  if (km <= CORE_RADIUS_KM) return "core";
  if (km <= EXTENDED_RADIUS_KM) return "extended";
  return "scheduled";
}

export const TIER_COPY: Record<CoverageTier, { label: string; notice: string }> = {
  core: {
    label: "Core service area",
    notice: "Same-day capacity is held back for discharges, and routine rides need 24 hours' notice.",
  },
  extended: {
    label: "Extended service area",
    notice: "Book 24 hours ahead for guaranteed capacity. Same-day rides depend on what's on the board.",
  },
  scheduled: {
    label: "Scheduled service",
    notice:
      "This is beyond our extended ring, so trips run on a scheduled basis. Book at least 24 hours ahead, and a day or two more for standing orders.",
  },
};

export interface NearbyHospital {
  place: Place;
  /** Estimated road miles, same formula as the quote. */
  miles: number;
}

export function nearestHospitals(area: Area, count = 3): NearbyHospital[] {
  return Object.values(PLACES)
    .map((place) => ({ place, miles: haversineKm(area.center, place.coord) * KM_TO_MILES * ROAD_FACTOR }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count);
}

export function nearbyAreas(area: Area, count = 4): Area[] {
  return AREAS.filter((a) => a.slug !== area.slug)
    .sort((a, b) => haversineKm(area.center, a.center) - haversineKm(area.center, b.center))
    .slice(0, count);
}
