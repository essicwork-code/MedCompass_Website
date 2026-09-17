"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PLACES } from "@/lib/demo/data";
import type { LatLng } from "@/lib/demo/types";
import {
  forwardGeocode,
  getCurrentPosition,
  reverseGeocode,
  searchAddresses,
  GeoError,
  type AddressSuggestion,
  type GeoPoint,
} from "@/lib/geo";

/*
 * One pickup or destination: a major hospital from the shortcut list, or any
 * address typed in with live suggestions. Typed addresses are geocoded (on
 * picking a suggestion, on blur, or by the parent before quoting) so the
 * quote always runs on real coordinates.
 */

export type AddressValue =
  | { mode: "saved"; placeId: string }
  | { mode: "custom"; text: string; point: GeoPoint | null; fromLocation: boolean };

export const EMPTY_ADDRESS: AddressValue = { mode: "custom", text: "", point: null, fromLocation: false };

const PLACE_OPTIONS = Object.values(PLACES);
const SUGGEST_DEBOUNCE_MS = 400;
const MIN_QUERY = 4;

export function addressCoord(v: AddressValue): LatLng | null {
  if (v.mode === "saved") return PLACES[v.placeId]?.coord ?? null;
  return v.point ? [v.point.lat, v.point.lng] : null;
}

/** Short label for the quote summary. */
export function addressLabel(v: AddressValue): string {
  return v.mode === "saved" ? (PLACES[v.placeId]?.name ?? "") : v.text.trim();
}

/** Full line handed to dispatch. */
export function addressLine(v: AddressValue): string {
  if (v.mode === "custom") return v.text.trim();
  const p = PLACES[v.placeId];
  return p ? `${p.name}, ${p.address}, ${p.city}` : "";
}

export function addressFilled(v: AddressValue): boolean {
  return v.mode === "saved" ? Boolean(v.placeId) : v.text.trim().length > 0;
}

/** Geocodes a typed address that has no coordinates yet. Throws GeoError. */
export async function resolveAddress(v: AddressValue): Promise<AddressValue> {
  if (v.mode === "saved" || v.point || !v.text.trim()) return v;
  const { point, label } = await forwardGeocode(v.text);
  return { ...v, text: label, point };
}

type LocateStatus = "idle" | "locating" | "resolving";

