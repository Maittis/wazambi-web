import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, nowIso, readTable, remove, update } from "@/lib/db";
import type { Customer, PasswordReset, SessionRow, Staff } from "@/lib/db";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "");
    const password = String(body.password ?? "");
    if (!token || password.length < 8) {
      return NextResponse.json({ error: "A valid token and a password of at least 8 characters are required." }, { status: 400 });
    }

    const resets = await readTable<PasswordReset>("passwordResets");
    const reset = resets.find((r) => r.tokenHash === hashToken(token));
    if (!reset || new Date(reset.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }
    await remove("passwordResets", reset.id);

    const [customers, staff, sessions] = await Promise.all([
      readTable<Customer>("customers"),
      readTable<Staff>("staff"),
      readTable<SessionRow>("sessions"),
    ]);

    const email = reset.email;
    const customer = customers.find((c) => c.email?.toLowerCase() === email);
    if (customer) {
      await update<Customer>("customers", customer.id, { passwordHash: hashPassword(password), updatedAt: nowIso() });
      for (const s of sessions) {
        if (s.customerId === customer.id) await remove("sessions", s.id);
      }
    } else {
      const member = staff.find((s) => s.email.toLowerCase() === email);
      if (!member) {
        return NextResponse.json({ error: "No matching account was found." }, { status: 400 });
      }
      await update<Staff>("staff", member.id, { passwordHash: hashPassword(password) });
      for (const s of sessions) {
        if (s.staffId === member.id) await remove("sessions", s.id);
      }
    }

    return NextResponse.json({ ok: true, message: "Password updated. You can now log in." });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}