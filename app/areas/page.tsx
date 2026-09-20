import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { AREAS, TIER_COPY, coverageTier, nearestHospitals, type CoverageTier } from "@/lib/areas";
import { SERVICE_AREA } from "@/lib/content";

export const metadata: Metadata = {
  title: "Areas We Serve in Chicagoland",
  description:
    "Medical transportation across Chicago and the suburbs, from Cicero and Oak Park to Evanston and Naperville. Prices and nearby hospitals for your town.",
};

const TIERS: CoverageTier[] = ["core", "extended", "scheduled"];

export default function AreasPage() {
  const withPages = new Set(AREAS.map((a) => a.name));
  const otherTowns = SERVICE_AREA.filter((t) => !withPages.has(t));

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ label: "Areas we serve" }]} />
      <PageHero
        eyebrow="Areas we serve"
        title="Medical rides across Chicagoland"
        lede="Pick your community for sample prices, the hospitals closest to you, and how far ahead to book."
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-14">
        {TIERS.map((tier) => {
          const areas = AREAS.filter((a) => coverageTier(a) === tier);
          if (areas.length === 0) return null;
          return (
            <section key={tier}>
              <h2 className="font-display text-[1.5rem] font-extrabold text-deep">{TIER_COPY[tier].label}</h2>
              <p className="mt-1.5 max-w-2xl text-[0.98rem] leading-relaxed text-slate-soft">{TIER_COPY[tier].notice}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {areas.map((a) => {
                  const [nearest] = nearestHospitals(a, 1);
                  return (
                    <li key={a.slug}>
                      <Link
                        href={`/areas/${a.slug}/`}
                        className="lift-on-hover block h-full rounded-2xl border border-line bg-white p-5 hover:border-blue"
                      >
                        <span className="block font-display text-[1.15rem] font-bold text-deep">{a.name}</span>
                        <span className="mt-0.5 block text-[0.85rem] text-slate-soft">{a.county}</span>
                        <span className="mt-3 block text-[0.88rem] text-ink">
                          Nearest major hospital: {nearest.place.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section>
          <h2 className="font-display text-[1.3rem] font-extrabold text-deep">Also served</h2>
          <p className="mt-1.5 max-w-2xl text-[0.98rem] leading-relaxed text-slate-soft">
            We also run trips in these communities. Check any address on the{" "}
            <Link href="/service-area/" className="font-semibold text-blue-ink hover:underline">
              coverage map
            </Link>{" "}
            or get a price in the{" "}
            <Link href="/cost-calculator/" className="font-semibold text-blue-ink hover:underline">
              cost calculator
            </Link>
            .
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {otherTowns.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.9rem] text-slate-soft">
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MarketingShell>
  );
}
