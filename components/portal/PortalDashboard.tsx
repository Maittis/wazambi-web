"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Vehicle } from "@/lib/db";
import VehicleMap from "@/components/tracking/VehicleMap";
import type { MapPoint } from "@/components/tracking/VehicleMap";

function FuelBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy/10">
      <div
        className={`h-full rounded-full ${
          clamped < 20 ? "bg-alert" : clamped < 50 ? "bg-gold" : "bg-emerald-500"
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default function PortalDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<{ fullName: string; email: string } | null | undefined>(undefined);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mapVehicle, setMapVehicle] = useState<Vehicle | null>(null);
  const [track, setTrack] = useState<Array<{ lat: number; lng: number; speedKph?: number }>>([]);
  const [alerts, setAlerts] = useState<Array<{ id: number; alertType: string; message: string; status: string; createdAt: string }>>([]);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    const load = () =>
      fetch("/api/customer/alerts")
        .then((r) => r.json())
        .then((d) => {
          if (cancelled || !d.ok) return;
          setAlerts(d.data ?? []);
        })
        .catch(() => undefined);
    load();
    const timer = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [loaded]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d.ok) {
          router.replace("/portal/login");
          return;
        }
        if (d.kind === "staff") {
          router.replace("/customer-admin");
          return;
        }
        setMe(d.customer);
      })
      .catch(() => {
        if (!cancelled) router.replace("/portal/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (loaded) return;
    fetch("/api/customer/vehicles")
      .then((r) => r.json())
      .then((d) => {
        setLoaded(true);
        if (d.ok) setVehicles(d.data ?? []);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  useEffect(() => {
    if (!mapVehicle) return;
    let cancelled = false;
    const load = () =>
      fetch(`/api/customer/positions?vehicleId=${mapVehicle.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled || !d.ok) return;
          const pts = (d.data ?? []).map((p: any) => ({
            lat: Number(p.latitude),
            lng: Number(p.longitude),
            speedKph: typeof p.speedKph === "number" ? p.speedKph : undefined,
          }));
          setTrack(pts.filter((p: any) => Number.isFinite(p.lat) && Number.isFinite(p.lng)));
        })
        .catch(() => undefined);
    load();
    const timer = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [mapVehicle]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  };

  const openAlerts = alerts.filter((a) => a.status === "open");
  const alertChip: Record<string, string> = {
    overspeed: "bg-red-100 text-red-700",
    geofence_exit: "bg-amber-100 text-amber-800",
    geofence_enter: "bg-blue-100 text-blue-800",
    low_fuel: "bg-amber-100 text-amber-800",
    ignition_on: "bg-emerald-100 text-emerald-700",
    ignition_off: "bg-navy/10 text-ink/70",
  };

  if (!me) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-[18px] font-semibold">Welcome, {me.fullName}</p>
            <p className="text-[13px] font-light text-white/70">{me.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-[100px] border border-white/30 px-4 py-1.5 text-[13px] font-medium">
              {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}
            </span>
            {openAlerts.length > 0 && (
              <Link
                href="#alerts"
                className="relative rounded-[100px] border border-red-400/60 bg-red-500/20 px-4 py-1.5 text-[13px] font-semibold text-red-100"
              >
                {openAlerts.length} alert{openAlerts.length === 1 ? "" : "s"}
              </Link>
            )}
            <Link
              href="/portal/account"
              className="hidden rounded-[100px] border-2 border-white/40 px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-navy sm:inline-block"
            >
              Account
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-[100px] border-2 border-white/40 px-4 py-1.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-navy"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-[22px] font-bold text-navy">Your vehicles</h1>
        <p className="mt-1 text-[14px] font-light text-ink/60">
          Live status for the vehicles registered to your account.
        </p>

        {!loaded ? (
          <p className="mt-10 text-center text-[14px] text-ink/50">Loading…</p>
        ) : vehicles.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center">
            <p className="text-[15px] font-medium text-navy">No vehicles linked to your account yet.</p>
            <p className="mt-1 text-[13px] font-light text-ink/60">
              Contact Wazambi at +260 976 595 331 to add a vehicle.
            </p>
            <a href="https://wa.me/260976595331" target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 inline-block text-[14px]">
              Chat on WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <div key={v.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[16px] font-bold text-navy">{v.name}</h2>
                    <p className="mt-0.5 text-[13px] font-medium text-electric-blue">{v.plate}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      v.status === "moving"
                        ? "bg-emerald-100 text-emerald-700"
                        : v.status === "stopped"
                          ? "bg-gold/20 text-ink/80"
                          : "bg-navy/10 text-ink/60"
                    }`}
                  >
                    {v.status ?? "unknown"}
                  </span>
                </div>

                <p className="mt-3 text-[12px] font-light uppercase tracking-wide text-ink/50">
                  {v.vehicleType || "Vehicle"}
                </p>

                <dl className="mt-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-light text-ink/60">Last location</dt>
                    <dd className="text-right font-medium text-navy">{v.lastLocation || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-light text-ink/60">Speed</dt>
                    <dd className="font-medium text-navy">
                      {typeof v.speedKph === "number" ? `${Math.round(v.speedKph)} km/h` : "—"}
                    </dd>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-light text-ink/60">Fuel level</dt>
                      <dd className="font-medium text-navy">
                        {typeof v.fuelLevelPct === "number" ? `${Math.round(v.fuelLevelPct)}%` : "—"}
                      </dd>
                    </div>
                    {typeof v.fuelLevelPct === "number" && <FuelBar pct={v.fuelLevelPct} />}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-light text-ink/60">Ignition</dt>
                    <dd className="font-medium text-navy">
                      {v.ignition === null || v.ignition === undefined
                        ? "—"
                        : v.ignition
                          ? "On"
                          : "Off"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-light text-ink/60">Last update</dt>
                    <dd className="font-medium text-navy">
                      {v.lastUpdate ? new Date(v.lastUpdate).toLocaleString() : "—"}
                    </dd>
                  </div>
                </dl>

                {v.latitude && v.longitude && (
                  <button
                    type="button"
                    onClick={() => setMapVehicle(v)}
                    className="btn-primary mt-4 w-full text-[13px]"
                  >
                    View on map
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <section id="alerts" className="mt-10">
          <h2 className="text-[20px] font-bold text-navy">Alerts</h2>
          <p className="mt-1 text-[14px] font-light text-ink/60">
            Automatic alerts for your vehicles — overspeeding, low fuel, ignition changes and geofence crossings.
          </p>
          {alerts.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white p-8 text-center text-[13px] font-light text-ink/60">
              No alerts yet. Your vehicles are running clean.
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {alerts.slice(0, 25).map((a) => (
                <li
                  key={a.id}
                  className={`flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ${a.status === "resolved" ? "opacity-60" : ""}`}
                >
                  <div>
                    <p className="text-[14px] font-medium text-navy">{a.message}</p>
                    <p className="mt-0.5 text-[12px] font-light text-ink/50">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${alertChip[a.alertType] ?? "bg-navy/10 text-ink/70"}`}
                  >
                    {a.alertType.replace(/_/g, " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {mapVehicle && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-navy/70 p-4" onClick={() => setMapVehicle(null)}>
          <div
            className="w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-navy px-5 py-3 text-white">
              <div>
                <p className="text-[15px] font-bold">{mapVehicle.name}</p>
                <p className="text-[12px] font-light text-white/70">
                  {mapVehicle.plate} · {mapVehicle.vehicleType ?? "Vehicle"} ·{" "}
                  {typeof mapVehicle.speedKph === "number" ? `${Math.round(mapVehicle.speedKph)} km/h` : "—"}
                </p>
              </div>
              <button type="button" onClick={() => setMapVehicle(null)} className="text-white/80 hover:text-white" aria-label="Close map">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="h-[420px] w-full">
              <VehicleMap
                points={
                  mapVehicle.latitude && mapVehicle.longitude
                    ? [
                        {
                          id: mapVehicle.id,
                          lat: Number(mapVehicle.latitude),
                          lng: Number(mapVehicle.longitude),
                          status: mapVehicle.status,
                        },
                      ]
                    : []
                }
                track={track}
              />
            </div>
            <p className="border-t border-navy/10 px-5 py-2.5 text-[11px] text-ink/50">
              Live area · refreshes every few seconds. Track line shows the last recorded route.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}