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
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    // Next's optimizer needs a server; a static export serves the files as-is.
    unoptimized: true,
  },
  // Cloudflare Pages serves /about as /about/index.html, so emit directories.
  trailingSlash: true,
};

export default nextConfig;
