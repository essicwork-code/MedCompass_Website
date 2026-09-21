import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookARideButton from "@/components/BookARideButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import { asset } from "@/lib/asset";
import JsonLd from "@/components/JsonLd";
import MarketingShell from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import {
  AREAS,
  AREA_BY_SLUG,
  TIER_COPY,
  coverageTier,
  nearbyAreas,
  nearestHospitals,
} from "@/lib/areas";
import { SERVICES, SERVICE_BY_SLUG } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { computeQuote } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const area = AREA_BY_SLUG[(await params).slug];
  if (!area) return {};
  const [nearest] = nearestHospitals(area, 1);
  return {
    title: `Medical Transportation in ${area.name}, IL`,
    description: `Wheelchair, stretcher and ambulatory rides in ${area.name}, IL, with published prices. A wheelchair ride to ${nearest.place.name} is about $${Math.round(
      computeQuote(SERVICE_BY_SLUG.wheelchair, area.center, nearest.place.coord, false).total,
    )}.`,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const area = AREA_BY_SLUG[(await params).slug];
  if (!area) notFound();

  const tier = coverageTier(area);
  const hospitals = nearestHospitals(area);
  const nearest = hospitals[0];
  const nearby = nearbyAreas(area);
  const riderServices = SERVICES.filter((s) => s.slug !== "courier");
  const wheelchair = SERVICES.find((s) => s.slug === "wheelchair")!;
  const nearestWheelchair = computeQuote(wheelchair, area.center, nearest.place.coord, false).total;

  const faqs = [
    {
      q: `Do you provide medical transportation in ${area.name}?`,
      a: `Yes. ${area.name} is in our ${TIER_COPY[tier].label.toLowerCase()}. ${TIER_COPY[tier].notice} Dispatch answers ${COMPANY.phone} around the clock.`,
    },
    {
      q: `How much is a wheelchair ride from ${area.name} to ${nearest.place.name}?`,
      a: `About $${nearestWheelchair.toFixed(0)} one way from central ${area.name}: the $${wheelchair.fromPrice} wheelchair base rate plus roughly ${nearest.miles.toFixed(1)} miles at $${wheelchair.perMile.toFixed(2)} per mile. Your exact price depends on your pickup address, and the booking page shows it before you confirm.`,
    },
    {
      q: `Does Medicaid cover rides from ${area.name}?`,
      a: `Illinois Medicaid covers non-emergency rides to covered medical services, by the least expensive kind of transportation that meets the rider's needs. Managed care members arrange rides through the number on the back of their card. Our Illinois Medicaid ride guide explains the steps.`,
    },
  ];

  const pageUrl = `${SITE_URL}/areas/${area.slug}/`;

  return (
    <MarketingShell>
      <Breadcrumbs
        items={[
          { label: "Areas we serve", href: "/areas/" },
          { label: area.name },
        ]}
      />

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <p className="text-[0.82rem] font-bold uppercase tracking-widest text-green-ink">
            {area.name}, IL · {area.county}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1.06] text-deep">
            Medical transportation in {area.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-slate-soft">
            Wheelchair, ambulatory, stretcher and bariatric rides from {area.name} to appointments, dialysis
            and hospital discharges, with the price shown before you book. {area.context}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BookARideButton className="inline-flex min-h-11 items-center rounded-full bg-green-ink px-7 py-3 font-bold text-white hover:bg-green-ink-hover">
              Book a ride
            </BookARideButton>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-deep px-6 py-3 font-bold text-deep hover:bg-mist"
            >
              Call {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-12">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={asset(PHOTOS.fleetLineup.src)}
            alt={PHOTOS.fleetLineup.alt}
            width={PHOTOS.fleetLineup.width}
            height={PHOTOS.fleetLineup.height}
            sizes="(min-width: 1312px) 1280px, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="font-display text-[1.5rem] font-extrabold text-deep">
              Sample prices from {area.name}
            </h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-slate-soft">
              One way from central {area.name} to {nearest.place.name} (about {nearest.miles.toFixed(1)} road
              miles), using the same published rates as every other trip. No surcharge for evenings, weekends or
              booking late.
            </p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
              <table className="w-full min-w-[17rem] text-left text-[0.97rem]">
                <caption className="sr-only">
                  Estimated one-way prices from {area.name} to {nearest.place.name}
                </caption>
                <thead className="bg-bone text-[0.85rem] uppercase tracking-wide text-slate-soft">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Service</th>
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Rate</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-5">Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {riderServices.map((s) => (
                    <tr key={s.slug} className="border-t border-line">
                      <th scope="row" className="px-3 py-3.5 font-semibold text-deep sm:px-5">
                        <Link href={`/services/${s.slug}/`} className="inline-flex min-h-11 items-center gap-2.5 hover:underline">
                          <span className="text-blue" aria-hidden="true">
                            <ServiceIcon kind={s.icon} className="h-5 w-5" />
                          </span>
                          {s.name}
                        </Link>
                      </th>
                      <td className="tabular px-3 py-3.5 text-slate-soft sm:px-5">
                        ${s.fromPrice} + ${s.perMile.toFixed(2)}/mi
                      </td>
                      <td className="tabular px-3 py-3.5 text-right font-bold text-deep sm:px-5">
                        ${computeQuote(s, area.center, nearest.place.coord, false).total.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[0.9rem] text-slate-soft">
              Want your exact number? Enter your own addresses in the{" "}
              <Link href="/cost-calculator/" className="font-semibold text-blue-ink hover:underline">
                cost calculator
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.5rem] font-extrabold text-deep">
              Hospitals closest to {area.name}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {hospitals.map(({ place, miles }) => (
                <li key={place.id} className="rounded-2xl border border-line bg-white p-5">
                  <p className="font-display text-[1.02rem] font-bold leading-snug text-deep">{place.name}</p>
                  <p className="mt-1 text-[0.9rem] text-slate-soft">
                    {place.address}, {place.city}
                  </p>
                  <p className="tabular mt-3 text-[0.9rem] font-semibold text-moss-ink">
                    About {miles.toFixed(1)} mi from central {area.name}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.85rem] text-slate-soft">
              Distances are estimates for road travel. We drive to any hospital, clinic, dialysis center or home,
              not only the ones listed here.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.5rem] font-extrabold text-deep">
              Common rides we run from {area.name}
            </h2>
            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-[1.1rem] font-bold text-deep">Dialysis, three times a week</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-slate-soft">
                  Standing orders keep the same driver and van wherever scheduling allows, and they get first call
                  on capacity.{" "}
                  <Link href="/services/dialysis/" className="font-semibold text-blue-ink hover:underline">
                    How dialysis standing orders work
                  </Link>
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-[1.1rem] font-bold text-deep">Going home from the hospital</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-slate-soft">
                  Call as soon as the discharge order is written. Stretcher and wheelchair crews bring the rider
                  door to door, including stairs.{" "}
                  <Link href="/resources/hospital-discharge-guide/" className="font-semibold text-blue-ink hover:underline">
                    What to expect on a discharge ride
                  </Link>
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-[1.1rem] font-bold text-deep">Appointments and therapy</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-slate-soft">
                  One escort rides free, and return trips are dispatched when the appointment actually ends.{" "}
                  <Link href="/services/wheelchair/" className="font-semibold text-blue-ink hover:underline">
                    About wheelchair transport
                  </Link>
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[1.5rem] font-extrabold text-deep">
              Questions from {area.name} families
            </h2>
            <dl className="mt-5 space-y-5">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-line bg-white p-5">
                  <dt className="font-display text-[1.05rem] font-bold text-deep">{f.q}</dt>
                  <dd className="mt-2 text-[0.98rem] leading-relaxed text-slate-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.95rem]">
              <Link
                href="/resources/illinois-medicaid-transportation/"
                className="inline-flex min-h-11 items-center font-semibold text-blue-ink hover:underline"
              >
                Read the Illinois Medicaid ride guide →
              </Link>
            </p>
          </section>
        </div>

        <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-[0.82rem] font-bold uppercase tracking-widest text-green-ink">{TIER_COPY[tier].label}</p>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-ink">{TIER_COPY[tier].notice}</p>
            <Link
              href="/service-area/"
              className="mt-3 inline-flex min-h-11 items-center text-[0.92rem] font-semibold text-blue-ink hover:underline"
            >
              See the coverage map
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-[1.1rem] font-bold text-deep">Nearby communities</h2>
            <ul className="mt-2 space-y-2">
              {nearby.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}/`}
                    className="flex min-h-11 items-center font-semibold text-blue-ink hover:underline"
                  >
                    Medical rides in {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${pageUrl}#service`,
              name: `Non-emergency medical transportation in ${area.name}, IL`,
              serviceType: "Non-emergency medical transportation",
              url: pageUrl,
              provider: { "@id": `${SITE_URL}/#business` },
              areaServed: {
                "@type": "City",
                name: area.name,
                containedInPlace: { "@type": "State", name: "Illinois" },
              },
              offers: riderServices.map((s) => ({
                "@type": "Offer",
                name: s.name,
                priceSpecification: {
                  "@type": "PriceSpecification",
                  price: s.fromPrice,
                  minPrice: s.fromPrice,
                  priceCurrency: "USD",
                },
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
    </MarketingShell>
  );
}
