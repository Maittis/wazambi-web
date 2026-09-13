"use client";

import { useEffect, useState } from "react";
import { Badge, PrimaryBtn, Td, Th } from "@/components/admin/ui";

type AlertRow = {
  id: number;
  vehicleId?: number | null;
  customerId?: number | null;
  alertType: string;
  message: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
};
type Vehicle = { id: number; name: string; plate?: string | null; customerId?: number | null };
type Customer = { id: number; contactName: string; company?: string | null };

const severity: Record<string, string> = {
  overspeed: "bg-red-100 text-red-800",
  geofence_exit: "bg-amber-100 text-amber-800",
  geofence_enter: "bg-blue-100 text-blue-800",
  low_fuel: "bg-amber-100 text-amber-800",
  ignition_on: "bg-green-100 text-green-800",
  ignition_off: "bg-gray-100 text-gray-700",
};

export default function Alerts({ data }: { data: any }) {
  const [alerts, setAlerts] = useState<AlertRow[]>(data.alerts ?? []);
  const vehicles: Vehicle[] = data.vehicles ?? [];
  const customers: Customer[] = data.customers ?? [];

  const vehicleOf = (id?: number | null) => vehicles.find((v) => v.id === id);
  const customerOf = (id?: number | null) => customers.find((c) => c.id === id);

  const fetchAlerts = async () => {
    const res = await fetch("/api/alerts");
    if (res.ok) {
      const json = await res.json();
      setAlerts(json.data ?? []);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const t = setInterval(fetchAlerts, 15000);
    return () => clearInterval(t);
  }, []);

  const resolve = async (id: number) => {
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId: id }),
    });
    await fetchAlerts();
  };

  const openCount = alerts.filter((a) => a.status === "open").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-white p-4">
        <p className="text-[12px] text-ink/60">
          <strong className="text-navy">{openCount}</strong> open alert{openCount === 1 ? "" : "s"} ·
          detected automatically from device pings (overspeed, low fuel, ignition, geofence enter/exit).
        </p>
        <PrimaryBtn onClick={fetchAlerts}>Refresh</PrimaryBtn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
        <table className="w-full min-w-[820px]">
          <thead className="bg-paper">
            <tr>
              <Th>Type</Th>
              <Th>Message</Th>
              <Th>Vehicle</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th>When</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => {
              const veh = vehicleOf(a.vehicleId);
              const cust = customerOf(a.customerId);
              return (
                <tr key={a.id} className={`border-t border-navy/5 ${a.status === "open" ? "bg-white" : "bg-paper/50 opacity-60"}`}>
                  <Td>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${severity[a.alertType] ?? "bg-gray-100 text-gray-700"}`}>
                      {a.alertType.replace(/_/g, " ")}
                    </span>
                  </Td>
                  <Td className="max-w-[320px]">{a.message}</Td>
                  <Td>{veh ? <span className="font-semibold text-navy">{veh.name}</span> : "—"}</Td>
                  <Td>{cust ? cust.contactName : "—"}</Td>
                  <Td><Badge status={a.status} /></Td>
                  <Td className="whitespace-nowrap text-[12px]">{a.createdAt?.replace("T", " ").slice(0, 16)}</Td>
                  <Td>
                    {a.status === "open" ? (
                      <button
                        onClick={() => resolve(a.id)}
                        className="rounded-lg border border-navy/10 px-3 py-1 text-[12px] font-semibold text-navy hover:bg-navy/5"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-ink/40">{a.resolvedAt?.slice(0, 16)}</span>
                    )}
                  </Td>
                </tr>
              );
            })}
            {alerts.length === 0 && (
              <tr><Td colSpan={7} className="text-center text-ink/40">No alerts yet — alerts appear when devices ping while overspeeding, low on fuel, turning ignition, or crossing a geofence.</Td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}