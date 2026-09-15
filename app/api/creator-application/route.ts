import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { dedupeKeyFor, insert, nowIso, readTable, update } from "@/lib/db";
import type { EmailDelivery, Lead, WzEvent } from "@/lib/db";
import {
  sendCreatorApplicationAdminNotification,
  sendCreatorApplicationConfirmation,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      town,
      mainPlatform,
      mainContentUrl,
      contentDuration,
      canRecordEdit,
      whyYou,
      consent,
      acceptTerms,
    } = body;

    const name = String(fullName ?? "").trim();
    const phoneRaw = String(phone ?? "").trim();
    const emailRaw = String(email ?? "").trim();
    const contentUrl = String(mainContentUrl ?? "").trim();
    const platform = String(mainPlatform ?? "").trim();

    if (!name || !phoneRaw || !emailRaw || !contentUrl || !platform) {
      return NextResponse.json(
        { error: "Please provide your full name, WhatsApp number, email address, main platform and a link to your content." },
        { status: 400 }
      );
    }

    const key = dedupeKeyFor(emailRaw, phoneRaw);
    const leads = await readTable<Lead>("leads");
    const existing = leads.find((l) => l.dedupeKey === key && l.leadSource === "creator_application");
    if (existing) {
      return NextResponse.json(
        { error: "This phone number or email address has already been used for a creator application." },
        { status: 409 }
      );
    }

    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const lead = await upsertLead({
      firstName,
      lastName,
      email: emailRaw,
      phone: phoneRaw,
      phoneCountryCode: "+260",
      leadSource: "creator_application",
      landingPage: "/creators",
      consent: true,
    });
    if (!lead) {
      return NextResponse.json({ error: "Could not save your application." }, { status: 500 });
    }

    await update<Lead>("leads", lead.id, { status: "pending" });

    const submittedAt = nowIso();
    const appMeta = {
      fullName: name,
      email: emailRaw,
      phone: phoneRaw,
      town: String(town ?? ""),
      mainPlatform: platform,
      mainContentUrl: contentUrl,
      contentDuration: String(contentDuration ?? ""),
      canRecordEdit: String(canRecordEdit ?? ""),
      whyYou: String(whyYou ?? ""),
      consent: Boolean(consent),
      acceptTerms: Boolean(acceptTerms),
      submittedAt,
    };

    await addLeadEvent(lead.id, "creator_application", "Creator Program application submitted", appMeta);

    await insert<WzEvent>("events", {
      eventType: "creator_application",
      leadId: lead.id,
      meta: { email: emailRaw, phone: phoneRaw, submittedAt },
      createdAt: submittedAt,
    });

    const confirmResult = await sendCreatorApplicationConfirmation({
      to: emailRaw,
      firstName,
      submittedAt,
    });
    await insert<EmailDelivery>("emailDeliveries", {
      leadId: lead.id,
      toEmail: emailRaw,
      subject: `We received your Wazambi Creator application, ${firstName}`,
      guideName: "Creator Program Application",
      status: confirmResult.ok ? "sent" : "failed",
      errorMessage: confirmResult.ok ? undefined : confirmResult.error,
      createdAt: submittedAt,
    });
    await addLeadEvent(
      lead.id,
      confirmResult.ok ? "email_sent" : "email_failed",
      confirmResult.ok
        ? `Application confirmation email sent to ${emailRaw}`
        : `Confirmation email failed: ${confirmResult.error}`,
      {}
    );

    const adminResult = await sendCreatorApplicationAdminNotification({
      creatorName: name,
      email: emailRaw,
      phone: phoneRaw,
      town: String(town ?? ""),
      platforms: platform,
      submittedAt,
    });
    await addLeadEvent(
      lead.id,
      adminResult.ok ? "admin_notified" : "admin_notify_failed",
      adminResult.ok
        ? "Wazambi administrator notified of new creator application"
        : `Admin notification failed: ${adminResult.error}`,
      {}
    );

    await insert<WzEvent>("events", {
      eventType: "creator_application_admin_notified",
      leadId: lead.id,
      meta: { confirmationEmail: confirmResult.ok ? "sent" : "failed" },
      createdAt: submittedAt,
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      emailSent: confirmResult.ok,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}