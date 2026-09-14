import { NextRequest, NextResponse } from "next/server";
import { upsertLead, addLeadEvent } from "@/lib/leads";
import { insert, nowIso } from "@/lib/db";
import type { Assessment, WzEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      fleetSize,
      serviceInterest,
      serviceInterests,
      needsHelpChoosing,
      mainChallenge,
      mainChallenges,
      stillExploring,
      notes,
      consent,
      assessmentType,
    } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ error: "Please provide your first name, last name and phone number." }, { status: 400 });
    }

    const selectedServices = Array.isArray(serviceInterests) ? serviceInterests.filter(Boolean) : [];
    const needsHelp = needsHelpChoosing ?? (!selectedServices.length && (serviceInterest ?? "").trim() === "");
    const selectedChallenges = Array.isArray(mainChallenges) ? mainChallenges.filter(Boolean) : [];
    const exploring = stillExploring ?? (!selectedChallenges.length && (mainChallenge ?? "").trim() === "");

    const lead = await upsertLead({
      firstName,
      lastName,
      email,
      phone,
      phoneCountryCode: "+260",
      company,
      fleetSize,
      mainChallenge: typeof mainChallenge === "string" ? mainChallenge : undefined,
      mainChallenges: selectedChallenges,
      stillExploring: exploring,
      serviceInterest: typeof serviceInterest === "string" ? serviceInterest : undefined,
      serviceInterests: selectedServices,
      needsHelpChoosing: needsHelp,
      leadSource: "website_assessment",
      landingPage: assessmentType === "fuel" ? "/fuel-assessment" : "/fleet-assessment",
      consent,
    });
    if (!lead) {
      return NextResponse.json({ error: "Could not create lead." }, { status: 500 });
    }

    const assessment = await insert<Assessment>("assessments", {
      leadId: lead.id,
      assessmentType,
      fleetSize,
      mainChallenge: typeof mainChallenge === "string" ? mainChallenge : undefined,
      mainChallenges: selectedChallenges,
      stillExploring: exploring,
      serviceInterest: typeof serviceInterest === "string" ? serviceInterest : undefined,
      serviceInterests: selectedServices,
      needsHelpChoosing: needsHelp,
      details: { notes: notes ?? "", company: company ?? "" },
      submissionPath: assessmentType === "fuel" ? "/fuel-assessment" : "/fleet-assessment",
      createdAt: nowIso(),
    });

    await addLeadEvent(
      lead.id,
      "assessment_submitted",
      `${assessmentType === "fuel" ? "Fuel" : "Fleet"} assessment submitted`,
      { assessmentId: assessment.id }
    );

    await insert<WzEvent>("events", {
      eventType: "assessment_submitted",
      leadId: lead.id,
      meta: { assessmentType, serviceInterest, serviceInterests: selectedServices, needsHelpChoosing: needsHelp, mainChallenge, mainChallenges: selectedChallenges, stillExploring: exploring, fleetSize },
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