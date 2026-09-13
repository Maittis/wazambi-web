"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type MapPoint = {
  id: number;
  lat: number;
  lng: number;
  color?: string;
  status?: string;
  label?: string;
  popupHtml?: string;
};

const COLORS: Record<string, string> = {
  moving: "#16a34a",
  stopped: "#d97706",
  offline: "#64748b",
  default: "#2563eb",
};

function colorFor(status?: string): string {
  return COLORS[status ?? "default"] ?? COLORS.default;
}

function pinHtml(color: string): string {
  return `<div style="width:16px;height:16px;border-radius:50%;border:2.5px solid #fff;background:${color};box-shadow:0 1px 4px rgba(0,0,0,.45)"></div>`;
}

export type GeoCircle = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  enabled?: boolean;
};

export default function VehicleMap({
  points,
  track,
  center,
  zoom = 13,
  geofences,
}: {
  points: MapPoint[];
  track?: Array<{ lat: number; lng: number }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  geofences?: GeoCircle[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const trackRef = useRef<any>(null);
  const geofencesRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    let cancelled = false;
    void import("leaflet").then((mod) => {
      if (cancelled || mapRef.current || !containerRef.current) return;
      const lib = mod.default ?? mod;
      libRef.current = lib;
      const map = lib.map(containerRef.current, {
        center: [center?.lat ?? -15.3875, center?.lng ?? 28.3228],
        zoom,
      });
      lib
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);
      markersRef.current = lib.layerGroup().addTo(map);
      trackRef.current = lib.layerGroup().addTo(map);
      geofencesRef.current = lib.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        libRef.current = null;
        markersRef.current = null;
        trackRef.current = null;
        geofencesRef.current = null;
        setReady(false);
      }
    };
  }, [center?.lat, center?.lng, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (!map || !lib) return;

    if (trackRef.current) {
      trackRef.current.clearLayers();
      const normalized = (track ?? []).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      if (normalized.length >= 2) {
        lib
          .polyline(normalized.map((p) => [p.lat, p.lng]), {
            color: "#2563eb",
            weight: 3,
            opacity: 0.7,
          })
          .addTo(trackRef.current);
      }
    }

    if (markersRef.current) {
      markersRef.current.clearLayers();
      const valid = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      for (const p of valid) {
        const color = p.color ?? colorFor(p.status);
        const marker = lib.marker([p.lat, p.lng], {
          icon: lib.divIcon({
            html: pinHtml(color),
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        });
        if (p.label || p.popupHtml) {
          marker.bindPopup(p.popupHtml ?? `<strong>${p.label}</strong>`);
        }
        marker.addTo(markersRef.current);
      }
    }

    if (geofencesRef.current) {
      geofencesRef.current.clearLayers();
      for (const g of geofences ?? []) {
        if (!Number.isFinite(g.lat) || !Number.isFinite(g.lng) || !Number.isFinite(g.radiusKm)) continue;
        const circle = lib
          .circle([g.lat, g.lng], {
            radius: g.radiusKm * 1000,
            color: g.enabled === false ? "#94a3b8" : "#ea580c",
            weight: 1.5,
            fillColor: g.enabled === false ? "#cbd5e1" : "#fdba74",
            fillOpacity: 0.15,
            dashArray: g.enabled !== false ? "6 4" : undefined,
          })
          .addTo(geofencesRef.current);
        circle.bindPopup(`<strong>${esc(g.name)}</strong><br/><span style="color:#6b7280">radius ${g.radiusKm} km${g.enabled === false ? " (disabled)" : ""}</span>`);
      }
    }

    const bounds = lib.latLngBounds([]);
    points
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .forEach((p) => bounds.extend([p.lat, p.lng]));
    (track ?? [])
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .forEach((p) => bounds.extend([p.lat, p.lng]));
    (geofences ?? [])
      .filter((g) => Number.isFinite(g.lat) && Number.isFinite(g.lng))
      .forEach((g) => bounds.extend([g.lat, g.lng]));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
  }, [points, track, geofences, ready]);

  return <div ref={containerRef} className="h-full w-full" style={{ minHeight: 320 }} />;
}