export default function AddressField({
  id,
  label,
  value,
  onChange,
  error,
  onError,
  allowCurrentLocation = false,
}: {
  id: string;
  label: string;
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  /** A lookup problem for this field, shown under it. */
  error?: string | null;
  onError?: (message: string | null) => void;
  allowCurrentLocation?: boolean;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [locate, setLocate] = useState<LocateStatus>("idle");
  const [checking, setChecking] = useState(false);
  const seq = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // The text most recently filled in by the app (a picked suggestion or a
  // geolocation result) rather than typed; it must not trigger a new search.
  const settledText = useRef<string | null>(null);

  const text = value.mode === "custom" ? value.text : "";
  const latestText = useRef(text);
  latestText.current = text;
  const needsSearch =
    value.mode === "custom" && !value.point && text.trim().length >= MIN_QUERY && text !== settledText.current;

  useEffect(() => {
    if (!needsSearch) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    // A newer keystroke wins over a slower, older response.
    const mine = ++seq.current;
    const timer = setTimeout(() => {
      searchAddresses(text).then((results) => {
        if (seq.current !== mine) return;
        setSuggestions(results);
        setActive(-1);
        // A response landing after the rider moved on must not pop the list open.
        setOpen(results.length > 0 && document.activeElement === inputRef.current);
      });
    }, SUGGEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, needsSearch]);

  function setCustom(nextText: string, point: GeoPoint | null, fromLocation = false) {
    onChange({ mode: "custom", text: nextText, point, fromLocation });
  }

  function pick(s: AddressSuggestion) {
    seq.current++;
    settledText.current = s.label;
    setCustom(s.label, s.point);
    setOpen(false);
    setSuggestions([]);
    onError?.(null);
  }

  async function checkOnBlur() {
    // Let a suggestion tap land before closing the list.
    setTimeout(() => setOpen(false), 150);
    if (value.mode !== "custom" || value.point || text.trim().length < MIN_QUERY) return;
    // The blur lookup replaces any suggestion search still pending.
    seq.current++;
    const typed = text;
    setChecking(true);
    try {
      const resolved = await resolveAddress(value);
      // Drop the result if the rider kept typing while it was in flight.
      if (latestText.current !== typed) return;
      if (resolved.mode === "custom" && resolved.point) {
        seq.current++;
        settledText.current = resolved.text;
        onChange(resolved);
        onError?.(null);
      }
    } catch (err) {
      onError?.(err instanceof GeoError ? err.message : "Couldn't find that address.");
    } finally {
      setChecking(false);
    }
  }

  async function useMyLocation() {
    setLocate("locating");
    onError?.(null);
    try {
      const point = await getCurrentPosition();
      setLocate("resolving");
      const address = await reverseGeocode(point);
      seq.current++;
      settledText.current = address;
      setCustom(address, point, true);
    } catch (err) {
      onError?.(err instanceof GeoError ? err.message : "Couldn't get your location. Try entering an address.");
    } finally {
      setLocate("idle");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(suggestions[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  const inputId = `${id}-address`;
  const selectId = `${id}-hospital`;
  const errorId = `${id}-error`;
  const confirmed = value.mode === "custom" && value.point;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <label htmlFor={value.mode === "saved" ? selectId : inputId} className="block text-[0.92rem] font-semibold text-deep">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            onError?.(null);
            settledText.current = null;
            onChange(value.mode === "saved" ? EMPTY_ADDRESS : { mode: "saved", placeId: "" });
          }}
          className="min-h-11 text-[0.85rem] font-semibold text-blue-ink hover:underline"
        >
          {value.mode === "saved" ? "Type an address instead" : "Pick a major hospital"}
        </button>
      </div>

      {value.mode === "saved" ? (
        <select
          id={selectId}
          value={value.placeId}
          onChange={(e) => onChange({ mode: "saved", placeId: e.target.value })}
          className="w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-base focus:border-blue"
        >
          <option value="">Select a hospital…</option>
          {PLACE_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.city})
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => {
              onError?.(null);
              setCustom(e.target.value, null);
            }}
            onFocus={() => setOpen(suggestions.length > 0)}
            onBlur={checkOnBlur}
            onKeyDown={onKeyDown}
            placeholder="Street address, city, or place name"
            autoComplete="off"
            enterKeyHint="done"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full rounded-lg border-2 border-line bg-white px-3.5 py-3 text-base focus:border-blue"
          />

          {open && suggestions.length > 0 && (
            <ul
              id={listId}
              role="listbox"
              aria-label={`${label} suggestions`}
              className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-line bg-white shadow-lg"
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.point.lat},${s.point.lng}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // mousedown fires before the input's blur, so the pick lands.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(s);
                  }}
                  className={`flex min-h-11 cursor-pointer items-center px-3.5 py-2.5 text-[0.95rem] text-ink ${
                    i === active ? "bg-mist" : "hover:bg-mist"
                  }`}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}

          {checking && <p className="mt-1.5 text-[0.82rem] text-slate-soft">Checking address…</p>}
          {confirmed && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] font-semibold text-moss-ink">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {value.fromLocation ? "Using your current location" : "Address found"}
            </p>
          )}
        </div>
      )}

      {allowCurrentLocation && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locate !== "idle"}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-blue px-4 text-[0.88rem] font-semibold text-blue-ink hover:bg-mist disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {locate === "locating" ? "Locating…" : locate === "resolving" ? "Looking up address…" : "Use my current location"}
          </button>
          <span className="text-[0.8rem] text-slate-soft">Your browser asks permission first.</span>
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-2 rounded-lg bg-alert-tint px-3.5 py-2.5 text-[0.85rem] text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
