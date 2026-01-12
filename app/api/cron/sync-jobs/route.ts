import { NextRequest, NextResponse } from "next/server";
import { aggregateJobs } from "@/lib/job-aggregator";

/**
 * Cron endpoint to sync jobs from all sources
 * This is called daily by Vercel Cron Jobs
 *
 * Protected by CRON_SECRET in production
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  // In production, ALWAYS require CRON_SECRET
  if (isProduction) {
    if (!cronSecret) {
      console.error("CRON_SECRET not configured in production");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    console.log("Starting scheduled job sync...");
    const startTime = Date.now();

    const result = await aggregateJobs();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("Job sync completed:", {
      ...result,
      duration: `${duration}s`,
    });

    return NextResponse.json({
      success: true,
      message: "Job sync completed successfully",
      stats: {
        totalFetched: result.totalFetched,
        totalFiltered: result.totalFiltered,
        totalInserted: result.totalInserted,
        totalUpdated: result.totalUpdated,
        totalFailed: result.totalFailed,
        duration: `${duration}s`,
        bySource: result.bySource,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Job sync failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Job sync failed",
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers (with same auth)
export async function POST(request: NextRequest) {
  return GET(request);
}
