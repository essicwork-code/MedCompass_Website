"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import TripTracker from "@/components/TripTracker";
import { TRIPS } from "@/lib/demo/data";
import { STATUS_COPY } from "@/lib/demo/simulator";

/*
 * Public tracking entry point.
 *
 * Two ways in:
 *  - /track?s=<shareToken> — the "Copy tracking link" a rider forwards to
 *    family. Opaque, unrelated to the dispatch code, and stops resolving
 *    once the trip ends or its window passes (CLAUDE.md PHI boundary: share
 *    links must be tokenized and expiring).
 *  - /track?t=<code> — a rider typing their own confirmation code, the way
 *    you'd type a package tracking number. Not a forwarded link, so it isn't
 *    held to the same expiry, but it still won't show a finished trip live.
 *
 * Reading from the query keeps this a single static page — no per-trip route
 * to pre-render — which matters because the build ships as a static export.
 */

const ACTIVE = TRIPS.filter((t) => t.status !== "completed" && t.status !== "cancelled");

function TrackContent() {
  const params = useSearchParams();
  const shareToken = params.get("s");
  const codeParam = params.get("t");
  const [entry, setEntry] = useState("");

  const byShareToken = shareToken ? TRIPS.find((t) => t.shareToken === shareToken) : undefined;
  const byCode = !byShareToken && codeParam
    ? TRIPS.find((t) => t.code.toLowerCase() === codeParam.toLowerCase())
    : undefined;
  const matched = byShareToken ?? byCode;

  const ended = matched
    ? matched.status === "completed" ||
      matched.status === "cancelled" ||
      (byShareToken != null && new Date(matched.shareExpiresAt).getTime() < Date.now())
    : false;

  if (matched && ended) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-[1.7rem] font-extrabold text-deep">
          This tracking link has ended
        </h1>
        <p className="mt-3 text-[1rem] leading-relaxed text-slate-soft">
          {byShareToken
            ? "Share links stop working once a trip is complete, so the link no longer shows a live position."
            : "This trip has already finished, so there's nothing live left to show."}
        </p>
        <Link
          href="/track"
          className="mt-6 inline-flex items-center rounded-full border-2 border-deep px-6 py-3 font-bold text-deep hover:bg-bone"
        >
          Track another trip
        </Link>
      </section>
    );
  }

  if (matched) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[1.9rem] font-extrabold text-deep">
              Tracking {matched.code}
            </h1>
            <p className="mt-1 text-[0.95rem] text-slate-soft">
              This link updates automatically. Leave it open.
            </p>
          </div>
          <Link href="/track" className="text-[0.92rem] font-semibold text-blue-ink hover:underline">
            Track a different trip
          </Link>
        </div>

        <TripTracker tripId={matched.id} variant="public" />

        <p className="mx-auto mt-8 max-w-2xl rounded-xl bg-white px-5 py-4 text-center text-[0.85rem] leading-relaxed text-slate-soft">
          This is a shared view. It shows the vehicle, its arrival time and the driver&rsquo;s first
          name only. It does not identify the rider or their destination, so it is safe to forward.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold leading-tight text-deep">
        Track a ride
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-soft">
        Enter the trip code from your confirmation text. No account needed.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const code = entry.trim().toLowerCase();
          if (code) window.location.search = `?t=${encodeURIComponent(code)}`;
        }}
        className="mt-7 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="code" className="sr-only">
          Trip code
        </label>
        <input
          id="code"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="MC-4821"
          autoComplete="off"
          className="tabular min-w-0 flex-1 rounded-full border-2 border-line bg-white px-5 py-3.5 text-[1rem] focus:border-blue"
        />
        <button
          type="submit"
          className="rounded-full bg-green px-7 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
        >
          Track it
        </button>
      </form>

      {(shareToken || codeParam) && !matched && (
        <p role="alert" className="mt-4 rounded-lg bg-alert-tint px-4 py-3 text-[0.92rem] text-alert">
          No active trip matches &ldquo;{shareToken ?? codeParam}&rdquo;. Check the code on your
          confirmation, or call dispatch and we&rsquo;ll look it up.
        </p>
      )}

      <div className="mt-12 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-[1.1rem] font-bold text-deep">
          Demo trips running right now
        </h2>
        <p className="mt-1.5 text-[0.9rem] text-slate-soft">
          This is a demonstration site. Pick any trip below to see live tracking.
        </p>
        <ul className="mt-5 divide-y divide-line">
          {ACTIVE.map((t) => (
            <li key={t.id}>
              <Link
                href={`/track?t=${t.code.toLowerCase()}`}
                className="flex items-center justify-between gap-4 py-3.5 hover:bg-bone"
              >
                <span>
                  <span className="tabular font-semibold text-deep">{t.code}</span>
                  <span className="ml-3 text-[0.9rem] text-slate-soft">
                    {t.pickup.city} → {t.dropoff.city}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-moss px-3 py-1 text-[0.78rem] font-semibold text-moss-ink">
                  {STATUS_COPY[t.status].label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function TrackPage() {
  return (
    <MarketingShell>
      <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20">Loading…</div>}>
        <TrackContent />
      </Suspense>
    </MarketingShell>
  );
}
