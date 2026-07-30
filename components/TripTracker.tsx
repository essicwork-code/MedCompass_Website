"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTrip } from "@/lib/demo/useFleet";
import { STATUS_COPY } from "@/lib/demo/simulator";
import { TRIP_STAGES } from "@/lib/demo/types";
import { COMPANY, DRIVER_BY_ID, VEHICLE_BY_ID } from "@/lib/demo/data";

const TrackingMap = dynamic(() => import("./TrackingMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-mist" />,
});

/**
 * `public` is what a forwarded share link shows: a van, an ETA, a first name.
 * `client` is what the signed-in account holder sees. The difference is the
 * whole PHI boundary, so it lives in one place rather than being remembered at
 * each call site.
 */
export type TrackerVariant = "public" | "client";

function coarseDestination(kind: string): string {
  switch (kind) {
    case "dialysis":
      return "a dialysis appointment";
    case "hospital":
      return "a hospital appointment";
    case "snf":
      return "a care facility";
    case "imaging":
      return "an imaging appointment";
    case "clinic":
      return "a clinic appointment";
    default:
      return "the destination";
  }
}

export default function TripTracker({
  tripId,
  variant = "client",
}: {
  tripId: string;
  variant?: TrackerVariant;
}) {
  const live = useTrip(tripId);
  const [copied, setCopied] = useState(false);

  if (!live) {
    return <div className="h-96 animate-pulse rounded-2xl bg-mist" />;
  }

  const { trip } = live;
  const driver = DRIVER_BY_ID[trip.driverId];
  const vehicle = VEHICLE_BY_ID[trip.vehicleId];
  const stageIndex = TRIP_STAGES.indexOf(trip.status as never);
  const isPublic = variant === "public";

  async function share() {
    const url = `${window.location.origin}/track?t=${trip.code.toLowerCase()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard can be blocked; the URL is visible in the address bar anyway.
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="h-[420px] w-full lg:h-[560px]">
          <TrackingMap trips={[live]} ariaLabel={`Live location for trip ${trip.code}`} />
        </div>
      </div>

      {/* Status rail */}
      <div className="space-y-4">
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-wider text-green">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-2 w-2 rounded-full bg-green" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              Live
            </span>
            <span className="tabular text-[0.82rem] text-slate-soft">{trip.code}</span>
          </div>

          <p className="mt-4 font-display text-[2.6rem] font-extrabold leading-none text-deep">
            {live.etaMinutes != null ? (
              <>
                <span className="tabular">{live.etaMinutes}</span>
                <span className="text-[1.3rem] font-bold"> min</span>
              </>
            ) : (
              "Arrived"
            )}
          </p>
          <p className="mt-2 text-[1rem] text-slate-soft">{STATUS_COPY[trip.status].client}</p>
          <p className="tabular mt-1 text-[0.9rem] text-slate-soft">
            {live.milesRemaining.toFixed(1)} miles remaining
          </p>

          <p className="mt-4 rounded-lg bg-bone px-3.5 py-2.5 text-[0.88rem] text-slate-soft">
            Heading to{" "}
            <strong className="text-deep">
              {isPublic ? coarseDestination(trip.dropoff.kind) : trip.dropoff.name}
            </strong>
            {!isPublic && (
              <>
                {" · "}
                {trip.dropoff.address}, {trip.dropoff.city}
              </>
            )}
          </p>
        </section>

        {/* Lifecycle */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-[1.05rem] font-bold text-deep">Trip progress</h2>
          <ol className="mt-4 space-y-0">
            {TRIP_STAGES.slice(0, 6).map((stage, i) => {
              const done = i < stageIndex;
              const current = i === stageIndex;
              return (
                <li key={stage} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                        done
                          ? "border-green bg-green text-white"
                          : current
                            ? "border-green bg-white"
                            : "border-line bg-white"
                      }`}
                    >
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {current && <span className="h-2 w-2 rounded-full bg-green" />}
                    </span>
                    {i < 5 && (
                      <span
                        aria-hidden="true"
                        className={`w-0.5 flex-1 ${done ? "bg-green" : "bg-line"}`}
                        style={{ minHeight: "1.6rem" }}
                      />
                    )}
                  </div>
                  <p
                    className={`pb-5 text-[0.94rem] ${
                      current ? "font-bold text-deep" : done ? "text-slate-soft" : "text-slate-soft/60"
                    }`}
                  >
                    {STATUS_COPY[stage].label}
                    {current && <span className="sr-only"> (current stage)</span>}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Driver + vehicle */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-[1.05rem] font-bold text-deep">Your driver</h2>
          <div className="mt-4 flex items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-deep text-[0.95rem] font-bold text-white">
              {driver.initials}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-deep">
                {isPublic ? driver.name.split(" ")[0] : driver.name}
              </p>
              <p className="tabular text-[0.86rem] text-slate-soft">
                {driver.tenureYears} years with MedCompass · {driver.rating.toFixed(1)}★
              </p>
            </div>
          </div>

          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.88rem]">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-soft">Vehicle</dt>
              <dd className="tabular font-semibold text-deep">Unit {vehicle.unit}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-soft">Make</dt>
              <dd className="text-right text-deep">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </dd>
            </div>
            {!isPublic && (
              <div className="flex justify-between gap-3">
                <dt className="text-slate-soft">Certifications</dt>
                <dd className="text-right text-deep">{driver.certifications.join(", ")}</dd>
              </div>
            )}
          </dl>

          <a
            href={`tel:${COMPANY.dispatchPhone.replace(/\D/g, "")}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-deep px-5 py-3 font-bold text-deep hover:bg-bone"
          >
            Call dispatch
          </a>
        </section>

        {!isPublic && (
          <section className="rounded-2xl border border-line bg-moss p-6">
            <h2 className="font-display text-[1.05rem] font-bold text-deep">Share this trip</h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-soft">
              Send a live link to family. It shows the van, the ETA and the driver&rsquo;s first
              name. It never shows the rider&rsquo;s name, their condition, or where they&rsquo;re going.
            </p>
            <button
              type="button"
              onClick={share}
              className="mt-4 w-full rounded-full bg-green px-5 py-3 font-bold text-white hover:bg-[#4d8f28]"
            >
              {copied ? "Link copied" : "Copy tracking link"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
