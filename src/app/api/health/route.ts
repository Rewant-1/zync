import { NextResponse } from "next/server";

export async function GET() {
  const startedAt = Date.now();

  // Keep this endpoint public + cheap.
  // If DB is not configured, we still return an OK (with db: "skipped").
  const shouldCheckDb =
    process.env.HEALTHCHECK_DB === "1" && !!process.env.DATABASE_URL;

  if (!shouldCheckDb) {
    return NextResponse.json({
      ok: true,
      db: "skipped",
      latencyMs: Date.now() - startedAt,
      ts: new Date().toISOString(),
    });
  }

  try {
    // Minimal DB ping
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      db: "ok",
      latencyMs: Date.now() - startedAt,
      ts: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        db: "error",
        latencyMs: Date.now() - startedAt,
        ts: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
