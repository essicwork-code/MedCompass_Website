import type { Driver, LatLng, Place, Trip, Vehicle } from "./types";

/*
 * Demo fixtures for the MedCompass tracking prototype.
 *
 * Coordinates are real Chicago-area locations so the map reads correctly at
 * neighborhood zoom. Everything else — names, phone numbers, plates, USDOT
 * figures, rider identities — is invented. No real person or patient record is
 * represented here.
 */

export const SERVICE_CENTER: LatLng = [41.8781, -87.6298];

export const COMPANY = {
  name: "MedCompass",
  tagline: "Safe · Reliable · On-Time Transportation",
  phone: "(708) 555-0142",
  phoneHref: "+17085550142",
  dispatchPhone: "(708) 555-0100",
  email: "dispatch@medcompass.com",
  address: "4200 W Cermak Rd, Suite 210",
  city: "Cicero, IL 60804",
  usdot: "3914772",
  mc: "1447209",
  npi: "1043827715",
  hours: "Dispatch staffed 24/7 · Scheduled rides 4:00 AM – 11:00 PM daily",
} as const;

export const PLACES: Record<string, Place> = {
  rush: {
    id: "rush",
    name: "Rush University Medical Center",
    kind: "hospital",
    address: "1653 W Congress Pkwy",
    city: "Chicago",
    coord: [41.8747, -87.6673],
  },
  northwestern: {
    id: "northwestern",
    name: "Northwestern Memorial Hospital",
    kind: "hospital",
    address: "251 E Huron St",
    city: "Chicago",
    coord: [41.8947, -87.6214],
  },
  loyola: {
    id: "loyola",
    name: "Loyola University Medical Center",
    kind: "hospital",
    address: "2160 S 1st Ave",
    city: "Maywood",
    coord: [41.8639, -87.8353],
  },
  christ: {
    id: "christ",
    name: "Advocate Christ Medical Center",
    kind: "hospital",
    address: "4440 W 95th St",
    city: "Oak Lawn",
    coord: [41.7167, -87.7331],
  },
  mtsinai: {
    id: "mtsinai",
    name: "Mount Sinai Hospital",
    kind: "hospital",
    address: "1500 S California Ave",
    city: "Chicago",
    coord: [41.8592, -87.6947],
  },
  lakeshoreDialysis: {
    id: "lakeshoreDialysis",
    name: "Lakeshore Renal Care",
    kind: "dialysis",
    address: "3220 N Sheridan Rd",
    city: "Chicago",
    coord: [41.9403, -87.6444],
  },
  westsideDialysis: {
    id: "westsideDialysis",
    name: "Westside Kidney Center",
    kind: "dialysis",
    address: "5100 W Roosevelt Rd",
    city: "Cicero",
    coord: [41.8661, -87.7527],
  },
  southDialysis: {
    id: "southDialysis",
    name: "Southtown Dialysis Partners",
    kind: "dialysis",
    address: "8730 S Cicero Ave",
    city: "Oak Lawn",
    coord: [41.7345, -87.7412],
  },
  oakParkSnf: {
    id: "oakParkSnf",
    name: "Oak Park Rehabilitation & Living",
    kind: "snf",
    address: "625 Madison St",
    city: "Oak Park",
    coord: [41.8812, -87.7891],
  },
  evanstonSnf: {
    id: "evanstonSnf",
    name: "Lakeview Skilled Nursing",
    kind: "snf",
    address: "1300 Chicago Ave",
    city: "Evanston",
    coord: [42.0421, -87.6822],
  },
  berwynImaging: {
    id: "berwynImaging",
    name: "Berwyn Advanced Imaging",
    kind: "imaging",
    address: "3100 S Harlem Ave",
    city: "Berwyn",
    coord: [41.8331, -87.8034],
  },
  // Residences use block-level addresses only — never a unit number.
  res1: {
    id: "res1",
    name: "Residence — Oak Park",
    kind: "residence",
    address: "1100 block S Ridgeland Ave",
    city: "Oak Park",
    coord: [41.8709, -87.7936],
  },
  res2: {
    id: "res2",
    name: "Residence — Cicero",
    kind: "residence",
    address: "2400 block S 58th Ct",
    city: "Cicero",
    coord: [41.8452, -87.7623],
  },
  res3: {
    id: "res3",
    name: "Residence — Evanston",
    kind: "residence",
    address: "800 block Dodge Ave",
    city: "Evanston",
    coord: [42.0466, -87.6991],
  },
  res4: {
    id: "res4",
    name: "Residence — Berwyn",
    kind: "residence",
    address: "1900 block Oak Park Ave",
    city: "Berwyn",
    coord: [41.8489, -87.7942],
  },
  res5: {
    id: "res5",
    name: "Residence — Oak Lawn",
    kind: "residence",
    address: "9600 block S Menard Ave",
    city: "Oak Lawn",
    coord: [41.7186, -87.7688],
  },
  res6: {
    id: "res6",
    name: "Residence — Skokie",
    kind: "residence",
    address: "4700 block Oakton St",
    city: "Skokie",
    coord: [42.0287, -87.7452],
  },
};

