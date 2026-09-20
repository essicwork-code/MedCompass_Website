import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact dispatch, staffed 24 hours a day",
  description:
    "Reach MedCompass dispatch 24/7 by phone, or send a message about quotes, facility accounts and non-urgent questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
