import { NextRequest, NextResponse } from "next/server";
import { readTable } from "@/lib/db";
import type { Lead } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { creatorCode, phone } = await req.json();
    const code = String(creatorCode ?? "").trim().toUpperCase();
    const phoneRaw = String(phone ?? "").trim();

    if (!code || !phoneRaw) {
      return NextResponse.json({ ok: false, error: "Enter your Creator Code and registered phone number." }, { status: 400 });
    }

    const leads = await readTable<Lead>("leads");
    const lead = leads.find(
      (l) =>
        l.leadSource === "creator_application" &&
        l.status === "approved" &&
        String(l.agentCode ?? "").trim().toUpperCase() === code &&
        l.phone === phoneRaw
    );

    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "No approved creator matches these details. This form is only for approved creators." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      name: `${lead.firstName} ${lead.lastName}`.trim(),
      email: lead.email ?? "",
      creatorCode: code,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}