"use client";

import Link from "next/link";
import { useEffect } from "react";
import MarketingShell from "@/components/MarketingShell";
import { CompassMark } from "@/components/Logo";
import { COMPANY } from "@/lib/demo/data";

/*
 * Shown when a client component throws.
 *
 * Without this, one bad render blanks the page — on a site whose entire
 * argument is that the ride shows up, that is the worst possible failure. The
 * phone number is the point: whatever broke here, dispatch is still answering.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // No error service is wired up, and the console is where a developer will
    // look. Deliberately logs nothing about the trip the rider was entering.
    console.error("A page-level error was caught by app/error.tsx");
  }, []);

  return (
    <MarketingShell>
      <section className="bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <CompassMark size={64} />

          <h1 className="mt-8 font-display text-[clamp(1.6rem,3.6vw,2.3rem)] font-extrabold leading-tight text-deep">
            Something on this page stopped working
          </h1>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-slate-soft">
            Not your fault, and nothing you typed was sent anywhere. Dispatch is staffed around the
            clock, so the fastest route to a ride right now is the phone.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="inline-flex min-h-11 items-center rounded-full bg-green-ink px-7 py-3.5 text-[1rem] font-bold text-white transition-colors hover:bg-green-ink-hover"
            >
              Call {COMPANY.phone}
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-deep px-7 py-3.5 text-[1rem] font-bold text-deep transition-colors hover:bg-bone"
            >
              Try again
            </button>
          </div>

          <p className="mt-8 text-[0.92rem] text-slate-soft">
            Or go back to the{" "}
            <Link href="/" className="font-semibold text-blue-ink hover:underline">
              home page
            </Link>
            .
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
