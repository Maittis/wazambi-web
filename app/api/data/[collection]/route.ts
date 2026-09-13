import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { hashPassword, insert, nowIso, readTable, update } from "@/lib/db";
import type { CollectionName, DbRow, FollowUp, Lead, Staff } from "@/lib/db";

const writable: Record<string, Array<Staff["role"]>> = {
  leads: ["owner", "admin", "sales_manager", "salesperson"],
  followUps: ["owner", "admin", "sales_manager", "salesperson"],
  customers: ["owner", "admin", "sales_manager"],
  staff: ["owner", "admin"],
};

const staffRoles: Array<Staff["role"]> = [
  "owner",
  "admin",
  "sales_manager",
  "salesperson",
  "content_manager",
];

const followUpTypes = [
  "phone_call",
  "whatsapp",
  "email",
  "demonstration",
  "assessment",
  "quotation",
  "installation_discussion",
];

export async function POST(req: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  try {
    const { collection } = await params;
    const allowed = writable[collection];
    if (!allowed) {
      return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
    }
    const staff = await requireStaff(allowed);
    const body = await req.json();

    if (collection === "followUps") {
      const leadId = Number(body.leadId);
      const salespersonId = Number(body.salespersonId);
      if (!leadId || !salespersonId) {
        return NextResponse.json({ error: "leadId and salespersonId are required." }, { status: 400 });
      }
      const followUpType = followUpTypes.includes(body.followUpType) ? body.followUpType : "phone_call";
      const dueDate = String(body.dueDate ?? new Date().toISOString().slice(0, 10)).slice(0, 10);
      const record = await insert<FollowUp>("followUps", {
        leadId,
        salespersonId,
        followUpType,
        dueDate,
        status: String(body.status ?? "pending"),
        notes: body.notes ? String(body.notes) : undefined,
        createdAt: nowIso(),
      });
      await update<Lead>("leads", leadId, {
        status: "follow_up",
        followUpDate: dueDate,
      });
      return NextResponse.json({ ok: true, data: record });
    }

    if (collection === "staff") {
      const fullName = String(body.fullName ?? "").trim();
      const email = String(body.email ?? "").trim().toLowerCase();
      const role = staffRoles.includes(body.role) ? body.role : "salesperson";
      if (!fullName || !email) {
        return NextResponse.json({ error: "fullName and email are required." }, { status: 400 });
      }
      const staffList = await readTable<Staff>("staff");
      if (staffList.some((s) => s.email.toLowerCase() === email)) {
        return NextResponse.json({ error: "A staff member with that email already exists." }, { status: 409 });
      }
      const passwordHash = hashPassword(process.env.STAFF_DEFAULT_PASSWORD || "wazambi123");
      const record = await insert<Staff>("staff", {
        fullName,
        email,
        passwordHash,
        role,
        active: true,
      });
      const safe = { id: record.id, fullName: record.fullName, email: record.email, role: record.role, active: record.active };
      return NextResponse.json({ ok: true, data: safe });
    }

    return NextResponse.json({
      ok: true,
      data: await insert<DbRow>(collection as CollectionName, { ...body, createdAt: nowIso() }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}