"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/demo/data";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/who-we-serve", label: "Who we serve" },
  { href: "/service-area", label: "Service area" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sticky header that yields on scroll-down and returns on scroll-up.
  // Sanctioned in CLAUDE.md §4: cheap, reversible, useful on long pages.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Never hide while a menu is open, or the controls vanish mid-interaction.
      setHidden(y > last && y > 240 && !menuOpen);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Utility bar: the phone number stays reachable for callers who will never use the portal. */}
      <div className="bg-deep text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[0.8rem]">
          <p className="hidden sm:block text-white/80">{COMPANY.hours}</p>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="tabular whitespace-nowrap text-[1.05rem] font-extrabold tracking-tight hover:text-lime sm:text-[1.15rem]"
            >
              Dispatch {COMPANY.phone}
            </a>
            <Link href="/portal" className="hidden sm:inline text-white/80 hover:text-lime">
              Client sign in
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`border-b border-line bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_2px_16px_rgb(16_34_46/0.07)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-6">
          <Link href="/" aria-label={`${COMPANY.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[0.95rem] font-medium text-slate-soft hover:text-deep"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/*
            shrink-0 + whitespace-nowrap on every pill: without them a flex
            item is allowed to shrink below its content width, which wraps
            "Book a ride" onto two lines on narrow phones instead of just
            letting the row scroll or the logo yield space first.
          */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              href="/track"
              className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 border-blue px-4 py-2 text-[0.9rem] font-semibold text-blue hover:bg-mist sm:inline-flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-2 w-2 rounded-full bg-green" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              Track a ride
            </Link>
            <Link
              href="/book"
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-green px-4 py-2.5 text-[0.88rem] font-bold text-white hover:bg-[#4d8f28] sm:px-5 sm:text-[0.9rem]"
            >
              Book a ride
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="lg:hidden ml-1 rounded-md p-2 text-deep"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" aria-label="Mobile" className="lg:hidden border-t border-line bg-white px-4 py-3">
            {[...NAV, { href: "/track", label: "Track a ride" }, { href: "/portal", label: "Client sign in" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 text-[1rem] font-medium text-deep hover:bg-bone"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
