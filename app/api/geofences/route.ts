import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { insert, nowIso, readTable, remove, update } from "@/lib/db";
import type { Geofence, Staff } from "@/lib/db";

const viewers: Array<Staff["role"]> = ["owner", "admin", "sales_manager", "salesperson"];
const managers: Array<Staff["role"]> = ["owner", "admin", "sales_manager"];

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    await requireStaff(viewers);
    const geofences = await readTable<Geofence>("geofences");
    return NextResponse.json({ data: geofences });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireStaff(managers);
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const lat = num(body.latitude);
    const lng = num(body.longitude);
    if (!name || !lat || !lng) {
      return NextResponse.json({ error: "name, latitude and longitude are required." }, { status: 400 });
    }
    const record = await insert<Geofence>("geofences", {
      customerId: body.customerId ? num(body.customerId) : null,
      name,
      latitude: String(lat),
      longitude: String(lng),
      radiusKm: Math.max(num(body.radiusKm), 0.1),
      enabled: body.enabled === false ? false : true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    return NextResponse.json({ ok: true, data: record });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireStaff(managers);
    const body = await req.json();
    const id = Number(body.id || 0);
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }
    await remove("geofences", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireStaff(managers);
    const body = await req.json();
    const id = Number(body.id || 0);
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }
    const patch: Partial<Geofence> = {};
    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.latitude !== undefined) patch.latitude = String(num(body.latitude));
    if (body.longitude !== undefined) patch.longitude = String(num(body.longitude));
    if (body.radiusKm !== undefined) patch.radiusKm = Math.max(num(body.radiusKm), 0.1);
    if (body.enabled !== undefined) patch.enabled = body.enabled === true || body.enabled === "true";
    patch.updatedAt = nowIso();
    if (Object.keys(patch).length <= 1) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }
    await update<Geofence>("geofences", id, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}