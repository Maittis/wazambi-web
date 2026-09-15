import { NextRequest, NextResponse } from "next/server";
import { addLeadEvent } from "@/lib/leads";
import { readTable } from "@/lib/db";
import type { Lead } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const staff = await requireStaff(["owner", "admin"]);
    const { leadId, note } = await req.json();
    const id = Number(leadId);
    const text = String(note ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "leadId is required." }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: "Note is too long." }, { status: 400 });
    }

    const leads = await readTable<Lead>("leads");
    const lead = leads.find((l) => l.id === id && l.leadSource === "creator_application");
    if (!lead) {
      return NextResponse.json({ error: "Creator application not found." }, { status: 404 });
    }

    await addLeadEvent(lead.id, "creator_note", `${staff.fullName} added an internal note`, {
      note: text,
      staffId: staff.id,
      staffName: staff.fullName,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: message === "UNAUTHORIZED" ? "Login required." : "Not permitted." }, { status: message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}