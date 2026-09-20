import type { Metadata } from "next";
import { COMPANY } from "./demo/data";
import { AREAS } from "./areas";
import { RESOURCES } from "./resources";

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
  { path: "/areas/", priority: 0.8 },
  ...AREAS.map((a) => ({ path: `/areas/${a.slug}/`, priority: 0.7 })),
  { path: "/faq/", priority: 0.6 },
  { path: "/resources/", priority: 0.6 },
  ...RESOURCES.map((r) => ({ path: `/resources/${r.slug}/`, priority: 0.6 })),
  { path: "/about/", priority: 0.5 },
  { path: "/contact/", priority: 0.6 },
  { path: "/careers/", priority: 0.4 },
];

/**
 * Open Graph for the guide pages.
 *
 * Next replaces a parent `openGraph` object wholesale rather than merging into
 * it, so a page that sets `type: "article"` silently drops the root's url,
 * locale and image — the share card loses its picture and its link. This repo
 * has already been bitten once, when the Medicaid guide lost its brand name.
 * Stating the whole object once here means the next guide cannot repeat it.
 */
export const ARTICLE_OPEN_GRAPH: Metadata["openGraph"] = {
  type: "article",
  siteName: COMPANY.name,
  locale: "en_US",
  url: "./",
  images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, type: "image/jpeg" }],
};
