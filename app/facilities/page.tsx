import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { COMPANY } from "@/lib/demo/data";
import { asset } from "@/lib/asset";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Facility partnerships",
  description:
    "Corporate NEMT accounts for Chicagoland hospitals, dialysis centers and skilled nursing facilities, with direct dispatch, bulk scheduling and consolidated invoicing.",
};

const FEATURES = [
  {
    h: "A dispatch line that skips the queue",
    d: "Partner facilities call a direct number answered by a named dispatcher who knows your unit, not a general queue.",
  },
  {
    h: "Bulk recurring scheduling",
    d: "Load up to 40 standing orders in one pass. Change one and the series updates; change the series and every future trip follows.",
  },
  {
    h: "One dispatcher for your whole unit",
    d: "Your named dispatcher already has every trip your facility booked today, with status and pickup time on hand. Coordinators stop calling to ask where a van is.",
  },
  {
    h: "Consolidated invoicing",
    d: "Net-30 terms, one monthly statement, per-department cost coding. No per-trip receipts to reconcile.",
  },
  {
    h: "Discharge capacity held back",
    d: "We hold same-day capacity back specifically for discharges instead of filling every slot with scheduled trips, so a discharge call is not competing with tomorrow’s routine rides.",
  },
  {
    h: "Documentation that survives audit",
    d: "Signature capture, timestamped arrival and delivery, driver and vehicle on every trip record. Exportable for your compliance file.",
  },
];

export default function FacilitiesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For facilities"
        title="Transport your discharge planners stop chasing"
        lede="Partner accounts for hospitals, dialysis centers, skilled nursing and assisted living across Chicagoland. Set the schedule once and watch it run."
      />

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={asset(PHOTOS.dispatchDesk.src)}
              alt={PHOTOS.dispatchDesk.alt}
              width={PHOTOS.dispatchDesk.width}
              height={PHOTOS.dispatchDesk.height}
              className="h-auto w-full"
            />
          </div>
          <div>
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight text-deep">
              A named dispatcher, not a phone tree
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-slate-soft">
              When your coordinator calls, a specific person picks up who already has your
              facility&rsquo;s trips on their screen. No hold music, no re-explaining who you are
              every time.
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.h} className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-[1.1rem] font-bold text-deep">{f.h}</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-soft">{f.d}</p>
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-line bg-white p-7 lg:p-10">
          <div className="grid gap-9 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[1.6rem] font-extrabold text-deep">
                Start a facility account
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-slate-soft">
                Setup takes about a week: a service agreement, a Business Associate Agreement, and
                a walkthrough with whoever will be booking. No minimum volume and no setup fee.
              </p>

              <ol className="mt-7 space-y-4">
                {[
                  "Intro call, where we learn your volume, mobility mix and discharge patterns",
                  "Service agreement and BAA executed",
                  "Coordinator contacts added to your dispatch account",
                  "First week runs with a dispatcher assigned to your account",
                ].map((s, i) => (
                  <li key={s} className="flex gap-3.5">
                    <span className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-full bg-deep text-[0.85rem] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[0.97rem] leading-relaxed text-ink">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="self-start rounded-xl bg-bone p-7">
              <h3 className="font-display text-[1.15rem] font-bold text-deep">Talk to us</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-soft">
                Partnerships are handled by the dispatch supervisor, not a sales team.
              </p>

              <dl className="mt-5 space-y-3 text-[0.95rem]">
                <div>
                  <dt className="text-slate-soft">Direct line</dt>
                  <dd className="tabular font-bold text-deep">
                    <a href={`tel:${COMPANY.phoneHref}`} className="hover:text-blue">
                      {COMPANY.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-soft">Email</dt>
                  <dd className="font-bold text-deep">
                    <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-blue">
                      {COMPANY.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <Link
                href="/contact"
                className="mt-6 block rounded-full bg-green px-6 py-3.5 text-center font-bold text-white hover:bg-[#4d8f28]"
              >
                Request a callback
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
