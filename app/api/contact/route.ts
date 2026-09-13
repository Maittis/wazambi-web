import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { insert, nowIso } from "@/lib/db";
import type { ContactMessage, WzEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, subject, message } = body;

    if (!fullName || !message) {
      return NextResponse.json({ error: "Please provide your name and a message." }, { status: 400 });
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    let leadId: number | undefined;
    if (email || phone) {
      const lead = await upsertLead({
        firstName,
        lastName,
        email,
        phone,
        leadSource: "contact_page",
        landingPage: "/contact",
        consent: true,
      });
      leadId = lead?.id ?? undefined;
    }

    const msg = await insert<ContactMessage>("contactMessages", {
      leadId,
      fullName,
      email,
      phone,
      subject,
      message,
      status: "new",
      createdAt: nowIso(),
    });

    if (leadId) {
      await addLeadEvent(leadId, "contact_message", `Contact message: ${subject || "No subject"}`, {
        messageId: msg.id,
      });
    }

    await insert<WzEvent>("events", {
      eventType: "contact_submitted",
      leadId,
      meta: { subject },
      createdAt: nowIso(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}