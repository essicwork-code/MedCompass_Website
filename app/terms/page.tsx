import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms covering MedCompass non-emergency medical transportation.",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of service"
        lede="The short version: we drive people to medical appointments, we are not an ambulance, and we bill what we published."
      />

      <Prose>
        <h2>What we are, and what we are not</h2>
        <p>
          MedCompass provides non emergency medical transportation. Our vehicles carry mobility
          equipment and trained drivers. They do not carry paramedics, cardiac monitors or emergency
          medication, and our staff do not provide clinical care of any kind.
        </p>
        <p>
          <strong>If someone needs emergency medical attention, call 911.</strong> We cannot
          respond to emergencies and will not accept a trip that should be an ambulance call.
        </p>

        <h2>Booking and confirmation</h2>
        <p>
          A trip is confirmed when you receive a confirmation with a trip code. Quotes given before
          that are estimates based on the distance and service level you described. If the actual
          trip differs, for example a rider needs a wheelchair van rather than an ambulatory seat,
          the rate changes to match and we tell you before we drive.
        </p>

        <h2>Rates and billing</h2>
        <p>
          Published rates are on our{" "}
          <Link href="/pricing" className="font-semibold text-blue hover:underline">
            pricing page
          </Link>
          . Where a Medicaid managed care plan, a broker or a facility account covers the trip, we
          bill them directly and verify eligibility before travel. Private pay is charged after the
          trip completes.
        </p>

        <h2>What we ask of you</h2>
        <ul>
          <li>Tell us about access issues in advance, such as stairs, a narrow doorway or a locked entrance.</li>
          <li>Tell us the rider&rsquo;s actual weight and mobility needs, so we send equipment that is rated for them.</li>
          <li>Be ready within the pickup window. Our driver waits 15 minutes.</li>
          <li>Make sure an escort is present where one is medically required.</li>
        </ul>
        <p>
          We may decline or end a trip if a rider&rsquo;s condition is beyond what non emergency
          transport can safely handle, or if a driver&rsquo;s safety is at risk. In either case we
          help arrange the right alternative.
        </p>

        <h2>Cancellations</h2>
        <p>
          Covered separately on our{" "}
          <Link href="/cancellation" className="font-semibold text-blue hover:underline">
            cancellation page
          </Link>
          , including the circumstances where we waive the fee.
        </p>

        <h2>Liability</h2>
        <p>
          We carry commercial auto and general liability insurance as required in Illinois, and we
          are licensed and bonded under USDOT {COMPANY.usdot}. Our liability is limited to the
          transportation service itself. We are not responsible for missed appointments caused by
          circumstances outside our control, such as weather, road closures or a clinic running
          behind.
        </p>

        <h2>Privacy</h2>
        <p>
          Handling of health information is described on our{" "}
          <Link href="/privacy" className="font-semibold text-blue hover:underline">
            privacy and HIPAA page
          </Link>
          .
        </p>

        <h2>About this page</h2>
        <p>
          This is a demonstration site. MedCompass as described here is not an operating company,
          and nothing on this page forms a contract or an offer of service.
        </p>
      </Prose>
    </MarketingShell>
  );
}
