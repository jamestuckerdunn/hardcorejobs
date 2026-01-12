import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { API } from "@/lib/constants";

/**
 * GET /api/jobs/featured
 * Returns featured job listings for homepage display.
 */
export async function GET() {
  try {
    const jobs = await sql`
      SELECT
        id,
        title,
        company_name,
        company_logo_url,
        location,
        remote_type,
        salary_min,
        salary_max,
        salary_currency,
        description,
        apply_url,
        is_featured,
        posted_at,
        source
      FROM jobs
      WHERE status = 'active'
        AND is_featured = true
        AND (featured_until IS NULL OR featured_until > NOW())
      ORDER BY posted_at DESC
      LIMIT ${API.MAX_FEATURED_JOBS}
    `;

    return NextResponse.json({ jobs });
  } catch (error) {
    logger.error("Failed to fetch featured jobs", error);
    return NextResponse.json(
      { error: "Failed to fetch featured jobs" },
      { status: 500 }
    );
  }
}
