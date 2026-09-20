import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service area: Chicago and the suburbs",
  description:
    "Check whether your town is covered. MedCompass serves Chicago and the western and northern suburbs, with long-distance runs on request.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
