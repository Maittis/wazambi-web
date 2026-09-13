import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { hashPassword, insert, nowIso, readTable, remove, update } from "@/lib/db";
import type { Customer, SessionRow, Staff, Vehicle } from "@/lib/db";

const managers: Array<Staff["role"]> = ["owner", "admin", "sales_manager"];

function genPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const rnd = crypto.getRandomValues(new Uint32Array(8));
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[rnd[i] % chars.length];
  return out;
}

async function wipeSessions(customerId: number): Promise<void> {
  const sessions = await readTable<SessionRow>("sessions");
  for (const s of sessions) {
    if (s.customerId === customerId) await remove("sessions", s.id);
  }
}

async function syncVehicleCount(customerId: number): Promise<void> {
  const vehicles = await readTable<Vehicle>("vehicles");
  const n = vehicles.filter((v) => v.customerId === customerId).length;
  await update<Customer>("customers", customerId, { vehicleCount: n });
}

export async function POST(req: NextRequest) {
  try {
    await requireStaff(managers);
    const body = await req.json();
    const action = String(body.action ?? "");

    if (action === "enable" || action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = body.password ? String(body.password) : genPassword();
      const contactName = String(body.contactName ?? "").trim();
      const existingId = Number(body.customerId || 0);

      if (!email) {
        if (action === "create") {
          const record = await insert<Customer>("customers", {
            leadId: null,
            contactName: contactName || "Unnamed customer",
            company: body.company ? String(body.company) : undefined,
            phone: body.phone ? String(body.phone) : undefined,
            active: true,
            status: "active",
            vehicleCount: 0,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          });
          return NextResponse.json({ ok: true, customer: record, tempPassword: null, vehicles: [] });
        }
        return NextResponse.json({ error: "Email is required for portal access." }, { status: 400 });
      }
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      const customers = await readTable<Customer>("customers");
      const dup = customers.find(
        (c) => c.id !== existingId && c.email?.toLowerCase() === email
      );
      if (dup) {
        return NextResponse.json({ error: "A customer with that email already exists." }, { status: 409 });
      }

      let customerId = existingId;
      if (customerId) {
        await update<Customer>("customers", customerId, {
          email,
          passwordHash: hashPassword(password),
          active: true,
          ...(contactName ? { contactName } : {}),
        });
      } else {
        const record = await insert<Customer>("customers", {
          leadId: null,
          contactName: contactName || "Unnamed customer",
          company: body.company ? String(body.company) : undefined,
          email,
          phone: body.phone ? String(body.phone) : undefined,
          passwordHash: hashPassword(password),
          active: true,
          status: "active",
          vehicleCount: 0,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        });
        customerId = record.id;
      }

      const proposed: Array<{ name?: string; plate?: string; vehicleType?: string }> = Array.isArray(
        body.vehicles
      )
        ? body.vehicles
        : [];
      for (const v of proposed) {
        const name = String(v?.name ?? "").trim();
        if (!name) continue;
        await insert<Vehicle>("vehicles", {
          customerId,
          name,
          plate: v?.plate ? String(v.plate) : undefined,
          vehicleType: v?.vehicleType ? String(v.vehicleType) : undefined,
          status: "stopped",
          lastLocation: "No signal yet",
          createdAt: nowIso(),
          updatedAt: nowIso(),
        });
      }

      await wipeSessions(customerId);
      await syncVehicleCount(customerId);

      const fresh = await readTable<Customer>("customers");
      const customer = fresh.find((c) => c.id === customerId) ?? null;
      const allVehicles = await readTable<Vehicle>("vehicles");
      const customerVehicles = allVehicles.filter((v) => v.customerId === customerId);

      return NextResponse.json({
        ok: true,
        created: !existingId,
        tempPassword: password,
        customer,
        vehicles: customerVehicles,
      });
    }

    if (action === "disable") {
      const customerId = Number(body.customerId);
      if (!customerId) {
        return NextResponse.json({ error: "customerId is required." }, { status: 400 });
      }
      await update<Customer>("customers", customerId, { active: false });
      await wipeSessions(customerId);
      return NextResponse.json({ ok: true });
    }

    if (action === "setPassword") {
      const customerId = Number(body.customerId);
      const password = String(body.password ?? "");
      if (!customerId) {
        return NextResponse.json({ error: "customerId is required." }, { status: 400 });
      }
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      await update<Customer>("customers", customerId, { passwordHash: hashPassword(password) });
      await wipeSessions(customerId);
      return NextResponse.json({ ok: true });
    }

    if (action === "addVehicle") {
      const customerId = Number(body.customerId);
      const name = String(body.name ?? "").trim();
      if (!customerId || !name) {
        return NextResponse.json({ error: "customerId and vehicle name are required." }, { status: 400 });
      }
      const vehicle = await insert<Vehicle>("vehicles", {
        customerId,
        name,
        plate: body.plate ? String(body.plate) : undefined,
        vehicleType: body.vehicleType ? String(body.vehicleType) : undefined,
        status: "stopped",
        lastLocation: "No signal yet",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      await syncVehicleCount(customerId);
      return NextResponse.json({ ok: true, vehicle });
    }

    if (action === "removeVehicle") {
      const vehicleId = Number(body.vehicleId);
      const vehicles = await readTable<Vehicle>("vehicles");
      const target = vehicles.find((v) => v.id === vehicleId);
      if (!target) {
        return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
      }
      await remove("vehicles", vehicleId);
      await syncVehicleCount(target.customerId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}