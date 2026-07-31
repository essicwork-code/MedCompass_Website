"use client";

import { useState } from "react";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import { COMPANY } from "@/lib/demo/data";

/*
 * Contact form.
 *
 * Submits nowhere — this is a demo build with no backend. Rather than fake a
 * success state, the form says so on submit and points at the phone number,
 * which is the channel that actually works today.
 */
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Dispatch is staffed around the clock"
        lede="If it involves a trip happening today, a discharge, a delay, a change, please call. It is faster than any form and a person answers."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-[1.4rem] font-extrabold text-deep">Reach us</h2>

          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Ride bookings
              </dt>
              <dd className="tabular mt-1 font-display text-[1.6rem] font-extrabold text-deep">
                <a href={`tel:${COMPANY.phoneHref}`} className="hover:text-blue">
                  {COMPANY.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Facility &amp; discharge line
              </dt>
              <dd className="tabular mt-1 font-display text-[1.6rem] font-extrabold text-deep">
                <a href={`tel:${COMPANY.dispatchPhone.replace(/\D/g, "")}`} className="hover:text-blue">
                  {COMPANY.dispatchPhone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Email
              </dt>
              <dd className="mt-1 text-[1.05rem] font-semibold text-deep">
                <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-blue">
                  {COMPANY.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Office
              </dt>
              <dd className="mt-1 text-[1.02rem] leading-relaxed text-ink">
                {COMPANY.address}
                <br />
                {COMPANY.city}
              </dd>
            </div>

            <div>
              <dt className="text-[0.85rem] font-semibold uppercase tracking-wide text-slate-soft">
                Hours
              </dt>
              <dd className="mt-1 text-[1.02rem] leading-relaxed text-ink">{COMPANY.hours}</dd>
            </div>
          </dl>

          <p className="mt-8 rounded-xl bg-alert-tint px-5 py-4 text-[0.95rem] leading-relaxed text-alert">
            <strong>Medical emergency?</strong> Call 911. MedCompass provides non-emergency
            transport only and cannot respond to emergencies.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-7 lg:p-9">
          <h2 className="font-display text-[1.4rem] font-extrabold text-deep">Send a message</h2>
          <p className="mt-2 text-[0.95rem] text-slate-soft">
            For quotes, facility accounts and non-urgent questions. We reply within one business day.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-[0.92rem] font-semibold text-deep">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 focus:border-blue"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[0.92rem] font-semibold text-deep">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 focus:border-blue"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[0.92rem] font-semibold text-deep">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 focus:border-blue"
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-[0.92rem] font-semibold text-deep">
                What is this about?
              </label>
              <select
                id="topic"
                name="topic"
                className="mt-2 w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 focus:border-blue"
              >
                <option>Booking a ride</option>
                <option>Facility or corporate account</option>
                <option>Insurance and coverage</option>
                <option>Feedback about a trip</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-[0.92rem] font-semibold text-deep">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 focus:border-blue"
              />
              <p className="mt-1.5 text-[0.82rem] text-slate-soft">
                Please don&rsquo;t include diagnoses or medical records here.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
            >
              Send message
            </button>

            {submitted && (
              <p role="status" className="rounded-xl bg-amber-tint px-5 py-4 text-[0.93rem] leading-relaxed text-deep">
                <strong>This is a demonstration site.</strong> The form has no backend, so nothing
                was sent and nobody was notified. On a live site this would reach dispatch. To
                actually reach someone, call{" "}
                <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
                  {COMPANY.phone}
                </a>
                .
              </p>
            )}
          </form>
        </div>
      </div>
    </MarketingShell>
  );
}
