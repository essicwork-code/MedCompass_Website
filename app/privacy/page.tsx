import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Privacy & HIPAA",
  description: "How MedCompass handles protected health information and what tracking links do not reveal.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Privacy"
        title="Privacy and HIPAA"
        lede="Where someone is going for treatment is medical information. We treat it that way, including in the parts of the product you can forward to other people."
      />

      <Prose>
        <h2>Our role under HIPAA</h2>
        <p>
          When we transport patients on behalf of a health plan, a hospital or a broker, MedCompass
          acts as a Business Associate. Trip details, appointment times and mobility needs are
          protected health information, and we handle them under a Business Associate Agreement
          with every facility partner.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Rider name, contact details and the pickup and destination addresses.</li>
          <li>Mobility requirements and equipment needs, which is what we use to assign the right van.</li>
          <li>Access notes you give us, such as stairs at an entrance or a preferred door.</li>
          <li>Insurance or broker identifiers, used to verify eligibility and to bill.</li>
          <li>Trip records including timestamps, driver, vehicle and route.</li>
        </ul>
        <p>
          We do not ask for diagnoses and we do not want them. Our drivers need to know how to move
          someone safely, not why they are being treated.
        </p>

        <h2>What a tracking link shows</h2>
        <p>
          This is the part people ask about most, so it is worth being exact. A public tracking link
          shows only:
        </p>
        <ul>
          <li>The vehicle position on a map and its unit number.</li>
          <li>The estimated arrival time and distance remaining.</li>
          <li>The trip stage, such as on the way or arrived.</li>
          <li>The driver&rsquo;s first name.</li>
        </ul>
        <p>
          It does not show the rider&rsquo;s name, their condition, the pickup address, or the name
          of the facility they are travelling to. A link forwarded into a family group chat, or
          screenshotted, does not disclose that anyone is receiving treatment. Links carry a single
          use token that stops working when the trip closes.
        </p>

        <h2>Who can see what</h2>
        <p>
          Every account is individual. Dispatchers, drivers, billing staff and clients each see a
          different view, and every access is logged against a named person. Shared logins are not
          permitted, because an account that several people use cannot be audited.
        </p>

        <h2>Mapping and third parties</h2>
        <p>
          Our map provider receives coordinates and a trip identifier. It never receives a rider
          name, a condition or a facility name, so no third party mapping service holds information
          that could identify a patient.
        </p>

        <h2>Retention</h2>
        <p>
          Trip records and the associated compliance documentation are retained for six years, in
          line with HIPAA requirements. Tracking tokens are discarded when a trip completes.
        </p>

        <h2>Your rights</h2>
        <p>
          You may request a copy of the information we hold about you, ask us to correct it, or ask
          for an accounting of disclosures. Contact us at{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-blue-ink hover:underline">
            {COMPANY.email}
          </a>{" "}
          or {COMPANY.phone}.
        </p>

        <h2>About this page</h2>
        <p>
          This is a demonstration site. No real personal or health information is collected here,
          and the trips shown are simulated. This page describes the intended policy of the product
          rather than the practices of an operating company.
        </p>
      </Prose>
    </MarketingShell>
  );
}
