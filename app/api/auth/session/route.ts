import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/auth";

export async function GET() {
  const staff = await getSessionStaff();
  if (!staff) {
    return NextResponse.json({ ok: false, staff: null }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    staff: { id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role },
  });
}