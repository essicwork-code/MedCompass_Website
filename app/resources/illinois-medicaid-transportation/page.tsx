import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import Prose from "@/components/Prose";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import { asset } from "@/lib/asset";
import { COMPANY } from "@/lib/demo/data";
import { RESOURCES } from "@/lib/resources";
import { ARTICLE_OPEN_GRAPH, SITE_URL } from "@/lib/site";
import { firstPublished } from "@/lib/lastmod";

const resource = RESOURCES.find((r) => r.slug === "illinois-medicaid-transportation")!;
const REVIEWED = "2026-09-17";

export const metadata: Metadata = {
  title: resource.title,
  description: resource.description,
  openGraph: ARTICLE_OPEN_GRAPH,
};

const link = "font-semibold text-blue-ink hover:underline";

export default function IllinoisMedicaidTransportationPage() {
  return (
    <MarketingShell>
      <Breadcrumbs items={[{ label: "Resources", href: "/resources/" }, { label: "Illinois Medicaid rides" }]} />
      <PageHero eyebrow={resource.readTime} title={resource.title} lede={resource.description} />

      <div className="mx-auto max-w-4xl px-4 pt-8">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={asset(PHOTOS.clinicHandoff.src)}
            alt={PHOTOS.clinicHandoff.alt}
            width={PHOTOS.clinicHandoff.width}
            height={PHOTOS.clinicHandoff.height}
            sizes="(min-width: 928px) 896px, 100vw"
            loading="lazy"
            className="h-auto w-full"
          />
        </div>
      </div>

      <Prose>
        <p>
          Illinois Medicaid, run by the Department of Healthcare and Family Services (HFS), pays for
          non-emergency medical transportation (NEMT) in certain circumstances. The rules are simple once
          you know which kind of Medicaid coverage you have, because that decides who you call. This guide
          summarizes the state&rsquo;s published guidance as of the date at the bottom. Check with HFS or your
          plan for anything specific to your case.
        </p>

        <h2>What Medicaid covers</h2>
        <p>
          HFS covers rides to a covered medical service. The state&rsquo;s guidance says the trip must go to
          the nearest appropriate provider, by the least expensive kind of transportation that meets the
          rider&rsquo;s needs that day. In practice:
        </p>
        <ul>
          <li>
            Someone who can ride a bus or take a car is not sent a wheelchair van. Someone who can&rsquo;t sit
            upright is sent a stretcher, not a wheelchair van.
          </li>
          <li>
            The appointment has to be for a Medicaid-covered service, such as a doctor visit, dialysis,
            therapy, or a dental visit your plan covers.
          </li>
          <li>
            Rides generally need approval before the trip. For dental appointments, the state asks for the
            request at least seven days ahead.
          </li>
        </ul>

        <h2>Step 1: find out which kind of Medicaid you have</h2>
        <p>
          Most Illinois Medicaid members are enrolled in a managed care plan (HealthChoice Illinois). Others
          are on traditional fee-for-service Medicaid. If you aren&rsquo;t sure, HFS runs an automated line
          at <a href="tel:+18558284995" className={link}>1-855-828-4995</a>. Have your Medicaid Recipient
          Identification Number (RIN) ready.
        </p>

        <h2>Step 2 (managed care): call the number on your card</h2>
        <p>
          If you&rsquo;re in a managed care plan, HFS says to call the phone number on the back of your
          member ID card to schedule transportation. Your plan works with a transportation vendor that
          assigns the trip to a local provider. Ask for the ride when you book the appointment, not the day
          before.
        </p>

        <h2>Step 2 (fee-for-service): prior approval through Transdev</h2>
        <p>
          For fee-for-service members, HFS uses Transdev (formerly First Transit) to handle prior approval.
          Reach them at <a href="tel:+18777250569" className={link}>877-725-0569</a> or{" "}
          <a href="https://www.netspap.com/" className={link} rel="noopener">
            netspap.com
          </a>
          . Transdev approves the trip but doesn&rsquo;t schedule rides or send vehicles. It can give you a
          list of transportation providers to contact, and the provider you choose runs the approved trip.
        </p>
        <p>
          For some trips, the medical provider fills out a Physician Certification Statement (form HFS 2270)
          confirming the level of transport the rider needs. Ask the doctor&rsquo;s office about it early,
          especially for stretcher trips.
        </p>

        <h2>What to have ready when you call</h2>
        <ul>
          <li>Medicaid RIN or plan member ID</li>
          <li>Appointment date, time, and the full address of the clinic or hospital</li>
          <li>The pickup address, plus any stairs, ramps or building access details</li>
          <li>Whether the rider walks, uses a wheelchair, or needs a stretcher</li>
          <li>Whether someone is riding along as an escort</li>
          <li>For recurring care like dialysis, the full weekly schedule</li>
        </ul>

        <h2>If Medicaid doesn&rsquo;t cover the trip</h2>
        <p>
          Some trips aren&rsquo;t covered: a visit that isn&rsquo;t a covered service, a request that
          wasn&rsquo;t approved in time, or a rider whose plan sends the trip to a different provider. You can
          still book privately.{" "}
          <Link href="/pricing/" className={link}>
            {COMPANY.name} publishes its rates
          </Link>
          , and the{" "}
          <Link href="/cost-calculator/" className={link}>
            cost calculator
          </Link>{" "}
          shows the price for your exact addresses before you commit. When you call us, have your member ID
          ready and dispatch will tell you on the same call whether we can bill your plan for the ride.
        </p>

        <h2>Questions about a specific case</h2>
        <p>
          HFS takes non-emergency transportation questions at{" "}
          <a href="mailto:HFS.Transportation@illinois.gov" className={link}>
            HFS.Transportation@illinois.gov
          </a>
          . Sources for this guide:{" "}
          <a
            href="https://hfs.illinois.gov/medicalclients/medicaltransportationnonemergency.html"
            className={link}
            rel="noopener"
          >
            HFS: Medical Transportation (Non-Emergency)
          </a>{" "}
          and{" "}
          <a
            href="https://hfs.illinois.gov/medicalproviders/cc/ace/installment5ccnonemergencymedicaltransportation.html"
            className={link}
            rel="noopener"
          >
            HFS: Non-Emergency Medical Transportation toolkit
          </a>
          .
        </p>

        <p className="text-[0.9rem]">
          Last reviewed <time dateTime={REVIEWED}>September 17, 2026</time>. This page is general
          information, not legal or benefits advice.
        </p>
      </Prose>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.title,
          description: resource.description,
          mainEntityOfPage: `${SITE_URL}/resources/${resource.slug}/`,
          image: `${SITE_URL}/opengraph-image.jpg`,
          datePublished: firstPublished(`/resources/illinois-medicaid-transportation/`),
          // The editorial review date the page shows, not the git date: schema
          // dates have to match what the reader sees.
          dateModified: REVIEWED,
          author: { "@id": `${SITE_URL}/#business` },
          publisher: { "@id": `${SITE_URL}/#business` },
        }}
      />
    </MarketingShell>
  );
}
