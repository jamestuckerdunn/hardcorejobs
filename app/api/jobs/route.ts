import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";
import { PAGINATION } from "@/lib/constants";

const JOB_SELECT_COLUMNS = `
  id, title, company_name, company_logo_url, location, remote_type,
  salary_min, salary_max, salary_currency, description, apply_url,
  is_featured, featured_until, posted_at, source
`;

type SortOption = "recent" | "salary-high" | "salary-low" | "featured";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT))));
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const remoteType = searchParams.get("remote_type") || "";
    const salaryMin = searchParams.get("salary_min") || "";
    const featured = searchParams.get("featured") === "true";
    const sortBy = (searchParams.get("sort") || "recent") as SortOption;

    const offset = (page - 1) * limit;
    const searchPattern = search ? `%${search}%` : null;
    const locationPattern = location ? `%${location}%` : null;
    const minSalary = salaryMin ? parseInt(salaryMin) : null;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM jobs
      WHERE status = 'active'
        AND (${searchPattern}::text IS NULL OR (
          title ILIKE ${searchPattern} OR
          company_name ILIKE ${searchPattern} OR
          description ILIKE ${searchPattern}
        ))
        AND (${locationPattern}::text IS NULL OR location ILIKE ${locationPattern})
        AND (${remoteType}::text = '' OR remote_type = ${remoteType})
        AND (${minSalary}::int IS NULL OR salary_min >= ${minSalary})
        AND (${featured}::boolean = false OR (is_featured = true AND (featured_until IS NULL OR featured_until > NOW())))
    `;

    // Get jobs with dynamic sort order
    // Note: Using conditional queries since sql template literals don't support dynamic ORDER BY
    let jobs;
    if (sortBy === "salary-high") {
      jobs = await sql`
        SELECT ${sql.unsafe(JOB_SELECT_COLUMNS)}
        FROM jobs
        WHERE status = 'active'
          AND (${searchPattern}::text IS NULL OR (
            title ILIKE ${searchPattern} OR
            company_name ILIKE ${searchPattern} OR
            description ILIKE ${searchPattern}
          ))
          AND (${locationPattern}::text IS NULL OR location ILIKE ${locationPattern})
          AND (${remoteType}::text = '' OR remote_type = ${remoteType})
          AND (${minSalary}::int IS NULL OR salary_min >= ${minSalary})
          AND (${featured}::boolean = false OR (is_featured = true AND (featured_until IS NULL OR featured_until > NOW())))
        ORDER BY salary_max DESC NULLS LAST
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else if (sortBy === "salary-low") {
      jobs = await sql`
        SELECT ${sql.unsafe(JOB_SELECT_COLUMNS)}
        FROM jobs
        WHERE status = 'active'
          AND (${searchPattern}::text IS NULL OR (
            title ILIKE ${searchPattern} OR
            company_name ILIKE ${searchPattern} OR
            description ILIKE ${searchPattern}
          ))
          AND (${locationPattern}::text IS NULL OR location ILIKE ${locationPattern})
          AND (${remoteType}::text = '' OR remote_type = ${remoteType})
          AND (${minSalary}::int IS NULL OR salary_min >= ${minSalary})
          AND (${featured}::boolean = false OR (is_featured = true AND (featured_until IS NULL OR featured_until > NOW())))
        ORDER BY salary_min ASC NULLS LAST
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else if (sortBy === "featured") {
      jobs = await sql`
        SELECT ${sql.unsafe(JOB_SELECT_COLUMNS)}
        FROM jobs
        WHERE status = 'active'
          AND (${searchPattern}::text IS NULL OR (
            title ILIKE ${searchPattern} OR
            company_name ILIKE ${searchPattern} OR
            description ILIKE ${searchPattern}
          ))
          AND (${locationPattern}::text IS NULL OR location ILIKE ${locationPattern})
          AND (${remoteType}::text = '' OR remote_type = ${remoteType})
          AND (${minSalary}::int IS NULL OR salary_min >= ${minSalary})
          AND (${featured}::boolean = false OR (is_featured = true AND (featured_until IS NULL OR featured_until > NOW())))
        ORDER BY is_featured DESC, posted_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      jobs = await sql`
        SELECT ${sql.unsafe(JOB_SELECT_COLUMNS)}
        FROM jobs
        WHERE status = 'active'
          AND (${searchPattern}::text IS NULL OR (
            title ILIKE ${searchPattern} OR
            company_name ILIKE ${searchPattern} OR
            description ILIKE ${searchPattern}
          ))
          AND (${locationPattern}::text IS NULL OR location ILIKE ${locationPattern})
          AND (${remoteType}::text = '' OR remote_type = ${remoteType})
          AND (${minSalary}::int IS NULL OR salary_min >= ${minSalary})
          AND (${featured}::boolean = false OR (is_featured = true AND (featured_until IS NULL OR featured_until > NOW())))
        ORDER BY posted_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

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
    return NextResponse.json(
      createApiError("Failed to fetch jobs", error, { route: "/api/jobs" }),
      { status: 500 }
    );
  }
}
