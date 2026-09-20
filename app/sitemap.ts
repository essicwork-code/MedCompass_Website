import type { MetadataRoute } from "next";
import { lastModified } from "@/lib/lastmod";
import { SITE_ROUTES, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    // Google ignores changefreq and priority but does read lastmod, so this is
    // the only field here that actually influences recrawl scheduling.
    lastModified: lastModified(path),
    changeFrequency: "monthly",
    priority,
  }));
}
