import { NextRequest, NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Staff } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const staffList = await readTable<Staff>("staff");
    const staff = staffList.find(
      (s) => s.email.toLowerCase() === email.toLowerCase() && s.active
    );
    if (!staff) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const { verifyPassword } = await import("@/lib/passwords");
    if (!verifyPassword(password, staff.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await createSession(staff.id);
    return NextResponse.json({
      ok: true,
      staff: { id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}