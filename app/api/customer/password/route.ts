import { NextRequest, NextResponse } from "next/server";
import { createCustomerSession, getSessionCustomer } from "@/lib/auth";
import { hashPassword, verifyPassword, readTable, remove, update } from "@/lib/db";
import type { Customer, SessionRow } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const { currentPassword, newPassword } = await req.json();
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Missing password fields." }, { status: 400 });
    }
    if (!customer.passwordHash || !verifyPassword(currentPassword, customer.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }
    await update<Customer>("customers", customer.id, { passwordHash: hashPassword(newPassword) });
    const sessions = await readTable<SessionRow>("sessions");
    for (const s of sessions) {
      if (s.customerId === customer.id) await remove("sessions", s.id);
    }
    await createCustomerSession(customer.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}