export const DRIVERS: Driver[] = [
  {
    id: "d1",
    name: "Marcus Whitfield",
    initials: "MW",
    phone: "(708) 555-0171",
    tenureYears: 6,
    certifications: ["CPR/AED", "PASS", "Defensive Driving", "Wheelchair Securement"],
    rating: 4.9,
    completedTrips: 3182,
    },
  {
    id: "d2",
    name: "Rosa Delgado",
    initials: "RD",
    phone: "(708) 555-0172",
    tenureYears: 4,
    certifications: ["CPR/AED", "PASS", "Stretcher Transport", "Bariatric Handling"],
    rating: 5.0,
    completedTrips: 2044,
  },
  {
    id: "d3",
    name: "Andre Boykin",
    initials: "AB",
    phone: "(708) 555-0173",
    tenureYears: 9,
    certifications: ["CPR/AED", "PASS", "Defensive Driving", "First Aid"],
    rating: 4.8,
    completedTrips: 5310,
  },
  {
    id: "d4",
    name: "Priya Raghunathan",
    initials: "PR",
    phone: "(708) 555-0174",
    tenureYears: 2,
    certifications: ["CPR/AED", "Wheelchair Securement"],
    rating: 4.9,
    completedTrips: 918,
  },
  {
    id: "d5",
    name: "Tomasz Wnuk",
    initials: "TW",
    phone: "(708) 555-0175",
    tenureYears: 5,
    certifications: ["CPR/AED", "PASS", "Stretcher Transport"],
    rating: 4.7,
    completedTrips: 2673,
  },
  {
    id: "d6",
    name: "Danielle Foster",
    initials: "DF",
    phone: "(708) 555-0176",
    tenureYears: 3,
    certifications: ["CPR/AED", "PASS", "Defensive Driving"],
    rating: 4.9,
    completedTrips: 1487,
  },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "v1",
    unit: "MC-112",
    make: "RAM",
    model: "ProMaster 2500 High Roof",
    year: 2024,
    plate: "IL MC112",
    supports: ["wheelchair", "ambulatory"],
    wheelchairPositions: 2,
    ambulatorySeats: 3,
    lastInspection: "2026-06-02",
  },
  {
    id: "v2",
    unit: "MC-114",
    make: "RAM",
    model: "ProMaster 2500 High Roof",
    year: 2024,
    plate: "IL MC114",
    supports: ["wheelchair", "ambulatory", "bariatric"],
    wheelchairPositions: 2,
    ambulatorySeats: 2,
    lastInspection: "2026-05-19",
  },
  {
    id: "v3",
    unit: "MC-118",
    make: "Ford",
    model: "Transit 350 Medium Roof",
    year: 2023,
    plate: "IL MC118",
    supports: ["stretcher", "ambulatory"],
    wheelchairPositions: 0,
    ambulatorySeats: 2,
    lastInspection: "2026-06-24",
  },
  {
    id: "v4",
    unit: "MC-121",
    make: "RAM",
    model: "ProMaster 1500",
    year: 2025,
    plate: "IL MC121",
    supports: ["ambulatory"],
    wheelchairPositions: 0,
    ambulatorySeats: 6,
    lastInspection: "2026-07-08",
  },
  {
    id: "v5",
    unit: "MC-126",
    make: "Ford",
    model: "Transit 350 High Roof",
    year: 2024,
    plate: "IL MC126",
    supports: ["wheelchair", "ambulatory"],
    wheelchairPositions: 3,
    ambulatorySeats: 2,
    lastInspection: "2026-04-30",
  },
  {
    id: "v6",
    unit: "MC-130",
    make: "Chevrolet",
    model: "Express 3500",
    year: 2023,
    plate: "IL MC130",
    supports: ["wheelchair", "bariatric", "ambulatory"],
    wheelchairPositions: 1,
    ambulatorySeats: 4,
    lastInspection: "2026-06-11",
  },
];

