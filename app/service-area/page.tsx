"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { SERVICE_AREA } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";

const CoverageMap = dynamic(() => import("@/components/CoverageMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-mist" />,
});

export default function ServiceAreaPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICE_AREA;
    return SERVICE_AREA.filter((t) => t.toLowerCase().includes(q));
  }, [query]);

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Coverage"
        title="Where we run"
        lede="Chicago proper plus the western and northern suburbs, with scheduled long-distance runs into southeastern Wisconsin. Outside the ring? Call dispatch anyway. We quote trips outside the area instead of turning them down."
      />

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="h-[420px] w-full lg:h-[560px]">
              <CoverageMap />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-5 py-3.5 text-[0.85rem]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-lime" aria-hidden="true" />
                Core area · same-day capacity
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-sky" aria-hidden="true" />
                Extended · 24h notice
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue" aria-hidden="true" />
                Partner facility
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="town" className="block font-display text-[1.15rem] font-bold text-deep">
              Check your town
            </label>
            <input
              id="town"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing… e.g. Berwyn"
              autoComplete="off"
              className="mt-3 w-full rounded-full border-2 border-line bg-white px-5 py-3 text-[0.98rem] outline-none focus:border-blue"
            />

            <p aria-live="polite" className="mt-3 text-[0.9rem] text-slate-soft">
              {query.trim()
                ? filtered.length > 0
                  ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} in our service area.`
                  : "No match in the core list. Call dispatch and we'll quote it."
                : `${SERVICE_AREA.length} municipalities served.`}
            </p>

            <ul className="mt-4 flex max-h-[420px] flex-wrap gap-2 overflow-y-auto">
              {filtered.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.88rem] text-slate-soft"
                >
                  {t}
                </li>
              ))}
            </ul>

            {filtered.length === 0 && (
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="mt-5 block rounded-full bg-green px-6 py-3.5 text-center font-bold text-white hover:bg-[#4d8f28]"
              >
                Call dispatch · {COMPANY.phone}
              </a>
            )}
          </div>
        </div>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              h: "Core area",
              d: "Roughly 12 miles from our Cicero base. Same-day discharge capacity held back daily, median pickup 42 minutes from the call.",
            },
            {
              h: "Extended area",
              d: "Out to about 22 miles, including the far western and northern suburbs. Book 24 hours ahead for guaranteed capacity.",
            },
            {
              h: "Long distance",
              d: "Scheduled runs into southeastern Wisconsin and downstate Illinois for transfers and specialist appointments. Quoted per trip.",
            },
          ].map((c) => (
            <div key={c.h} className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-[1.15rem] font-bold text-deep">{c.h}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-soft">{c.d}</p>
            </div>
          ))}
        </section>
      </div>
    </MarketingShell>
  );
}
