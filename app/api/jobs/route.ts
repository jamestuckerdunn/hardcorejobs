import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/jobs - List all jobs with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const remoteType = searchParams.get("remote_type") || "";
    const salaryMin = searchParams.get("salary_min") || "";
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sort") || "recent";

    const offset = (page - 1) * limit;

    // Build the query dynamically based on filters
    let whereConditions: string[] = ["status = 'active'"];

    if (search) {
      whereConditions.push(`(title ILIKE '%${search}%' OR company_name ILIKE '%${search}%' OR description ILIKE '%${search}%')`);
    }

    if (location) {
      whereConditions.push(`location ILIKE '%${location}%'`);
    }

    if (remoteType) {
      whereConditions.push(`remote_type = '${remoteType}'`);
    }

    if (salaryMin) {
      whereConditions.push(`salary_min >= ${parseInt(salaryMin)}`);
    }

    if (featured) {
      whereConditions.push(`is_featured = true AND (featured_until IS NULL OR featured_until > NOW())`);
    }

    // Determine sort order
    let orderBy = "posted_at DESC";
    switch (sortBy) {
      case "salary-high":
        orderBy = "salary_max DESC NULLS LAST";
        break;
      case "salary-low":
        orderBy = "salary_min ASC NULLS LAST";
        break;
      case "featured":
        orderBy = "is_featured DESC, posted_at DESC";
        break;
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM jobs
      WHERE ${sql.raw(whereClause)}
    `;

    // Get paginated results
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
        featured_until,
        posted_at,
        source
      FROM jobs
      WHERE ${sql.raw(whereClause)}
      ORDER BY ${sql.raw(orderBy)}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const total = parseInt(countResult[0]?.total || "0");
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: String(error) },
      { status: 500 }
    );
  }
}
