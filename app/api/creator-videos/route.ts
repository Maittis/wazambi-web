import { NextRequest, NextResponse } from "next/server";
import { addLeadEvent } from "@/lib/leads";
import { insert, nowIso, readTable } from "@/lib/db";
import type { CreatorVideo, Lead } from "@/lib/db";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads", "videos");

function safeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "").replace(/\.{2,}/g, ".").slice(0, 80);
  return base || "video.mp4";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const creatorCode = String(form.get("creatorCode") ?? "").trim().toUpperCase();
    const phone = String(form.get("phone") ?? "").trim();
    const platform = String(form.get("platform") ?? "").trim();
    const videoTitle = String(form.get("videoTitle") ?? "").trim();
    const caption = String(form.get("caption") ?? "").trim();
    const publishedUrl = String(form.get("publishedUrl") ?? "").trim();
    const publishedDate = String(form.get("publishedDate") ?? "").trim();
    const note = String(form.get("note") ?? "").trim();
    const videoLink = String(form.get("videoLink") ?? "").trim();
    const file = form.get("file");

    if (!creatorCode || !phone || !platform || !videoTitle) {
      return NextResponse.json({ ok: false, error: "Creator Code, registered phone number, platform and video title are required." }, { status: 400 });
    }
    if (!videoLink && !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Upload your video or paste a video link." }, { status: 400 });
    }
    const hasFile = file instanceof File && file.size > 0;

    const leads = await readTable<Lead>("leads");
    const lead = leads.find(
      (l) =>
        l.leadSource === "creator_application" &&
        l.status === "approved" &&
        String(l.agentCode ?? "").trim().toUpperCase() === creatorCode &&
        l.phone === phone
    );
    if (!lead) {
      return NextResponse.json({ ok: false, error: "These details do not match an approved creator. This form is only for approved creators." }, { status: 403 });
    }

    let videoPath: string | undefined;
    if (hasFile) {
      const ext = path.extname(safeFileName(file.name)) || ".mp4";
      const stored = `v${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, stored), Buffer.from(await file.arrayBuffer()));
      videoPath = stored;
    }

    const submittedAt = nowIso();
    const record = await insert<CreatorVideo>("creatorVideos", {
      leadId: lead.id,
      creatorCode,
      creatorName: `${lead.firstName} ${lead.lastName}`.trim(),
      phone,
      email: lead.email ?? "",
      platform,
      videoTitle,
      videoUrl: videoLink || undefined,
      videoPath,
      caption: caption || undefined,
      publishedUrl: publishedUrl || undefined,
      publishedDate: publishedDate || undefined,
      note: note || undefined,
      status: "submitted",
      submittedAt,
    });

    await addLeadEvent(
      lead.id,
      "creator_video_submitted",
      `Video submitted by ${record.creatorName}: ${videoTitle}`,
      { videoId: record.id, platform, videoLink: videoLink || undefined, videoPath }
    );

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}