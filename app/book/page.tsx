"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MarketingShell from "@/components/MarketingShell";
import { useBookingModal, type BookingModalPrefill } from "@/components/BookingModalProvider";
import ServiceIcon from "@/components/ServiceIcon";
import { COURIER_STAT_FEE, SERVICES, type ServiceSlug } from "@/lib/content";
import { COMPANY, PLACES } from "@/lib/demo/data";
import { computeQuote } from "@/lib/quote";
import {
  forwardGeocode,
  getCurrentPosition,
  reverseGeocode,
  searchAddresses,
  GeoError,
  type AddressSuggestion,
  type GeoPoint,
} from "@/lib/geo";
import type { LatLng } from "@/lib/demo/types";

/** How long to let the rider keep typing before hitting the geocoder. */
const SUGGEST_DEBOUNCE_MS = 400;

/*
 * Booking wizard.
 *
 * The competitor booking flows all end at "we'll call you with a price". This
 * one shows the number before the commit, which is the single most requested
 * thing in NEMT reviews. Confirming hands the chosen trip to the booking modal,
 * which only has to ask for contact details before sending it to dispatch.
 *
 * Pickup has two real modes, not just the fixed list of saved facilities:
 *  1. "Use my current location" — the browser's actual geolocation, reverse
 *     geocoded to a readable address. This is the one that needs a
 *     permission prompt, and the UI has to handle grant, deny, and timeout
 *     as distinct, honest states rather than pretending it always works.
 *  2. A typed address, forward geocoded on Continue.
 * Neither is persisted anywhere — this is a quote, not a saved profile.
 */

const PLACE_OPTIONS = Object.values(PLACES);

function placeLine(id: string): string {
  const p = PLACES[id];
  return p ? `${p.name}, ${p.address}, ${p.city}` : "";
}

type Step = 1 | 2 | 3;
type PickupMode = "saved" | "custom";
type GeoStatus = "idle" | "locating" | "resolving" | "error";

