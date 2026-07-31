import type { WeatherCategory } from "@/lib/weather";

/** Line icons matching ServiceIcon's style — no emoji, per the icon anti-pattern in ui-ux-pro-max. */
export default function WeatherIcon({
  category,
  className = "h-6 w-6",
}: {
  category: WeatherCategory;
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

  switch (category) {
    case "clear":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="6" />
          <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2 2M23.5 23.5l2 2M6.5 25.5l2-2M23.5 8.5l2-2" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M9 22a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 21 9a5.5 5.5 0 0 1 1 10.9" />
          <path d="M9 22h13" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M9 14a5.5 5.5 0 0 1-1-10.9 7 7 0 0 1 12.6-2.4" />
          <path d="M5 19h22M5 23h22M5 27h16" />
        </svg>
      );
    case "drizzle":
    case "rain":
      return (
        <svg {...common}>
          <path d="M9 17a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 21 4a5.5 5.5 0 0 1 1 10.9" />
          <path d="M11 22v4M16 22v4M21 22v4" />
        </svg>
      );
    case "freezing":
      return (
        <svg {...common}>
          <path d="M9 15a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 21 2a5.5 5.5 0 0 1 1 10.9" />
          <path d="M16 19v10M12 22l8 4M20 22l-8 4" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M9 15a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 21 2a5.5 5.5 0 0 1 1 10.9" />
          <path d="M16 19v10M11.5 21.5l9 7M20.5 21.5l-9 7" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M9 15a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 21 2a5.5 5.5 0 0 1 1 10.9" />
          <path d="M18 19l-5 6h4l-3 6" />
        </svg>
      );
  }
}
