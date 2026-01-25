import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";
import { syncJoobleJobs } from "@/lib/aggregators/jooble";

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
        { error: "Unauthorized - Sync requires CRON_SECRET in production" },
        { status: 401 }
      );
    }

    // In development, still check secret if configured
    if (!isProduction && secretConfigured && !secretValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for Jooble API key
    if (!process.env.JOOBLE_API_KEY) {
      return NextResponse.json(
        { error: "JOOBLE_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    // Run the sync
    const result = await syncJoobleJobs();

    return NextResponse.json({
      success: result.errors.length === 0,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      createApiError("Jooble sync failed", error, {
        route: "/api/aggregators/jooble/sync",
      }),
      { status: 500 }
    );
  }
}
