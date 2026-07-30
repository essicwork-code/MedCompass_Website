/**
 * One-off: turn the raw phone screenshots in /Assets into web-ready brand assets.
 *
 * The source logo is a screenshot — a white card floating on a black surround.
 * Two trim passes strip the black frame, then the surrounding white, leaving a
 * tight lockup. The van shot is a four-up mockup sheet with an "Edit" artifact
 * on one panel, so only the clean top panel is kept.
 *
 * Re-run with: node scripts/prepare-assets.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "Assets";
const OUT = "public/brand";

await mkdir(OUT, { recursive: true });

async function describe(file) {
  const meta = await sharp(file).metadata();
  console.log(`  ${file} — ${meta.width}x${meta.height} ${meta.format}`);
  return meta;
}

console.log("Source images:");
await describe(`${SRC}/IMG_1092.JPEG`);
const van = await describe(`${SRC}/IMG_1560.JPEG`);

// ---- Logo -------------------------------------------------------------
// Pass 1 strips the black frame, leaving the white card. The card's rounded
// corners keep dark pixels in the corners, which would defeat a second trim
// (it samples the top-left pixel), so crop inside the radius first.
const carded = await sharp(`${SRC}/IMG_1092.JPEG`).trim({ threshold: 40 }).toBuffer();
const cardMeta = await sharp(carded).metadata();

/*
 * Each step is its own sharp() pass on purpose. Within a single pipeline sharp
 * applies trim() before extract() no matter how the calls are chained, so a
 * combined chain would trim first and then try to extract a region larger than
 * what survived. Separate passes make the order explicit.
 */
const inset = Math.round(Math.min(cardMeta.width, cardMeta.height) * 0.06);
const insetBuf = await sharp(carded)
  .extract({
    left: inset,
    top: inset,
    width: cardMeta.width - inset * 2,
    height: cardMeta.height - inset * 2,
  })
  .toBuffer();

const logoBuf = await sharp(insetBuf)
  .trim({ threshold: 20 })
  .resize({ width: 900, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(`${OUT}/medcompass-logo.png`, logoBuf);
console.log("\nwrote", `${OUT}/medcompass-logo.png`);

// The stacked lockup is too tall for a site header, so pull the mark out on its
// own: keep everything above the wordmark, then trim back to the artwork.
const lockup = await sharp(logoBuf).metadata();
const markCrop = await sharp(logoBuf)
  .extract({
    left: 0,
    top: 0,
    width: lockup.width,
    height: Math.round(lockup.height * 0.78),
  })
  .toBuffer();

await sharp(markCrop)
  .trim({ threshold: 20 })
  .resize({ width: 320, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/compass-mark.png`);
console.log("wrote", `${OUT}/compass-mark.png`);

// ---- Van --------------------------------------------------------------
// Keep only the top panel (the clean full-side view). Percentages rather than
// magic pixels so this survives a differently-sized re-export.
const topPanel = {
  left: Math.round(van.width * 0.062),
  top: Math.round(van.height * 0.072),
  width: Math.round(van.width * 0.876),
  height: Math.round(van.height * 0.474),
};

await sharp(`${SRC}/IMG_1560.JPEG`)
  .extract(topPanel)
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(`${OUT}/van-side.jpg`);
console.log("wrote", `${OUT}/van-side.jpg`);

// Square-ish crop of the van's rear graphic for card thumbnails.
await sharp(`${SRC}/IMG_1560.JPEG`)
  .extract({
    left: Math.round(van.width * 0.72),
    top: Math.round(van.height * 0.6),
    width: Math.round(van.width * 0.24),
    height: Math.round(van.height * 0.36),
  })
  .resize({ width: 640, withoutEnlargement: true })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(`${OUT}/van-rear.jpg`);
console.log("wrote", `${OUT}/van-rear.jpg`);

for (const f of ["medcompass-logo.png", "van-side.jpg", "van-rear.jpg"]) {
  const m = await sharp(`${OUT}/${f}`).metadata();
  console.log(`  ${f} -> ${m.width}x${m.height}`);
}
