import { NextRequest, NextResponse } from "next/server";
import { addLeadEvent } from "@/lib/leads";
import { nowIso, readTable, update } from "@/lib/db";
import type { CreatorVideo } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { insert } from "@/lib/db";
import type { WzEvent } from "@/lib/db";

const statuses = ["under_review", "approved", "changes_requested", "rejected"];

export async function POST(req: NextRequest) {
  try {
    const staff = await requireStaff(["owner", "admin"]);
    const { id, status, feedback, finalPostUrl } = await req.json();
    const videoId = Number(id);
    const next = String(status ?? "");

    if (!videoId) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }
    if (!statuses.includes(next)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    if ((next === "changes_requested" || next === "rejected") && !String(feedback ?? "").trim()) {
      return NextResponse.json({ error: "Feedback is required when requesting changes or rejecting." }, { status: 400 });
    }

    const videos = await readTable<CreatorVideo>("creatorVideos");
    const video = videos.find((v) => v.id === videoId);
    if (!video) {
      return NextResponse.json({ error: "Video submission not found." }, { status: 404 });
    }

    const at = nowIso();
    const patch: Partial<CreatorVideo> = { status: next, feedback: feedback ? String(feedback).trim() : video.feedback };

    if (next === "under_review" && !video.underReviewAt) patch.underReviewAt = at;
    if (next === "approved" || next === "rejected") {
      patch.decidedAt = at;
      patch.underReviewAt = video.underReviewAt || at;
    }
    if (finalPostUrl !== undefined) {
      patch.finalPostUrl = String(finalPostUrl).trim() || undefined;
      if (patch.finalPostUrl && !video.decidedAt) patch.decidedAt = at;
    }

    await update<CreatorVideo>("creatorVideos", video.id, patch);

    await addLeadEvent(
      video.leadId,
      `creator_video_${next}`,
      `${staff.fullName} marked video "${video.videoTitle}" as ${next.replace(/_/g, " ")}`,
      { videoId: video.id, feedback: patch.feedback || undefined, finalPostUrl: patch.finalPostUrl || undefined }
    );
    await insert<WzEvent>("events", {
      eventType: `creator_video_${next}`,
      leadId: video.leadId,
      meta: { videoId: video.id, staffId: staff.id, status: next },
      createdAt: at,
    });

    return NextResponse.json({ ok: true, status: next });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: message === "UNAUTHORIZED" ? "Login required." : "Not permitted." }, { status: message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}