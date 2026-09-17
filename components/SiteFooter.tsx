import Link from "next/link";
import { Logo } from "./Logo";
import { AREAS } from "@/lib/areas";
import { COMPANY } from "@/lib/demo/data";

const COLUMNS = [
  {
    heading: "Services",
    links: [
      { href: "/services/wheelchair", label: "Wheelchair transport" },
      { href: "/services/ambulatory", label: "Ambulatory transport" },
      { href: "/services/stretcher", label: "Stretcher transport" },
      { href: "/services/bariatric", label: "Bariatric transport" },
      { href: "/services/courier", label: "Medical courier" },
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
      { href: "/who-we-serve#labs", label: "Labs & pharmacies" },
      { href: "/facilities", label: "Facility partners" },
    ],
  },
  {
    heading: "Popular areas",
    links: [
      ...AREAS.slice(0, 9).map((a) => ({ href: `/areas/${a.slug}`, label: a.name })),
      { href: "/areas", label: "All areas →" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Ride MedCompass" },
      { href: "/service-area", label: "Service area" },
      { href: "/areas", label: "Areas we serve" },
      { href: "/pricing", label: "Pricing & insurance" },
      { href: "/cost-calculator", label: "Cost calculator" },
      { href: "/resources", label: "Guides & resources" },
      { href: "/faq", label: "FAQ" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact dispatch" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="route-gradient h-1.5" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-slate-soft">
              {COMPANY.tagline}. Non-emergency medical transportation and courier service across
              Chicago and the western suburbs, covering wheelchair, ambulatory, stretcher,
              bariatric and medical courier.
            </p>

            <address className="mt-5 not-italic text-[0.95rem] leading-relaxed text-slate-soft">
              {COMPANY.address}
              <br />
              {COMPANY.city}
              <a href={`tel:${COMPANY.phoneHref}`} className="flex min-h-11 w-fit items-center font-semibold text-deep hover:text-blue">
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex min-h-11 w-fit items-center break-all hover:text-blue">
                {COMPANY.email}
              </a>
            </address>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-display text-[0.95rem] font-bold text-deep">{col.heading}</h2>
              <ul className="mt-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-[0.92rem] text-slate-soft transition-transform duration-150 hover:translate-x-0.5 hover:text-blue"
                    >
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
        </div>
      </div>
    </footer>
  );
}
