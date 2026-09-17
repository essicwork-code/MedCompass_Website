import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a ride",
  description:
    "Book wheelchair, ambulatory, stretcher, bariatric or medical courier transport in Chicagoland and see the price before you confirm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
