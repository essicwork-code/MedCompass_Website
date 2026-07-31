import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { RESOURCES } from "@/lib/resources";
import { SERVICES } from "@/lib/content";
import { COMPANY } from "@/lib/demo/data";

const resource = RESOURCES.find((r) => r.slug === "nemt-cost-chicago")!;

export const metadata: Metadata = {
  title: resource.title,
  description: resource.description,
};

const wheelchair = SERVICES.find((s) => s.slug === "wheelchair")!;
const ambulatory = SERVICES.find((s) => s.slug === "ambulatory")!;
const stretcher = SERVICES.find((s) => s.slug === "stretcher")!;
const bariatric = SERVICES.find((s) => s.slug === "bariatric")!;

export default function NemtCostChicagoPage() {
  return (
    <MarketingShell>
      <PageHero eyebrow={resource.readTime} title={resource.title} lede={resource.description} />

      <Prose>
        <p>
          Most NEMT providers make you call and wait for a callback to find out what a ride costs.
          That is backwards for something you are trying to budget for, especially if it is a
          recurring trip three times a week. Here is the actual math.
        </p>

        <h2>The two numbers that make up every fare</h2>
        <p>
          Every trip has a base rate for the service level, plus a per-mile charge for the
          distance. There is no separate fuel surcharge, no evening or weekend markup, and no fee
          for wait time under 20 minutes.
        </p>
        <ul>
          <li>
            <strong>{wheelchair.name}:</strong> ${wheelchair.fromPrice} base + ${wheelchair.perMile.toFixed(2)}/mile
          </li>
          <li>
            <strong>{ambulatory.name}:</strong> ${ambulatory.fromPrice} base + ${ambulatory.perMile.toFixed(2)}/mile
          </li>
          <li>
            <strong>{stretcher.name}:</strong> ${stretcher.fromPrice} base + ${stretcher.perMile.toFixed(2)}/mile
          </li>
          <li>
            <strong>{bariatric.name}:</strong> ${bariatric.fromPrice} base + ${bariatric.perMile.toFixed(2)}/mile
          </li>
        </ul>
        <p>
          A wheelchair trip from Oak Park to a dialysis center four miles away runs about $68. The
          same service level across town, twelve miles, runs closer to $94. Distance is the
          variable; the base rate for a given service level does not change by neighborhood or time
          of day.
        </p>

        <h2>Why stretcher costs so much more than wheelchair</h2>
        <p>
          Stretcher transport requires two attendants on every trip, not one driver, plus a
          full-recline cot with rail restraints and, often, a stair carry. That is a different labor
          cost structure than a single driver with a lift, and the base rate reflects it. If a rider
          can sit upright and transfer into a wheelchair van instead, that is the cheaper and
          usually more comfortable option; a good dispatcher will tell you if stretcher is not
          actually necessary rather than defaulting to it.
        </p>

        <h2>What actually changes the price</h2>
        <ul>
          <li>
            <strong>Distance.</strong> The only variable in the formula above. Longer trips outside
            the core service area are quoted individually rather than by the standard per-mile
            rate.
          </li>
          <li>
            <strong>Wait time over 20 minutes.</strong> Billed at $18/hour in 15-minute increments,
            most relevant for a "wait and return" appointment like a short imaging visit.
          </li>
          <li>
            <strong>Round trip vs. one way.</strong> A round trip is simply two one-way fares. There
            is no discount for booking both legs together, but there is also no penalty; the return
            leg is open-ended and dispatched when the rider is actually ready.
          </li>
        </ul>
        <p>What does <strong>not</strong> change the price: time of day, day of week, or how far in advance you book.</p>

        <h2>If you are covered by Medicaid or a broker</h2>
        <p>
          Most riders on this kind of trip are not paying these rates out of pocket. If a Medicaid
          managed care plan or an NEMT broker covers the ride, {COMPANY.name} bills them directly
          and verifies eligibility before the trip, not after it. Bring your member ID when you
          book. If your plan is not directly billable, we can usually tell you that on the same call
          rather than after the ride happens.
        </p>

        <h2>Getting an exact number</h2>
        <p>
          The formula above is exact, not a ballpark, for any address inside the core service area.
          Use the{" "}
          <Link href="/cost-calculator" className="font-semibold text-blue-ink hover:underline">
            cost calculator
          </Link>{" "}
          to plug in a real pickup and destination, or start a{" "}
          <Link href="/book" className="font-semibold text-blue-ink hover:underline">
            booking
          </Link>{" "}
          to see the same number with your actual trip details and any add-ons.
        </p>
      </Prose>
    </MarketingShell>
  );
}
