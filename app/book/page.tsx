"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MarketingShell from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import { SERVICES } from "@/lib/content";
import { COMPANY, PLACES } from "@/lib/demo/data";
import { haversineKm } from "@/lib/demo/simulator";
import type { MobilityType } from "@/lib/demo/types";

/*
 * Booking wizard.
 *
 * The competitor booking flows all end at "we'll call you with a price". This
 * one shows the number before the commit, which is the single most requested
 * thing in NEMT reviews. Nothing here submits anywhere — it is a demo — so the
 * final step says so plainly rather than faking a confirmation.
 */

const PLACE_OPTIONS = Object.values(PLACES);

/** Straight-line distance underestimates driving; city grids add roughly 25%. */
const ROAD_FACTOR = 1.25;
const KM_TO_MILES = 0.621371;

type Step = 1 | 2 | 3;

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [mobility, setMobility] = useState<MobilityType | null>(null);
  const [pickupId, setPickupId] = useState("");
  const [dropoffId, setDropoffId] = useState("");
  const [when, setWhen] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [escort, setEscort] = useState(false);
  const [notes, setNotes] = useState("");

  const service = SERVICES.find((s) => s.icon === mobility || s.slug === mobility) ?? null;

  const quote = useMemo(() => {
    if (!service || !pickupId || !dropoffId) return null;
    const a = PLACES[pickupId];
    const b = PLACES[dropoffId];
    if (!a || !b) return null;

    const miles = haversineKm(a.coord, b.coord) * KM_TO_MILES * ROAD_FACTOR;
    const oneWay = service.fromPrice + miles * service.perMile;
    const total = roundTrip ? oneWay * 2 : oneWay;

    return { miles, oneWay, total };
  }, [service, pickupId, dropoffId, roundTrip]);

  const canAdvance = step === 1 ? Boolean(mobility) : step === 2 ? Boolean(pickupId && dropoffId && when) : true;

  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-tight text-deep">
          Book a ride
        </h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-soft">
          You&rsquo;ll see the price before you confirm. No card until the trip is locked in.
        </p>

        {/* Progress */}
        <ol className="mt-8 flex gap-2" aria-label="Booking steps">
          {(["Service", "Trip details", "Quote"] as const).map((label, i) => {
            const n = (i + 1) as Step;
            return (
              <li key={label} className="flex-1">
                <span className="sr-only">
                  Step {n}: {label}
                  {step === n ? " (current)" : step > n ? " (done)" : ""}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full ${step >= n ? "bg-green" : "bg-line"}`}
                />
                <span
                  aria-hidden="true"
                  className={`mt-2 block text-[0.85rem] font-semibold ${
                    step >= n ? "text-deep" : "text-slate-soft"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 rounded-2xl border border-line bg-white p-6 lg:p-8">
          {/* ---- Step 1: service ---- */}
          {step === 1 && (
            <fieldset>
              <legend className="font-display text-[1.3rem] font-bold text-deep">
                What kind of transport is needed?
              </legend>
              <p className="mt-2 text-[0.95rem] text-slate-soft">
                Not sure? Pick the closest one. Dispatch confirms with you before the trip.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => {
                  const selected = mobility === (s.slug as MobilityType);
                  return (
                    <label
                      key={s.slug}
                      className={`flex cursor-pointer gap-4 rounded-xl border-2 p-5 transition-colors ${
                        selected ? "border-green bg-moss" : "border-line hover:border-blue"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mobility"
                        value={s.slug}
                        checked={selected}
                        onChange={() => setMobility(s.slug as MobilityType)}
                        className="sr-only"
                      />
                      <span className={selected ? "text-green" : "text-blue"}>
                        <ServiceIcon kind={s.icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[1.05rem] font-bold text-deep">
                          {s.name}
                        </span>
                        <span className="mt-1 block text-[0.88rem] leading-relaxed text-slate-soft">
                          {s.short}
                        </span>
                        <span className="tabular mt-2 block text-[0.85rem] font-semibold text-deep">
                          From ${s.fromPrice} + ${s.perMile.toFixed(2)}/mi
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* ---- Step 2: trip ---- */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-[1.3rem] font-bold text-deep">Trip details</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="pickup" className="block text-[0.92rem] font-semibold text-deep">
                    Pickup
                  </label>
                  <select
                    id="pickup"
                    value={pickupId}
                    onChange={(e) => setPickupId(e.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-blue"
                  >
                    <option value="">Select a pickup location…</option>
                    {PLACE_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dropoff" className="block text-[0.92rem] font-semibold text-deep">
                    Destination
                  </label>
                  <select
                    id="dropoff"
                    value={dropoffId}
                    onChange={(e) => setDropoffId(e.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-blue"
                  >
                    <option value="">Select a destination…</option>
                    {PLACE_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="when" className="block text-[0.92rem] font-semibold text-deep">
                    Pickup time
                  </label>
                  <input
                    id="when"
                    type="datetime-local"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-blue"
                  />
                  <p className="mt-1.5 text-[0.82rem] text-slate-soft">
                    24 hours&rsquo; notice for routine trips. Discharges: call dispatch.
                  </p>
                </div>

                <fieldset className="self-start">
                  <legend className="block text-[0.92rem] font-semibold text-deep">Options</legend>
                  <label className="mt-2 flex items-center gap-2.5 text-[0.95rem] text-ink">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    Round trip (return pickup)
                  </label>
                  <label className="mt-2.5 flex items-center gap-2.5 text-[0.95rem] text-ink">
                    <input
                      type="checkbox"
                      checked={escort}
                      onChange={(e) => setEscort(e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    One escort riding along (free)
                  </label>
                </fieldset>
              </div>

              <div className="mt-5">
                <label htmlFor="notes" className="block text-[0.92rem] font-semibold text-deep">
                  Anything the driver should know?
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Stairs at the entrance, oxygen tank, preferred door…"
                  className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-blue"
                />
                <p className="mt-1.5 text-[0.82rem] text-slate-soft">
                  Access and equipment notes only. Don&rsquo;t include diagnoses here.
                </p>
              </div>
            </div>
          )}

          {/* ---- Step 3: quote ---- */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-[1.3rem] font-bold text-deep">Your quote</h2>

              {quote && service ? (
                <>
                  <p className="mt-6 font-display text-[3rem] font-extrabold leading-none text-deep">
                    <span className="tabular">${quote.total.toFixed(2)}</span>
                  </p>
                  <p className="mt-2 text-[0.95rem] text-slate-soft">
                    {roundTrip ? "Round trip" : "One way"} · {service.name.toLowerCase()}
                  </p>

                  <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[0.95rem]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-soft">Base rate</dt>
                      <dd className="tabular font-semibold text-deep">
                        ${service.fromPrice.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-soft">
                        Distance ({quote.miles.toFixed(1)} mi × ${service.perMile.toFixed(2)})
                      </dt>
                      <dd className="tabular font-semibold text-deep">
                        ${(quote.miles * service.perMile).toFixed(2)}
                      </dd>
                    </div>
                    {roundTrip && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-soft">Return leg</dt>
                        <dd className="tabular font-semibold text-deep">
                          ${quote.oneWay.toFixed(2)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-soft">Escort</dt>
                      <dd className="font-semibold text-green">{escort ? "Included" : "Not added"}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-line pt-3">
                      <dt className="font-bold text-deep">Total</dt>
                      <dd className="tabular font-display text-[1.3rem] font-extrabold text-deep">
                        ${quote.total.toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 rounded-lg bg-mist px-4 py-3.5 text-[0.88rem] leading-relaxed text-deep">
                    Covered by Medicaid managed care or an NEMT broker? Most riders pay nothing.
                    Enter your member ID at confirmation and we verify eligibility before the trip
                    rather than billing you after it.
                  </p>

                  <div className="mt-6 rounded-xl border-2 border-amber/30 bg-[#fff8ec] px-4 py-4">
                    <p className="text-[0.9rem] font-bold text-deep">This is a demonstration</p>
                    <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-soft">
                      Nothing is submitted and no booking is created. On a live site this button
                      would reserve the vehicle and text you a tracking link.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="mt-4 w-full cursor-not-allowed rounded-full bg-slate-soft/30 px-6 py-3.5 font-bold text-slate-soft"
                    >
                      Confirm booking (disabled in demo)
                    </button>
                    <p className="mt-3 text-center text-[0.88rem] text-slate-soft">
                      To book for real, call{" "}
                      <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue hover:underline">
                        {COMPANY.phone}
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <p className="mt-6 text-[0.95rem] text-slate-soft">
                  Go back and choose a pickup and destination to see a price.
                </p>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              disabled={step === 1}
              className="rounded-full border-2 border-line px-6 py-3 font-bold text-slate-soft disabled:opacity-40 enabled:hover:border-deep enabled:hover:text-deep"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => ((s + 1) as Step))}
                disabled={!canAdvance}
                className="rounded-full bg-green px-8 py-3 font-bold text-white disabled:opacity-40 enabled:hover:bg-[#4d8f28]"
              >
                Continue
              </button>
            ) : (
              <Link href="/track" className="font-semibold text-blue hover:underline">
                See how tracking works →
              </Link>
            )}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