/** Lives inside MarketingShell, where the booking-modal provider is mounted. */
function ConfirmBookingButton({ prefill }: { prefill: BookingModalPrefill }) {
  const { open } = useBookingModal();
  return (
    <button
      type="button"
      onClick={() => open(prefill)}
      className="w-full rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
    >
      Confirm booking
    </button>
  );
}

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [mobility, setMobility] = useState<ServiceSlug | null>(null);

  const [pickupMode, setPickupMode] = useState<PickupMode>("saved");
  const [pickupId, setPickupId] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customPoint, setCustomPoint] = useState<GeoPoint | null>(null);
  const [usedCurrentLocation, setUsedCurrentLocation] = useState(false);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestSeq = useRef(0);
  // Set whenever customAddress is filled in programmatically (a picked
  // suggestion, or a geolocation result) rather than typed. Selecting a
  // suggestion changes customAddress, which would otherwise re-trigger this
  // same effect and immediately re-search for — and reopen a dropdown
  // showing — the address that was just chosen.
  const resolvedAddressRef = useRef<string | null>(null);

  // Debounced address autocomplete. A sequence number guards against an
  // earlier, slower request overwriting the result of a more recent
  // keystroke — the rider typed on, so the stale response should lose.
  useEffect(() => {
    if (
      pickupMode !== "custom" ||
      usedCurrentLocation ||
      customAddress.trim().length < 4 ||
      customAddress === resolvedAddressRef.current
    ) {
      setSuggestions([]);
      return;
    }

    const mySeq = ++suggestSeq.current;
    const timer = setTimeout(() => {
      searchAddresses(customAddress).then((results) => {
        if (suggestSeq.current === mySeq) {
          setSuggestions(results);
          setSuggestionsOpen(results.length > 0);
        }
      });
    }, SUGGEST_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [customAddress, pickupMode, usedCurrentLocation]);

  const [dropoffId, setDropoffId] = useState("");
  const [when, setWhen] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [escort, setEscort] = useState(false);
  const [notes, setNotes] = useState("");
  const [stat, setStat] = useState(false);

  const service = SERVICES.find((s) => s.slug === mobility) ?? null;
  // Courier moves items, not people: no escort seat, but a STAT option.
  const isCourier = mobility === "courier";

  const pickupCoord: LatLng | null =
    pickupMode === "saved"
      ? (PLACES[pickupId]?.coord ?? null)
      : customPoint
        ? [customPoint.lat, customPoint.lng]
        : null;
  const pickupLabel = pickupMode === "saved" ? PLACES[pickupId]?.name : customAddress;

  const quote = useMemo(() => {
    if (!service || !pickupCoord || !dropoffId) return null;
    const b = PLACES[dropoffId];
    if (!b) return null;
    return computeQuote(service, pickupCoord, b.coord, roundTrip, stat);
    // pickupCoord is a fresh array each render; comparing its contents (not
    // its identity) so the quote doesn't recompute needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, pickupCoord?.[0], pickupCoord?.[1], dropoffId, roundTrip, stat]);

  async function useMyLocation() {
    setGeoStatus("locating");
    setGeoError(null);
    try {
      const point = await getCurrentPosition();
      setGeoStatus("resolving");
      const address = await reverseGeocode(point);
      resolvedAddressRef.current = address;
      setCustomPoint(point);
      setCustomAddress(address);
      setPickupMode("custom");
      setUsedCurrentLocation(true);
      setGeoStatus("idle");
    } catch (err) {
      setGeoStatus("error");
      setGeoError(err instanceof GeoError ? err.message : "Couldn't get your location. Try entering an address.");
    }
  }

  function switchToCustom() {
    setPickupMode("custom");
    setCustomAddress("");
    setCustomPoint(null);
    setUsedCurrentLocation(false);
    setGeoStatus("idle");
    setGeoError(null);
    setSuggestions([]);
    setSuggestionsOpen(false);
    resolvedAddressRef.current = null;
  }

  function switchToSaved() {
    setPickupMode("saved");
    setCustomAddress("");
    setCustomPoint(null);
    setUsedCurrentLocation(false);
    setGeoStatus("idle");
    setGeoError(null);
    setSuggestions([]);
    setSuggestionsOpen(false);
    resolvedAddressRef.current = null;
  }

  function pickSuggestion(s: AddressSuggestion) {
    resolvedAddressRef.current = s.label;
    setCustomAddress(s.label);
    setCustomPoint(s.point);
    setSuggestionsOpen(false);
    setSuggestions([]);
  }

  const pickupReady = pickupMode === "saved" ? Boolean(pickupId) : customAddress.trim().length > 0;
  const canAdvanceStep2 = pickupReady && Boolean(dropoffId && when);
  const canAdvance = step === 1 ? Boolean(mobility) : step === 2 ? canAdvanceStep2 : true;

  async function handleContinue() {
    if (step === 2 && pickupMode === "custom" && !customPoint && customAddress.trim()) {
      // Typed by hand rather than via geolocation — resolve it to real
      // coordinates before the quote step needs them.
      setGeoStatus("resolving");
      setGeoError(null);
      try {
        const { point, label } = await forwardGeocode(customAddress);
        resolvedAddressRef.current = label;
        setCustomPoint(point);
        setCustomAddress(label);
        setGeoStatus("idle");
        setStep(3);
      } catch (err) {
        setGeoStatus("error");
        setGeoError(err instanceof GeoError ? err.message : "Couldn't find that address.");
      }
      return;
    }
    setStep((s) => (s + 1) as Step);
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
                  const selected = mobility === s.slug;
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
                        onChange={() => setMobility(s.slug)}
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
                <div className="sm:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor={pickupMode === "saved" ? "pickup" : "pickup-address"}
                      className="block text-[0.92rem] font-semibold text-deep"
                    >
                      Pickup
                    </label>
                    <button
                      type="button"
                      onClick={pickupMode === "saved" ? switchToCustom : switchToSaved}
                      className="text-[0.85rem] font-semibold text-blue-ink hover:underline"
                    >
                      {pickupMode === "saved" ? "Enter a different address" : "Choose a saved location instead"}
                    </button>
                  </div>

                  {pickupMode === "saved" ? (
                    <select
                      id="pickup"
                      value={pickupId}
                      onChange={(e) => setPickupId(e.target.value)}
                      className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-blue"
                    >
                      <option value="">Select a pickup location…</option>
                      {PLACE_OPTIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.city})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        id="pickup-address"
                        type="text"
                        value={customAddress}
                        onChange={(e) => {
                          setCustomAddress(e.target.value);
                          // Any hand-edit invalidates a previously resolved
                          // point — it gets re-geocoded on Continue, or
                          // sooner if the rider picks a live suggestion.
                          setCustomPoint(null);
                          setUsedCurrentLocation(false);
                        }}
                        onFocus={() => setSuggestionsOpen(suggestions.length > 0)}
                        onBlur={() => {
                          // Delay so a click on a suggestion (see onMouseDown
                          // below) registers before the list disappears.
                          setTimeout(() => setSuggestionsOpen(false), 150);
                        }}
                        placeholder="Street address, city"
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={suggestionsOpen}
                        aria-controls="pickup-suggestions"
                        aria-autocomplete="list"
                        className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-blue"
                      />

                      {suggestionsOpen && suggestions.length > 0 && (
                        <ul
                          id="pickup-suggestions"
                          role="listbox"
                          aria-label="Address suggestions"
                          className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-line bg-white shadow-lg"
                        >
                          {suggestions.map((s) => (
                            <li key={`${s.point.lat},${s.point.lng}`} role="option" aria-selected={false}>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  // mousedown fires before the input's blur,
                                  // so the click actually lands.
                                  e.preventDefault();
                                  pickSuggestion(s);
                                }}
                                className="block w-full px-3.5 py-2.5 text-left text-[0.9rem] text-ink hover:bg-mist"
                              >
                                {s.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {usedCurrentLocation && customPoint && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] text-green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Using your current location
                        </p>
                      )}
                      {!usedCurrentLocation && customPoint && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] text-green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Address confirmed
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={geoStatus === "locating" || geoStatus === "resolving"}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-blue px-3.5 py-1.5 text-[0.85rem] font-semibold text-blue-ink hover:bg-mist disabled:opacity-50"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {geoStatus === "locating"
                        ? "Locating…"
                        : geoStatus === "resolving"
                          ? "Looking up address…"
                          : "Use my current location"}
                    </button>
                    <span className="text-[0.8rem] text-slate-soft">
                      We&rsquo;ll ask your browser for permission first.
                    </span>
                  </div>

                  {geoStatus === "error" && geoError && (
                    <p role="alert" className="mt-2 rounded-lg bg-alert-tint px-3.5 py-2.5 text-[0.85rem] text-alert">
                      {geoError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="dropoff" className="block text-[0.92rem] font-semibold text-deep">
                    Destination
                  </label>
                  <select
                    id="dropoff"
                    value={dropoffId}
                    onChange={(e) => setDropoffId(e.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-blue"
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
                    className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-blue"
                  />
                  <p className="mt-1.5 text-[0.82rem] text-slate-soft">
                    {isCourier
                      ? "Routine runs are scheduled same day. Choose STAT for pickup within 30 minutes."
                      : "24 hours’ notice for routine trips. Discharges: call dispatch."}
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
                  {isCourier ? (
                    <label className="mt-2.5 flex items-center gap-2.5 text-[0.95rem] text-ink">
                      <input
                        type="checkbox"
                        checked={stat}
                        onChange={(e) => setStat(e.target.checked)}
                        className="h-5 w-5 rounded border-line"
                      />
                      STAT pickup within 30 minutes (+${COURIER_STAT_FEE})
                    </label>
                  ) : (
                    <label className="mt-2.5 flex items-center gap-2.5 text-[0.95rem] text-ink">
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
                  className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-blue"
                />
                <p className="mt-1.5 text-[0.82rem] text-slate-soft">
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
                    From <span className="font-semibold text-deep">{pickupLabel}</span>
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
                        <dd className="font-semibold text-green">{escort ? "Included" : "Not added"}</dd>
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
                      : "Covered by Medicaid managed care or an NEMT broker? Most riders pay nothing. Enter your member ID at confirmation and we verify eligibility before the trip rather than billing you after it."}
                  </p>

                  <div className="mt-6">
                    <ConfirmBookingButton
                      prefill={{
                        serviceSlug: service.slug,
                        trip: {
                          pickup: pickupMode === "saved" ? placeLine(pickupId) : customAddress,
                          dropoff: placeLine(dropoffId),
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
                onClick={handleContinue}
                disabled={!canAdvance || geoStatus === "resolving"}
                className="rounded-full bg-green px-8 py-3 font-bold text-white disabled:opacity-40 enabled:hover:bg-[#4d8f28]"
              >
                {geoStatus === "resolving" ? "Looking up address…" : "Continue"}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
