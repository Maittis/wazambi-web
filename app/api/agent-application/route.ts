import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { insert, nowIso } from "@/lib/db";
import type { WzEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, town, over18, hasSmartphone, experience } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ error: "Please provide your full name and WhatsApp number." }, { status: 400 });
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const lead = await upsertLead({
      firstName,
      lastName,
      email,
      phone,
      phoneCountryCode: "+260",
      leadSource: "agent_application",
      landingPage: "/agents",
      agentCode: "APPLICATION",
      consent: true,
    });
    if (!lead) {
      return NextResponse.json({ error: "Could not create lead." }, { status: 500 });
    }

    await addLeadEvent(lead.id, "agent_application", "Agent Program application submitted", {
      town,
      over18,
      hasSmartphone,
      experience: experience?.slice(0, 300),
    });

    await insert<WzEvent>("events", {
      eventType: "agent_application",
      leadId: lead.id,
      meta: { town },
      createdAt: nowIso(),
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}