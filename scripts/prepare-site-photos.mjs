/**
 * Optimizes the MedCompass photography for the web.
 *
 * Sources live in Assets/generated/ as full-size PNGs; this writes the WebP
 * files the site actually ships. Every photo keeps its aspect ratio, so the
 * width/height attributes in the pages stay accurate and nothing shifts while
 * the page loads.
 *
 * Run: node scripts/prepare-site-photos.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { statSync } from "node:fs";

const SRC = "Assets/generated";
const OUT = "public/photos";

/**
 * Narrower copies emitted beside every photo, picked by lib/image-loader.ts.
 *
 * Without these a phone downloaded the same 1800px file a retina desktop got:
 * the homepage alone shipped 742 KB of photography to a 375px screen. The
 * widths match images.deviceSizes in next.config.ts — a device size with no
 * file behind it falls back to the full-size original, which is correct but
 * pointless, so the two lists have to stay in step.
 */
const VARIANTS = [640, 1080];

/** Widest the file ever needs to be, by how it is used on the page. */
const WIDTHS = {
  "home-hero": 1800,
  "home-secure": 1100,
  "stretcher-loading": 1800,
  "clinic-handoff": 1600,
  "wheelchair-securement": 1600,
  "ambulatory-assist": 1600,
  "stretcher-transport": 1600,
  "bariatric-lift": 1600,
  "courier-handoff": 1600,
  "dialysis-arrival": 1600,
  "discharge-planner": 1600,
  "family-booking": 1600,
  "fleet-lineup": 1920,
  "crew-team": 1800,
  "dispatch-desk": 1600,
  "pretrip-check": 1600,
};

await mkdir(OUT, { recursive: true });
// og-source.png is cropped straight into app/opengraph-image.jpg, so it is not
// a site photo and gets no WebP of its own.
const files = (await readdir(SRC)).filter((f) => /\.png$/i.test(f) && f !== "og-source.png");

for (const file of files) {
  const name = file.replace(/\.png$/i, "");
  const width = WIDTHS[name] ?? 1600;
  const dest = `${OUT}/${name}.webp`;
  const meta = await sharp(`${SRC}/${file}`).metadata();
  await sharp(`${SRC}/${file}`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(dest);
  const out = await sharp(dest).metadata();
  const kb = Math.round(statSync(dest).size / 1024);
  console.log(`${file} (${meta.width}x${meta.height}) -> ${dest} (${out.width}x${out.height}, ${kb} KB)`);

  for (const v of VARIANTS) {
    // Upscaling a 1100px photo to 1080 is pointless but harmless; skipping it
    // would leave the loader pointing at a file that does not exist.
    if (v > width) continue;
    const small = `${OUT}/${name}-${v}.webp`;
    await sharp(`${SRC}/${file}`)
      .resize({ width: v, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(small);
    console.log(`    ${small} (${Math.round(statSync(small).size / 1024)} KB)`);
  }
}
