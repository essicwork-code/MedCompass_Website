"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import SignInCard from "@/components/auth/SignInCard";
import { useSession } from "@/lib/auth/useSession";
import { ACCOUNTS, ROLE_LABEL, STAFF_ACCOUNTS, can } from "@/lib/auth/accounts";
import { useFleet } from "@/lib/demo/useFleet";
import { STATUS_COPY } from "@/lib/demo/simulator";
import { COMPANY, DRIVERS, DRIVER_BY_ID, VEHICLES, VEHICLE_BY_ID } from "@/lib/demo/data";
import type { MobilityType, TripStatus } from "@/lib/demo/types";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-mist" />,
});

/*
 * Dispatch console.
 *
 * Rider names are visible here because dispatchers cannot do the job without
 * them. What changes by role is the reach: a dispatcher runs the board, a
 * supervisor also manages the fleet, and only an administrator sees accounts
 * and billing. The signed-in name is always on screen, because under HIPAA the
 * account is the accountable unit, not the desk.
 */

const MOBILITY_LABEL: Record<MobilityType, string> = {
  ambulatory: "Ambulatory",
  wheelchair: "Wheelchair",
  stretcher: "Stretcher",
  bariatric: "Bariatric",
};

const STATUS_TONE: Partial<Record<TripStatus, string>> = {
  en_route_pickup: "bg-mist text-deep",
  arrived_pickup: "bg-[#fff3d6] text-amber",
  onboard: "bg-moss text-[#3f7f22]",
  arrived_dest: "bg-moss text-[#3f7f22]",
  scheduled: "bg-bone text-slate-soft",
  completed: "bg-bone text-slate-soft",
};

type Tab = "board" | "fleet" | "drivers" | "accounts";

