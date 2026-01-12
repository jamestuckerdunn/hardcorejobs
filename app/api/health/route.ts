import { NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { hasStripe } from "@/lib/stripe";
import { hasAuth } from "@/lib/env";

/**
 * GET /api/health
 * Health check endpoint for monitoring and load balancers.
 * Returns the status of all system dependencies.
 */
export async function GET() {
  const health = {
    status: "ok" as "ok" | "degraded" | "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: isDatabaseAvailable(),
      auth: hasAuth(),
      payments: hasStripe(),
    },
  };

  // Determine overall health status
  if (!health.services.database) {
    health.status = "unhealthy";
  } else if (!health.services.auth || !health.services.payments) {
    health.status = "degraded";
  }

  const statusCode = health.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
