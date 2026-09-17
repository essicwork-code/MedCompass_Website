import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { FAQS, SERVICES } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Medical Transportation FAQ",
  description:
    "Answers about booking non-emergency medical transportation in Chicago: service types, prices, Medicaid, escorts, round trips and how far ahead to book.",
};

const byService = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

const BOOKING_FAQS = [
  {
    q: "How do I book a ride?",
    a: `Book online and see the price before you confirm, call dispatch at ${COMPANY.phone} (answered 24/7), or use the chat on any page. Dispatch calls you back to confirm the pickup window.`,
  },
  {
    q: "Which service type do I need?",
    a: `Ambulatory is for riders who can walk with a steadying arm. Wheelchair transport is for riders who stay in their own chair, with a lift and four-point securement. Stretcher transport is for riders who can't sit upright and comes with two attendants. Bariatric transport uses equipment rated to 750 lb. Not sure? Pick the closest one and dispatch will check with you before the trip.`,
  },
  {
    q: "How much does a ride cost?",
    a: `Every fare is a base rate plus a per-mile charge, for example ${byService("wheelchair").name.toLowerCase()} at $${byService("wheelchair").fromPrice} plus $${byService("wheelchair").perMile.toFixed(2)} per mile. There's no evening or weekend markup, and the booking page shows your total before you confirm.`,
  },
  {
    q: "Do I have to pay when I book?",
    a: "No card is needed to request a ride. Dispatch confirms the price with you before the trip.",
  },
];

const ALL = [...BOOKING_FAQS, ...FAQS];

export default function FaqPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <PageHero
        eyebrow="FAQ"
        title="Questions families and facilities ask us"
        lede="If yours isn't here, dispatch answers the phone around the clock."
      />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <dl className="space-y-4">
          {ALL.map((f) => (
            <div key={f.q} className="rounded-2xl border border-line bg-white p-6">
              <dt className="font-display text-[1.12rem] font-bold text-deep">{f.q}</dt>
              <dd className="mt-2 text-[1rem] leading-relaxed text-slate-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-2xl bg-mist p-6">
          <h2 className="font-display text-[1.2rem] font-bold text-deep">Keep reading</h2>
          <ul className="mt-2">
            <li>
              <Link href="/resources/illinois-medicaid-transportation/" className="flex min-h-11 items-center font-semibold text-blue-ink hover:underline">
                How Illinois Medicaid rides work
              </Link>
            </li>
            <li>
              <Link href="/resources/nemt-cost-chicago/" className="flex min-h-11 items-center font-semibold text-blue-ink hover:underline">
                What medical transportation costs in Chicago
              </Link>
            </li>
            <li>
              <Link href="/areas/" className="flex min-h-11 items-center font-semibold text-blue-ink hover:underline">
                Communities we serve
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ALL.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </MarketingShell>
  );
}
