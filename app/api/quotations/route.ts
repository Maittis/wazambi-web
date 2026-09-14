import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { insert, nowIso, readTable, update } from "@/lib/db";
import type { Quotation, QuotationItem, Staff } from "@/lib/db";

const viewers: Array<Staff["role"]> = ["owner", "admin", "sales_manager", "salesperson"];
const managers: Array<Staff["role"]> = ["owner", "admin", "sales_manager"];
const validStatus = ["draft", "sent", "accepted", "declined", "converted"];

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function nextNumber(): Promise<string> {
  const all = await readTable<Quotation>("quotations");
  return `Q-${1000 + all.length + 1}`;
}

export async function GET() {
  try {
    await requireStaff(viewers);
    const quotations = await readTable<Quotation>("quotations");
    return NextResponse.json({ data: quotations.slice().reverse() });
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
    const customerId = num(body.customerId);
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items: QuotationItem[] = rawItems
      .map((it: any) => ({
        description: String(it.description ?? "").trim(),
        qty: Math.max(num(it.qty), 1),
        unitPrice: num(it.unitPrice),
      }))
      .filter((it: QuotationItem) => it.description && it.unitPrice > 0);
    if (!customerId || !body.items) {
      return NextResponse.json({ error: "customerId and items are required." }, { status: 400 });
    }
    const number = await nextNumber();
    const total = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    const record = await insert<Quotation>("quotations", {
      customerId,
      number,
      items,
      total,
      currency: String(body.currency ?? "ZMW").toUpperCase(),
      status: "draft",
      validUntil: body.validUntil ? new Date(body.validUntil).toISOString() : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
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
    if (body.status !== undefined && !validStatus.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const patch: Partial<Quotation> = body.status !== undefined ? { status: body.status as Quotation["status"] } : {};
    patch.updatedAt = nowIso();
    if (Object.keys(patch).length <= 1) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }
    await update<Quotation>("quotations", id, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}