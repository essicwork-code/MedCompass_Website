"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ROLE_LABEL, type Account } from "@/lib/auth/accounts";

/*
 * Shared sign-in surface for both portals.
 *
 * The demo credentials are printed right on the card. That is deliberate: a
 * prototype that hides its own test logins wastes the reviewer's time, and
 * pretending these are secret would imply a security model that does not
 * exist here.
 */

export default function SignInCard({
  heading,
  blurb,
  accounts,
  onSubmit,
  onPick,
  footer,
}: {
  heading: string;
  blurb: string;
  accounts: Account[];
  onSubmit: (email: string, password: string) => { ok: boolean; error?: string };
  onPick: (account: Account) => void;
  footer?: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    // grid-cols-1 is load-bearing, not decorative: Tailwind's grid-cols-N
    // utilities set `minmax(0, 1fr)`, which is what lets the single track
    // shrink to the viewport. Without it, a plain `grid place-items-center`
    // sizes its implicit column to the max-content width of whatever it
    // contains — here, the unbreakable "email · password" strings below —
    // and overflows the viewport instead of letting them ellipsis.
    <div className="grid min-h-dvh grid-cols-1 place-items-center bg-bone px-4 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="rounded-2xl border border-line bg-white p-8">
          <h1 className="font-display text-[1.6rem] font-extrabold text-deep">{heading}</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-soft">{blurb}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const result = onSubmit(email, password);
              setError(result.ok ? null : (result.error ?? "Sign in failed."));
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-[0.92rem] font-semibold text-deep">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 text-[0.95rem] focus:border-blue"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[0.92rem] font-semibold text-deep">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-lg border-2 border-line px-3.5 py-3 text-[0.95rem] focus:border-blue"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-alert-tint px-4 py-3 text-[0.9rem] text-alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-green px-6 py-3.5 font-bold text-white hover:bg-[#4d8f28]"
            >
              Sign in
            </button>
          </form>

          <div className="mt-7 border-t border-line pt-6">
            <p className="text-[0.85rem] font-bold uppercase tracking-wide text-slate-soft">
              Demo accounts
            </p>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-slate-soft">
              This prototype has no real authentication. Pick an account to sign in, or type the
              credentials above.
            </p>

            <ul className="mt-4 space-y-2">
              {accounts.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onPick(a)}
                    className="flex w-full items-center gap-3 rounded-xl border border-line px-4 py-3 text-left hover:border-blue hover:bg-mist"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-deep text-[0.8rem] font-bold text-white">
                      {a.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-deep">{a.name}</span>
                      <span className="block truncate text-[0.85rem] text-slate-soft">
                        {ROLE_LABEL[a.role]}
                        {a.facilityName ? ` · ${a.facilityName}` : ""}
                        {a.ridersManaged && a.ridersManaged[0] !== a.name
                          ? ` · books for ${a.ridersManaged.join(", ")}`
                          : ""}
                      </span>
                      <span className="tabular mt-0.5 block truncate text-[0.78rem] text-slate-soft/80">
                        {a.email} · {a.password}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 rounded-lg bg-amber-tint px-4 py-3 text-[0.82rem] leading-relaxed text-slate-soft">
            <strong className="text-deep">Not real security.</strong> These credentials live in the
            page source. A production build needs server-side sessions and one account per person,
            since a shared login cannot be audited.
          </p>
        </div>

        {footer && <div className="mt-6 text-center text-[0.88rem] text-slate-soft">{footer}</div>}
      </div>
    </div>
  );
}
