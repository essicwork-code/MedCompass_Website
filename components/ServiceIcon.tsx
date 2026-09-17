import type { Service } from "@/lib/content";

/*
 * Line icons drawn inline rather than pulled from a set — emoji are explicitly
 * an anti-pattern for service icons (ui-ux-pro-max priority 4), and a whole
 * icon dependency for four glyphs is not worth the weight.
 */
export default function ServiceIcon({
  kind,
  className = "h-7 w-7",
}: {
  kind: Service["icon"];
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (kind) {
    case "wheelchair":
      return (
        <svg {...common}>
          <circle cx="13" cy="4.5" r="2.5" />
          <path d="M11 9v7h7l4 8" />
          <circle cx="14" cy="22" r="6.5" />
          <path d="M24 24h4" />
        </svg>
      );
    case "walk":
      return (
        <svg {...common}>
          <circle cx="17" cy="4.5" r="2.5" />
          <path d="M17 9l-4 5 3 4-2 9" />
          <path d="M16 18l5 3 1 8" />
          <path d="M13 14l-5 3" />
        </svg>
      );
    case "stretcher":
      return (
        <svg {...common}>
          <path d="M3 14h26" />
          <path d="M6 14v6M26 14v6" />
          <circle cx="8" cy="24" r="2.5" />
          <circle cx="24" cy="24" r="2.5" />
          <path d="M7 10h18" />
          <circle cx="10" cy="7" r="2" />
        </svg>
      );
    case "bariatric":
      return (
        <svg {...common}>
          <circle cx="16" cy="6" r="3.5" />
          <path d="M8 15a8 8 0 0 1 16 0v4H8z" />
          <path d="M10 19l-1 9M22 19l1 9" />
        </svg>
      );
    case "courier":
      return (
        <svg {...common}>
          <path d="M4 11l12-6 12 6-12 6-12-6z" />
          <path d="M4 11v10l12 6 12-6V11" />
          <path d="M16 17v10" />
        </svg>
      );
  }
}
