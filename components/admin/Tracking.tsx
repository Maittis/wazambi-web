"use client";

import { useEffect, useMemo, useState } from "react";
import VehicleMap from "@/components/tracking/VehicleMap";
import type { MapPoint } from "@/components/tracking/VehicleMap";
import { PrimaryBtn } from "@/components/admin/ui";

type VehicleRow = {
  id: number;
  customerId?: number | null;
  name: string;
  plate?: string;
  vehicleType?: string;
  status: string;
  latitude?: string;
  longitude?: string;
  speedKph?: number;
  fuelLevelPct?: number;
  ignition?: boolean;
  lastUpdate?: string;
};
type PositionRow = {
  vehicleId: number;
  latitude?: string;
  longitude?: string;
  speedKph?: number;
  recordedAt?: string;
};

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function Tracking({ data }: { data: any }) {
  const [vehicles, setVehicles] = useState<VehicleRow[]>(data.vehicles ?? []);
  const customers: any[] = data.customers ?? [];
  const [positions, setPositions] = useState<PositionRow[]>(data.vehiclePositions ?? []);
  const [filterId, setFilterId] = useState<number | string>("all");

  const customerName = (id?: number | null) => {
    if (!id) return "Unassigned";
    const c = customers.find((x) => x.id === id);
    return c ? c.contactName : `Customer #${id}`;
  };

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      Promise.all([
        fetch("/api/data?resource=vehicles").then((r) => r.json()),
        fetch("/api/data?resource=vehiclePositions&limit=600").then((r) => r.json()),
        fetch("/api/geofences").then((r) => r.json()),
      ])
        .then(([v, p, g]) => {
          if (cancelled) return;
          if (v.ok) setVehicles(v.data);
          if (p.ok) setPositions(p.data);
          if (g.ok) setGeofences(g.data ?? []);
        })
        .catch(() => undefined);
    load();
    const timer = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) => filterId === "all" || (v.customerId ?? null) === null || v.customerId === Number(filterId)
      ),
    [vehicles, filterId]
  );

  const byVehicle = useMemo(() => {
    const map = new Map<number, PositionRow[]>();
    for (const p of positions) {
      const list = map.get(p.vehicleId);
      if (list) list.push(p);
      else map.set(p.vehicleId, [p]);
    }
    map.forEach((list) => list.sort((a, b) => (a.recordedAt ?? "").localeCompare(b.recordedAt ?? "")));
    return map;
  }, [positions]);

  const points: MapPoint[] = filtered
    .filter((v) => v.latitude && v.longitude)
    .map((v) => ({
      id: v.id,
      lat: Number(v.latitude),
      lng: Number(v.longitude),
      status: typeof v.speedKph === "number" && v.speedKph > 0 ? "moving" : "stopped",
      popupHtml: `<div style="min-width:170px">
        <strong>${esc(v.name)}</strong><br/>
        <span style="color:#1d4ed8">${esc(v.plate ?? "")}</span> · ${esc(customerName(v.customerId))}<br/>
        ${typeof v.speedKph === "number" ? Math.round(v.speedKph) + " km/h" : "—"} · fuel ${typeof v.fuelLevelPct === "number" ? Math.round(v.fuelLevelPct) + "%" : "—"}<br/>
        <span style="color:#6b7280">${esc(fmt(v.lastUpdate))}</span>
      </div>`,
    }));

  const activeTracks = useMemo(() => {
    const out: Record<number, Array<{ lat: number; lng: number }>> = {};
    for (const v of filtered) {
      const list = byVehicle.get(v.id) ?? [];
      const pts = list
        .filter((p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)))
        .map((p) => ({ lat: Number(p.latitude), lng: Number(p.longitude) }));
      if (pts.length >= 2) out[v.id] = pts;
    }
    return out;
  }, [filtered, byVehicle]);

  const [showTracks, setShowTracks] = useState(true);
  const [selId, setSelId] = useState<number | null>(null);
  const [geofences, setGeofences] = useState<GeoRow[]>([]);
  const [geoForm, setGeoForm] = useState<{ name: string; lat: string; lng: string; radiusKm: string; customerId: string }>({
    name: "",
    lat: "",
    lng: "",
    radiusKm: "2",
    customerId: "",
  });
  const [geoMsg, setGeoMsg] = useState("");

  type GeoRow = {
    id: number;
    customerId?: number | null;
    name: string;
    latitude?: string;
    longitude?: string;
    radiusKm?: number;
    enabled?: boolean;
  };

  const selTrack = selId ? activeTracks[selId] ?? [] : [];

  const reloadGeofences = async () => {
    const res = await fetch("/api/geofences");
    if (res.ok) {
      const json = await res.json();
      setGeofences(json.data ?? []);
    }
  };

  const createGeo = async () => {
    setGeoMsg("");
    if (!geoForm.name.trim() || !geoForm.lat || !geoForm.lng) return;
    const res = await fetch("/api/geofences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: geoForm.name.trim(),
        latitude: geoForm.lat,
        longitude: geoForm.lng,
        radiusKm: geoForm.radiusKm,
        customerId: geoForm.customerId ? Number(geoForm.customerId) : null,
      }),
    });
    if (res.ok) {
      setGeoForm({ name: "", lat: "", lng: "", radiusKm: "2", customerId: "" });
      setGeoMsg("Geofence added.");
      await reloadGeofences();
    }
  };

  const setEnabled = async (id: number, enabled: boolean) => {
    const res = await fetch("/api/geofences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
    if (res.ok) await reloadGeofences();
  };

  const removeGeo = async (id: number) => {
    const res = await fetch("/api/geofences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await reloadGeofences();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="space-y-5">
      <div className="rounded-xl border border-navy/10 bg-white">
        <div className="border-b border-navy/10 p-3">
          <select
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="w-full rounded-lg border border-navy/15 bg-white px-2 py-1.5 text-[12px] text-ink outline-none focus:border-electric-blue"
          >
            <option value="all">All customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.contactName}
              </option>
            ))}
          </select>
          <label className="mt-3 flex items-center gap-2 text-[12px] font-medium text-ink/70">
            <input type="checkbox" checked={showTracks} onChange={(e) => setShowTracks(e.target.checked)} />
            Show movement tracks
          </label>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto p-2">
          {filtered.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => setSelId(v.id)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left transition-colors ${
                  selId === v.id ? "bg-electric-blue text-white" : "hover:bg-paper"
                }`}
              >
                <p className="text-[13px] font-semibold text-navy flex items-center justify-between gap-2">
                  <span className="truncate">{v.name}</span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      typeof v.speedKph === "number" && v.speedKph > 0 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </p>
                <p className={`text-[11px] ${selId === v.id ? "text-white/80" : "text-ink/50"}`}>
                  {v.plate ?? "no plate"} · {customerName(v.customerId)}
                </p>
                <p className={`text-[11px] ${selId === v.id ? "text-white/80" : "text-ink/50"}`}>
                  {typeof v.speedKph === "number" ? `${Math.round(v.speedKph)} km/h` : "—"} · {fmt(v.lastUpdate)}
                </p>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-[12px] text-ink/40">No vehicles.</li>
          )}
        </ul>
      </div>

      {/* Geofence manager */}
      <div className="rounded-xl border border-orange-200 bg-white">
        <div className="flex items-center justify-between border-b border-orange-100 px-3 py-2.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-orange-700">Geofences</p>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
            {geofences.filter((g) => g.enabled !== false).length} active
          </span>
        </div>
        <ul className="max-h-[34vh] overflow-y-auto p-2">
          {geofences.map((g) => (
            <li key={g.id} className="mb-1.5 rounded-lg border border-orange-100 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-navy">{g.name}</p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title={g.enabled === false ? "Enable" : "Disable"}
                    onClick={() => setEnabled(g.id, g.enabled !== false ? false : true)}
                    className="rounded border border-navy/10 px-1.5 py-0.5 text-[11px] text-ink/70 hover:bg-navy/5"
                  >
                    {g.enabled === false ? "Enable" : "Disable"}
                  </button>
                  <button
                    type="button"
                    title="Delete geofence"
                    onClick={() => removeGeo(g.id)}
                    className="rounded border border-red-200 px-1.5 py-0.5 text-[11px] text-red-600 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-ink/50">
                {g.latitude}, {g.longitude} · radius {g.radiusKm} km
                {g.customerId ? ` · ${customerName(g.customerId)}` : " · all vehicles"}
              </p>
            </li>
          ))}
          {geofences.length === 0 && (
            <li className="px-3 py-4 text-center text-[12px] text-ink/40">No geofences yet — define one below.</li>
          )}
        </ul>
        {geoMsg && <p className="px-3 pb-1 text-[11px] text-emerald-700">{geoMsg}</p>}
        <div className="border-t border-orange-100 p-3">
          <div className="grid grid-cols-2 gap-2">
            <input value={geoForm.name} onChange={(e) => setGeoForm({ ...geoForm, name: e.target.value })} placeholder="Name (e.g. Lusaka HQ)" className="col-span-2 rounded-lg border border-navy/15 px-2 py-1.5 text-[12px] outline-none focus:border-electric-blue" />
            <input value={geoForm.lat} onChange={(e) => setGeoForm({ ...geoForm, lat: e.target.value })} placeholder="Lat (e.g. -15.3875)" className="rounded-lg border border-navy/15 px-2 py-1.5 text-[12px] outline-none focus:border-electric-blue" />
            <input value={geoForm.lng} onChange={(e) => setGeoForm({ ...geoForm, lng: e.target.value })} placeholder="Lng (e.g. 28.3228)" className="rounded-lg border border-navy/15 px-2 py-1.5 text-[12px] outline-none focus:border-electric-blue" />
            <input value={geoForm.radiusKm} onChange={(e) => setGeoForm({ ...geoForm, radiusKm: e.target.value })} placeholder="Radius (km)" className="rounded-lg border border-navy/15 px-2 py-1.5 text-[12px] outline-none focus:border-electric-blue" />
            <select value={geoForm.customerId} onChange={(e) => setGeoForm({ ...geoForm, customerId: e.target.value })} className="rounded-lg border border-navy/15 px-2 py-1.5 text-[12px] outline-none focus:border-electric-blue">
              <option value="">All vehicles</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.contactName}</option>
              ))}
            </select>
            <PrimaryBtn type="button" onClick={createGeo} className="col-span-2">
              Add geofence
            </PrimaryBtn>
          </div>
        </div>
      </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-3">
        <div className="h-[70vh] overflow-hidden rounded-xl">
          {points.length === 0 && !selTrack.length ? (
            <div className="flex h-full items-center justify-center text-[13px] text-ink/50">
              No vehicles with a location yet — send a /api/device/ping to bring them on the map.
            </div>
          ) : (
            <VehicleMap
              points={points}
              track={showTracks ? selTrack : undefined}
              geofences={geofences.map((g) => ({
                id: g.id,
                name: g.name,
                lat: Number(g.latitude),
                lng: Number(g.longitude),
                radiusKm: Number(g.radiusKm ?? 1),
                enabled: g.enabled !== false,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}