import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";

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

    const job = jobs[0];
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Safely extract title and company name with proper type checking
    const title = typeof job.title === "string" ? job.title : "";
    const companyName = typeof job.company_name === "string" ? job.company_name : "";
    const titleFirstWord = title.split(" ")[0] || "";

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
          company_name = ${companyName}
          OR title ILIKE '%' || ${titleFirstWord} || '%'
        )
      ORDER BY is_featured DESC, posted_at DESC
      LIMIT 5
    `;

    return NextResponse.json({
      job,
      similarJobs,
    });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to fetch job", error, { route: "/api/jobs/[id]" }),
      { status: 500 }
    );
  }
}
