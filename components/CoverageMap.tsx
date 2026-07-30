"use client";

import { Circle, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PLACES, SERVICE_CENTER } from "@/lib/demo/data";

/*
 * Coverage map for the service-area page.
 *
 * Both competitors list towns as plain text and make you call to find out
 * whether you're in range. A radius on a map answers it in a glance.
 */

const CORE_RADIUS_M = 19_000;
const EXTENDED_RADIUS_M = 36_000;

/** Anchor facilities, so the map reads as a real operating footprint. */
const ANCHORS = Object.values(PLACES).filter((p) => p.kind !== "residence");

function anchorIcon(kind: string) {
  const color = kind === "dialysis" ? "#5CA632" : kind === "hospital" ? "#1B7FBF" : "#0F4C75";
  return L.divIcon({
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<div style="width:14px;height:14px;border-radius:9999px;background:${color};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(16,34,46,.4)"></div>`,
  });
}

export default function CoverageMap() {
  return (
    <MapContainer
      center={SERVICE_CENTER as [number, number]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <Circle
        center={SERVICE_CENTER as [number, number]}
        radius={EXTENDED_RADIUS_M}
        pathOptions={{ color: "#1B7FBF", weight: 1.5, fillColor: "#4DA8DA", fillOpacity: 0.1 }}
      />
      <Circle
        center={SERVICE_CENTER as [number, number]}
        radius={CORE_RADIUS_M}
        pathOptions={{ color: "#5CA632", weight: 2, fillColor: "#8DC63F", fillOpacity: 0.18 }}
      />

      {ANCHORS.map((p) => (
        <Marker key={p.id} position={p.coord as [number, number]} icon={anchorIcon(p.kind)}>
          <Tooltip direction="top" offset={[0, -8]}>
            {p.name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