export default function AdminPage() {
  const { status, account, signIn, signInAs, signOut } = useSession();
  const [tab, setTab] = useState<Tab>("board");
  const [focused, setFocused] = useState<string | null>(null);

  const live = useFleet();

  const moving = useMemo(
    () => live.filter((t) => t.trip.status !== "completed" && t.trip.status !== "cancelled"),
    [live],
  );

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-bone">
        <p className="text-slate-soft">Loading console…</p>
      </div>
    );
  }

  if (status === "signed-out" || !account) {
    return (
      <SignInCard
        heading="Dispatch sign in"
        blurb="For MedCompass staff. Each role sees a different slice of the board."
        accounts={STAFF_ACCOUNTS}
        onSubmit={signIn}
        onPick={signInAs}
        footer={
          <>
            Looking for your rides?{" "}
            <Link href="/portal" className="font-semibold text-blue hover:underline">
              Client sign in
            </Link>
          </>
        }
      />
    );
  }

  // A client who reaches /admin is refused rather than shown an empty console.
  if (!can(account, "manage.dispatch")) {
    return (
      <div className="grid min-h-screen place-items-center bg-bone px-4">
        <div className="max-w-md rounded-2xl border border-line bg-white p-8 text-center">
          <h1 className="font-display text-[1.4rem] font-extrabold text-deep">
            This area is for staff
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-soft">
            You are signed in as {account.name}, a {ROLE_LABEL[account.role].toLowerCase()} account.
            The dispatch console is limited to MedCompass staff.
          </p>
          <Link
            href="/portal"
            className="mt-6 block rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
          >
            Go to your portal
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

  const shown = focused ? live.filter((t) => t.trip.id === focused) : moving;

  const kpis = [
    {
      label: "Vehicles in service",
      value: `${new Set(moving.map((t) => t.trip.vehicleId)).size} / ${VEHICLES.length}`,
    },
    {
      label: "Trips in progress",
      value: String(moving.filter((t) => t.trip.status === "onboard").length),
    },
    {
      label: "Awaiting pickup",
      value: String(moving.filter((t) => t.trip.status !== "onboard").length),
    },
    { label: "Drivers on shift", value: String(DRIVERS.length) },
  ];

  const tabs: Array<[Tab, string]> = [
    ["board", "Dispatch board"],
    ["fleet", "Fleet"],
    ["drivers", "Drivers"],
  ];
  if (can(account, "manage.staff")) tabs.push(["accounts", "Accounts"]);

  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b border-line bg-deep text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded bg-white px-2.5 py-1.5">
              <Logo />
            </Link>
            <span className="hidden rounded-full bg-white/15 px-3 py-1 text-[0.78rem] font-bold uppercase tracking-wider sm:inline">
              Dispatch console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tabular hidden text-[0.85rem] text-white/70 md:inline">
              Dispatch {COMPANY.dispatchPhone}
            </span>
            <span className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-[0.8rem] font-bold">
                {account.initials}
              </span>
              <span className="hidden sm:block">
                <span className="block text-[0.88rem] font-semibold leading-tight">
                  {account.name}
                </span>
                <span className="tabular block text-[0.75rem] text-white/60">
                  {account.title}
                  {account.shift ? ` · ${account.shift}` : ""}
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={signOut}
              className="text-[0.85rem] font-semibold text-white/80 hover:text-lime"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1600px] px-4 py-6">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="flex flex-col-reverse rounded-xl border border-line bg-white px-5 py-4"
            >
              <dt className="mt-1 text-[0.85rem] text-slate-soft">{k.label}</dt>
              <dd className="tabular font-display text-[1.8rem] font-extrabold leading-none text-deep">
                {k.value}
              </dd>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label="Dispatch views" className="mt-6 flex gap-1 border-b border-line">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`-mb-px border-b-3 px-4 py-2.5 text-[0.95rem] font-semibold ${
                tab === id
                  ? "border-green text-deep"
                  : "border-transparent text-slate-soft hover:text-deep"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "board" && (
          <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_460px]">
            <section className="order-2 overflow-hidden rounded-2xl border border-line bg-white xl:order-1">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                <h2 className="font-display text-[1.05rem] font-bold text-deep">
                  {focused ? "Focused vehicle" : "All vehicles"}
                </h2>
                {focused && (
                  <button
                    type="button"
                    onClick={() => setFocused(null)}
                    className="text-[0.88rem] font-semibold text-blue hover:underline"
                  >
                    Show whole fleet
                  </button>
                )}
              </div>
              <div className="h-[520px] w-full xl:h-[680px]">
                <TrackingMap
                  trips={shown}
                  showRoutes={Boolean(focused)}
                  ariaLabel="Live fleet positions"
                />
              </div>
            </section>

            <section className="order-1 rounded-2xl border border-line bg-white xl:order-2">
              <div className="border-b border-line px-4 py-3">
                <h2 className="font-display text-[1.05rem] font-bold text-deep">Active trips</h2>
                <p className="mt-0.5 text-[0.85rem] text-slate-soft">
                  Select a trip to isolate it on the map.
                </p>
              </div>

              <ul className="max-h-[680px] divide-y divide-line overflow-y-auto">
                {moving.map((t) => {
                  const driver = DRIVER_BY_ID[t.trip.driverId];
                  const vehicle = VEHICLE_BY_ID[t.trip.vehicleId];
                  const isFocused = focused === t.trip.id;
                  const late = t.etaMinutes != null && t.etaMinutes > 25;

                  return (
                    <li key={t.trip.id}>
                      <button
                        type="button"
                        onClick={() => setFocused(isFocused ? null : t.trip.id)}
                        aria-pressed={isFocused}
                        className={`w-full px-4 py-3.5 text-left hover:bg-bone ${
                          isFocused ? "bg-mist" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="tabular font-bold text-deep">{t.trip.code}</span>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                              STATUS_TONE[t.trip.status] ?? "bg-bone text-slate-soft"
                            }`}
                          >
                            {STATUS_COPY[t.trip.status].label}
                          </span>
                        </div>

                        <p className="mt-1.5 text-[0.92rem] font-semibold text-ink">
                          {t.trip.riderName}
                          <span className="ml-2 font-normal text-slate-soft">
                            {MOBILITY_LABEL[t.trip.mobility]}
                          </span>
                        </p>

                        <p className="mt-1 truncate text-[0.85rem] text-slate-soft">
                          {t.trip.pickup.city} to {t.trip.dropoff.name}
                        </p>

                        <div className="tabular mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-slate-soft">
                          <span>Unit {vehicle.unit}</span>
                          <span>·</span>
                          <span>{driver.name}</span>
                          <span>·</span>
                          <span className={late ? "font-bold text-amber" : ""}>
                            ETA {t.etaMinutes ?? "n/a"} min
                          </span>
                        </div>

                        {t.trip.recurring && (
                          <span className="mt-2 inline-block rounded-full bg-moss px-2 py-0.5 text-[0.72rem] font-semibold text-[#3f7f22]">
                            Standing order
                          </span>
                        )}
                        {t.trip.notes && (
                          <p className="mt-2 border-l-2 border-line pl-2.5 text-[0.82rem] italic leading-relaxed text-slate-soft">
                            {t.trip.notes}
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}

        {tab === "fleet" && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            {!can(account, "manage.fleet") && (
              <p className="border-b border-line bg-bone px-5 py-3 text-[0.88rem] text-slate-soft">
                Read only. Fleet changes need a supervisor or administrator account.
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-[0.9rem]">
                <caption className="sr-only">
                  Vehicle roster with capability and inspection status
                </caption>
                <thead className="border-b border-line bg-bone text-[0.82rem] uppercase tracking-wide text-slate-soft">
                  <tr>
                    <th scope="col" className="px-4 py-3">Unit</th>
                    <th scope="col" className="px-4 py-3">Vehicle</th>
                    <th scope="col" className="px-4 py-3">Supports</th>
                    <th scope="col" className="px-4 py-3">WC / seats</th>
                    <th scope="col" className="px-4 py-3">Last inspection</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {VEHICLES.map((v) => {
                    const assigned = moving.find((t) => t.trip.vehicleId === v.id);
                    return (
                      <tr key={v.id}>
                        <td className="tabular px-4 py-3 font-bold text-deep">{v.unit}</td>
                        <td className="px-4 py-3 text-slate-soft">
                          {v.year} {v.make} {v.model}
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex flex-wrap gap-1">
                            {v.supports.map((s) => (
                              <span
                                key={s}
                                className="rounded bg-mist px-1.5 py-0.5 text-[0.75rem] text-deep"
                              >
                                {MOBILITY_LABEL[s]}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="tabular px-4 py-3 text-slate-soft">
                          {v.wheelchairPositions} / {v.ambulatorySeats}
                        </td>
                        <td className="tabular px-4 py-3 text-slate-soft">{v.lastInspection}</td>
                        <td className="px-4 py-3">
                          {assigned ? (
                            <span className="rounded-full bg-moss px-2.5 py-1 text-[0.78rem] font-semibold text-[#3f7f22]">
                              On trip {assigned.trip.code}
                            </span>
                          ) : (
                            <span className="rounded-full bg-bone px-2.5 py-1 text-[0.78rem] font-semibold text-slate-soft">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "drivers" && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {DRIVERS.map((d) => {
              const trip = moving.find((t) => t.trip.driverId === d.id);
              return (
                <li key={d.id} className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-deep text-[0.9rem] font-bold text-white">
                      {d.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-deep">{d.name}</p>
                      <p className="tabular text-[0.85rem] text-slate-soft">
                        {d.rating.toFixed(1)}★ · {d.completedTrips.toLocaleString()} trips
                      </p>
                    </div>
                  </div>

                  <p className="tabular mt-3 text-[0.85rem] text-slate-soft">
                    {d.tenureYears} years · {d.phone}
                  </p>

                  <ul className="mt-3 flex flex-wrap gap-1">
                    {d.certifications.map((c) => (
                      <li
                        key={c}
                        className="rounded bg-bone px-2 py-0.5 text-[0.75rem] text-slate-soft"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 border-t border-line pt-3 text-[0.85rem]">
                    {trip ? (
                      <span className="font-semibold text-[#3f7f22]">
                        On {trip.trip.code} · ETA {trip.etaMinutes} min
                      </span>
                    ) : (
                      <span className="text-slate-soft">Available for assignment</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        {tab === "accounts" && can(account, "manage.staff") && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-[1.05rem] font-bold text-deep">Accounts</h2>
              <p className="mt-0.5 text-[0.88rem] leading-relaxed text-slate-soft">
                One account per person. Shared logins are not permitted, because an account several
                people use cannot be audited.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-[0.9rem]">
                <caption className="sr-only">All accounts with role and access</caption>
                <thead className="border-b border-line bg-bone text-[0.82rem] uppercase tracking-wide text-slate-soft">
                  <tr>
                    <th scope="col" className="px-4 py-3">Person</th>
                    <th scope="col" className="px-4 py-3">Email</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ACCOUNTS.map((a) => (
                    <tr key={a.id} className={a.id === account.id ? "bg-mist" : ""}>
                      <th scope="row" className="px-4 py-3 font-semibold text-deep">
                        {a.name}
                        {a.id === account.id && (
                          <span className="ml-2 text-[0.78rem] font-normal text-slate-soft">
                            (you)
                          </span>
                        )}
                      </th>
                      <td className="px-4 py-3 text-slate-soft">{a.email}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-bone px-2.5 py-1 text-[0.78rem] font-semibold text-deep">
                          {ROLE_LABEL[a.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-soft">
                        {a.role === "client"
                          ? `Books for ${a.ridersManaged?.join(", ")}`
                          : a.role === "facility"
                            ? a.facilityName
                            : "All trips"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
