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
    default: `${COMPANY.name} — Non-Emergency Medical Transportation, Chicagoland`,
    template: `%s · ${COMPANY.name}`,
  },
  description:
    "Wheelchair, ambulatory, stretcher and bariatric medical transportation across Chicago and the western suburbs. Track your ride live from booking to arrival.",
  openGraph: {
    title: `${COMPANY.name} — Track your ride, not just book it`,
    description:
      "Chicagoland non-emergency medical transportation with live vehicle tracking for families and facilities.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f4c75",
  // Never block zoom — a meaningful share of riders and families need it.
  maximumScale: 5,
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
