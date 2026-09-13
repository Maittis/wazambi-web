import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { insert, nowIso, readTable } from "@/lib/db";
import type { EmailDelivery, Registration, WzEvent } from "@/lib/db";
import { sendGuideEmail } from "@/lib/email";
import { courses } from "@/lib/content";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      position,
      fleetSize,
      mainChallenge,
      consent,
      courseCode,
      courseUrl,
    } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Please provide your name, email and phone number." }, { status: 400 });
    }

    const course = courses.find((c) => c.code === courseCode);
    if (!course) {
      return NextResponse.json({ error: "Unknown course." }, { status: 400 });
    }

    const lead = await upsertLead({
      firstName,
      lastName,
      email,
      phone,
      phoneCountryCode: "+260",
      company,
      position,
      fleetSize,
      mainChallenge,
      serviceInterest:
        courseCode === "gps_tracking"
          ? "GPS Tracking"
          : courseCode === "fuel_monitoring"
            ? "Fuel Monitoring"
            : "Fleet Management",
      leadSource: "course_registration",
      landingPage: courseUrl,
      consent,
    });
    if (!lead) {
      return NextResponse.json({ error: "Could not create lead." }, { status: 500 });
    }

    const registrations = await readTable<Registration>("registrations");
    const existing = registrations.find((r) => r.leadId === lead.id && r.courseCode === courseCode);
    const registration = existing ?? (await insert<Registration>("registrations", {
      leadId: lead.id,
      courseCode,
      emailStatus: "pending",
      createdAt: nowIso(),
    }));

    const subject =
      courseCode === "gps_tracking"
        ? `${firstName}, your GPS Tracking Guide is ready`
        : courseCode === "fuel_monitoring"
          ? `${firstName}, your Fuel Control Guide is ready`
          : `${firstName}, your Fleet Management Guide is ready`;

    const result = await sendGuideEmail({
      to: email,
      firstName,
      subject,
      guideName: course.guideName,
      guideUrl: `https://wazambigps.com/guides/${course.slug}.pdf`,
      courseCode,
    });

    const delivery = await insert<EmailDelivery>("emailDeliveries", {
      registrationId: registration.id,
      leadId: lead.id,
      toEmail: email,
      subject,
      guideName: course.guideName,
      status: result.ok ? "sent" : "failed",
      errorMessage: result.error,
      createdAt: nowIso(),
    });

    await addLeadEvent(
      lead.id,
      "guide_registered",
      `${course.title} — ${course.guideName} requested`,
      { deliveryId: delivery.id }
    );
    await addLeadEvent(
      lead.id,
      result.ok ? "email_sent" : "email_failed",
      result.ok ? `Guide email sent to ${email}` : `Guide email failed: ${result.error}`,
      {}
    );

    await insert<WzEvent>("events", {
      eventType: "course_registration",
      leadId: lead.id,
      meta: { courseCode, emailOk: result.ok },
      createdAt: nowIso(),
    });

    return NextResponse.json({ ok: true, leadId: lead.id, emailSent: result.ok });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}