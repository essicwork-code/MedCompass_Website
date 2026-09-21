"use client";

import { useMemo, useState } from "react";
import AddressField, {
  EMPTY_ADDRESS,
  addressCoord,
  addressFilled,
  addressLabel,
  addressLine,
  resolveAddress,
  type AddressValue,
} from "@/components/AddressField";
import MarketingShell from "@/components/MarketingShell";
import { useBookingModal, type BookingModalPrefill } from "@/components/BookingModalProvider";
import ServiceIcon from "@/components/ServiceIcon";
import { COURIER_STAT_FEE, SERVICES, type ServiceSlug } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { nowForDateTimeInput } from "@/lib/datetime";
import { GeoError } from "@/lib/geo";
import { computeQuote } from "@/lib/quote";

/*
 * Booking wizard.
 *
 * The competitor booking flows all end at "we'll call you with a price". This
 * one shows the number before the commit, which is the single most requested
 * thing in NEMT reviews. Confirming hands the chosen trip to the booking modal,
 * which only has to ask for contact details before sending it to dispatch.
 *
 * Pickup and destination each take any typed address (with live
 * suggestions), a major-hospital shortcut, or — for pickup — the browser's
 * current location. Typed addresses are geocoded before the quote step.
 * Nothing is persisted; this is a quote, not a saved profile.
 */

type Step = 1 | 2 | 3;

