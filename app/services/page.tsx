import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wheelchair, ambulatory, stretcher and bariatric medical transportation in Chicagoland, with published rates.",
};

export default function ServicesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Services"
        title="Four levels of transport. Published rates."
        lede="Every service has a base rate and a per-mile rate listed on this page. If you are covered by Medicaid managed care or an NEMT broker, most riders pay nothing. We verify before the trip, not after."
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-14">
        {SERVICES.map((s) => (
          <article key={s.slug} className="rounded-2xl border border-line bg-white p-7 lg:p-9">
            <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-blue">
                    <ServiceIcon kind={s.icon} className="h-8 w-8" />
                  </span>
                  <h2 className="font-display text-[1.5rem] font-extrabold text-deep">{s.name}</h2>
                </div>

                <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-slate-soft">
                  {s.description}
                </p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5 text-[0.95rem] text-ink">
                      <svg
                        className="mt-1 h-4 w-4 shrink-0 text-green"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="self-start rounded-xl border border-line bg-bone p-6">
                <p className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                  Starting at
                </p>
                <p className="tabular mt-1 font-display text-[2.2rem] font-extrabold leading-none text-deep">
                  ${s.fromPrice}
                </p>
                <p className="tabular mt-1 text-[0.9rem] text-slate-soft">
                  plus ${s.perMile.toFixed(2)} per mile
                </p>
                <Link
                  href={`/book?service=${s.slug}`}
                  className="mt-5 block rounded-full bg-green px-5 py-3 text-center font-bold text-white hover:bg-[#4d8f28]"
                >
                  Get a quote
                </Link>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-2.5 block text-center text-[0.9rem] font-semibold text-blue hover:underline"
                >
                  Full details →
                </Link>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </MarketingShell>
  );
}
