import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import BookARideButton from "@/components/BookARideButton";
import { FAQS, SERVICES } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Pricing & insurance",
  description:
    "Published NEMT rates for Chicagoland covering wheelchair, ambulatory, stretcher, bariatric transport and medical courier service, plus Medicaid and broker billing.",
};

/** Representative trips so a rate table turns into a number people recognise. */
const EXAMPLES = [
  { trip: "Oak Park → Westside Kidney Center", miles: 4.2, service: "wheelchair" },
  { trip: "Cicero → Rush University Medical Center", miles: 7.8, service: "ambulatory" },
  { trip: "Loyola → Oak Park Rehabilitation", miles: 5.1, service: "stretcher" },
  { trip: "Skokie → Northwestern Memorial", miles: 12.4, service: "ambulatory" },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="The number, before the ride"
        lede="Most transport companies quote by phone, after they know how much you need them. Our rates are on this page. If a broker or Medicaid plan covers you, your share is usually nothing."
      />

      <div className="mx-auto max-w-7xl px-4 py-14">
        {/* Rate table */}
        <section>
          <h2 className="font-display text-[1.6rem] font-extrabold text-deep">Rates</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[600px] text-left">
              <caption className="sr-only">Base and per-mile rates by service type</caption>
              <thead className="border-b border-line bg-bone text-[0.85rem] uppercase tracking-wide text-slate-soft">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Service</th>
                  <th scope="col" className="px-5 py-3.5">Base</th>
                  <th scope="col" className="px-5 py-3.5">Per mile</th>
                  <th scope="col" className="px-5 py-3.5">Typical 8-mile trip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SERVICES.map((s) => (
                  <tr key={s.slug}>
                    <th scope="row" className="px-5 py-4 font-semibold text-deep">
                      {s.name}
                    </th>
                    <td className="tabular px-5 py-4 text-slate-soft">${s.fromPrice.toFixed(2)}</td>
                    <td className="tabular px-5 py-4 text-slate-soft">${s.perMile.toFixed(2)}</td>
                    <td className="tabular px-5 py-4 font-bold text-deep">
                      ${(s.fromPrice + 8 * s.perMile).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[0.88rem] text-slate-soft">
            One escort rides free on every service. Wait time over 20 minutes bills at $18/hour in
            15-minute increments. No surcharge for evenings or weekends.
          </p>
          <Link
            href="/cost-calculator"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-ink hover:underline"
          >
            Try the cost calculator for your own trip →
          </Link>
        </section>

        {/* Worked examples */}
        <section className="mt-14">
          <h2 className="font-display text-[1.6rem] font-extrabold text-deep">Real trips, real prices</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {EXAMPLES.map((ex) => {
              const s = SERVICES.find((x) => x.slug === ex.service)!;
              const total = s.fromPrice + ex.miles * s.perMile;
              return (
                <li key={ex.trip} className="rounded-2xl border border-line bg-white p-6">
                  <p className="font-semibold text-deep">{ex.trip}</p>
                  <p className="tabular mt-1 text-[0.88rem] text-slate-soft">
                    {ex.miles} mi · {s.name.toLowerCase()}
                  </p>
                  <p className="tabular mt-3 font-display text-[1.8rem] font-extrabold text-deep">
                    ${total.toFixed(2)}
                  </p>
                  <p className="text-[0.85rem] text-slate-soft">one way, out of pocket</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Coverage */}
        <section className="mt-14 rounded-2xl border border-line bg-white p-7 lg:p-10">
          <h2 className="font-display text-[1.6rem] font-extrabold text-deep">
            If you&rsquo;re covered, you probably pay nothing
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            {[
              {
                h: "Medicaid managed care",
                d: "We bill Illinois MCO plans directly. Bring your member ID and we verify eligibility before the trip, so you will not get a bill weeks later for a ride you thought was covered.",
              },
              {
                h: "NEMT brokers",
                d: "We take assignments from the major brokers. If your plan routed you to a broker, give us the trip number and we handle the paperwork.",
              },
              {
                h: "Private pay & facilities",
                d: "Card, invoice, or a facility account billed monthly. Facility accounts get net-30 terms and one consolidated statement instead of per-trip receipts.",
              },
            ].map((c) => (
              <div key={c.h}>
                <h3 className="font-display text-[1.1rem] font-bold text-deep">{c.h}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-soft">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-7">
            <BookARideButton className="rounded-full bg-green px-7 py-3.5 font-bold text-white hover:bg-[#4d8f28]">
              Get an exact quote
            </BookARideButton>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="rounded-full border-2 border-deep px-7 py-3.5 font-bold text-deep hover:bg-bone"
            >
              Check my coverage · {COMPANY.phone}
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-display text-[1.6rem] font-extrabold text-deep">Common questions</h2>
          <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-deep marker:content-['']">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[1.4rem] leading-none text-blue transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                {/* hidden + group-open:block rather than relying on the browser's native
                    details:not([open]) UA rule — that rule did not apply in testing, see
                    components/WeatherWidget.tsx for the full explanation. */}
                <p className="mt-3 hidden max-w-3xl text-[0.97rem] leading-relaxed text-slate-soft group-open:block">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
