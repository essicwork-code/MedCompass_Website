import Image from "next/image";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { COMPANY, DRIVERS, VEHICLES } from "@/lib/demo/data";
import { STATS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedCompass is a Chicagoland non-emergency medical transportation company built around live tracking and on-time arrival.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="About"
        title="We started because someone's mother was left waiting"
        lede="Four hours in a hospital lobby after a discharge, with three phone calls that all ended in 'the van is on its way.' Nobody could say where it was, because nobody actually knew."
      />

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-2xl">
            <p className="text-[1.08rem] leading-relaxed text-ink">
              Non emergency medical transportation sells a promise. A van will be somewhere at a
              certain time. Almost nobody in this industry can show you whether that promise is
              actually being kept.
            </p>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-slate-soft">
              So we built the tracking first. Before the brochure, before the fleet livery, before
              the phone system. Every MedCompass trip produces a live position and an arrival time
              that the rider, their family, and the facility can all see at once. It turns out that
              when everyone can see the same thing, most of the phone calls stop.
            </p>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-slate-soft">
              The rest follows from that. Drivers stay with the same standing orders so riders see a
              familiar face. Rates are published so nobody negotiates at a curb. Discharge capacity
              is held back on purpose, because a bed that cannot empty is a bed that cannot fill.
            </p>

            <h2 className="mt-12 font-display text-[1.5rem] font-extrabold text-deep">
              How we operate
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                ["Drivers, not contractors", "Every driver is an employee, background-checked, CPR/AED certified, and trained on securement for the equipment they carry."],
                ["Same driver where we can", "Standing orders are assigned to a consistent driver and van. For a rider with dementia, a familiar face is not a nicety."],
                ["Inspection on a schedule, not on failure", "Lifts and securement hardware are inspected monthly and logged. The dates are visible on our dispatch board."],
                ["Privacy by construction", "Tracking links carry a van and an arrival time. They never carry a name, a condition, or a destination facility, so forwarding one gives nothing away."],
              ].map(([h, d]) => (
                <li key={h}>
                  <h3 className="font-display text-[1.05rem] font-bold text-deep">{h}</h3>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-slate-soft">{d}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/brand/van-side.jpg"
                alt="A MedCompass wheelchair-accessible van"
                width={1156}
                height={419}
                className="h-auto w-full"
              />
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {[
                ...STATS.slice(0, 2),
                { value: String(VEHICLES.length), label: "vans in the fleet" },
                { value: String(DRIVERS.length), label: "drivers on staff" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse rounded-xl border border-line bg-white px-5 py-4"
                >
                  <dt className="mt-1 text-[0.85rem] text-slate-soft">{s.label}</dt>
                  <dd className="tabular font-display text-[1.6rem] font-extrabold leading-none text-deep">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-[1.1rem] font-bold text-deep">Credentials</h2>
              <dl className="tabular mt-4 space-y-2.5 text-[0.92rem]">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-soft">USDOT</dt>
                  <dd className="font-semibold text-deep">{COMPANY.usdot}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-soft">MC</dt>
                  <dd className="font-semibold text-deep">{COMPANY.mc}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-soft">NPI</dt>
                  <dd className="font-semibold text-deep">{COMPANY.npi}</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-line pt-4 text-[0.88rem] leading-relaxed text-slate-soft">
                Licensed, bonded and insured in Illinois. ADA-compliant vehicles inspected under
                IDOT requirements.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </MarketingShell>
  );
}
