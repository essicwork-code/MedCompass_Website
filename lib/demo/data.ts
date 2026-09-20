import type { LatLng, Place } from "./types";

/*
 * Demo fixtures for the MedCompass marketing site.
 *
 * Hospital names, addresses and coordinates are real public locations. No
 * real person or patient record is represented here.
 */

export const SERVICE_CENTER: LatLng = [41.8781, -87.6298];

export const COMPANY = {
  name: "MedCompass",
  tagline: "Safe · Reliable · On-Time Transportation",
  phone: "(773) 839-4474",
  phoneHref: "+17738394474",
  email: "dispatch@ridemedcompass.com",
  address: "10735 S Western Ave, Ste 6 #373",
  city: "Chicago, IL 60643",
  hours: "Dispatch staffed 24/7 · Scheduled rides 4:00 AM to 11:00 PM daily",
} as const;

/**
 * Major Chicagoland hospitals offered as one-tap pickup/destination shortcuts.
 * Real public addresses, verified against OpenStreetMap; any other address is
 * typed into the address field instead. Listing a hospital here does not
 * imply a partnership with it.
 */
export const PLACES: Record<string, Place> = {
  rush: {
    id: "rush",
    name: "Rush University Medical Center",
    kind: "hospital",
    address: "1653 W Congress Pkwy",
    city: "Chicago",
    coord: [41.8746, -87.6691],
  },
  northwestern: {
    id: "northwestern",
    name: "Northwestern Memorial Hospital",
    kind: "hospital",
    address: "251 E Huron St",
    city: "Chicago",
    coord: [41.8946, -87.6234],
  },
  uiHealth: {
    id: "uiHealth",
    name: "University of Illinois Hospital",
    kind: "hospital",
    address: "1740 W Taylor St",
    city: "Chicago",
    coord: [41.8697, -87.6705],
  },
  stroger: {
    id: "stroger",
    name: "John H. Stroger Jr. Hospital of Cook County",
    kind: "hospital",
    address: "1969 W Ogden Ave",
    city: "Chicago",
    coord: [41.8722, -87.6739],
  },
  mtsinai: {
    id: "mtsinai",
    name: "Mount Sinai Hospital",
    kind: "hospital",
    address: "1500 S Fairfield Ave",
    city: "Chicago",
    coord: [41.8618, -87.6936],
  },
  uchicago: {
    id: "uchicago",
    name: "University of Chicago Medical Center",
    kind: "hospital",
    address: "5841 S Maryland Ave",
    city: "Chicago",
    coord: [41.7904, -87.6049],
  },
  loyola: {
    id: "loyola",
    name: "Loyola University Medical Center",
    kind: "hospital",
    address: "2160 S 1st Ave",
    city: "Maywood",
    coord: [41.8611, -87.8348],
  },
  hines: {
    id: "hines",
    name: "Edward Hines Jr. VA Hospital",
    kind: "hospital",
    address: "5000 S 5th Ave",
    city: "Hines",
    coord: [41.8575, -87.84],
  },
  rushOakPark: {
    id: "rushOakPark",
    name: "Rush Oak Park Hospital",
    kind: "hospital",
    address: "520 S Maple Ave",
    city: "Oak Park",
    coord: [41.8789, -87.8031],
  },
  macneal: {
    id: "macneal",
    name: "MacNeal Hospital",
    kind: "hospital",
    address: "3249 S Oak Park Ave",
    city: "Berwyn",
    coord: [41.8307, -87.7929],
  },
  christ: {
    id: "christ",
    name: "Advocate Christ Medical Center",
    kind: "hospital",
    address: "4440 W 95th St",
    city: "Oak Lawn",
    coord: [41.7236, -87.7321],
  },
  lutheranGeneral: {
    id: "lutheranGeneral",
    name: "Advocate Lutheran General Hospital",
    kind: "hospital",
    address: "1775 Dempster St",
    city: "Park Ridge",
    coord: [42.0395, -87.8501],
  },
  evanston: {
    id: "evanston",
    name: "Evanston Hospital",
    kind: "hospital",
    address: "2650 Ridge Ave",
    city: "Evanston",
    coord: [42.066, -87.6843],
  },
};

