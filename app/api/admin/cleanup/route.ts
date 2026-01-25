import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError, logger } from "@/lib/logger";

/**
 * POST /api/admin/cleanup
 * Removes all sample/test/demo jobs from the database
 * Requires CRON_SECRET authorization in production
 */
export async function POST(request: Request) {
  try {
    // Get secret from Authorization header
    const authHeader = request.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "");

    // In production, always require the secret
    const isProduction = process.env.NODE_ENV === "production";
    const secretConfigured = !!process.env.CRON_SECRET;
    const secretValid = secret === process.env.CRON_SECRET;

    if (isProduction && (!secretConfigured || !secretValid)) {
      return NextResponse.json(
        { error: "Unauthorized - Cleanup requires CRON_SECRET in production" },
        { status: 401 }
      );
    }

    // In development, still check secret if configured
    if (!isProduction && secretConfigured && !secretValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sources to clean up (sample, test, demo, seed, manual entries)
    const sourcesToRemove = ["sample", "test", "demo", "seed", "manual"];

    logger.info("Starting cleanup of sample jobs", {
      sourcesToRemove,
    });

    // Delete jobs from non-Jooble sources
    // This removes all sample/test jobs while keeping real aggregator data
    const result = await sql`
      DELETE FROM jobs
      WHERE source = ANY(${sourcesToRemove})
      RETURNING id, source, title
    `;

    const deletedCount = result.length;
    const deletedJobs = result as Array<{ id: string; source: string; title: string }>;

    logger.info("Cleanup completed", {
      deletedCount,
      sources: [...new Set(deletedJobs.map((r) => r.source))],
    });

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      sources: sourcesToRemove,
      message: `Deleted ${deletedCount} sample/test jobs`,
    });
  } catch (error) {
    return NextResponse.json(
      createApiError("Cleanup failed", error, { route: "/api/admin/cleanup" }),
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/cleanup
 * Preview which jobs would be deleted without actually deleting
 */
export async function GET(request: Request) {
  try {
    // Get secret from Authorization header
    const authHeader = request.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "");

    // In production, always require the secret
    const isProduction = process.env.NODE_ENV === "production";
    const secretConfigured = !!process.env.CRON_SECRET;
    const secretValid = secret === process.env.CRON_SECRET;

    if (isProduction && (!secretConfigured || !secretValid)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isProduction && secretConfigured && !secretValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sourcesToRemove = ["sample", "test", "demo", "seed", "manual"];

    // Count jobs that would be deleted
    const countResult = await sql`
      SELECT source, COUNT(*) as count
      FROM jobs
      WHERE source = ANY(${sourcesToRemove})
      GROUP BY source
    `;

    const countRows = countResult as Array<{ source: string; count: string }>;
    const totalToDelete = countRows.reduce(
      (sum, r) => sum + parseInt(r.count),
      0
    );

    return NextResponse.json({
      preview: true,
      totalToDelete,
      bySource: countResult,
      sourcesToRemove,
      message: "Use POST to actually delete these jobs",
    });
  } catch (error) {
    return NextResponse.json(
      createApiError("Preview failed", error, { route: "/api/admin/cleanup" }),
      { status: 500 }
    );
  }
}
