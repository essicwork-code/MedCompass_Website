"use client";

import { useState } from "react";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { COMPANY } from "@/lib/demo/data";
import { sendFormEmail } from "@/lib/emailjs";
import { useFormTimer } from "@/lib/spam";
import Honeypot from "@/components/Honeypot";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import { asset } from "@/lib/asset";
import { dispatchMailto, formValue } from "@/lib/mailto";

/*
 * Driver recruitment page.
 *
 * A gap the site had until now: zero presence for the people who actually
 * drive the vans. There are no driver testimonials here: quoting invented
 * employees would be a fabrication, so the page describes the work instead
 * and offers to put a candidate on the phone with a real driver.
 */

const REQUIREMENTS = [
  "Valid driver's license with a clean record for at least 3 years",
  "Pass a background check and a pre-employment drug screen",
  "Physically able to assist with transfers and wheelchair securement",
  "CPR/AED certified, or willing to complete paid training before your first shift",
  "Comfortable working with elderly and disabled riders with patience and respect",
];

const BENEFITS = [
  {
    h: "Employee, not contractor",
    d: "Every driver is a W-2 employee with paid training, not a gig worker piecing together fares. Health benefits available after 90 days.",
  },
  {
    h: "Predictable schedules",
    d: "Standing dialysis and discharge routes create real weekly patterns, not a queue of random pings. Know your week before it starts.",
  },
  {
    h: "Paid certification",
    d: "CPR/AED, PASS, and wheelchair securement training are paid, on the clock, before you're ever assigned a rider.",
  },
  {
    h: "Work that means something",
    d: "You're not just driving a route. You're the reason someone makes their dialysis appointment or gets home from the hospital.",
  },
];

interface JobPosting {
  title: string;
  type: string;
  pay: string;
  location: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
}

const JOB_POSTINGS: JobPosting[] = [
  {
    title: "Wheelchair Van Driver",
    type: "Full-time · Employee (W-2)",
    pay: "$19-$23/hr, plus paid certification training",
    location: "Routes across Chicago and the western suburbs, based out of our South Side Chicago office",
    summary:
      "Drive a wheelchair-accessible van on scheduled routes, including standing dialysis and discharge trips. Most shifts follow a predictable weekly pattern rather than random on-demand pings.",
    responsibilities: [
      "Operate a hydraulic-lift wheelchair van safely on scheduled routes",
      "Secure wheelchairs using four-point tie-downs before every trip",
      "Assist riders door-through-door, not curb-to-curb",
      "Communicate pickup and arrival status to dispatch in real time",
      "Complete a pre-trip and post-trip vehicle inspection each shift",
    ],
    qualifications: [
      "Valid driver's license, clean record for 3+ years",
      "Pass a background check and pre-employment drug screen",
      "Comfortable assisting riders with limited mobility",
      "CPR/AED certified, or willing to complete paid training",
    ],
  },
  {
    title: "Stretcher Attendant",
    type: "Full-time · Employee (W-2)",
    pay: "$21-$26/hr, plus paid certification training",
    location: "Hospital and facility transfers across Chicagoland",
    summary:
      "Work as part of a two-person stretcher team handling hospital discharges and inter-facility transfers, including stair carries where building access requires it.",
    responsibilities: [
      "Safely load, secure, and transport riders on a stretcher",
      "Perform stair carries as a two-person team when elevators are unavailable",
      "Coordinate with hospital and facility staff at pickup and drop-off",
      "Monitor riders for comfort and safety throughout the transfer",
      "Maintain stretcher and securement equipment to inspection standard",
    ],
    qualifications: [
      "Valid driver's license, clean record for 3+ years",
      "Physically able to lift and maneuver a loaded stretcher with a partner",
      "CPR/AED and stretcher-transport certified, or willing to train",
      "Pass a background check and pre-employment drug screen",
    ],
  },
  {
    title: "Dispatcher",
    type: "Full-time · Employee (W-2)",
    pay: "$20-$25/hr, depending on experience",
    location: "Chicago dispatch desk, some remote flexibility after training",
    summary:
      "Run the live dispatch board: assign drivers and vehicles to trips, monitor the fleet map, and handle facility calls when a coordinator needs a status update.",
    responsibilities: [
      "Assign drivers and vehicles to scheduled and same-day trips",
      "Monitor the live fleet map and flag delays before a rider has to ask",
      "Answer facility calls and update coordinators directly",
      "Escalate access or equipment issues to a supervisor",
      "Keep trip records accurate for billing and compliance",
    ],
    qualifications: [
      "Comfortable in a fast-moving, multi-line phone environment",
      "Clear, calm communicator under pressure",
      "Basic computer literacy; NEMT dispatch software training provided",
      "Pass a background check",
    ],
  },
];

