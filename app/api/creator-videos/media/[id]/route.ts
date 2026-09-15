import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readTable } from "@/lib/db";
import type { CreatorVideo } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads", "videos");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff(["owner", "admin"]);
    const { id } = await params;
    const videoId = Number(id);
    const videos = await readTable<CreatorVideo>("creatorVideos");
    const video = videos.find((v) => v.id === videoId);

    if (!video?.videoPath) {
      return new NextResponse("Not found", { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, video.videoPath);
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const type =
      path.extname(filePath).toLowerCase() === ".webm" ? "video/webm" : "video/mp4";
    const stat = fs.statSync(filePath);

    return new Response(fileToWebStream(fs.createReadStream(filePath)), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(stat.size),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Forbidden";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return new NextResponse(message === "UNAUTHORIZED" ? "Login required" : "Forbidden", { status: message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return new NextResponse("Not found", { status: 404 });
  }
}

function fileToWebStream(nodeStream: fs.ReadStream): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer | string) => controller.enqueue(new Uint8Array(chunk as Buffer)));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
  });
}