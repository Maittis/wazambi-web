import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { insert, nowIso, readTable, update } from "@/lib/db";
import type { Deposit, Invoice, Quotation, Staff } from "@/lib/db";

const viewers: Array<Staff["role"]> = ["owner", "admin", "sales_manager", "salesperson"];
const managers: Array<Staff["role"]> = ["owner", "admin", "sales_manager"];
const validStatus = ["draft", "sent", "partial", "paid", "overdue"];
const methods = ["cash", "mobile_money", "bank_transfer", "cheque", "card"];

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function nextNumber(): Promise<string> {
  const all = await readTable<Invoice>("invoices");
  return `INV-${2000 + all.length + 1}`;
}

export async function GET() {
  try {
    await requireStaff(viewers);
    const [invoices, deposits] = await Promise.all([
      readTable<Invoice>("invoices"),
      readTable<Deposit>("deposits"),
    ]);
    return NextResponse.json({ data: invoices.slice().reverse(), deposits });
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
    const quotationId = num(body.quotationId);
    if (!quotationId) {
      return NextResponse.json({ error: "quotationId is required." }, { status: 400 });
    }
    const quotations = await readTable<Quotation>("quotations");
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
    if (quote.status === "converted") {
      return NextResponse.json({ error: "An invoice already exists for this quotation." }, { status: 409 });
    }
    const number = await nextNumber();
    const record = await insert<Invoice>("invoices", {
      quotationId: quote.id,
      customerId: quote.customerId,
      number,
      items: quote.items,
      total: quote.total,
      amountPaid: 0,
      status: "draft",
      dueAt: body.dueAt ? new Date(body.dueAt).toISOString() : undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    await update<Quotation>("quotations", quote.id, { status: "converted", updatedAt: nowIso() });
    return NextResponse.json({ ok: true, data: record });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireStaff(managers);
    const body = await req.json();
    const id = num(body.id);
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    const invoices = await readTable<Invoice>("invoices");
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

    if (body.action === "deposit") {
      const amount = num(body.amount);
      if (amount <= 0) return NextResponse.json({ error: "A positive amount is required." }, { status: 400 });
      const method = methods.includes(String(body.method)) ? String(body.method) : "cash";
      const amountPaid = invoice.amountPaid + amount;
      const status: Invoice["status"] = amountPaid >= invoice.total - 0.001 ? "paid" : "partial";
      await insert<Deposit>("deposits", {
        invoiceId: invoice.id,
        amount,
        method,
        reference: body.reference ? String(body.reference) : undefined,
        createdAt: nowIso(),
      });
      await update<Invoice>("invoices", id, {
        amountPaid,
        status,
        paidAt: status === "paid" ? nowIso() : undefined,
        updatedAt: nowIso(),
      });
      return NextResponse.json({ ok: true, amountPaid, status });
    }

    if (body.status !== undefined) {
      if (!validStatus.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      const patch: Partial<Invoice> = { status: body.status as Invoice["status"], updatedAt: nowIso() };
      if (body.status === "paid") patch.paidAt = nowIso();
      await update<Invoice>("invoices", id, patch);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}