"use client";

import dynamic from "next/dynamic";
import { useTrip } from "@/lib/demo/useFleet";
import { STATUS_COPY } from "@/lib/demo/simulator";
import { TRIP_STAGES } from "@/lib/demo/types";
import { DRIVER_BY_ID, VEHICLE_BY_ID } from "@/lib/demo/data";

// Leaflet touches `window` on import, so it can never be server-rendered.
const TrackingMap = dynamic(() => import("./TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-mist text-sm text-slate-soft">
      Loading map…
    </div>
  ),
});

/**
 * The homepage hero.
 *
 * Competitors open with a stock photo of a smiling caregiver. This opens with a
 * van actually moving, because the product claim is operational competence and
 * showing it is more persuasive than asserting it.
 */
export default function HeroTracker({ tripId = "t1" }: { tripId?: string }) {
  const live = useTrip(tripId);

  const driver = live ? DRIVER_BY_ID[live.trip.driverId] : undefined;
  const vehicle = live ? VEHICLE_BY_ID[live.trip.vehicleId] : undefined;
  const stageIndex = live ? TRIP_STAGES.indexOf(live.trip.status as never) : -1;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-25px_rgb(16_34_46/0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-ring absolute inline-flex h-2.5 w-2.5 rounded-full bg-green" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
          </span>
          <span className="text-[0.8rem] font-bold uppercase tracking-wider text-deep">
            Live demo
          </span>
        </div>
        <span className="tabular text-[0.8rem] text-slate-soft">
          Trip {live?.trip.code ?? "—"}
        </span>
      </div>

      <div className="h-[300px] w-full sm:h-[340px]">
        <TrackingMap
          trips={live ? [live] : []}
          ariaLabel="Live demonstration of vehicle tracking"
        />
      </div>

      <div className="border-t border-line px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-[1.45rem] font-bold text-deep">
            {live?.etaMinutes != null ? (
              <>
                <span className="tabular">{live.etaMinutes}</span> min away
              </>
            ) : (
              "Arrived"
            )}
          </p>
          <p className="tabular text-[0.9rem] text-slate-soft">
            {live ? `${live.milesRemaining.toFixed(1)} mi remaining` : ""}
          </p>
        </div>

        <p className="mt-1 text-[0.95rem] text-slate-soft">
          {live ? STATUS_COPY[live.trip.status].client : "Connecting…"}
        </p>

        {/* Stage rail — the same lifecycle the client portal shows. */}
        <ol className="mt-4 flex gap-1.5" aria-label="Trip progress">
          {TRIP_STAGES.slice(0, 6).map((stage, i) => {
            const done = i <= stageIndex;
            return (
              <li key={stage} className="flex-1">
                <span className="sr-only">
                  {STATUS_COPY[stage].label}
                  {done ? " — done" : ""}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full ${done ? "bg-green" : "bg-line"}`}
                />
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-deep text-[0.85rem] font-bold text-white">
            {driver?.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.92rem] font-semibold text-deep">
              {driver?.name.split(" ")[0]} · {driver?.tenureYears} yrs with MedCompass
            </p>
            <p className="truncate text-[0.85rem] text-slate-soft">
              Unit {vehicle?.unit} · {vehicle?.year} {vehicle?.make} {vehicle?.model}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
