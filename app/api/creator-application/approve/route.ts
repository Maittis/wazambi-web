import { NextRequest, NextResponse } from "next/server";
import { addLeadEvent } from "@/lib/leads";
import { insert, nowIso, readTable, update } from "@/lib/db";
import type { EmailDelivery, Lead, WzEvent } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { sendCreatorApprovalEmail } from "@/lib/email";

function generateCreatorCode(existing: string[]): string {
  let code: string;
  do {
    const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(2, 8);
    code = `WZC-${rand}`;
  } while (existing.includes(code));
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const staff = await requireStaff(["owner", "admin"]);
    const { leadId, action = "approve" } = await req.json();
    const id = Number(leadId);
    if (!id) {
      return NextResponse.json({ error: "leadId is required." }, { status: 400 });
    }

    const leads = await readTable<Lead>("leads");
    const lead = leads.find((l) => l.id === id && l.leadSource === "creator_application");
    if (!lead) {
      return NextResponse.json({ error: "Creator application not found." }, { status: 404 });
    }

    const at = nowIso();

    if (action === "reject") {
      await update<Lead>("leads", lead.id, { status: "rejected" });
      await addLeadEvent(lead.id, "creator_rejected", `${staff.fullName} rejected the application`, {});
      await insert<WzEvent>("events", { eventType: "creator_rejected", leadId: lead.id, meta: { staffId: staff.id }, createdAt: at });
      return NextResponse.json({ ok: true, action: "rejected" });
    }

    const codes = leads.filter((l) => l.agentCode).map((l) => l.agentCode as string);
    const creatorCode = generateCreatorCode(codes);

    await update<Lead>("leads", lead.id, { agentCode: creatorCode, status: "approved" });
    await addLeadEvent(lead.id, "creator_approved", `${staff.fullName} approved the application. Creator code: ${creatorCode}`, { agentCode: creatorCode });
    await insert<WzEvent>("events", { eventType: "creator_approved", leadId: lead.id, meta: { staffId: staff.id, agentCode: creatorCode }, createdAt: at });

    const firstName = (lead.firstName || "").trim() || "there";
    const email = (lead.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "This applicant has no email address on file." }, { status: 400 });
    }
    const emailResult = await sendCreatorApprovalEmail({
      to: email,
      firstName,
      creatorCode,
    });
    await insert<EmailDelivery>("emailDeliveries", {
      leadId: lead.id,
      toEmail: email,
      subject: `Approved! Your Wazambi Creator Code is ${creatorCode}`,
      guideName: "Creator Approval Email",
      status: emailResult.ok ? "sent" : "failed",
      errorMessage: emailResult.ok ? undefined : emailResult.error,
      createdAt: at,
    });
    await addLeadEvent(
      lead.id,
      emailResult.ok ? "email_sent" : "email_failed",
      emailResult.ok ? `Approval email sent to ${email}` : `Approval email failed: ${emailResult.error}`,
      {}
    );

    return NextResponse.json({ ok: true, action: "approved", creatorCode });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: message === "UNAUTHORIZED" ? "Login required." : "Not permitted." }, { status: message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}