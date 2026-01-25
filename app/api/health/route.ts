import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: {
      status: "up" | "down";
      latency?: number;
      error?: string;
    };
  };
  version: string;
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  let dbStatus: HealthStatus["services"]["database"] = { status: "down" };

  try {
    const dbStart = Date.now();
    await sql`SELECT 1`;
    dbStatus = {
      status: "up",
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    dbStatus = {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  const isHealthy = dbStatus.status === "up";
  const response: HealthStatus = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
  };

  return NextResponse.json(response, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
