"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LiveTrip } from "@/lib/demo/simulator";
import { activeLeg, pointAlong } from "@/lib/demo/simulator";
import type { LatLng } from "@/lib/demo/types";

/*
 * Every value handed to Leaflet here is a coordinate, a trip code, or a vehicle
 * unit number. Rider names and mobility types stay out of the map layer on
 * purpose — see CLAUDE.md "PHI boundary".
 */

function vanIcon(bearing: number, live: boolean) {
  return L.divIcon({
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="position:relative;width:40px;height:40px;">
        ${
          live
            ? `<span class="pulse-ring" style="position:absolute;inset:9px;border-radius:9999px;background:#5CA632;display:block;"></span>`
            : ""
        }
        <div style="position:absolute;inset:8px;border-radius:9999px;background:#0F4C75;border:2.5px solid #fff;box-shadow:0 3px 10px rgba(16,34,46,.4);display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" width="13" height="13" style="transform:rotate(${bearing}deg)" aria-hidden="true">
            <path d="M12 2 L19 21 L12 16.5 L5 21 Z" fill="#8DC63F"/>
          </svg>
        </div>
      </div>`,
  });
}

function endpointIcon(kind: "pickup" | "dropoff") {
  const color = kind === "pickup" ? "#1B7FBF" : "#5CA632";
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:#fff;border:4px solid ${color};box-shadow:0 2px 6px rgba(16,34,46,.3)"></div>`,
  });
}

/**
 * Leaflet measures its container once at init. Inside a flex/grid card that
 * measurement can happen before layout settles, which lays the tiles out in a
 * staggered grid. Re-measure on mount and on any container resize.
 */
function InvalidateOnResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    // Defer past the first paint so the card has its final height.
    const raf = requestAnimationFrame(() => map.invalidateSize());
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

/** Keeps every watched vehicle and its route in frame as the fleet moves. */
function FitBounds({ points, enabled }: { points: LatLng[]; enabled: boolean }) {
  const map = useMap();
  const key = points.length;

  useEffect(() => {
    if (!enabled || points.length === 0) return;
    map.fitBounds(L.latLngBounds(points.map((p) => L.latLng(p[0], p[1]))), {
      padding: [48, 48],
      maxZoom: 14,
    });
    // Refit only when the set of tracked points changes size, not on every tick —
    // continuous refitting would fight the user's own panning.
  }, [map, key, enabled]);

  return null;
}

export interface TrackingMapProps {
  trips: LiveTrip[];
  /** Draw each trip's full route line. Off for the dispatch overview. */
  showRoutes?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function TrackingMap({
  trips,
  showRoutes = true,
  className,
  ariaLabel = "Live vehicle map",
}: TrackingMapProps) {
  const fitPoints = useMemo(() => {
    const pts: LatLng[] = [];
    for (const t of trips) {
      pts.push(t.position);
      if (showRoutes) pts.push(...activeLeg(t.trip));
    }
    return pts;
  }, [trips, showRoutes]);

  const center = trips[0]?.position ?? [41.8781, -87.6298];

  return (
    <div
      // Must fill its parent by default: Leaflet's own height:100% resolves
      // against this element, so leaving it auto-height collapses the map.
      className={className ?? "h-full w-full"}
      role="region"
      aria-label={ariaLabel}
      // The map is decorative-adjacent: every fact it shows is also in the
      // status panel beside it, so screen reader users lose nothing.
    >
      <MapContainer
        center={center as [number, number]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {trips.map((t) => {
          const leg = activeLeg(t.trip);
          const travelled: LatLng[] = [];
          // Split the line so the completed portion reads green and the road
          // ahead reads blue — the logo's sweep, applied to the journey.
          const steps = 24;
          for (let i = 0; i <= steps * t.progress; i++) {
            travelled.push(pointAlong(leg, i / steps));
          }
          travelled.push(t.position);

          return (
            <div key={t.trip.id}>
              {showRoutes && (
                <>
                  <Polyline
                    positions={leg as [number, number][]}
                    pathOptions={{ color: "#1B7FBF", weight: 5, opacity: 0.35 }}
                  />
                  <Polyline
                    positions={travelled as [number, number][]}
                    pathOptions={{ color: "#5CA632", weight: 5, opacity: 0.95 }}
                  />
                  <Marker position={leg[0] as [number, number]} icon={endpointIcon("pickup")} />
                  <Marker
                    position={leg[leg.length - 1] as [number, number]}
                    icon={endpointIcon("dropoff")}
                  />
                </>
              )}
              <Marker
                position={t.position as [number, number]}
                icon={vanIcon(t.bearing, t.etaMinutes !== null)}
              >
                <Tooltip direction="top" offset={[0, -16]}>
                  <span className="font-semibold">{t.trip.code}</span>
                  {t.etaMinutes !== null && <> · {t.etaMinutes} min out</>}
                </Tooltip>
              </Marker>
            </div>
          );
        })}

        <InvalidateOnResize />
        <FitBounds points={fitPoints} enabled={trips.length > 0} />
      </MapContainer>
    </div>
  );
}
