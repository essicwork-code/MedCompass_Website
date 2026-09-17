import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { SEGMENTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Who we serve",
  description:
    "NEMT for families, hospital discharge planners, dialysis centers, skilled nursing facilities and lab/pharmacy courier accounts across Chicagoland.",
};

export default function WhoWeServePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Who we serve"
        title="Five kinds of callers, and they all want something different"
        lede="A daughter wants to know her mother arrived. A discharge planner wants the bed back. A dialysis coordinator wants the chair to turn on time. A lab wants the specimen there before the batch closes. We built for each of them rather than averaging them into 'patients.'"
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-14">
        {SEGMENTS.map((seg) => (
          <section
            key={seg.id}
            id={seg.id}
            className="scroll-mt-32 rounded-2xl border border-line bg-white p-7 lg:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <h2 className="font-display text-[1.5rem] font-extrabold text-deep">{seg.name}</h2>
                <p className="mt-4 border-l-3 border-green pl-4 text-[1rem] italic leading-relaxed text-slate-soft">
                  {seg.pain}
                </p>
              </div>
              <div>
                <p className="text-[1.05rem] leading-relaxed text-ink">{seg.answer}</p>
                <p className="tabular mt-5 inline-block rounded-full bg-moss px-4 py-2 text-[0.9rem] font-semibold text-moss-ink">
                  {seg.proof}
                </p>
              </div>
            </div>
          </section>
        ))}

        <section className="rounded-2xl bg-deep p-8 text-center lg:p-12">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-white">
            Booking for a facility?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-white/75">
            Facility accounts get a direct dispatch line, consolidated monthly invoicing, bulk
            scheduling for recurring trips, and a named dispatcher who already has every trip your
            unit has booked today.
          </p>
          <Link
            href="/facilities"
            className="mt-7 inline-flex rounded-full bg-lime px-8 py-3.5 font-bold text-lime-ink hover:bg-lime-hover"
          >
            Facility partnerships
          </Link>
        </section>
      </div>
    </MarketingShell>
  );
}
