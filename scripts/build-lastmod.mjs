/*
 * Records when every source file under app/ and lib/ was added and last changed.
 *
 * Search engines use <lastmod> in the sitemap and datePublished/dateModified in
 * Article schema as freshness signals; all three are worthless if they are a
 * build timestamp, because every page then claims to have changed on every
 * deploy. Git already knows when each page's content actually changed, so that
 * is the source of truth. lib/lastmod.ts maps a route to the files behind it.
 *
 * Needs full history: the deploy workflow checks out with fetch-depth 0.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

// One walk of the log beats one `git log -1` per file by ~60 process spawns.
const log = execFileSync(
  "git",
  ["log", "--date=short", "--format=@%cd", "--name-only", "--", "app", "lib"],
  { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
);

// Newest commit first, so the first sighting of a path is its last change and
// the last sighting is when it was added.
const dates = {};
let current = null;
for (const line of log.split("\n")) {
  if (line.startsWith("@")) {
    current = line.slice(1);
  } else if (line && current) {
    if (line in dates) dates[line].created = current;
    else dates[line] = { created: current, modified: current };
  }
}

const count = Object.keys(dates).length;
if (count === 0) {
  // A shallow clone yields no history. Fail loudly rather than shipping a
  // sitemap with no lastmod at all, which is worse than a stale one.
  throw new Error(
    "build-lastmod: git log returned no files. Is this a shallow clone? " +
      "The deploy workflow needs actions/checkout with fetch-depth: 0.",
  );
}

writeFileSync(
  join(root, "lib", "lastmod.generated.json"),
  JSON.stringify(Object.fromEntries(Object.entries(dates).sort()), null, 2) + "\n",
);
console.log(`build-lastmod: recorded ${count} files`);
