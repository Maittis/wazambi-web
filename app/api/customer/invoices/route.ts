import { NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Deposit, Invoice, Quotation } from "@/lib/db";
import { getSessionCustomer } from "@/lib/auth";

export async function GET() {
  try {
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const [invoices, quotations, deposits] = await Promise.all([
      readTable<Invoice>("invoices"),
      readTable<Quotation>("quotations"),
      readTable<Deposit>("deposits"),
    ]);
    const myIds = new Set<number>();
    for (const inv of invoices) {
      if (inv.customerId === customer.id) myIds.add(inv.id);
    }
    return NextResponse.json({
      ok: true,
      invoices: invoices.filter((i) => i.customerId === customer.id).slice().reverse(),
      quotations: quotations.filter((q) => q.customerId === customer.id).slice().reverse(),
      deposits: deposits.filter((d) => myIds.has(d.invoiceId)).slice().reverse(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 500 }
    );
  }
}