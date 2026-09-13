import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { insert, nowIso, readTable, remove } from "@/lib/db";
import type { Customer, PasswordReset, Staff } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

function genToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const [customers, staff] = await Promise.all([
      readTable<Customer>("customers"),
      readTable<Staff>("staff"),
    ]);
    const customer = customers.find((c) => c.email?.toLowerCase() === email);
    const member = staff.find((s) => s.email.toLowerCase() === email);

    if (!customer?.active && !member?.active) {
      return NextResponse.json({ ok: true, message: "If that account exists, a reset link is on its way." });
    }
    if (!customer && !member) {
      return NextResponse.json({ ok: true, message: "If that account exists, a reset link is on its way." });
    }

    const existing = await readTable<PasswordReset>("passwordResets");
    for (const r of existing) {
      if (r.email === email) await remove("passwordResets", r.id);
    }

    const token = genToken();
    const first = customer ? customer.contactName : member!.fullName;
    await insert<PasswordReset>("passwordResets", {
      email,
      tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      createdAt: nowIso(),
    });

    const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
    const result = await sendPasswordResetEmail(
      email,
      first.split(" ")[0],
      `${base}/portal/reset?token=${token}`
    );

    return NextResponse.json({
      ok: true,
      message: "If that account exists, a reset link is on its way.",
      sent: result.ok,
      logUrl: result.ok ? `${base}/portal/reset?token=${token}` : undefined,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}