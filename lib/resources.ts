/** Index metadata for the resource guides. Each guide's full content lives in its own route file. */
export interface ResourceSummary {
  slug: string;
  title: string;
  description: string;
  readTime: string;
}

export const RESOURCES: ResourceSummary[] = [
  {
    slug: "illinois-medicaid-transportation",
    title: "Illinois Medicaid Transportation: How Rides Work",
    description:
      "Who Illinois Medicaid covers for rides to medical appointments, who to call for managed care versus fee-for-service, prior approval, and what to have ready.",
    readTime: "6 min read",
  },
  {
    slug: "nemt-cost-chicago",
    title: "How Much Does NEMT Cost in Chicago?",
    description:
      "A plain breakdown of what wheelchair, ambulatory, stretcher and bariatric transport actually cost, what drives the price up or down, and when Medicaid or a broker covers it.",
    readTime: "5 min read",
  },
  {
    slug: "hospital-discharge-guide",
    title: "What to Expect From a Hospital Discharge Ride",
    description:
      "How discharge transport actually works: who calls it in, how fast a van can realistically get there, and what to have ready so nothing holds up the bed.",
    readTime: "4 min read",
  },
];
