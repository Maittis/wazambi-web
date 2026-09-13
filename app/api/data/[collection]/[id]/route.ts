import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { readTable, update, remove, nowIso } from "@/lib/db";
import type { DbRow } from "@/lib/db";

type CollectionName =
  | "leads"
  | "leadEvents"
  | "assessments"
  | "registrations"
  | "emailDeliveries"
  | "quotationRequests"
  | "contactMessages"
  | "followUps"
  | "customers"
  | "staff"
  | "pageViews"
  | "events"
  | "sessions";

const COLLECTIONS_LIST: CollectionName[] = [
  "leads", "leadEvents", "assessments", "registrations", "emailDeliveries",
  "quotationRequests", "contactMessages", "followUps", "customers",
  "staff", "pageViews", "events", "sessions",
];
const COLLECTIONS = new Set<string>(COLLECTIONS_LIST);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params;
    if (!COLLECTIONS.has(collection)) {
      return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
    }
    const staff = await requireStaff(["owner", "admin", "sales_manager", "salesperson"]);
    const body = await req.json();
    const list = await readTable<DbRow>(collection as CollectionName);
    const index = list.findIndex((item) => item.id === Number(id));
    if (index === -1) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (collection === "leads") {
      const lead = list[index] as { assignedSalespersonId?: number | null } & Record<string, unknown>;
      if (staff.role === "salesperson" && lead.assignedSalespersonId !== staff.id) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    const updated = await update<DbRow>(collection as CollectionName, Number(id), { ...body, updatedAt: nowIso() });
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg || "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params;
    if (!COLLECTIONS.has(collection)) {
      return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
    }
    await requireStaff(["owner", "admin", "sales_manager", "salesperson"]);
    const removed = await remove(collection as CollectionName, Number(id));
    return NextResponse.json({ ok: removed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg || "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}
