/**
 * Pulls the demo stock photography into /public/photos.
 *
 * Downloaded rather than hot-linked so the static export has no external image
 * dependency and nothing breaks if Unsplash changes a URL. These are Unsplash
 * License images used for a demonstration build; swap them for licensed or
 * owned photography of real MedCompass riders before this goes live, with
 * written consent from anyone identifiable.
 *
 * Run: node scripts/fetch-stock.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "public/photos";
await mkdir(OUT, { recursive: true });

const PHOTOS = [
  {
    file: "assist-to-vehicle.jpg",
    id: "photo-1543333995-a78aea2eee50",
    credit: "Unsplash",
    alt: "A companion walking beside a woman in a wheelchair outdoors",
    width: 1400,
  },
  {
    file: "rider-waiting.jpg",
    id: "photo-1565615833231-e8c91a38a012",
    credit: "Unsplash",
    alt: "A woman seated in her wheelchair, ready to travel",
    width: 1100,
  },
  {
    file: "care-handoff.jpg",
    id: "photo-1765896387377-e293914d1e69",
    credit: "Unsplash",
    alt: "A caregiver in scrubs laughing together with an older woman",
    width: 1100,
  },
  {
    file: "companion-ride.jpg",
    id: "photo-1685575002792-a3a916964539",
    credit: "Unsplash",
    alt: "Two people sitting together, one helping the other",
    width: 1100,
  },
];

for (const p of PHOTOS) {
  const url = `https://images.unsplash.com/${p.id}?w=1800&q=85&fm=jpg&fit=max`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAILED ${p.file}: ${res.status} ${res.statusText}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  await sharp(buf)
    .resize({ width: p.width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OUT}/${p.file}`);

  const meta = await sharp(`${OUT}/${p.file}`).metadata();
  console.log(`wrote ${OUT}/${p.file} (${meta.width}x${meta.height})`);
}

// Keep provenance next to the files so nobody has to guess later.
await writeFile(
  `${OUT}/CREDITS.md`,
  [
    "# Demo photography",
    "",
    "Placeholder images for the MedCompass prototype, sourced from Unsplash under the",
    "Unsplash License. They depict models, not MedCompass riders.",
    "",
    "**Replace these before launch.** Photographs of real riders require written consent,",
    "and using stock images of unrelated people to imply they are your patients is both a",
    "privacy problem and a credibility one.",
    "",
    ...PHOTOS.map((p) => `- \`${p.file}\` — unsplash.com/photos/${p.id.replace("photo-", "")} — ${p.alt}`),
    "",
  ].join("\n"),
);
console.log(`wrote ${OUT}/CREDITS.md`);
