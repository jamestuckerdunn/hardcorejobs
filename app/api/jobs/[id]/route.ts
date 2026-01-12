import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/jobs/[id] - Get a single job by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jobs = await sql`
      SELECT
        j.*,
        ep.company_website,
        ep.company_description,
        ep.company_size,
        ep.industry,
        ep.verified
      FROM jobs j
      LEFT JOIN employer_profiles ep ON j.employer_id = ep.id
      WHERE j.id = ${id}
    `;

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = jobs[0];

    // Get similar jobs (same company or similar title)
    const similarJobs = await sql`
      SELECT
        id,
        title,
        company_name,
        salary_min,
        salary_max,
        location,
        remote_type
      FROM jobs
      WHERE id != ${id}
        AND status = 'active'
        AND (
          company_name = ${job.company_name}
          OR title ILIKE '%' || ${job.title.split(' ')[0]} || '%'
        )
      ORDER BY is_featured DESC, posted_at DESC
      LIMIT 5
    `;

    return NextResponse.json({
      job,
      similarJobs,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job", details: String(error) },
      { status: 500 }
    );
  }
}
