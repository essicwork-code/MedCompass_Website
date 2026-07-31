/*
 * Live Chicago-area weather via Open-Meteo.
 *
 * Unlike the trip/account data elsewhere in this prototype, weather isn't
 * something worth faking — it's public, non-sensitive, and genuinely useful
 * for both a rider deciding whether to leave extra time and a dispatcher
 * deciding whether to pad ETAs. Open-Meteo needs no API key and allows
 * browser CORS, which matters here since this site is a static export with
 * no server to hide a key behind.
 */

export type WeatherCategory =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "freezing"
  | "snow"
  | "storm";

export interface WeatherSnapshot {
  tempF: number;
  feelsLikeF: number;
  windMph: number;
  category: WeatherCategory;
  label: string;
  /** True when the category is the kind that actually slows a van down. */
  adverse: boolean;
  updatedAt: string;
}

/** WMO weather codes, as returned by Open-Meteo. */
function categorize(code: number): { category: WeatherCategory; label: string } {
  if (code === 0) return { category: "clear", label: "Clear" };
  if (code === 1) return { category: "clear", label: "Mostly clear" };
  if (code === 2) return { category: "cloudy", label: "Partly cloudy" };
  if (code === 3) return { category: "cloudy", label: "Overcast" };
  if (code === 45 || code === 48) return { category: "fog", label: "Foggy" };
  if (code === 51 || code === 53 || code === 55) return { category: "drizzle", label: "Drizzle" };
  if (code === 56 || code === 57) return { category: "freezing", label: "Freezing drizzle" };
  if (code === 61 || code === 63) return { category: "rain", label: "Rain" };
  if (code === 65) return { category: "rain", label: "Heavy rain" };
  if (code === 66 || code === 67) return { category: "freezing", label: "Freezing rain" };
  if (code === 71 || code === 73) return { category: "snow", label: "Snow" };
  if (code === 75 || code === 77) return { category: "snow", label: "Heavy snow" };
  if (code === 80 || code === 81) return { category: "rain", label: "Rain showers" };
  if (code === 82) return { category: "rain", label: "Heavy rain showers" };
  if (code === 85 || code === 86) return { category: "snow", label: "Snow showers" };
  if (code === 95) return { category: "storm", label: "Thunderstorms" };
  if (code === 96 || code === 99) return { category: "storm", label: "Thunderstorms with hail" };
  return { category: "cloudy", label: "Overcast" };
}

const ADVERSE: ReadonlySet<WeatherCategory> = new Set(["freezing", "snow", "storm"]);

/** Wind alone can matter even under a clear sky, e.g. a gusty cold front. */
const HIGH_WIND_MPH = 25;

export async function fetchWeather(coord: [number, number]): Promise<WeatherSnapshot> {
  const [lat, lng] = coord;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  const data = await res.json();
  const current = data.current;

  const { category, label } = categorize(current.weather_code);
  const windMph = current.wind_speed_10m as number;

  return {
    tempF: Math.round(current.temperature_2m),
    feelsLikeF: Math.round(current.apparent_temperature),
    windMph: Math.round(windMph),
    category,
    label,
    adverse: ADVERSE.has(category) || windMph >= HIGH_WIND_MPH,
    updatedAt: current.time,
  };
}

/**
 * Advisory copy, split by audience rather than by a single generic string.
 *
 * A rider needs to know "you might want to leave a few minutes earlier."
 * A dispatcher needs to know "pad ETAs and check the ramp mats." Same
 * weather, different job, so the copy is written for each rather than
 * shared and hedged into meaning nothing to either.
 */
export function advisoryFor(w: WeatherSnapshot, audience: "client" | "ops"): string | null {
  const windy = w.windMph >= HIGH_WIND_MPH;

  if (audience === "client") {
    switch (w.category) {
      case "snow":
        return "Winter weather in the area today. Wheelchair and stretcher trips may take a little longer than usual.";
      case "freezing":
        return "Icy conditions possible today. Your driver may add extra time to move safely.";
      case "storm":
        return "Thunderstorms in the area. Some rides may run a few minutes behind.";
      case "rain":
        return "Rain today. Your driver may run a little behind schedule.";
      case "fog":
        return "Foggy conditions this morning. Drivers are allowing a bit of extra time.";
      default:
        return windy ? "Windy today, but road conditions are otherwise normal." : null;
    }
  }

  switch (w.category) {
    case "snow":
      return "Snow conditions: extend pickup windows, confirm ramp mats and traction aids are loaded, prioritize standing dialysis orders.";
    case "freezing":
      return "Icy conditions: pad ETAs, brief drivers on reduced speed, confirm salt/traction equipment.";
    case "storm":
      return "Storm activity: expect delays, watch radar for lightning risk on stretcher transfers.";
    case "rain":
      return "Wet roads: pad ETAs and confirm wiper/tread checks on the fleet.";
    case "fog":
      return "Reduced visibility: build extra time into longer routes.";
    default:
      return windy ? "High wind: secure loose equipment during wheelchair loading." : null;
  }
}
