"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/db";

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

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}