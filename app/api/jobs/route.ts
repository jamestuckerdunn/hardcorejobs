import { sql, isDatabaseAvailable } from "@/lib/db";
import { NextResponse } from "next/server";
import { jobsQuerySchema, parseQuery, formatZodError } from "@/lib/validations";

// GET /api/jobs - List all jobs with optional filtering
export async function GET(request: Request) {
  // Check database availability
  if (!isDatabaseAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validation = parseQuery(searchParams, jobsQuerySchema);
    if (validation.error) {
      return NextResponse.json(
        { error: "Invalid parameters", details: formatZodError(validation.error) },
        { status: 400 }
      );
    }

    const { page, limit, search, location, remote_type, salary_min, featured, sort } = validation.data;
    const offset = (page - 1) * limit;

    // Use parameterized queries for safety
    const searchPattern = search ? `%${search}%` : "%";
    const locationPattern = location ? `%${location}%` : "%";

    let jobs;
    let countResult;

    if (featured) {
      // Featured jobs query
      if (remote_type) {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remote_type}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
        `;
        jobs = await sql`
          SELECT id, title, company_name, company_logo_url, location, remote_type,
                 salary_min, salary_max, salary_currency, description, apply_url,
                 is_featured, featured_until, posted_at, source
          FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remote_type}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
          ORDER BY posted_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
        `;
        jobs = await sql`
          SELECT id, title, company_name, company_logo_url, location, remote_type,
                 salary_min, salary_max, salary_currency, description, apply_url,
                 is_featured, featured_until, posted_at, source
          FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
          ORDER BY posted_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      }
    } else {
      // Regular jobs query with different sort options
      if (remote_type) {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remote_type}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
        `;

        if (sort === "salary-high") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else if (sort === "salary-low") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY salary_min ASC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY is_featured DESC, posted_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        }
      } else {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
        `;

        if (sort === "salary-high") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else if (sort === "salary-low") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY salary_min ASC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${salary_min || 0})
            ORDER BY is_featured DESC, posted_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        }
      }
    }

    const total = parseInt(String((countResult[0] as { total?: string })?.total || "0"));
    const totalPages = Math.ceil(total / limit);

    // Add cache headers for CDN
    const response = NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });

    // Cache for 5 minutes
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return response;
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
