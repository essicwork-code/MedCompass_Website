import { AREAS } from "@/lib/areas";
import { SERVICES, SERVICE_ALIASES, SERVICE_AREA, SERVICE_BY_SLUG } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";
import { RESOURCES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/*
 * /llms.txt — the llmstxt.org convention: one H1, a blockquote summary, free
 * body text, then H2 sections of `- [name](url): note` links.
 *
 * Worth being honest about what this is. The 2026 citation studies rank it low
 * on evidence — no major assistant has confirmed it changes retrieval, and the
 * pages themselves already carry the same facts in schema.org markup. It is
 * here because it costs nothing, it is generated from the same source data as
 * the pages so it cannot drift, and the curation it forces (what are the
 * twenty URLs that actually answer a question?) is useful regardless.
 *
 * Rules that do matter: every URL must return 200, none may redirect, and the
 * file stays small. Trailing slashes are therefore mandatory here — without
 * one the host 301s and the agent burns a hop.
 */
function body(): string {
  const price = (n: number) => `$${n.toFixed(2)}`;

  const services = SERVICES.map(
    (s) =>
      `- [${s.name}](${SITE_URL}/services/${s.slug}/): ${s.short} From ` +
      `${price(s.fromPrice)} base plus ${price(s.perMile)} per mile.`,
  );

  // Use-case landing pages priced off an existing service. Dialysis is the
  // query volume here, so it belongs in the list rather than buried as an alias.
  const aliases = Object.entries(SERVICE_ALIASES).map(([slug, a]) => {
    const base = SERVICE_BY_SLUG[a.base];
    return (
      `- [${a.title}](${SITE_URL}/services/${slug}/): ${a.short} Priced as ` +
      `${base.name.toLowerCase()}, from ${price(base.fromPrice)} base plus ` +
      `${price(base.perMile)} per mile.`
    );
  });

  // The dedicated town pages, not all 40-odd communities in the service area.
  const areas = AREAS.map(
    (a) => `- [${a.name}, IL](${SITE_URL}/areas/${a.slug}/): ${a.context}`,
  );

  const guides = RESOURCES.map(
    (r) => `- [${r.title}](${SITE_URL}/resources/${r.slug}/): ${r.description}`,
  );

  return `# ${COMPANY.name}

> ${COMPANY.name} is a non-emergency medical transportation (NEMT) and medical
> courier provider serving Chicago and ${SERVICE_AREA.length - 1} surrounding
> communities. Wheelchair, ambulatory, stretcher and bariatric transport, with
> every rate published rather than quoted by phone. ${COMPANY.hours}.

Rates are base fare plus per mile, listed on every service page and in full on
the pricing page below. One escort rides free on every trip. Wait time past 20
minutes bills at $18/hour in 15-minute increments, and there is no evening or
weekend surcharge. Medicaid and managed-care broker trips are billed directly,
in which case the rider's share is usually nothing.

Phone ${COMPANY.phone}. Email ${COMPANY.email}. Based at ${COMPANY.address}, ${COMPANY.city}.

## Services

${[...services, ...aliases].join("\n")}

## Pricing and booking

- [Pricing and insurance](${SITE_URL}/pricing/): Every base and per-mile rate, what Medicaid and brokers cover, and worked examples of real trips.
- [Cost calculator](${SITE_URL}/cost-calculator/): Enter a pickup and destination for an exact fare before booking.
- [Book a ride](${SITE_URL}/book/): Scheduling form for one-off and recurring trips.
- [Service area](${SITE_URL}/service-area/): Coverage map and the full list of communities served.

## Guides

${guides.join("\n")}

## Towns served

${areas.join("\n")}

## Optional

- [About ${COMPANY.name}](${SITE_URL}/about/): How the operation is run, and what the vehicles and training actually are.
- [FAQ](${SITE_URL}/faq/): Common questions on booking windows, escorts, equipment and billing.
- [For facilities and discharge planners](${SITE_URL}/facilities/): Standing orders, recurring dialysis schedules and consolidated invoicing.
- [Who we serve](${SITE_URL}/who-we-serve/): Riders, families, and the facility roles that book on their behalf.
- [Contact](${SITE_URL}/contact/): Dispatch phone, email and hours.
- [Careers](${SITE_URL}/careers/): Driver and dispatcher openings.
`;
}

export function GET(): Response {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