/** Lives inside MarketingShell, where the booking-modal provider is mounted. */
function ConfirmBookingButton({ prefill }: { prefill: BookingModalPrefill }) {
  const { open } = useBookingModal();
  return (
    <button
      type="button"
      onClick={() => open(prefill)}
      className="w-full rounded-full bg-green-ink px-6 py-3.5 font-bold text-white hover:bg-green-ink-hover"
    >
      Confirm booking
    </button>
  );
}

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [mobility, setMobility] = useState<ServiceSlug | null>(null);

  const [pickup, setPickup] = useState<AddressValue>(EMPTY_ADDRESS);
  const [dropoff, setDropoff] = useState<AddressValue>(EMPTY_ADDRESS);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [dropoffError, setDropoffError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [when, setWhen] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [escort, setEscort] = useState(false);
  const [notes, setNotes] = useState("");
  const [stat, setStat] = useState(false);

  const service = SERVICES.find((s) => s.slug === mobility) ?? null;
  // Courier moves items, not people: no escort seat, but a STAT option.
  const isCourier = mobility === "courier";

  const pickupCoord = addressCoord(pickup);
  const dropoffCoord = addressCoord(dropoff);

  const quote = useMemo(() => {
    if (!service || !pickupCoord || !dropoffCoord) return null;
    return computeQuote(service, pickupCoord, dropoffCoord, roundTrip, stat);
    // Coordinates are fresh arrays each render; compare their contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, pickupCoord?.[0], pickupCoord?.[1], dropoffCoord?.[0], dropoffCoord?.[1], roundTrip, stat]);

  const whenInPast = Boolean(when) && when < nowForDateTimeInput();
  const canAdvanceStep2 = addressFilled(pickup) && addressFilled(dropoff) && Boolean(when) && !whenInPast;
  const canAdvance = step === 1 ? Boolean(mobility) : step === 2 ? canAdvanceStep2 : true;

  /*
   * A greyed-out Continue with no reason is a dead end: the rider can see the
   * button refuse and cannot tell what it wants. This says so, and the button
   * points at it with aria-describedby so it is not a visual-only cue.
   */
  const blockedReason = (): string | null => {
    if (canAdvance) return null;
    if (step === 1) return "Choose the kind of transport to continue.";
    if (!addressFilled(pickup)) return "Add a pickup address to continue.";
    if (!addressFilled(dropoff)) return "Add a destination to continue.";
    if (!when) return "Choose a pickup date and time to continue.";
    if (whenInPast) return "That pickup time has already passed. Pick a later one.";
    return null;
  };
  const blocked = blockedReason();

  async function handleContinue() {
    if (step !== 2) {
      setStep((s) => (s + 1) as Step);
      return;
    }
    // Typed addresses that haven't been matched yet get geocoded now, so the
    // quote runs on real coordinates.
    setResolving(true);
    let ok = true;
    for (const [value, set, setError] of [
      [pickup, setPickup, setPickupError],
      [dropoff, setDropoff, setDropoffError],
    ] as const) {
      try {
        set(await resolveAddress(value));
      } catch (err) {
        ok = false;
        setError(err instanceof GeoError ? err.message : "Couldn't find that address.");
      }
    }
    setResolving(false);
    if (ok) setStep(3);
  }

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
                  className={`block h-1.5 rounded-full ${step >= n ? "bg-green-ink" : "bg-line"}`}
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
                  const selected = mobility === s.slug;
                  return (
                    <label
                      key={s.slug}
                      className={`flex cursor-pointer gap-4 rounded-xl border-2 p-5 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue ${
                        selected ? "border-green bg-moss" : "border-line hover:border-blue"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mobility"
                        value={s.slug}
                        checked={selected}
                        onChange={() => setMobility(s.slug)}
                        className="sr-only"
                      />
                      <span className={selected ? "text-green-ink" : "text-blue-ink"}>
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
                <div className="sm:col-span-2">
                  <AddressField
                    id="pickup"
                    label="Pickup"
                    value={pickup}
                    onChange={setPickup}
                    error={pickupError}
                    onError={setPickupError}
                    allowCurrentLocation
                  />
                </div>

                <div className="sm:col-span-2">
                  <AddressField
                    id="dropoff"
                    label={isCourier ? "Drop-off" : "Destination"}
                    value={dropoff}
                    onChange={setDropoff}
                    error={dropoffError}
                    onError={setDropoffError}
                  />
                </div>

                <div>
                  <label htmlFor="when" className="block text-[0.92rem] font-semibold text-deep">
                    Pickup time
                  </label>
                  <input
                    id="when"
                    type="datetime-local"
                    min={nowForDateTimeInput()}
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-base focus:border-blue"
                  />
                  {whenInPast && (
                    <p role="alert" className="mt-1.5 text-[0.82rem] font-semibold text-alert">
                      That time has already passed. Choose a later one.
                    </p>
                  )}
                  <p className="mt-1.5 text-[0.9rem] text-slate-soft">
                    {isCourier
                      ? "Routine runs are scheduled same day. Choose STAT for pickup within 30 minutes."
                      : "24 hours’ notice for routine trips. Discharges: call dispatch."}
                  </p>
                </div>

                <fieldset className="self-start">
                  <legend className="block text-[0.92rem] font-semibold text-deep">Options</legend>
                  <label className="mt-2 flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="h-5 w-5 rounded border-line"
                    />
                    Round trip (return pickup)
                  </label>
                  {isCourier ? (
                    <label className="mt-2.5 flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
                      <input
                        type="checkbox"
                        checked={stat}
                        onChange={(e) => setStat(e.target.checked)}
                        className="h-5 w-5 rounded border-line"
                      />
                      STAT pickup within 30 minutes (+${COURIER_STAT_FEE})
                    </label>
                  ) : (
                    <label className="mt-2.5 flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
                      <input
                        type="checkbox"
                        checked={escort}
                        onChange={(e) => setEscort(e.target.checked)}
                        className="h-5 w-5 rounded border-line"
                      />
                      One escort riding along (free)
                    </label>
                  )}
                </fieldset>
              </div>

              <div className="mt-5">
                <label htmlFor="notes" className="block text-[0.92rem] font-semibold text-deep">
                  {isCourier ? "Handling notes" : "Anything the driver should know?"}
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    isCourier
                      ? "Refrigerated tote, loading dock entrance, who signs at drop-off…"
                      : "Stairs at the entrance, oxygen tank, preferred door…"
                  }
                  className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-base focus:border-blue"
                />
                <p className="mt-1.5 text-[0.9rem] text-slate-soft">
                  {isCourier
                    ? "Use an order or specimen ID. Don’t include patient names or diagnoses."
                    : "Access and equipment notes only. Don’t include diagnoses here."}
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
                  <p className="mt-1 text-[0.88rem] text-slate-soft">
                    From <span className="font-semibold text-deep">{addressLabel(pickup)}</span> to{" "}
                    <span className="font-semibold text-deep">{addressLabel(dropoff)}</span>
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
                    {isCourier ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-soft">STAT dispatch</dt>
                        <dd className="tabular font-semibold text-deep">
                          {stat ? `$${quote.rushFee.toFixed(2)}` : "Not added"}
                        </dd>
                      </div>
                    ) : (
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-soft">Escort</dt>
                        <dd className="font-semibold text-green-ink">{escort ? "Included" : "Not added"}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 border-t border-line pt-3">
                      <dt className="font-bold text-deep">Total</dt>
                      <dd className="tabular font-display text-[1.3rem] font-extrabold text-deep">
                        ${quote.total.toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 rounded-lg bg-mist px-4 py-3.5 text-[0.88rem] leading-relaxed text-deep">
                    {isCourier
                      ? "Facility accounts are invoiced monthly, and a signed Business Associate Agreement is available before your first run."
                      : "Covered by Medicaid managed care or an NEMT broker? Most riders pay nothing. Have your member ID ready when dispatch calls to confirm, and we verify eligibility before the trip rather than billing you after it."}
                  </p>

                  <div className="mt-6">
                    <ConfirmBookingButton
                      prefill={{
                        serviceSlug: service.slug,
                        trip: {
                          pickup: addressLine(pickup),
                          dropoff: addressLine(dropoff),
                          when,
                          roundTrip,
                          escort: !isCourier && escort,
                          stat: isCourier && stat,
                          notes,
                        },
                      }}
                    />
                    <p className="mt-3 text-center text-[0.88rem] text-slate-soft">
                      Next we&rsquo;ll ask where to reach you. Dispatch calls to lock in your pickup
                      window. Prefer the phone? Call{" "}
                      <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
                        {COMPANY.phone}
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <p className="mt-6 text-[0.95rem] text-slate-soft">
                  Go back and enter a pickup and destination to see a price.
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
              <div className="flex flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!canAdvance || resolving}
                  aria-describedby={blocked ? "book-blocked" : undefined}
                  className="rounded-full bg-green-ink px-8 py-3 font-bold text-white disabled:opacity-40 enabled:hover:bg-green-ink-hover"
                >
                  {resolving ? "Looking up addresses…" : "Continue"}
                </button>
                {blocked && (
                  <p id="book-blocked" role="status" className="text-right text-[0.85rem] text-slate-soft">
                    {blocked}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
