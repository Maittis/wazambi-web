import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }
  if (user.kind === "staff") {
    return NextResponse.json({
      ok: true,
      kind: "staff",
      staff: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  }
  return NextResponse.json({
    ok: true,
    kind: "customer",
    customer: { id: user.id, fullName: user.fullName, email: user.email },
  });
}