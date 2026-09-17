"use client";

import { useEffect, useState } from "react";
import { fetchWeather, type WeatherSnapshot } from "./weather";
import { SERVICE_CENTER } from "./demo/data";

export type WeatherState =
  | { status: "loading"; data: null }
  | { status: "ready"; data: WeatherSnapshot }
  | { status: "error"; data: null };

/** Live weather never changes fast enough to justify polling more often than this. */
const REFRESH_MS = 15 * 60_000;

export function useWeather(coord: [number, number] = SERVICE_CENTER): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetchWeather(coord)
        .then((data) => {
          if (!cancelled) setState({ status: "ready", data });
        })
        .catch(() => {
          // Open-Meteo is best-effort here — a network hiccup shouldn't break
          // the page, it should just hide the widget.
          if (!cancelled) setState({ status: "error", data: null });
        });
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // coord is a tuple literal at every call site in this app (always
    // SERVICE_CENTER), so re-running only on mount is correct here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
