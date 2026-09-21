"use client";

import { useEffect } from "react";
import Script from "next/script";

/*
 * Cookieless analytics, provider-agnostic.
 *
 * Nothing is hard-coded to one vendor: point NEXT_PUBLIC_ANALYTICS_SRC at
 * Plausible, Umami or Cloudflare Web Analytics and the tag shape is the same.
 * With the variable unset — local builds, forks, anyone who clones this — the
 * component renders nothing at all, so no one is measured by accident.
 *
 * Deliberately not Google Analytics: it sets cookies, which would mean a
 * consent banner in front of people trying to book medical transport, and it
 * would hand a third party a record of who was reading the dialysis page.
 *
 * The PHI boundary still applies. The events below count that something
 * happened; none of them carry a name, an address, a trip or a destination.
 */

const SRC = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
const DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

export default function Analytics() {
  /*
   * One delegated listener instead of an onClick on each of the ~20 phone
   * links scattered through the site. A tap on the dispatch number is the
   * highest-intent thing anyone does here and the easiest conversion to miss,
   * because it navigates away from the page before anything else can fire.
   */
  useEffect(() => {
    if (!SRC) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a[href^='tel:']");
      if (link) track("Call dispatch");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!SRC) return null;

  return (
    <Script
      src={SRC}
      // Never ahead of the page itself: measurement must not cost the rider
      // anything on the way in.
      strategy="afterInteractive"
      defer
      {...(DOMAIN ? { "data-domain": DOMAIN } : {})}
    />
  );
}

/**
 * Report a conversion, if analytics is configured and the provider exposes the
 * common `window.<fn>(event)` shape. Safe to call unconditionally.
 */
export function track(event: string): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as Record<string, ((e: string) => void) | undefined>;
    (w.plausible ?? w.umami)?.(event);
  } catch {
    // Analytics must never break a booking.
  }
}
