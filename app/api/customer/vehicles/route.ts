import { NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Vehicle } from "@/lib/db";
import { getSessionCustomer } from "@/lib/auth";

export async function GET() {
  try {
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const vehicles = await readTable<Vehicle>("vehicles");
    const mine = vehicles.filter((v) => v.customerId === customer.id);
    return NextResponse.json({ ok: true, data: mine });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}