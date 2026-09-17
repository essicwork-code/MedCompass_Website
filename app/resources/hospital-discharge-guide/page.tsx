import Link from "next/link";
import type { Metadata } from "next";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import { RESOURCES } from "@/lib/resources";
import { COMPANY } from "@/lib/demo/data";

const resource = RESOURCES.find((r) => r.slug === "hospital-discharge-guide")!;

export const metadata: Metadata = {
  title: resource.title,
  description: resource.description,
};

export default function HospitalDischargeGuidePage() {
  return (
    <MarketingShell>
      <PageHero eyebrow={resource.readTime} title={resource.title} lede={resource.description} />

      <Prose>
        <p>
          A discharge order gets written, and suddenly transport is the thing standing between a
          patient and going home, or the bed and its next patient. Here is what actually happens
          between that order and a van showing up.
        </p>

        <h2>Who calls it in</h2>
        <p>
          Usually a discharge planner, case manager, or floor nurse, not the patient or family
          directly. If you are family and nobody has called transport yet, you can call{" "}
          <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
            {COMPANY.phone}
          </a>{" "}
          yourself, but it helps to have the discharging unit's name and the patient's mobility
          level (walking, wheelchair, or stretcher) ready when you call.
        </p>

        <h2>How fast a van actually shows up</h2>
        <p>
          We hold same-day capacity back specifically for discharges rather than filling every slot
          with scheduled trips, which is why our median discharge pickup runs 42 minutes from the
          call. That is a real operational number, not a marketing one; it moves around with how
          many discharges are happening across the city at the same hour, but it does not move
          because of which hospital or which neighborhood.
        </p>

        <h2>What determines the right vehicle</h2>
        <ul>
          <li>
            <strong>Can the patient walk and transfer independently?</strong> Ambulatory transport,
            the fastest to dispatch and least expensive.
          </li>
          <li>
            <strong>Can they sit upright but not walk far?</strong> Wheelchair transport with a
            hydraulic lift.
          </li>
          <li>
            <strong>Do they need to stay reclined?</strong> Stretcher transport with two attendants,
            which takes longer to dispatch since it requires two people and a specific vehicle.
          </li>
        </ul>
        <p>
          Getting this right the first time matters. A wheelchair van dispatched for what turns out
          to be a stretcher case means a second van has to be sent, which is the single biggest
          cause of a discharge taking longer than it should.
        </p>

        <h2>What to have ready</h2>
        <ul>
          <li>Discharge paperwork and any prescriptions the unit is sending home</li>
          <li>Personal mobility equipment, folded if it is a wheelchair or walker</li>
          <li>Oxygen tank, if the patient uses one, with enough for the ride</li>
          <li>A working phone number for whoever should get the arrival text</li>
          <li>Insurance or Medicaid member ID, if this trip is not private pay</li>
        </ul>

        <h2>What happens if the discharge gets delayed</h2>
        <p>
          Discharges slip. Labs come back late, a physician needs to sign off, a family member is
          still in transit. Call dispatch and push the pickup rather than letting the van sit idle
          in the lot; there is no charge for adjusting a pickup time before the driver arrives, and
          it frees that van for another discharge in the meantime.
        </p>

        <h2>Once the trip starts</h2>
        <p>
          Whoever is listed as the contact gets a text confirming the driver and van assigned to
          the pickup, plus a call from the driver on approach. If the pickup runs early or late,
          dispatch calls the listed contact directly rather than leaving them to guess.
        </p>

        <h2>For discharge planners booking regularly</h2>
        <p>
          If your unit sends multiple discharges a week, a{" "}
          <Link href="/facilities" className="font-semibold text-blue-ink hover:underline">
            facility account
          </Link>{" "}
          gets you a direct dispatch line and a named dispatcher who already has every trip your
          unit has booked today, so you stop calling to ask where a van is.
        </p>
      </Prose>
    </MarketingShell>
  );
}
