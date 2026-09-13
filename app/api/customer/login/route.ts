import { NextRequest, NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Customer } from "@/lib/db";
import { createCustomerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const customers = await readTable<Customer>("customers");
    const customer = customers.find(
      (c) => c.email?.toLowerCase() === email.toLowerCase() && c.active
    );
    if (!customer || !customer.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const { verifyPassword } = await import("@/lib/passwords");
    if (!verifyPassword(password, customer.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await createCustomerSession(customer.id);
    return NextResponse.json({
      ok: true,
      customer: { id: customer.id, contactName: customer.contactName, email: customer.email },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}