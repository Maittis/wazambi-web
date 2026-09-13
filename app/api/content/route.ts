import { NextRequest, NextResponse } from "next/server";
import { requireStaff, canManageContent } from "@/lib/auth";
import { getSettings, setSetting } from "@/lib/db";
import { stats as defaultStats, faqs as defaultFaqs } from "@/lib/content";

export async function GET() {
  const settings = await getSettings();
  const stored = (settings.content as Record<string, unknown> | undefined) ?? {};
  return NextResponse.json({
    announcement: stored.announcement ?? null,
    stats: stored.stats ?? defaultStats,
    faqs: stored.faqs ?? defaultFaqs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const staff = await requireStaff();
    if (!canManageContent(staff)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    const body = await req.json();
    const settings = await getSettings();
    const current = (settings.content as Record<string, unknown> | undefined) ?? {};
    const merged: Record<string, unknown> = { ...current, ...body };
    if (!merged.announcement && !body.announcement) {
      delete merged.announcement;
    }
    await setSetting("content", merged);
    return NextResponse.json({ ok: true, content: merged });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return NextResponse.json(
      { error: msg === "UNAUTHORIZED" ? "Please log in." : "Forbidden." },
      { status: msg === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}