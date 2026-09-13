import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET() {
  try {
    await requireStaff();
    const db = await readDb();

    const leads = db.leads;
    const today = new Date().toISOString().slice(0, 10);

    const overview = {
      totalLeads: leads.length,
      newToday: leads.filter((l) => l.createdAt.slice(0, 10) === today).length,
      serious: leads.filter((l) =>
        ["serious", "follow_up", "assessment_booked", "demonstration_booked", "quotation_requested", "quotation_sent", "deposit_paid"].includes(l.status)
      ).length,
      fleetAssessments: db.assessments.filter((a) => a.assessmentType === "fleet").length,
      fuelAssessments: db.assessments.filter((a) => a.assessmentType === "fuel").length,
      courseRegistrations: db.registrations.length,
      gpsGuideRequests: db.registrations.filter((r) => r.courseCode === "gps_tracking").length,
      fuelGuideRequests: db.registrations.filter((r) => r.courseCode === "fuel_monitoring").length,
      fleetGuideRequests: db.registrations.filter((r) => r.courseCode === "fleet_management").length,
      quotationRequests: db.quotationRequests.length,
      contactMessages: db.contactMessages.length,
      customersWon: leads.filter((l) => l.status === "sold").length,
      followUpsDue: db.followUps.filter((f) => f.status === "pending").length,
      emailsSent: db.emailDeliveries.filter((e) => e.status === "sent").length,
      emailsFailed: db.emailDeliveries.filter((e) => e.status === "failed").length,
    };

    const leadsBySource = count(leads, (l) => l.leadSource ?? "direct");
    const leadsByService = countNullable(leads, (l) => l.serviceInterest);
    const leadsByFleetSize = countNullable(leads, (l) => l.fleetSize);
    const leadsBySalesperson = db.staff
      .filter((s) => ["sales_manager", "salesperson"].includes(s.role))
      .map((s) => ({
        name: s.fullName,
        count: leads.filter((l) => l.assignedSalespersonId === s.id).length,
      }));

    const leadsByDate: { date: string; count: number }[] = [];
    const byDate = new Map<string, number>();
    for (const l of leads) {
      const d = l.createdAt.slice(0, 10);
      byDate.set(d, (byDate.get(d) ?? 0) + 1);
    }
    for (const [date, count] of [...byDate.entries()].sort()) {
      leadsByDate.push({ date, count });
    }

    const converted = leads.filter((l) => l.status === "sold").length;
    const conversionRate = leads.length ? Math.round((converted / leads.length) * 1000) / 10 : 0;

    return NextResponse.json({
      ok: true,
      overview,
      charts: { leadsBySource, leadsByService, leadsByFleetSize, leadsBySalesperson, leadsByDate, conversionRate },
    });
  } catch (err) {
    console.error("[overview]", err);
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Forbidden." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

function count(items: unknown[], keyFn: (i: any) => string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = keyFn(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function countNullable(items: unknown[], keyFn: (i: any) => string | undefined): { label: string; count: number }[] {
  return count(items, (i) => keyFn(i) ?? "Not specified");
}