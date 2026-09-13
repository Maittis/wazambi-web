import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { readTable, getSettings } from "@/lib/db";
import type { CollectionName, DbRow } from "@/lib/db";

const readable: Record<string, string[]> = {
  leads: ["owner", "admin", "sales_manager", "salesperson"],
  leadEvents: ["owner", "admin", "sales_manager", "salesperson"],
  assessments: ["owner", "admin", "sales_manager", "salesperson"],
  registrations: ["owner", "admin", "sales_manager", "salesperson"],
  emailDeliveries: ["owner", "admin", "sales_manager", "salesperson"],
  quotationRequests: ["owner", "admin", "sales_manager", "salesperson"],
  contactMessages: ["owner", "admin", "sales_manager", "salesperson"],
  followUps: ["owner", "admin", "sales_manager", "salesperson"],
  customers: ["owner", "admin", "sales_manager", "salesperson"],
  vehicles: ["owner", "admin", "sales_manager", "salesperson"],
  staff: ["owner", "admin"],
  pageViews: ["owner", "admin"],
  events: ["owner", "admin", "sales_manager"],
  settings: ["owner", "admin", "content_manager"],
};

export async function GET(req: NextRequest) {
  try {
    const staff = await requireStaff();
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get("resource") ?? "leads";
    const allowed = readable[resource];
    if (!allowed) {
      return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
    }
    if (!allowed.includes(staff.role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (resource === "settings") {
      return NextResponse.json({ data: await getSettings() });
    }

    let data = await readTable<DbRow>(resource as CollectionName);

    if (resource === "staff") {
      data = (data as Array<{ id: number; fullName: string; email: string; role: string; active: boolean }>).map(
        (s) => ({ id: s.id, fullName: s.fullName, email: s.email, role: s.role, active: s.active })
      );
    }

    if (resource === "leads" && staff.role === "salesperson") {
      data = (data as Array<{ assignedSalespersonId?: number | null }>).filter(
        (l) => l.assignedSalespersonId === staff.id
      ) as DbRow[];
    }

    return NextResponse.json({ data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : msg === "FORBIDDEN" ? "Forbidden." : "Something went wrong." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}