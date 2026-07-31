"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Logo } from "@/components/Logo";
import TripTracker from "@/components/TripTracker";
import ChatWidget from "@/components/ChatWidget";
import { WeatherCard } from "@/components/WeatherWidget";
import SignInCard from "@/components/auth/SignInCard";
import { useSession } from "@/lib/auth/useSession";
import { CLIENT_ACCOUNTS, ROLE_LABEL, can } from "@/lib/auth/accounts";
import { useFleet } from "@/lib/demo/useFleet";
import { STATUS_COPY } from "@/lib/demo/simulator";
import { COMPANY, DRIVER_BY_ID, TRIPS, VEHICLE_BY_ID } from "@/lib/demo/data";

/*
 * Client and facility portal.
 *
 * One page serves both, because the difference is what a role can see rather
 * than what it can do. A family member sees their own rider; a clinic
 * coordinator sees every rider booked against the facility.
 */

const ACTIVE_STATUSES = new Set(["assigned", "en_route_pickup", "arrived_pickup", "onboard"]);

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export default function PortalPage() {
  const { status, account, signIn, signInAs, signOut } = useSession();

  const myTripIds = useMemo(() => account?.tripIds ?? [], [account]);
  const live = useFleet(myTripIds);

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh grid-cols-1 place-items-center bg-bone">
        <p className="text-slate-soft">Loading your account…</p>
      </div>
    );
  }

  if (status === "signed-out" || !account) {
    return (
      <SignInCard
        heading="Client sign in"
        blurb="Track active rides, review trip history, and book without calling."
        accounts={CLIENT_ACCOUNTS}
        onSubmit={signIn}
        onPick={signInAs}
        footer={
          <>
            Staff member?{" "}
            <Link href="/admin" className="font-semibold text-blue hover:underline">
              Dispatch sign in
            </Link>
          </>
        }
      />
    );
  }

  // A dispatcher who lands here is sent to the console rather than shown an
  // empty client dashboard.
  if (can(account, "view.all_trips")) {
    return (
      <div className="grid min-h-dvh grid-cols-1 place-items-center bg-bone px-4">
        <div className="max-w-md rounded-2xl border border-line bg-white p-8 text-center">
          <h1 className="font-display text-[1.4rem] font-extrabold text-deep">
            You are signed in as staff
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-soft">
            {account.name}, {ROLE_LABEL[account.role].toLowerCase()} accounts use the dispatch
            console rather than the client portal.
          </p>
          <Link
            href="/admin"
            className="mt-6 block rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
          >
            Open dispatch console
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 text-[0.9rem] font-semibold text-slate-soft hover:text-deep"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const isFacility = account.role === "facility";
  const myTrips = TRIPS.filter((t) => myTripIds.includes(t.id));
  const activeLive = live.filter((l) => ACTIVE_STATUSES.has(l.trip.status));
  const focus = activeLive[0];
  const upcoming = myTrips.filter((t) => t.status === "scheduled");
  const history = myTrips.filter((t) => t.status === "completed");

  const heading = isFacility
    ? `${account.facilityName} transport board`
    : focus
      ? `${focus.trip.riderName.split(" ")[0]} is on the way`
      : "Your rides";

  return (
    <div className="min-h-dvh bg-bone">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="hidden text-[0.9rem] font-semibold text-deep hover:text-blue sm:inline"
            >
              {COMPANY.phone}
            </a>
            <span className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-deep text-[0.8rem] font-bold text-white">
                {account.initials}
              </span>
              <span className="hidden sm:block">
                <span className="block text-[0.88rem] font-semibold leading-tight text-deep">
                  {account.name}
                </span>
                <span className="block text-[0.75rem] text-slate-soft">
                  {ROLE_LABEL[account.role]}
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={signOut}
              className="text-[0.88rem] font-semibold text-slate-soft hover:text-deep"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-[2rem] font-extrabold leading-tight text-deep">
                  {heading}
                </h1>
                <p className="mt-1 text-[0.98rem] text-slate-soft">
                  {isFacility
                    ? `${myTrips.length} trips booked against this facility · ${account.title}`
                    : `Managing rides for ${account.ridersManaged?.join(", ")} · ${account.relationship}`}
                </p>
              </div>
              <Link
                href="/book"
                className="rounded-full bg-green px-6 py-3 font-bold text-white hover:bg-[#4d8f28]"
              >
                Book a ride
              </Link>
            </div>
          </div>

          <div className="w-full sm:w-80 sm:shrink-0">
            <WeatherCard />
          </div>
        </div>

        {focus ? (
          <section className="mt-7">
            <TripTracker tripId={focus.trip.id} variant="client" />
          </section>
        ) : (
          <section className="mt-7 rounded-2xl border border-line bg-white p-8 text-center">
            <h2 className="font-display text-[1.3rem] font-bold text-deep">
              Nothing on the road right now
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[0.97rem] leading-relaxed text-slate-soft">
              When a trip is underway you will see the van, its arrival time and the driver here.
              Your upcoming rides are listed below.
            </p>
          </section>
        )}

        {/* Facility board: every rider at once. */}
        {isFacility && live.length > 0 && (
          <section className="mt-8 rounded-2xl border border-line bg-white">
            <div className="border-b border-line px-6 py-4">
              <h2 className="font-display text-[1.2rem] font-bold text-deep">
                All trips for {account.facilityName}
              </h2>
              <p className="mt-0.5 text-[0.88rem] text-slate-soft">
                Live status for every rider booked against this facility today.
              </p>
            </div>
            <ul className="divide-y divide-line">
              {live.map((l) => {
                const driver = DRIVER_BY_ID[l.trip.driverId];
                return (
                  <li key={l.trip.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-deep">{l.trip.riderName}</p>
                      <p className="tabular text-[0.88rem] text-slate-soft">
                        {l.trip.code} · {l.trip.pickup.city} to {l.trip.dropoff.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-moss px-3 py-1 text-[0.8rem] font-semibold text-[#3f7f22]">
                      {STATUS_COPY[l.trip.status].label}
                    </span>
                    <span className="tabular w-24 text-right text-[0.9rem] text-slate-soft">
                      {l.etaMinutes != null ? `${l.etaMinutes} min` : "Arrived"}
                    </span>
                    <span className="tabular hidden w-32 text-right text-[0.88rem] text-slate-soft md:block">
                      {driver.name.split(" ")[0]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[1.2rem] font-bold text-deep">Upcoming rides</h2>
              <span className="tabular rounded-full bg-mist px-2.5 py-1 text-[0.8rem] font-semibold text-deep">
                {upcoming.length + (focus ? 1 : 0)}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-line">
              {focus && (
                <li className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-deep">Return trip</p>
                    <p className="text-[0.88rem] text-slate-soft">
                      Open ended, tap when {focus.trip.riderName.split(" ")[0]} is ready
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full border-2 border-blue px-4 py-1.5 text-[0.85rem] font-bold text-blue hover:bg-mist"
                  >
                    Ready now
                  </button>
                </li>
              )}
              {upcoming.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-deep">
                      {t.pickup.city} to {t.dropoff.name}
                    </p>
                    <p className="tabular text-[0.88rem] text-slate-soft">
                      {fmtDate(t.scheduledAt)} · pickup {fmtTime(t.scheduledAt)}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-[0.85rem] text-slate-soft">{t.code}</span>
                </li>
              ))}
              {upcoming.length === 0 && !focus && (
                <li className="py-3.5 text-[0.92rem] text-slate-soft">
                  No upcoming rides booked.
                </li>
              )}
            </ul>

            {myTrips.some((t) => t.recurring) && (
              <div className="mt-5 rounded-xl bg-moss px-4 py-3.5">
                <p className="text-[0.88rem] font-bold text-deep">Standing order active</p>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-slate-soft">
                  Mondays, Wednesdays and Fridays to Westside Kidney Center, with the same driver
                  and van wherever scheduling allows.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-[1.2rem] font-bold text-deep">Recent trips</h2>
            <ul className="mt-4 divide-y divide-line">
              {history.map((t) => {
                const d = DRIVER_BY_ID[t.driverId];
                const v = VEHICLE_BY_ID[t.vehicleId];
                return (
                  <li key={t.id} className="flex items-start justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="font-semibold text-deep">
                        {t.pickup.name} to {t.dropoff.city}
                      </p>
                      <p className="tabular text-[0.88rem] text-slate-soft">
                        {fmtDate(t.scheduledAt)} · {d.name.split(" ")[0]} · Unit {v.unit}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-moss px-2.5 py-1 text-[0.78rem] font-semibold text-[#3f7f22]">
                      {STATUS_COPY[t.status].label}
                    </span>
                  </li>
                );
              })}
              {history.length === 0 && (
                <li className="py-3.5 text-[0.92rem] text-slate-soft">No completed trips yet.</li>
              )}
            </ul>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[0.88rem]">
              {isFacility ? (
                <>
                  <div>
                    <dt className="text-slate-soft">Facility</dt>
                    <dd className="mt-0.5 font-semibold text-deep">{account.facilityName}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-soft">Billing</dt>
                    <dd className="mt-0.5 font-semibold text-deep">Net 30, consolidated</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-slate-soft">Member ID</dt>
                    <dd className="tabular mt-0.5 font-semibold text-deep">{account.memberId}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-soft">Plan</dt>
                    <dd className="mt-0.5 font-semibold text-deep">{account.plan}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
