"use client";

import Link from "next/link";
import { useState } from "react";
import AddressField, { EMPTY_ADDRESS, addressCoord, type AddressValue } from "@/components/AddressField";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import BookARideButton from "@/components/BookARideButton";
import { COURIER_STAT_FEE, SERVICES, type ServiceSlug } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { computeQuote } from "@/lib/quote";

/*
 * A no-commitment estimate, separate from the booking wizard.
 *
 * Dream Care Rides has a standalone cost calculator; we didn't, even though
 * the same math already exists inside step 3 of /book. Splitting it out
 * gives someone comparing providers a number without having to start a
 * booking to see it — and it's a page worth linking to directly, which a
 * step buried in a wizard never is.
 */

export default function CostCalculatorPage() {
  const [mobility, setMobility] = useState<ServiceSlug>("wheelchair");
  const [pickup, setPickup] = useState<AddressValue>(EMPTY_ADDRESS);
  const [dropoff, setDropoff] = useState<AddressValue>(EMPTY_ADDRESS);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [dropoffError, setDropoffError] = useState<string | null>(null);
  const [roundTrip, setRoundTrip] = useState(false);
  const [stat, setStat] = useState(false);

  const service = SERVICES.find((s) => s.slug === mobility)!;
  const isCourier = mobility === "courier";
  const from = addressCoord(pickup);
  const to = addressCoord(dropoff);
  const quote = from && to ? computeQuote(service, from, to, roundTrip, stat) : null;

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Cost calculator"
        title="See what a ride costs, no booking required"
        lede="Pick a service type and enter any two addresses in Chicagoland for an instant estimate. This uses the same published rates as the rest of the site, so the number you see here is the number you'd see at checkout."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-line bg-white p-6 lg:p-8">
          <fieldset>
            <legend className="font-display text-[1.05rem] font-bold text-deep">Service type</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const selected = mobility === s.slug;
                return (
                  <label
                    key={s.slug}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue ${
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
                      <ServiceIcon kind={s.icon} className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block text-[0.95rem] font-bold text-deep">{s.name}</span>
                      <span className="tabular block text-[0.85rem] text-slate-soft">
                        ${s.fromPrice} + ${s.perMile.toFixed(2)}/mi
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 space-y-5">
            <AddressField
              id="calc-pickup"
              label="Pickup"
              value={pickup}
              onChange={setPickup}
              error={pickupError}
              onError={setPickupError}
              allowCurrentLocation
            />
            <AddressField
              id="calc-dropoff"
              label="Destination"
              value={dropoff}
              onChange={setDropoff}
              error={dropoffError}
              onError={setDropoffError}
            />
          </div>

          <label className="mt-5 flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-5 w-5 rounded border-line"
            />
            Round trip (return pickup)
          </label>
          {isCourier && (
            <label className="mt-3 flex min-h-11 items-center gap-2.5 text-[0.95rem] text-ink">
              <input
                type="checkbox"
                checked={stat}
                onChange={(e) => setStat(e.target.checked)}
                className="h-5 w-5 rounded border-line"
              />
              STAT pickup within 30 minutes (+${COURIER_STAT_FEE})
            </label>
          )}

          <p className="mt-6 text-[0.85rem] leading-relaxed text-slate-soft">
            Estimates use straight-line distance between the two points with a 25% adjustment for
            city driving, the same formula the booking flow uses. An unusual route, heavy traffic
            corridor, or hard-to-reach entrance can change the real number. Call{" "}
            <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
              {COMPANY.phone}
            </a>{" "}
            for an exact quote, or{" "}
            <Link href="/book" className="font-semibold text-blue-ink hover:underline">
              book the trip
            </Link>{" "}
            with the price shown up front.
          </p>
        </div>

        {/* Result */}
        <aside className="self-start rounded-2xl border border-line bg-white p-7">
          {quote ? (
            <>
              <p className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Estimated {roundTrip ? "round trip" : "one way"}
              </p>
              <p className="tabular mt-1 font-display text-[2.6rem] font-extrabold leading-none text-deep">
                ${quote.total.toFixed(2)}
              </p>
              <p className="tabular mt-1 text-[0.9rem] text-slate-soft">
                {quote.miles.toFixed(1)} miles · {service.name.toLowerCase()}
              </p>

              <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.9rem]">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-soft">Base rate</dt>
                  <dd className="tabular font-semibold text-deep">${service.fromPrice.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-soft">Distance charge</dt>
                  <dd className="tabular font-semibold text-deep">
                    ${(quote.miles * service.perMile).toFixed(2)}
                  </dd>
                </div>
                {roundTrip && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-soft">Return leg</dt>
                    <dd className="tabular font-semibold text-deep">${quote.oneWay.toFixed(2)}</dd>
                  </div>
                )}
                {quote.rushFee > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-soft">STAT dispatch</dt>
                    <dd className="tabular font-semibold text-deep">${quote.rushFee.toFixed(2)}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-5 rounded-lg bg-mist px-3.5 py-3 text-[0.85rem] leading-relaxed text-deep">
                {isCourier
                  ? "Facility accounts can run standing courier routes on a monthly invoice."
                  : "Covered by Medicaid managed care or an NEMT broker? Most riders pay nothing toward this."}
              </p>

              <BookARideButton
                serviceSlug={service.slug}
                className="mt-5 block w-full rounded-full bg-green px-5 py-3 text-center font-bold text-white hover:bg-[#4d8f28]"
              >
                {isCourier ? "Book this pickup" : "Book this ride"}
              </BookARideButton>
            </>
          ) : (
            <>
              <p className="font-display text-[1.15rem] font-bold text-deep">Your estimate</p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-soft">
                Enter a pickup and a destination, or pick a major hospital, to see a price. Typed
                addresses are checked when you leave the field.
              </p>
            </>
          )}
        </aside>
      </div>
    </MarketingShell>
  );
}
