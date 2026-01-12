import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await sql`
      SELECT
        sj.*,
        j.title,
        j.company_name,
        j.company_logo_url,
        j.location,
        j.remote_type,
        j.salary_min,
        j.salary_max,
        j.description,
        j.apply_url,
        j.is_featured,
        j.posted_at,
        j.source
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ${userId}
      ORDER BY sj.saved_at DESC
    `;

    return NextResponse.json({ savedJobs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch saved jobs", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const existingSaved = await sql`
      SELECT id FROM saved_jobs
      WHERE job_id = ${jobId} AND user_id = ${userId}
    `;

    if (existingSaved[0]) {
      await sql`
        DELETE FROM saved_jobs
        WHERE job_id = ${jobId} AND user_id = ${userId}
      `;
      return NextResponse.json({ saved: false, message: "Job unsaved" });
    }

    await sql`
      INSERT INTO saved_jobs (job_id, user_id)
      VALUES (${jobId}, ${userId})
    `;

    return NextResponse.json({ saved: true, message: "Job saved" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save job", details: String(error) },
      { status: 500 }
    );
  }
}
