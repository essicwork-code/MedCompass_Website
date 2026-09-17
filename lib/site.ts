/** The production origin, used for canonical URLs, the sitemap and structured data. */
export const SITE_URL = "https://ridemedcompass.com";

/** Every public route, with the relative weight search engines should give it. */
export const SITE_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/book/", priority: 0.9 },
  { path: "/services/", priority: 0.9 },
  { path: "/services/wheelchair/", priority: 0.8 },
  { path: "/services/ambulatory/", priority: 0.8 },
  { path: "/services/stretcher/", priority: 0.8 },
  { path: "/services/bariatric/", priority: 0.8 },
  { path: "/services/courier/", priority: 0.8 },
  { path: "/services/dialysis/", priority: 0.8 },
  { path: "/pricing/", priority: 0.8 },
  { path: "/cost-calculator/", priority: 0.7 },
  { path: "/service-area/", priority: 0.7 },
  { path: "/who-we-serve/", priority: 0.7 },
  { path: "/facilities/", priority: 0.7 },
  { path: "/resources/", priority: 0.6 },
  { path: "/resources/nemt-cost-chicago/", priority: 0.6 },
  { path: "/resources/hospital-discharge-guide/", priority: 0.6 },
  { path: "/about/", priority: 0.5 },
  { path: "/contact/", priority: 0.6 },
  { path: "/careers/", priority: 0.4 },
];
