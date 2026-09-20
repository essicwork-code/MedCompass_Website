import generated from "./lastmod.generated.json";

/*
 * Real content dates, from git, for <lastmod> in the sitemap and the
 * date fields in Article schema. scripts/build-lastmod.mjs regenerates
 * lastmod.generated.json before every build.
 *
 * Freshness is a signal both classic crawlers and AI search use, so these have
 * to track when a page's copy actually changed. A build timestamp would mark
 * all 39 pages as modified on every deploy, which is noise rather than signal.
 */

interface FileDates {
  created: string;
  modified: string;
}

const dates: Record<string, FileDates> = generated;

/**
 * Data modules behind the dynamic route groups. /services/wheelchair/ has no
 * page file of its own — its copy lives in the data module, so that is what
 * dates it.
 */
const DYNAMIC_SOURCES: Record<string, string> = {
  services: "lib/content.ts",
  areas: "lib/areas.ts",
};

/** Every source file whose change should count as a change to `path`. */
function sourcesFor(path: string): string[] {
  const segment = path.replace(/^\/+|\/+$/g, "");
  if (segment === "") return ["app/page.tsx"];

  const own = `app/${segment}/page.tsx`;
  // Route metadata often sits in a sibling layout, so it counts too.
  if (own in dates) return [own, `app/${segment}/layout.tsx`];

  const group = segment.split("/")[0];
  return [`app/${group}/[slug]/page.tsx`, DYNAMIC_SOURCES[group] ?? ""];
}

function pick(path: string, field: keyof FileDates, newest: boolean): string | undefined {
  const stamps = sourcesFor(path)
    .map((file) => dates[file]?.[field])
    .filter((d): d is string => Boolean(d))
    .sort(); // ISO dates sort lexically
  return newest ? stamps[stamps.length - 1] : stamps[0];
}

/** When the page's content last changed, as YYYY-MM-DD. */
export function lastModified(path: string): string | undefined {
  return pick(path, "modified", true);
}

/** When the page first shipped, as YYYY-MM-DD. */
export function firstPublished(path: string): string | undefined {
  return pick(path, "created", false);
}
