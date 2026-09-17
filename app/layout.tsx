import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { COMPANY } from "@/lib/demo/data";
import "./globals.css";

/*
 * Display face carries the brand voice; Public Sans is the USWDS typeface and
 * signals the civic reliability a Medicaid-billing service is claiming.
 * Self-hosted by next/font — no third-party request at runtime.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name}, Non Emergency Medical Transportation in Chicagoland`,
    template: `%s · ${COMPANY.name}`,
  },
  description:
    "Wheelchair, ambulatory, stretcher and bariatric medical transportation, plus medical courier service, across Chicago and the western suburbs. Reliable, on-time, door-through-door service.",
  openGraph: {
    title: `${COMPANY.name}. Reliable rides, booked in minutes`,
    description:
      "Chicagoland non-emergency medical transportation and medical courier service for families, facilities, labs and pharmacies, with on-time pickup and door-through-door service.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f4c75",
  // Never block zoom — a meaningful share of riders and families need it.
  maximumScale: 5,
  // Lets content extend under notches/home indicators so env(safe-area-inset-*)
  // resolves to a real value instead of 0 — needed by the fixed chat launcher.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${publicSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
