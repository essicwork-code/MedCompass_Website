/**
 * Optimizes the AI-generated MedCompass photos for the web.
 *
 * Unlike the Unsplash stock photos in fetch-stock.mjs, these show the actual
 * MedCompass brand (van livery, staff polo) rather than a generic stand-in.
 * Run: node scripts/prepare-generated-photos.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/photos";
await mkdir(OUT, { recursive: true });

const PHOTOS = [
  { src: "Assets/generated-stretcher-loading.png", out: "stretcher-loading.jpg" },
  { src: "Assets/generated-dispatch-desk.png", out: "dispatch-desk.jpg" },
];

for (const { src, out } of PHOTOS) {
  const meta = await sharp(src).metadata();
  await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 87, mozjpeg: true })
    .toFile(`${OUT}/${out}`);
  const written = await sharp(`${OUT}/${out}`).metadata();
  console.log(`${src} (${meta.width}x${meta.height}) -> ${OUT}/${out} (${written.width}x${written.height})`);
}
