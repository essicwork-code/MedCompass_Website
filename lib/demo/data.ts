import type { LatLng, Place } from "./types";

/*
 * Demo fixtures for the MedCompass marketing site.
 *
 * Coordinates are real Chicago-area locations so the service-area map reads
 * correctly at neighborhood zoom. Everything else — names, phone numbers,
 * USDOT figures — is invented. No real person or patient record is
 * represented here.
 */

export const SERVICE_CENTER: LatLng = [41.8781, -87.6298];

export const COMPANY = {
  name: "Ride MedCompass",
  tagline: "Safe · Reliable · On-Time Transportation",
  phone: "(773) 839-4474",
  phoneHref: "+17738394474",
  email: "dispatch@ridemedcompass.com",
  address: "4200 W Cermak Rd, Suite 210",
  city: "Cicero, IL 60804",
  usdot: "3914772",
  mc: "1447209",
  npi: "1043827715",
  hours: "Dispatch staffed 24/7 · Scheduled rides 4:00 AM to 11:00 PM daily",
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
    name: "Residence in Oak Park",
    kind: "residence",
    address: "1100 block S Ridgeland Ave",
    city: "Oak Park",
    coord: [41.8709, -87.7936],
  },
  res2: {
    id: "res2",
    name: "Residence in Cicero",
    kind: "residence",
    address: "2400 block S 58th Ct",
    city: "Cicero",
    coord: [41.8452, -87.7623],
  },
  res3: {
    id: "res3",
    name: "Residence in Evanston",
    kind: "residence",
    address: "800 block Dodge Ave",
    city: "Evanston",
    coord: [42.0466, -87.6991],
  },
  res4: {
    id: "res4",
    name: "Residence in Berwyn",
    kind: "residence",
    address: "1900 block Oak Park Ave",
    city: "Berwyn",
    coord: [41.8489, -87.7942],
  },
  res5: {
    id: "res5",
    name: "Residence in Oak Lawn",
    kind: "residence",
    address: "9600 block S Menard Ave",
    city: "Oak Lawn",
    coord: [41.7186, -87.7688],
  },
  res6: {
    id: "res6",
    name: "Residence in Skokie",
    kind: "residence",
    address: "4700 block Oakton St",
    city: "Skokie",
    coord: [42.0287, -87.7452],
  },
};

