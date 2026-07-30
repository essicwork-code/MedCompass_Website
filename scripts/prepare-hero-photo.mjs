/**
 * Optimizes the generated stretcher-loading photo for the homepage.
 *
 * Source is an AI-generated image showing the actual MedCompass branding on
 * the van (unlike the Unsplash stock photos, which show generic vehicles).
 * Run: node scripts/prepare-hero-photo.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "Assets/generated-stretcher-loading.png";
const OUT = "public/photos";
await mkdir(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
console.log(`source: ${meta.width}x${meta.height}`);

await sharp(SRC)
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 87, mozjpeg: true })
  .toFile(`${OUT}/stretcher-loading.jpg`);

const out = await sharp(`${OUT}/stretcher-loading.jpg`).metadata();
console.log(`wrote ${OUT}/stretcher-loading.jpg (${out.width}x${out.height})`);
