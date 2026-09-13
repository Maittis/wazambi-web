import { NextRequest, NextResponse } from "next/server";
import { insert, nowIso } from "@/lib/db";
import type { WzEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { eventType, path, meta = {} } = await req.json();
    if (!eventType) {
      return NextResponse.json({ error: "eventType required" }, { status: 400 });
    }
    const record = await insert<WzEvent>("events", {
      eventType,
      meta: { path, ...meta },
      createdAt: nowIso(),
    });
    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}