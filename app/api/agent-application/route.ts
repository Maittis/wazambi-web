import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { dedupeKeyFor, insert, nowIso, readTable, update } from "@/lib/db";
import type { EmailDelivery, Lead, WzEvent } from "@/lib/db";
import {
  sendAgentApplicationAdminNotification,
  sendAgentApplicationConfirmation,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      town,
      over18,
      hasSmartphone,
      salesExperience,
      vehicleConnections,
      experience,
      methods,
      weeklyApproach,
      firstFive,
      whyYou,
      attend,
      travel,
      understandCommission,
      accept,
    } = body;

    const name = String(fullName ?? "").trim();
    const phoneRaw = String(phone ?? "").trim();
    const emailRaw = String(email ?? "").trim();

    if (!name || !phoneRaw || !emailRaw) {
      return NextResponse.json(
        { error: "Please provide your full name, WhatsApp number and email address." },
        { status: 400 }
      );
    }

    const key = dedupeKeyFor(emailRaw, phoneRaw);
    const leads = await readTable<Lead>("leads");
    const existing = leads.find((l) => l.dedupeKey === key && l.leadSource === "agent_application");
    if (existing) {
      return NextResponse.json(
        { error: "This phone number or email address has already been used for an agent application." },
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
      leadSource: "agent_application",
      landingPage: "/agents",
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
      over18: String(over18 ?? ""),
      hasSmartphone: String(hasSmartphone ?? ""),
      salesExperience: String(salesExperience ?? ""),
      vehicleConnections: String(vehicleConnections ?? ""),
      experience: String(experience ?? ""),
      methods: Array.isArray(methods) ? methods : [],
      weeklyApproach: String(weeklyApproach ?? ""),
      firstFive: String(firstFive ?? ""),
      whyYou: String(whyYou ?? ""),
      attend: String(attend ?? ""),
      travel: String(travel ?? ""),
      understandCommission: String(understandCommission ?? ""),
      accept: Boolean(accept),
      submittedAt,
    };

    await addLeadEvent(lead.id, "agent_application", "Agent Program application submitted", appMeta);

    await insert<WzEvent>("events", {
      eventType: "agent_application",
      leadId: lead.id,
      meta: { email: emailRaw, phone: phoneRaw, submittedAt },
      createdAt: submittedAt,
    });

    const confirmResult = await sendAgentApplicationConfirmation({
      to: emailRaw,
      firstName,
      submittedAt,
    });
    await insert<EmailDelivery>("emailDeliveries", {
      leadId: lead.id,
      toEmail: emailRaw,
      subject: `We received your Wazambi GPS Agent application, ${firstName}`,
      guideName: "Agent Program Application",
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

    const adminResult = await sendAgentApplicationAdminNotification({
      applicantName: name,
      email: emailRaw,
      phone: phoneRaw,
      town: String(town ?? ""),
      submittedAt,
    });
    await addLeadEvent(
      lead.id,
      adminResult.ok ? "admin_notified" : "admin_notify_failed",
      adminResult.ok
        ? "Wazambi administrator notified of new application"
        : `Admin notification failed: ${adminResult.error}`,
      {}
    );

    await insert<WzEvent>("events", {
      eventType: "agent_application_admin_notified",
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