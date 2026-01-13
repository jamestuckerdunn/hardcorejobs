import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";
import { sanitizeUUID, sanitizeString, sanitizeUrl } from "@/lib/validation";
import { INPUT_LIMITS } from "@/lib/constants";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await sql`
      SELECT
        a.*,
        j.title as job_title,
        j.company_name,
        j.company_logo_url,
        j.location,
        j.remote_type,
        j.salary_min,
        j.salary_max
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ${userId}
      ORDER BY a.applied_at DESC
    `;

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to fetch applications", error, { route: "/api/user/applications" }),
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

    // Validate inputs
    const jobId = sanitizeUUID(body.jobId);
    const coverLetter = sanitizeString(body.coverLetter).slice(0, INPUT_LIMITS.COVER_LETTER) || null;
    const resumeUrl = sanitizeUrl(body.resumeUrl);

    if (!jobId) {
      return NextResponse.json(
        { error: "Valid job ID is required" },
        { status: 400 }
      );
    }

    const existingApplications = await sql`
      SELECT id FROM applications
      WHERE job_id = ${jobId} AND user_id = ${userId}
    `;

    if (existingApplications[0]) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    const jobs = await sql`
      SELECT id, status FROM jobs WHERE id = ${jobId}
    `;

    const job = jobs[0];
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "This job is no longer accepting applications" },
        { status: 400 }
      );
    }

    const results = await sql`
      INSERT INTO applications (job_id, user_id, cover_letter, resume_url, status)
      VALUES (${jobId}, ${userId}, ${coverLetter}, ${resumeUrl}, 'pending')
      RETURNING *
    `;

    return NextResponse.json({ application: results[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to submit application", error, { route: "/api/user/applications" }),
      { status: 500 }
    );
  }
}
