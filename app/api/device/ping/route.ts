import { NextRequest, NextResponse } from "next/server";
import { insert, nowIso, readTable, update } from "@/lib/db";
import type { Vehicle, VehiclePosition } from "@/lib/db";
import { detectAlerts } from "@/lib/tracking";

function asNum(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const key = process.env.DEVICE_API_KEY;
    if (key && req.headers.get("x-device-key") !== key) {
      return NextResponse.json({ error: "Invalid device key." }, { status: 401 });
    }

    const body = await req.json();
    const lat = asNum(body.latitude);
    const lng = asNum(body.longitude);
    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "latitude and longitude are required." }, { status: 400 });
    }

    const vehicles = await readTable<Vehicle>("vehicles");
    let vehicle = body.vehicleId
      ? vehicles.find((v) => v.id === Number(body.vehicleId))
      : undefined;
    const plate = String(body.plate ?? "").trim();
    if (!vehicle && plate) {
      vehicle = vehicles.find((v) => (v.plate ?? "").trim().toLowerCase() === plate.toLowerCase());
    }

    if (!vehicle) {
      if (!plate) {
        return NextResponse.json({ error: "Provide vehicleId or plate." }, { status: 404 });
      }
      const created = await insert<Vehicle>("vehicles", {
        customerId: null as unknown as number,
        name: String(body.name ?? plate),
        plate,
        status: "stopped",
        lastLocation: "Awaiting location text",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      vehicle = created;
    }

    const speed = asNum(body.speed);
    const fuel = asNum(body.fuel);
    const ignition = body.ignition === undefined ? undefined : Boolean(body.ignition);
    const status = speed === undefined ? vehicle.status : speed > 0 ? "moving" : "stopped";

    const recordedAt = body.recordedAt ? new Date(body.recordedAt).toISOString() : nowIso();

    await update<Vehicle>("vehicles", vehicle.id, {
      latitude: String(lat),
      longitude: String(lng),
      speedKph: speed,
      fuelLevelPct: fuel,
      ignition,
      status,
      lastUpdate: nowIso(),
    });

    await insert<VehiclePosition>("vehiclePositions", {
      vehicleId: vehicle.id,
      latitude: String(lat),
      longitude: String(lng),
      speedKph: speed,
      fuelLevelPct: fuel,
      ignition,
      recordedAt,
      createdAt: nowIso(),
    });

    await detectAlerts({ vehicle, lat, lng, speed, fuel, ignition });

    return NextResponse.json({ ok: true, vehicleId: vehicle.id, status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    console.error("device ping failed:", msg);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const key = process.env.DEVICE_API_KEY;
    if (key && req.headers.get("x-device-key") !== key) {
      return NextResponse.json({ error: "Invalid device key." }, { status: 401 });
    }
    const vehicles = await readTable<Vehicle>("vehicles");
    return NextResponse.json({ ok: true, data: vehicles });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}