export default function CareersPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const [role, setRole] = useState(JOB_POSTINGS[0].title);
  const [formError, setFormError] = useState<string | null>(null);
  const timer = useFormTimer();

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Careers"
        title="Drive for Ride MedCompass"
        lede="We hire drivers, not contractors. Paid training, predictable routes, and work that actually matters to the people you're driving."
      />

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-12 overflow-hidden rounded-2xl">
          <Image
            src={asset(PHOTOS.crewTeam.src)}
            alt={PHOTOS.crewTeam.alt}
            width={PHOTOS.crewTeam.width}
            height={PHOTOS.crewTeam.height}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="grid gap-9 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[1.4rem] font-extrabold text-deep">Why drive with us</h2>
            <ul className="mt-6 space-y-5">
              {BENEFITS.map((b) => (
                <li key={b.h}>
                  <h3 className="font-display text-[1.05rem] font-bold text-deep">{b.h}</h3>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-slate-soft">{b.d}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-[1.1rem] font-bold text-deep">What the job actually is</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-slate-soft">
              Most routes are standing orders: the same riders, on the same days, at the same
              times, so you learn a route instead of chasing a queue. You are paid for training,
              you drive a van we maintain, and dispatch backs you up when a pickup runs long.
            </p>
            <p className="mt-3 text-[1rem] leading-relaxed text-slate-soft">
              If you want to hear it from the drivers themselves, ask us at the interview and we
              will put you on the phone with one.
            </p>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-[1.4rem] font-extrabold text-deep">Open positions</h2>
          <p className="mt-2 text-[0.95rem] text-slate-soft">
            Three roles open right now. Select one to see the full description.
          </p>

          <div className="mt-6 space-y-4">
            {JOB_POSTINGS.map((job) => (
              <details key={job.title} className="group rounded-2xl border border-line bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:content-['']">
                  <span className="min-w-0">
                    <span className="block font-display text-[1.1rem] font-bold text-deep">
                      {job.title}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[0.85rem] text-slate-soft">
                      <span>{job.type}</span>
                      <span className="tabular">{job.pay}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[1.6rem] leading-none text-blue transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                {/* hidden + group-open:block rather than the native details UA rule,
                    which did not apply in testing — see components/WeatherWidget.tsx. */}
                <div className="hidden border-t border-line px-6 py-5 group-open:block">
                  <p className="text-[0.85rem] font-semibold text-slate-soft">{job.location}</p>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-ink">{job.summary}</p>

                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-[0.85rem] font-bold uppercase tracking-wide text-deep">
                        Responsibilities
                      </h3>
                      <ul className="mt-2.5 space-y-2">
                        {job.responsibilities.map((r) => (
                          <li key={r} className="flex items-start gap-2.5 text-[0.92rem] text-ink">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" aria-hidden="true" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[0.85rem] font-bold uppercase tracking-wide text-deep">
                        Qualifications
                      </h3>
                      <ul className="mt-2.5 space-y-2">
                        {job.qualifications.map((q) => (
                          <li key={q} className="flex items-start gap-2.5 text-[0.92rem] text-ink">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href="#apply"
                    onClick={() => setRole(job.title)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-green px-5 py-2.5 text-[0.9rem] font-bold text-white hover:bg-[#4d8f28]"
                  >
                    Apply for this role
                  </a>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="apply" className="mt-14 scroll-mt-24 rounded-2xl border border-line bg-white p-7 lg:p-10">
          <div className="grid gap-9 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[1.4rem] font-extrabold text-deep">What we require</h2>
              <div className="mt-5 overflow-hidden rounded-xl">
                <Image
                  src={asset(PHOTOS.pretripCheck.src)}
                  alt={PHOTOS.pretripCheck.alt}
                  width={PHOTOS.pretripCheck.width}
                  height={PHOTOS.pretripCheck.height}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
              <ul className="mt-5 space-y-3">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[0.97rem] text-ink">
                    <svg className="mt-1 h-4.5 w-4.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-[1.4rem] font-extrabold text-deep">Tell us about yourself</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  if (!formValue(f, "c-name").trim()) return setFormError("Enter your name.");
                  if ((formValue(f, "c-phone").match(/\d/g)?.length ?? 0) < 7) {
                    return setFormError("Enter a phone number we can call back.");
                  }
                  setFormError(null);
                  const subject = `Job interest: ${formValue(f, "c-role")}`;
                  const fields: [string, string][] = [
                    ["Name", formValue(f, "c-name")],
                    ["Phone", formValue(f, "c-phone")],
                    ["Email", formValue(f, "c-email")],
                    ["Role", formValue(f, "c-role")],
                    ["Experience", formValue(f, "c-exp")],
                  ];
                  setStatus("sending");
                  try {
                    await sendFormEmail({
                      subject,
                      formName: "job application",
                      fromName: formValue(f, "c-name"),
                      replyTo: formValue(f, "c-email"),
                      fields,
                      guard: { honeypot: formValue(f, "c-website"), startedAt: timer.startedAt.current },
                    });
                    setStatus("sent");
                    f.reset();
                    setRole(JOB_POSTINGS[0].title);
                  } catch {
                    window.location.href = dispatchMailto(subject, fields);
                    setStatus("fallback");
                  }
                }}
                className="mt-5 space-y-4"
              >
                <Honeypot id="c-website" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="block text-[0.9rem] font-semibold text-deep">
                      Your name
                    </label>
                    <input
                      id="c-name"
                      required
                      autoComplete="name"
                      className="mt-1.5 w-full rounded-lg border-2 border-line px-3.5 py-2.5 focus:border-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="block text-[0.9rem] font-semibold text-deep">
                      Phone
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className="mt-1.5 w-full rounded-lg border-2 border-line px-3.5 py-2.5 focus:border-blue"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-email" className="block text-[0.9rem] font-semibold text-deep">
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-lg border-2 border-line px-3.5 py-2.5 focus:border-blue"
                  />
                </div>

                <div>
                  <label htmlFor="c-role" className="block text-[0.9rem] font-semibold text-deep">
                    Role you're interested in
                  </label>
                  <select
                    id="c-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-white px-3.5 py-2.5 focus:border-blue"
                  >
                    {JOB_POSTINGS.map((job) => (
                      <option key={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="c-exp" className="block text-[0.9rem] font-semibold text-deep">
                    Relevant experience
                  </label>
                  <textarea
                    id="c-exp"
                    rows={3}
                    placeholder="CDL, CNA, rideshare, caregiving, anything relevant"
                    className="mt-1.5 w-full rounded-lg border-2 border-line px-3.5 py-2.5 focus:border-blue"
                  />
                </div>

                {formError && (
                  <p role="alert" className="rounded-lg bg-alert-tint px-3.5 py-2.5 text-[0.85rem] text-alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-green px-6 py-3 font-bold text-white hover:bg-[#4d8f28] disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? "Sending…" : "Submit interest"}
                </button>

                {status === "sent" && (
                  <p role="status" className="rounded-xl bg-moss px-4 py-3.5 text-[0.88rem] leading-relaxed text-deep">
                    <strong>Thanks, we have it.</strong> Our hiring team will call you, and
                    we&rsquo;ve emailed you a confirmation.
                  </p>
                )}
                {status === "fallback" && (
                  <p role="status" className="rounded-xl bg-mist px-4 py-3.5 text-[0.88rem] leading-relaxed text-deep">
                    <strong>Almost done.</strong> Your email app should have opened with your
                    details addressed to us. Press send there. Nothing opened? Call{" "}
                    <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
                      {COMPANY.phone}
                    </a>{" "}
                    and ask for hiring.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