/**
 * Builds a road-plausible polyline between two points.
 *
 * Real routing would need a directions API and a BAA; for the demo we fake the
 * shape of city driving instead. Chicago's street grid runs almost exactly
 * N/S/E/W, so stepping along one axis at a time with a slight bias produces a
 * path that looks like it followed actual arterials.
 *
 * Deterministic: the same endpoints always yield the same route, so a reload
 * doesn't reshuffle the map.
 */
export function buildRoute(from: LatLng, to: LatLng, seed = 1): LatLng[] {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const legs = 6;
  const pts: LatLng[] = [from];

  // Cheap deterministic PRNG so routes are stable across renders.
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 1; i < legs; i++) {
    const t = i / legs;
    const jitter = (rand() - 0.5) * 0.006;
    // Alternate which axis leads, mimicking turns onto cross streets.
    if (i % 2 === 1) {
      pts.push([lat1 + (lat2 - lat1) * t + jitter, lng1 + (lng2 - lng1) * (t - 1 / legs)]);
    } else {
      pts.push([lat1 + (lat2 - lat1) * (t - 1 / legs), lng1 + (lng2 - lng1) * t + jitter]);
    }
  }

  pts.push(to);
  return pts;
}

/** Minutes from now, as an ISO string. Keeps fixtures relative to page load. */
function offsetIso(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export const TRIPS: Trip[] = [
  {
    id: "t1",
    code: "MC-4821",
    riderName: "Eleanor Vance",
    riderInitials: "E.V.",
    mobility: "wheelchair",
    status: "en_route_pickup",
    pickup: PLACES.res1,
    dropoff: PLACES.westsideDialysis,
    scheduledAt: offsetIso(14),
    appointmentAt: offsetIso(45),
    vehicleId: "v1",
    driverId: "d1",
    route: buildRoute(PLACES.res1.coord, PLACES.westsideDialysis.coord, 11),
    progress: 0.22,
    recurring: true,
    isReturnLeg: false,
    notes: "Standing M/W/F order. Rider uses a transport chair; needs door-to-door assist.",
  },
  {
    id: "t2",
    code: "MC-4822",
    riderName: "Harold Kimura",
    riderInitials: "H.K.",
    mobility: "ambulatory",
    status: "onboard",
    pickup: PLACES.res2,
    dropoff: PLACES.rush,
    scheduledAt: offsetIso(-18),
    appointmentAt: offsetIso(30),
    vehicleId: "v4",
    driverId: "d3",
    route: buildRoute(PLACES.res2.coord, PLACES.rush.coord, 23),
    progress: 0.61,
    recurring: false,
    isReturnLeg: false,
    notes: "Cardiology follow-up. Daughter riding along as escort.",
  },
  {
    id: "t3",
    code: "MC-4823",
    riderName: "Beatrice Okonkwo",
    riderInitials: "B.O.",
    mobility: "stretcher",
    status: "onboard",
    pickup: PLACES.loyola,
    dropoff: PLACES.oakParkSnf,
    scheduledAt: offsetIso(-32),
    vehicleId: "v3",
    driverId: "d5",
    route: buildRoute(PLACES.loyola.coord, PLACES.oakParkSnf.coord, 31),
    progress: 0.44,
    recurring: false,
    isReturnLeg: false,
    notes: "Hospital discharge to SNF. Two-person carry at destination.",
  },
  {
    id: "t4",
    code: "MC-4824",
    riderName: "Sam Petrosyan",
    riderInitials: "S.P.",
    mobility: "wheelchair",
    status: "arrived_pickup",
    pickup: PLACES.res3,
    dropoff: PLACES.evanstonSnf,
    scheduledAt: offsetIso(-4),
    vehicleId: "v5",
    driverId: "d4",
    route: buildRoute(PLACES.res3.coord, PLACES.evanstonSnf.coord, 47),
    progress: 0.02,
    recurring: false,
    isReturnLeg: false,
  },
  {
    id: "t5",
    code: "MC-4825",
    riderName: "Gloria Mendez",
    riderInitials: "G.M.",
    mobility: "wheelchair",
    status: "en_route_pickup",
    pickup: PLACES.res5,
    dropoff: PLACES.southDialysis,
    scheduledAt: offsetIso(22),
    appointmentAt: offsetIso(55),
    vehicleId: "v6",
    driverId: "d6",
    route: buildRoute(PLACES.res5.coord, PLACES.southDialysis.coord, 53),
    progress: 0.13,
    recurring: true,
    isReturnLeg: false,
    notes: "Standing T/Th/Sa order.",
  },
  {
    id: "t6",
    code: "MC-4826",
    riderName: "Walter Brzezinski",
    riderInitials: "W.B.",
    mobility: "bariatric",
    status: "onboard",
    pickup: PLACES.res4,
    dropoff: PLACES.berwynImaging,
    scheduledAt: offsetIso(-11),
    appointmentAt: offsetIso(24),
    vehicleId: "v2",
    driverId: "d2",
    route: buildRoute(PLACES.res4.coord, PLACES.berwynImaging.coord, 67),
    progress: 0.71,
    recurring: false,
    isReturnLeg: false,
    notes: "Bariatric lift required. Confirm 500 lb capacity chair on arrival.",
  },
  {
    id: "t7",
    code: "MC-4827",
    riderName: "Ida Thompson",
    riderInitials: "I.T.",
    mobility: "ambulatory",
    status: "scheduled",
    pickup: PLACES.res6,
    dropoff: PLACES.northwestern,
    scheduledAt: offsetIso(78),
    appointmentAt: offsetIso(120),
    vehicleId: "v4",
    driverId: "d3",
    route: buildRoute(PLACES.res6.coord, PLACES.northwestern.coord, 71),
    progress: 0,
    recurring: false,
    isReturnLeg: false,
  },
  {
    id: "t8",
    code: "MC-4819",
    riderName: "Eleanor Vance",
    riderInitials: "E.V.",
    mobility: "wheelchair",
    status: "completed",
    pickup: PLACES.westsideDialysis,
    dropoff: PLACES.res1,
    scheduledAt: offsetIso(-1420),
    vehicleId: "v1",
    driverId: "d1",
    route: buildRoute(PLACES.westsideDialysis.coord, PLACES.res1.coord, 83),
    progress: 1,
    recurring: true,
    isReturnLeg: true,
  },
];

export const DRIVER_BY_ID = Object.fromEntries(DRIVERS.map((d) => [d.id, d]));
export const VEHICLE_BY_ID = Object.fromEntries(VEHICLES.map((v) => [v.id, v]));
