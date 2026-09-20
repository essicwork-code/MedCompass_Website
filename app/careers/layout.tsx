import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver and dispatcher jobs in Chicagoland",
  description:
    "Drive for MedCompass. W-2 wheelchair van driver, stretcher attendant and dispatcher roles in Chicagoland, with paid certification training.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
