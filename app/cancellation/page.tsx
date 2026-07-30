import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Cancellation policy",
  description: "MedCompass cancellation and no-show terms, written plainly.",
};

export default function CancellationPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Policy"
        title="Cancellations and changes"
        lede="Plans change, and medical plans change more than most. Here is exactly what happens, so nobody finds out from an invoice."
      />

      <Prose>
        <h2>Cancelling a ride</h2>
        <ul>
          <li>
            <strong>More than 2 hours before pickup:</strong> no charge, for any reason.
          </li>
          <li>
            <strong>Within 2 hours of pickup:</strong> 50% of the base rate, with no mileage charge.
          </li>
          <li>
            <strong>After the driver arrives:</strong> the full base rate, again with no mileage.
          </li>
        </ul>

        <h2>When we waive it anyway</h2>
        <p>
          We do not charge a late cancellation fee when the reason is medical. If an appointment is
          cancelled by the clinic, a procedure runs long, a rider is admitted, or someone is simply
          too unwell to travel, tell us and the fee comes off. You do not need to explain the
          details and we will not ask for them.
        </p>

        <h2>If we are the ones who are late</h2>
        <p>
          If we arrive more than 30 minutes past the agreed pickup window and it was our fault, that
          leg is free. If a late arrival on our part causes a missed appointment, the return trip is
          free as well. You do not have to ask, but please do tell us, because we would rather know.
        </p>

        <h2>Standing orders</h2>
        <p>
          Cancel a single session in a standing order at no charge with 2 hours notice. To pause or
          end the whole series, give us 48 hours so we can release the driver and the van to someone
          else who needs them.
        </p>

        <h2>No shows</h2>
        <p>
          Our driver waits 15 minutes at the pickup point and calls twice before leaving. If we
          cannot reach anyone, the trip is billed at the base rate. Facilities on an account are
          notified the same day rather than at the end of the month.
        </p>

        <h2>How to cancel</h2>
        <p>
          Call dispatch at{" "}
          <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue hover:underline">
            {COMPANY.phone}
          </a>
          , any hour. You can also cancel from the client portal, but for anything inside two hours
          please call so a person hears it immediately.
        </p>

        <h2>About this page</h2>
        <p>
          This is a demonstration site. The terms above illustrate how the product presents policy
          and are not an offer or a contract.
        </p>
      </Prose>
    </MarketingShell>
  );
}
