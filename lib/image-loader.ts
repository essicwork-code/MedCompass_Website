/*
 * Picks the narrowest pre-generated copy of a site photo that still covers the
 * width the browser asked for.
 *
 * A static export has no image server, so next/image was running with
 * `unoptimized` and every device got the full-size file: the homepage shipped
 * 742 KB of photography to a 375px phone, most of it resolution nobody could
 * see. scripts/prepare-site-photos.mjs now writes -640 and -1080 copies beside
 * each original, and this maps a requested width onto them.
 *
 * Anything that is not a site photo — the logo, the icons — has no variants,
 * so it falls through unchanged. next/image then emits a srcset whose entries
 * all point at the same file, which is wasteful to look at and costs nothing
 * to serve.
 */

/** Must stay in step with VARIANTS in scripts/prepare-site-photos.mjs. */
const VARIANTS = [640, 1080];

export default function siteImageLoader({ src, width }: { src: string; width: number }): string {
  const photo = /^(.*\/photos\/[^/.]+)\.webp$/.exec(src);
  if (!photo) return src;

  const variant = VARIANTS.find((w) => width <= w);
  // Wider than every variant: the original is the right file.
  return variant ? `${photo[1]}-${variant}.webp` : src;
}
