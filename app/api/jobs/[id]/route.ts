import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

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

    const titleFirstWord = (job.title as string).split(" ")[0] ?? "";
    const companyName = job.company_name as string;

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
      { error: "Failed to fetch job", details: String(error) },
      { status: 500 }
    );
  }
}
