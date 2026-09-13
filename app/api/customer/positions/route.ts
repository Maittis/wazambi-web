import { NextRequest, NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Vehicle, VehiclePosition } from "@/lib/db";
import { getSessionCustomer } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const vehicles = await readTable<Vehicle>("vehicles");
    const mine = vehicles.filter((v) => v.customerId === customer.id);
    const vehicleId = Number(new URL(req.url).searchParams.get("vehicleId") || 0);
    const allowed = mine.map((v) => v.id);
    const targetId = vehicleId && allowed.includes(vehicleId) ? vehicleId : undefined;

    const all = await readTable<VehiclePosition>("vehiclePositions");
    const filtered = all.filter((p) => (targetId ? p.vehicleId === targetId : allowed.includes(p.vehicleId)));

    const byVehicle = new Map<number, VehiclePosition[]>();
    for (const p of filtered) {
      const list = byVehicle.get(p.vehicleId);
      if (list) list.push(p);
      else byVehicle.set(p.vehicleId, [p]);
    }
    const data: VehiclePosition[] = [];
    for (const list of byVehicle.values()) {
      const last = list.slice(-300);
      data.push(...last);
    }

    return NextResponse.json({
      ok: true,
      data: data.map((p) => ({ ...p })),
      vehicles: mine.map((v) => ({
        id: v.id,
        name: v.name,
        plate: v.plate,
        status: v.status,
        latitude: v.latitude,
        longitude: v.longitude,
        speedKph: v.speedKph,
        fuelLevelPct: v.fuelLevelPct,
        lastUpdate: v.lastUpdate,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}