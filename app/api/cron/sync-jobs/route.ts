import { NextRequest, NextResponse } from "next/server";
import { aggregateJobs } from "@/lib/job-aggregator";

/**
 * Cron endpoint to sync jobs from all sources
 * This is called daily by Vercel Cron Jobs (free tier supports daily)
 *
 * To protect this endpoint, we verify the CRON_SECRET header
 * Set CRON_SECRET in your Vercel environment variables
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In production, require CRON_SECRET
  if (process.env.NODE_ENV === "production" && cronSecret) {
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
        totalSaved: result.totalSaved,
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
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
