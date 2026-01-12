import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

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
      LIMIT 10
    `;

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured jobs", details: String(error) },
      { status: 500 }
    );
  }
}
