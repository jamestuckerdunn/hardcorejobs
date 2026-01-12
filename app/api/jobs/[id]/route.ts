import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeHtml } from "@/lib/sanitize";

interface JobRecord {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  location: string;
  remote_type: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description: string;
  requirements?: string;
  apply_url: string;
  is_featured: boolean;
  featured_until?: string;
  posted_at: string;
  source: string;
  company_website?: string;
  company_description?: string;
  company_size?: string;
  industry?: string;
  verified?: boolean;
}

// GET /api/jobs/[id] - Get a single job by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

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
    ` as unknown as JobRecord[];

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = jobs[0];

    // Sanitize HTML in description
    const sanitizedJob = {
      ...job,
      description: sanitizeHtml(job.description),
      requirements: job.requirements ? sanitizeHtml(job.requirements) : undefined,
    };

    // Get similar jobs (same company or similar title)
    const titleFirstWord = job.title.split(' ')[0] || '';
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
          OR title ILIKE ${'%' + titleFirstWord + '%'}
        )
      ORDER BY is_featured DESC, posted_at DESC
      LIMIT 5
    `;

    // Add cache headers
    const response = NextResponse.json({
      job: sanitizedJob,
      similarJobs,
    });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return response;
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
