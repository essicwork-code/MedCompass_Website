import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Plain-language guides to non-emergency medical transportation costs, coverage and what to expect.",
};

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Resources"
        title="Guides worth reading before you book"
        lede="No sales pitch, just the actual answers to what people ask us on the phone every day."
      />

      <div className="mx-auto max-w-4xl px-4 py-14">
        <ul className="space-y-5">
          {RESOURCES.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/resources/${r.slug}`}
                className="group block rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-[0_14px_40px_-20px_rgb(16_34_46/0.4)]"
              >
                <p className="text-[0.8rem] font-semibold uppercase tracking-wide text-slate-soft">
                  {r.readTime}
                </p>
                <h2 className="mt-1.5 font-display text-[1.4rem] font-bold text-deep">{r.title}</h2>
                <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-soft">{r.description}</p>
                <span className="mt-4 inline-block text-[0.92rem] font-semibold text-blue group-hover:underline">
                  Read the guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
