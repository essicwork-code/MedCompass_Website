"use client";

import { useWeather } from "@/lib/useWeather";
import { advisoryFor } from "@/lib/weather";
import WeatherIcon from "./WeatherIcon";

/*
 * Live weather, tuned for who's looking at it.
 *
 * `card` is the full version for the client/facility portal: a rider or
 * coordinator wants to know whether to plan around it. `chip` is the
 * compact header version for dispatch, where the desk needs the number and
 * the operational advisory at a glance without spending vertical space.
 */

export function WeatherCard() {
  const weather = useWeather();

  if (weather.status === "loading") {
    return <div className="h-[92px] animate-pulse rounded-2xl bg-mist" />;
  }
  if (weather.status === "error") return null;

  const { data } = weather;
  const advisory = advisoryFor(data, "client");

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-4">
        <span className={data.adverse ? "text-amber" : "text-blue"}>
          <WeatherIcon category={data.category} className="h-9 w-9" />
        </span>
        <div className="min-w-0">
          <p className="flex items-baseline gap-2">
            <span className="tabular font-display text-[1.7rem] font-extrabold leading-none text-deep">
              {data.tempF}°
            </span>
            <span className="text-[0.95rem] text-slate-soft">{data.label} in Chicago</span>
          </p>
          <p className="tabular mt-1 text-[0.85rem] text-slate-soft">
            Feels like {data.feelsLikeF}° · Wind {data.windMph} mph
          </p>
        </div>
      </div>

      {advisory && (
        <p
          className={`mt-3.5 rounded-lg px-3.5 py-2.5 text-[0.88rem] leading-relaxed ${
            data.adverse ? "bg-[#fff3d6] text-[#6b4a0a]" : "bg-mist text-deep"
          }`}
        >
          {advisory}
        </p>
      )}
    </div>
  );
}

export function WeatherChip() {
  const weather = useWeather();

  if (weather.status === "loading") {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-white/15" />;
  }
  if (weather.status === "error") return null;

  const { data } = weather;
  const advisory = advisoryFor(data, "ops");
  const chipClass = `flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.82rem] font-semibold ${
    data.adverse ? "bg-[#fff3d6] text-[#6b4a0a]" : "bg-white/15 text-white"
  }`;

  // Plain, non-interactive chip when there's nothing to say beyond the
  // number. Only wrap it in a disclosure when there's an advisory worth
  // surfacing on demand.
  if (!advisory) {
    return (
      <div className={chipClass}>
        <WeatherIcon category={data.category} className="h-4 w-4" />
        <span className="tabular">{data.tempF}°</span>
        <span className="hidden sm:inline">{data.label}</span>
      </div>
    );
  }

  return (
    // <details> rather than a hover tooltip: a hover-only reveal is
    // unreachable on touch, which is most of a dispatcher's phone-based
    // checking. This works identically by tap, click, or keyboard.
    <details className="group relative">
      <summary className={`${chipClass} cursor-pointer list-none marker:content-['']`}>
        <WeatherIcon category={data.category} className="h-4 w-4" />
        <span className="tabular">{data.tempF}°</span>
        <span className="hidden sm:inline">{data.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      {/*
        Tailwind's group-open pattern rather than relying on the browser's
        native details:not([open]) UA rule to hide this — that rule failed
        to apply in testing (the panel measured display:block while
        collapsed), so visibility is made explicit instead of assumed.
      */}
      <div className="absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-xl border border-line bg-white p-3 text-[0.82rem] leading-relaxed text-ink shadow-lg group-open:block">
        {advisory}
      </div>
    </details>
  );
}
