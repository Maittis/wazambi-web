import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getPool } from "@/lib/dbPostgres";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const staff = await requireStaff(["owner"]);
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: false, error: "This site is on the local file backend — nothing to repair." }, { status: 400 });
    }
    const pool = getPool;

    const schemaPath = path.join(process.cwd(), "database", "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      return NextResponse.json({ ok: false, error: "schema.sql not found." }, { status: 500 });
    }
    const raw = fs.readFileSync(schemaPath, "utf8");

    const noComments = raw
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    const statements = noComments
      .split(/;\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    const client = await pool();
    let executed = 0;
    for (const stmt of statements) {
      try {
        await client.query(stmt);
        executed += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("already exists")) continue;
        return NextResponse.json(
          { ok: false, error: `Migration failed on statement ${executed + 1}: ${msg}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true, executed, by: staff.fullName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json(
        { error: message === "UNAUTHORIZED" ? "Login required." : "Not permitted." },
        { status: message === "UNAUTHORIZED" ? 401 : 403 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}