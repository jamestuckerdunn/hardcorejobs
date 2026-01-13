import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applicationsResult = await sql`
      SELECT COUNT(*) as count FROM applications WHERE user_id = ${userId}
    `;

    const savedJobsResult = await sql`
      SELECT COUNT(*) as count FROM saved_jobs WHERE user_id = ${userId}
    `;

    const interviewsResult = await sql`
      SELECT COUNT(*) as count FROM applications
      WHERE user_id = ${userId} AND status = 'interviewing'
    `;

    const profileViewsResult = await sql`
      SELECT view_count FROM job_seeker_profiles WHERE clerk_user_id = ${userId}
    `;

    const stats = {
      applications: parseInt(applicationsResult[0]?.count || "0"),
      savedJobs: parseInt(savedJobsResult[0]?.count || "0"),
      interviews: parseInt(interviewsResult[0]?.count || "0"),
      profileViews: parseInt(profileViewsResult[0]?.view_count || "0"),
    };

    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      createApiError("Failed to fetch stats", error, { route: "/api/user/stats" }),
      { status: 500 }
    );
  }
}
