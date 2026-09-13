import { NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { AlertRow, Vehicle } from "@/lib/db";
import { getSessionCustomer } from "@/lib/auth";

export async function GET() {
  try {
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const [alerts, vehicles] = await Promise.all([
      readTable<AlertRow>("alerts"),
      readTable<Vehicle>("vehicles"),
    ]);
    const mine = new Set(vehicles.filter((v) => v.customerId === customer.id).map((v) => v.id));
    const data = alerts
      .filter((a) => (a.customerId === customer.id || (a.vehicleId && mine.has(a.vehicleId))))
      .slice()
      .reverse()
      .slice(0, 50);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}