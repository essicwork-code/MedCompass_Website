/*
 * Site photography.
 *
 * One entry per image, with the exact dimensions of the file in
 * public/photos so pages can reserve the space before it loads and nothing
 * shifts. Sources are the full-size PNGs in Assets/generated; regenerate the
 * WebP files with `node scripts/prepare-site-photos.mjs`.
 *
 * These are illustrative photographs created for the site, not photographs of
 * identified riders or of named staff. The footer says so, and
 * public/photos/CREDITS.md records it.
 */
export interface SitePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const photo = (name: string, width: number, height: number, alt: string): SitePhoto => ({
  src: `/photos/${name}.webp`,
  width,
  height,
  alt,
});

export const PHOTOS = {
  homeHero: photo(
    "home-hero",
    1800,
    1450,
    "A MedCompass driver guiding an older woman in her wheelchair up the ramp into a wheelchair-accessible van outside a Chicago two-flat",
  ),
  homeSecure: photo(
    "home-secure",
    1100,
    1100,
    "A rider secured in her wheelchair inside the van with four tie-down straps, her daughter seated beside her",
  ),
  wheelchairSecurement: photo(
    "wheelchair-securement",
    1600,
    1600,
    "A driver fastening a retractable tie-down strap to the floor track at the wheel of a rider's wheelchair",
  ),
  ambulatoryAssist: photo(
    "ambulatory-assist",
    1600,
    1073,
    "A driver offering his arm to an older man with a cane on the front steps of his home, the van waiting at the curb",
  ),
  stretcherLoading: photo(
    "stretcher-loading",
    1800,
    1208,
    "Two MedCompass crew members loading a rider on a stretcher into the van at a hospital entrance",
  ),
  stretcherTransport: photo(
    "stretcher-transport",
    1600,
    1073,
    "Two crew members wheeling a rider on a stretcher out of a nursing facility toward the waiting van",
  ),
  bariatricLift: photo(
    "bariatric-lift",
    1600,
    1073,
    "Two crew members steadying a bariatric wheelchair on the extra-wide hydraulic lift of the van",
  ),
  courierHandoff: photo(
    "courier-handoff",
    1600,
    1073,
    "A MedCompass courier handing a sealed specimen cooler to a laboratory technician who signs for it on a tablet",
  ),
  clinicHandoff: photo(
    "clinic-handoff",
    1600,
    1073,
    "A driver bringing a rider to the clinic reception desk and handing him to the receptionist",
  ),
  dischargePlanner: photo(
    "discharge-planner",
    1600,
    1073,
    "A hospital discharge planner confirming a pickup time with a MedCompass crew member at a nurses' station",
  ),
  familyBooking: photo(
    "family-booking",
    1600,
    1073,
    "A woman at her kitchen table watching the live map of her mother's ride on a laptop",
  ),
  fleetLineup: photo(
    "fleet-lineup",
    1920,
    1072,
    "Three MedCompass wheelchair vans parked in a row outside the fleet garage at golden hour",
  ),
  crewTeam: photo(
    "crew-team",
    1800,
    1208,
    "Five MedCompass crew members in uniform talking together beside a van",
  ),
  dialysisArrival: photo(
    "dialysis-arrival",
    1600,
    1073,
    "A driver wheeling a rider into a dialysis center at dawn as a staff member holds the door",
  ),
  pretripCheck: photo(
    "pretrip-check",
    1600,
    1073,
    "A driver checking the ramp and tie-down straps during the pre-trip safety inspection",
  ),
  dispatchDesk: photo(
    "dispatch-desk",
    1600,
    1073,
    "A MedCompass dispatcher at her desk with a live map of vehicles and the day's schedule on screen",
  ),
} as const satisfies Record<string, SitePhoto>;

/** The photo that leads each service page, by service slug. */
export const SERVICE_PHOTOS: Record<string, SitePhoto> = {
  wheelchair: PHOTOS.wheelchairSecurement,
  ambulatory: PHOTOS.ambulatoryAssist,
  stretcher: PHOTOS.stretcherTransport,
  bariatric: PHOTOS.bariatricLift,
  courier: PHOTOS.courierHandoff,
};
