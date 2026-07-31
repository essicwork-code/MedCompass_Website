import Link from "next/link";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/demo/data";

const COLUMNS = [
  {
    heading: "Services",
    links: [
      { href: "/services/wheelchair", label: "Wheelchair transport" },
      { href: "/services/ambulatory", label: "Ambulatory transport" },
      { href: "/services/stretcher", label: "Stretcher transport" },
      { href: "/services/bariatric", label: "Bariatric transport" },
      { href: "/services/dialysis", label: "Dialysis standing orders" },
    ],
  },
  {
    heading: "Who we serve",
    links: [
      { href: "/who-we-serve#families", label: "Patients & families" },
      { href: "/who-we-serve#hospitals", label: "Hospitals & discharge" },
      { href: "/who-we-serve#dialysis", label: "Dialysis centers" },
      { href: "/who-we-serve#snf", label: "Skilled nursing" },
      { href: "/facilities", label: "Facility partners" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About MedCompass" },
      { href: "/service-area", label: "Service area" },
      { href: "/pricing", label: "Pricing & insurance" },
      { href: "/cost-calculator", label: "Cost calculator" },
      { href: "/resources", label: "Guides & resources" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact dispatch" },
      { href: "/accessibility", label: "Accessibility statement" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="route-gradient h-1" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-slate-soft">
              {COMPANY.tagline}. Non-emergency medical transportation across Chicago and the
              western suburbs, covering wheelchair, ambulatory, stretcher and bariatric.
            </p>

            <address className="mt-5 not-italic text-[0.95rem] leading-relaxed text-slate-soft">
              {COMPANY.address}
              <br />
              {COMPANY.city}
              <br />
              <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-deep hover:text-blue">
                {COMPANY.phone}
              </a>
              <br />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-blue">
                {COMPANY.email}
              </a>
            </address>

            <p className="mt-5 text-[0.8rem] leading-relaxed text-slate-soft tabular">
              USDOT {COMPANY.usdot} · MC {COMPANY.mc} · NPI {COMPANY.npi}
              <br />
              Licensed, bonded and insured in the State of Illinois.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-display text-[0.95rem] font-bold text-deep">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.92rem] text-slate-soft hover:text-blue">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.82rem] text-slate-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:text-blue">Privacy & HIPAA</Link>
            <Link href="/terms" className="hover:text-blue">Terms</Link>
            <Link href="/cancellation" className="hover:text-blue">Cancellation policy</Link>
            <Link href="/admin" className="hover:text-blue">Staff login</Link>
          </p>
        </div>

        <p className="mt-6 rounded-lg bg-bone px-4 py-3 text-[0.78rem] leading-relaxed text-slate-soft">
          <strong className="text-deep">Demonstration site.</strong> Company details, addresses,
          phone numbers, registration numbers, staff, vehicles and all trip data shown here are
          fictional. Vehicle positions are simulated. Nothing on this site represents a real
          person or a real patient record.
        </p>
      </div>
    </footer>
  );
}
