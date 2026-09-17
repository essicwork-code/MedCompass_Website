/*
 * Browser geolocation + geocoding for the booking flow.
 *
 * Two real APIs, no keys, both CORS-permissive from a static site:
 *  - navigator.geolocation is the browser's own permission-gated location.
 *  - Nominatim (OpenStreetMap) turns that into a readable address, and turns
 *    a typed address back into coordinates when the rider enters one by hand
 *    instead of using their current location.
 *
 * Nothing here is persisted. A resolved pickup point only lives in the
 * booking wizard's component state and disappears the moment the tab closes,
 * consistent with never storing a rider's real address in this demo.
 *
 * PRODUCTION NOTE (CLAUDE.md PHI boundary): every function below sends the
 * pickup address text to nominatim.openstreetmap.org, a free public
 * geocoder with no BAA and no privacy guarantee. That's acceptable for a
 * demo with fake addresses, but a real deployment must not call it directly
 * from the browser with real rider addresses. Before going live, swap the
 * base URL below for a BAA-covered geocoder (e.g. a licensed Mapbox/Google/
 * Azure Maps key behind a first-party proxy route, or a self-hosted
 * Nominatim instance) — every call is already funneled through this one
 * file, so that's a one-file change, not a rewrite of the booking flow.
 * Only the address string is ever sent; no rider name, trip id, or other
 * identifier is attached to these requests, and none should be added later.
 */
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export type GeoErrorReason = "unsupported" | "denied" | "unavailable" | "timeout" | "lookup-failed" | "no-match";

export class GeoError extends Error {
  reason: GeoErrorReason;
  constructor(reason: GeoErrorReason, message: string) {
    super(message);
    this.reason = reason;
  }
}

/** Wraps the callback-based Geolocation API in a promise with plain-language errors. */
export function getCurrentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new GeoError("unsupported", "This browser doesn't support location."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        // GeolocationPositionError codes: 1 permission denied, 2 unavailable, 3 timeout.
        if (err.code === 1) {
          reject(new GeoError("denied", "Location access was denied. You can still enter an address below."));
        } else if (err.code === 3) {
          reject(new GeoError("timeout", "Location took too long to find. Try again or enter an address."));
        } else {
          reject(new GeoError("unavailable", "Your location isn't available right now. Try entering an address."));
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  });
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
}

/**
 * A short "1060 W Addison St, Chicago" label rather than Nominatim's raw
 * display_name, which is a full administrative breadcrumb (street,
 * neighborhood, city, township, county, state, country) and reads as noise
 * next to a quote someone is trying to actually read.
 */
function shortLabel(addr: NominatimAddress | undefined, fallback: string, query = ""): string {
  if (!addr) return fallback;
  // OSM sometimes stores several numbers on one building ("5481;5841").
  const numbers = addr.house_number?.split(/[;,]/).map((n) => n.trim()) ?? [];
  const houseNumber = numbers.find((n) => query.includes(n)) ?? numbers[0];
  const street = [houseNumber, addr.road].filter(Boolean).join(" ");
  const place = addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? addr.neighbourhood ?? addr.county;
  const parts = [street, place].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : fallback;
}

/** Coordinates to a readable street address. */
export async function reverseGeocode(point: GeoPoint): Promise<string> {
  const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}&zoom=18&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new GeoError("lookup-failed", "Couldn't look up that location. Try entering an address instead.");
  const data = await res.json();
  const name = data?.display_name as string | undefined;
  if (!name) throw new GeoError("lookup-failed", "Couldn't look up that location. Try entering an address instead.");
  return shortLabel(data.address, name);
}

/** A typed address to coordinates, biased toward Illinois since that's the whole service area. */
export async function forwardGeocode(address: string): Promise<{ point: GeoPoint; label: string }> {
  const url = `${NOMINATIM_BASE}/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(
    `${address}, Illinois`,
  )}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new GeoError("lookup-failed", "Address lookup failed. Check the address and try again.");
  const results = await res.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new GeoError("no-match", "We couldn't find that address. Try adding a city, or pick a saved location.");
  }
  const [first] = results;
  return {
    point: { lat: parseFloat(first.lat), lng: parseFloat(first.lon) },
    label: shortLabel(first.address, first.display_name as string, address),
  };
}

export interface AddressSuggestion {
  point: GeoPoint;
  label: string;
}

/**
 * Live suggestions as the rider types, rather than making them type a full
 * address and find out on submit whether it resolved to the place they
 * meant. Callers are expected to debounce this themselves — it fires one
 * network request per call with no internal rate limiting.
 */
export async function searchAddresses(query: string, limit = 5): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 4) return [];

  const url = `${NOMINATIM_BASE}/search?format=jsonv2&addressdetails=1&limit=${limit}&countrycodes=us&q=${encodeURIComponent(
    `${trimmed}, Illinois`,
  )}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const results = await res.json();
  if (!Array.isArray(results)) return [];

  // One building often comes back as several OSM objects with the same label.
  const seen = new Set<string>();
  const suggestions: AddressSuggestion[] = [];
  for (const r of results) {
    const label = shortLabel(r.address, r.display_name as string, trimmed);
    if (seen.has(label)) continue;
    seen.add(label);
    suggestions.push({ point: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) }, label });
  }
  return suggestions;
}
