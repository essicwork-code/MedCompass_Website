import type { NextConfig } from "next";

/*
 * Static export.
 *
 * The prototype has no server: the fleet simulation runs in the browser, so
 * every page can be prerendered to plain HTML. That means it deploys to
 * Cloudflare Pages (or any static host) with no build configuration and no
 * runtime cost.
 *
 * When the real driver-location API arrives this will need to change to a
 * server target, or the API moves to a separate service the static front end
 * calls.
 */
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/, so
// every asset and route needs that /<repo> prefix baked in at build time. The
// deploy workflow (.github/workflows/deploy-gh-pages.yml) sets this env var
// from the actual repo name; Cloudflare Pages and other hosts that serve from
// the domain root leave it unset and get no prefix.
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    /*
     * Next's optimizer needs a server, so a static export cannot resize on the
     * fly. Instead scripts/prepare-site-photos.mjs writes the narrow copies at
     * build time and lib/image-loader.ts points each requested width at one.
     * deviceSizes matches the widths that script emits, plus the full size.
     */
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 1080, 1920],
    imageSizes: [176, 256],
  },
  // Cloudflare Pages and GitHub Pages both serve /about as /about/index.html,
  // so emit directories.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  // Exposed so lib/asset.ts can prefix /public paths, which basePath skips.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
