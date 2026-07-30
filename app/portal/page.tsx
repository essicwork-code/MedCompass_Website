"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import TripTracker from "@/components/TripTracker";
import ChatWidget from "@/components/ChatWidget";
import { COMPANY, DRIVER_BY_ID, TRIPS, VEHICLE_BY_ID } from "@/lib/demo/data";
import { STATUS_COPY } from "@/lib/demo/simulator";

/*
 * Client portal.
 *
 * The account holder is usually not the rider — it is an adult child managing
 * a parent's trips — so the dashboard is built around "where is she right now"
 * rather than around the account itself.
 *
 * Sign-in is a demo stub. It deliberately does not present a password field:
 * a fake credential form teaches the wrong habit and this build has no auth
 * behind it. Real deployment needs per-user accounts with distinct roles —
 * shared logins are a HIPAA violation, not merely bad practice.
 */

const ACCOUNT = {
  holder: "Denise Alvarez",
  rider: "Eleanor Vance",
  relationship: "Daughter · authorized representative",
  memberId: "IL-MCO-4417832",
  plan: "Illinois Medicaid managed care",
};

const ACTIVE_TRIP = TRIPS.find((t) => t.id === "t1")!;
const UPCOMING = TRIPS.filter((t) => t.status === "scheduled");
const HISTORY = TRIPS.filter((t) => t.status === "completed");

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export default function PortalPage() {
  const [signedIn, setSignedIn] = useState(false);

  if (!signedIn) {
    return (
      <div className="grid min-h-screen place-items-center bg-bone px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center">
            <Logo />
          </Link>

          <div className="rounded-2xl border border-line bg-white p-8">
            <h1 className="font-display text-[1.6rem] font-extrabold text-deep">Client sign in</h1>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-soft">
              Track active rides, review trip history, and book without calling.
            </p>

            <div className="mt-6 rounded-xl bg-mist px-4 py-3.5">
              <p className="text-[0.85rem] font-bold text-deep">Demonstration account</p>
              <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-soft">
                This prototype has no authentication behind it, so there is nothing to type. In
                production each user gets their own credentials, because shared logins are a HIPAA
                accountability violation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSignedIn(true)}
              className="mt-6 w-full rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
            >
              Continue as {ACCOUNT.holder}
            </button>

            <p className="mt-5 text-center text-[0.85rem] text-slate-soft">
              Not a client yet?{" "}
              <Link href="/book" className="font-semibold text-blue hover:underline">
                Book your first ride
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[0.85rem] text-slate-soft">
            Staff member?{" "}
            <Link href="/admin" className="font-semibold text-blue hover:underline">
              Dispatch sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <a href={`tel:${COMPANY.phoneHref}`} className="text-[0.9rem] font-semibold text-deep hover:text-blue">
              {COMPANY.phone}
            </a>
            <span className="hidden items-center gap-2.5 sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-deep text-[0.8rem] font-bold text-white">
                DA
              </span>
              <span className="text-[0.9rem] font-semibold text-deep">{ACCOUNT.holder}</span>
            </span>
            <button
              type="button"
              onClick={() => setSignedIn(false)}
              className="text-[0.88rem] font-semibold text-slate-soft hover:text-deep"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[2rem] font-extrabold leading-tight text-deep">
              {ACCOUNT.rider} is on the way
            </h1>
            <p className="mt-1 text-[0.98rem] text-slate-soft">
              Managing rides for {ACCOUNT.rider} · {ACCOUNT.relationship}
            </p>
          </div>
          <Link
            href="/book"
            className="rounded-full bg-green px-6 py-3 font-bold text-white hover:bg-[#4d8f28]"
          >
            Book a ride
          </Link>
        </div>

        <section className="mt-7">
          <TripTracker tripId={ACTIVE_TRIP.id} variant="client" />
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Upcoming */}
          <section className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[1.2rem] font-bold text-deep">Upcoming rides</h2>
              <span className="tabular rounded-full bg-mist px-2.5 py-1 text-[0.8rem] font-semibold text-deep">
                {UPCOMING.length + 1}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-line">
              <li className="flex items-start justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-deep">Return from dialysis</p>
                  <p className="text-[0.88rem] text-slate-soft">
                    Open-ended · tap when {ACCOUNT.rider.split(" ")[0]} is ready
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border-2 border-blue px-4 py-1.5 text-[0.85rem] font-bold text-blue hover:bg-mist"
                >
                  Ready now
                </button>
              </li>
              {UPCOMING.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-deep">
                      {t.pickup.city} → {t.dropoff.name}
                    </p>
                    <p className="tabular text-[0.88rem] text-slate-soft">
                      {fmtDate(t.scheduledAt)} · pickup {fmtTime(t.scheduledAt)}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-[0.85rem] text-slate-soft">{t.code}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-moss px-4 py-3.5">
              <p className="text-[0.88rem] font-bold text-deep">Standing order active</p>
              <p className="mt-1 text-[0.88rem] leading-relaxed text-slate-soft">
                Mondays, Wednesdays and Fridays to Westside Kidney Center. Same driver and van
                where scheduling allows.
              </p>
            </div>
          </section>

          {/* History */}
          <section className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-[1.2rem] font-bold text-deep">Recent trips</h2>
            <ul className="mt-4 divide-y divide-line">
              {HISTORY.map((t) => {
                const d = DRIVER_BY_ID[t.driverId];
                const v = VEHICLE_BY_ID[t.vehicleId];
                return (
                  <li key={t.id} className="py-3.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-deep">
                          {t.pickup.name} → {t.dropoff.city}
                        </p>
                        <p className="tabular text-[0.88rem] text-slate-soft">
                          {fmtDate(t.scheduledAt)} · {d.name.split(" ")[0]} · Unit {v.unit}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-moss px-2.5 py-1 text-[0.78rem] font-semibold text-[#3f7f22]">
                        {STATUS_COPY[t.status].label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[0.88rem]">
              <div>
                <dt className="text-slate-soft">Member ID</dt>
                <dd className="tabular mt-0.5 font-semibold text-deep">{ACCOUNT.memberId}</dd>
              </div>
              <div>
                <dt className="text-slate-soft">Plan</dt>
                <dd className="mt-0.5 font-semibold text-deep">{ACCOUNT.plan}</dd>
              </div>
            </dl>
          </section>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
