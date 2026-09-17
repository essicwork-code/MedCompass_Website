import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cost calculator",
  description:
    "Get an instant estimate for non-emergency medical transportation in Chicagoland using our published rates, with no booking required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
