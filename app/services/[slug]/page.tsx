import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import BookARideButton from "@/components/BookARideButton";
import { SERVICES, SERVICE_BY_SLUG } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";

/*
 * Static export needs the full slug list at build time. Extra slugs beyond the
 * four service types (e.g. /services/dialysis, linked from the footer) are
 * handled as aliases so those links don't 404.
 */
const ALIASES: Record<string, { title: string; body: string; base: string }> = {
  dialysis: {
    title: "Dialysis standing orders",
    body: "Three sessions a week, the same driver and the same van wherever scheduling allows. Missing a session is not an inconvenience, it is a hospital admission, so standing orders get first call on capacity and a dispatcher who knows the schedule by name.",
    base: "wheelchair",
  },
};

/** The default steps assume a patient is riding along; courier moves items, not people. */
const COURIER_STEPS: [string, string][] = [
  ["Call or fax it in", "Give dispatch the pickup, the drop-off, and whether it's routine or STAT."],
  ["Driver signs at pickup", "Every item is logged with a signature and a time stamp before it leaves the building."],
  ["Direct to destination", "No shared stops. The van goes straight from pickup to drop-off."],
  ["Signed off at delivery", "A second signature closes the chain of custody, and we text the sender it arrived."],
];

export function generateStaticParams() {
  return [...SERVICES.map((s) => ({ slug: s.slug })), ...Object.keys(ALIASES).map((slug) => ({ slug }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG[slug];
  if (service) return { title: service.name, description: service.short };
  const alias = ALIASES[slug];
  return alias ? { title: alias.title, description: alias.body.slice(0, 150) } : {};
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alias = ALIASES[slug];
  const service = SERVICE_BY_SLUG[slug] ?? (alias ? SERVICE_BY_SLUG[alias.base] : undefined);

  if (!service) notFound();

  const title = alias?.title ?? service.name;
  const body = alias?.body ?? service.description;
  const isCourier = service.slug === "courier";

  return (
    <MarketingShell>
      <PageHero eyebrow="Service" title={title} lede={body} />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="font-display text-[1.4rem] font-extrabold text-deep">
            What&rsquo;s included
          </h2>
          <ul className="mt-5 space-y-3.5">
            {service.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-3 text-[1rem] text-ink">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green" aria-hidden="true" />
                {inc}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-[1.4rem] font-extrabold text-deep">
            How the trip runs
          </h2>
          <ol className="mt-5 space-y-5">
            {(isCourier
              ? COURIER_STEPS
              : ([
                  ["Confirmation the night before", "A text confirms the pickup window, the driver's name, and the unit number of the van."],
                  ["Driver arrives and comes to the door", "No curbside drop-offs. The driver comes to the door and walks the rider out."],
                  ["Status updates as the trip runs", "Whoever is on the account gets a text when the driver is dispatched, when they arrive, and when the rider is delivered."],
                  ["Hand-off at the desk", "The rider is handed to reception, not left in a lobby. We text you when they're inside."],
                ] as [string, string][])
            ).map(([heading, detail], i) => (
              <li key={heading} className="flex gap-4">
                <span className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full bg-deep text-[0.9rem] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[1.05rem] font-bold text-deep">{heading}</h3>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-slate-soft">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="self-start rounded-2xl border border-line bg-white p-7">
          <span className="text-blue">
            <ServiceIcon kind={service.icon} className="h-9 w-9" />
          </span>
          <p className="mt-4 text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
            Starting at
          </p>
          <p className="tabular mt-1 font-display text-[2.4rem] font-extrabold leading-none text-deep">
            ${service.fromPrice}
          </p>
          <p className="tabular mt-1 text-[0.92rem] text-slate-soft">
            plus ${service.perMile.toFixed(2)} per mile
          </p>

          <BookARideButton
            serviceSlug={service.slug}
            className="mt-6 block w-full rounded-full bg-green px-5 py-3.5 text-center font-bold text-white hover:bg-[#4d8f28]"
          >
            Get a quote
          </BookARideButton>
          <a
            href={`tel:${COMPANY.phoneHref}`}
            className="mt-2.5 block rounded-full border-2 border-deep px-5 py-3.5 text-center font-bold text-deep hover:bg-bone"
          >
            {COMPANY.phone}
          </a>

          <p className="mt-5 border-t border-line pt-5 text-[0.88rem] leading-relaxed text-slate-soft">
            {isCourier
              ? "STAT pickups dispatch within 30 minutes for a $25 rush fee. Facility accounts can set up standing courier routes on an invoice."
              : "Covered by Medicaid managed care or an NEMT broker? Most riders pay nothing. We verify eligibility before the trip."}
          </p>
        </aside>
      </div>
    </MarketingShell>
  );
}
