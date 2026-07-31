import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { COMPANY } from "@/lib/demo/data";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How MedCompass approaches accessibility, on the road and on this website.",
};

export default function AccessibilityPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Accessibility"
        title="Accessibility statement"
        lede="Most of the people we drive live with a disability. It would be strange to build a website they could not use."
      />

      <Prose>
        <h2>Our commitment</h2>
        <p>
          We aim to meet WCAG 2.2 Level AA across this site. That is a target we hold ourselves to
          rather than a certification we claim, and we would rather hear about a failure than have
          you work around it.
        </p>

        <h2>What we have built in</h2>
        <ul>
          <li>Every interactive element is reachable and operable by keyboard, with a visible focus outline that we never remove.</li>
          <li>Body text meets a 4.5 to 1 contrast ratio, and larger text and interface boundaries meet 3 to 1.</li>
          <li>Buttons and links are at least 44 by 44 pixels with space between them, so a shaky hand or a stylus is not punished.</li>
          <li>Pinch zoom is never disabled, and the layout reflows without horizontal scrolling down to 320 pixels wide.</li>
          <li>Motion respects your reduced motion setting. When it is on, animation stops but the page stays usable rather than freezing.</li>
          <li>Live tracking updates are announced to screen readers, and everything shown on the map is also written out in text beside it.</li>
          <li>Form fields have permanent visible labels. We do not use placeholder text as a label.</li>
        </ul>

        <h2>Known gaps</h2>
        <p>
          The live map is a visual component. We provide the same information in text next to it,
          including the arrival time, the distance remaining, the trip stage and the vehicle, so
          nothing is only available on the map. If you find something that is, tell us and we will
          treat it as a defect.
        </p>

        <h2>Accessibility on the road</h2>
        <ul>
          <li>Hydraulic lifts on wheelchair vans, rated to 800 lb, with four point securement.</li>
          <li>Bariatric equipment rated to 750 lb on vans scheduled for it.</li>
          <li>Door through door assistance as standard, not an upcharge.</li>
          <li>Service animals always welcome, at no cost and without notice.</li>
          <li>Drivers trained on securement for the specific equipment they carry.</li>
        </ul>

        <h2>Tell us where we fall short</h2>
        <p>
          If any part of this site or our service is difficult to use, call dispatch at{" "}
          <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
            {COMPANY.phone}
          </a>{" "}
          or write to{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-blue-ink hover:underline">
            {COMPANY.email}
          </a>
          . We respond within one business day, and we will arrange your ride by phone in the
          meantime so nothing is delayed while we fix it.
        </p>

        <h2>About this page</h2>
        <p>
          This is a demonstration site. The commitments above describe how the site is built, but
          MedCompass as described here is not an operating company.
        </p>
      </Prose>
    </MarketingShell>
  );
}
