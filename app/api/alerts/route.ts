import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { nowIso, readTable, update } from "@/lib/db";
import type { AlertRow, Staff } from "@/lib/db";

const viewers: Array<Staff["role"]> = ["owner", "admin", "sales_manager", "salesperson"];
const managers: Array<Staff["role"]> = ["owner", "admin", "sales_manager"];

export async function GET() {
  try {
    await requireStaff(viewers);
    const alerts = await readTable<AlertRow>("alerts");
    return NextResponse.json({ data: alerts.slice().reverse() });
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
    const id = Number(body.alertId || 0);
    if (!id) {
      return NextResponse.json({ error: "alertId is required." }, { status: 400 });
    }
    await update<AlertRow>("alerts", id, { status: "resolved", resolvedAt: nowIso() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}