import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/jobs - List all jobs with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const remoteType = searchParams.get("remote_type") || "";
    const salaryMin = parseInt(searchParams.get("salary_min") || "0");
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sort") || "recent";

    const offset = (page - 1) * limit;

    // Use parameterized queries for safety
    const searchPattern = search ? `%${search}%` : "%";
    const locationPattern = location ? `%${location}%` : "%";

    // Build query based on filters
    let jobs;
    let countResult;

    if (featured) {
      // Featured jobs query
      if (remoteType) {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remoteType}
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
            AND remote_type = ${remoteType}
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
          ORDER BY posted_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      }
    } else {
      // Regular jobs query
      if (remoteType) {
        countResult = await sql`
          SELECT COUNT(*) as total FROM jobs
          WHERE status = 'active'
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remoteType}
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
        `;

        // Different sort orders
        if (sortBy === "salary-high") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remoteType}
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else if (sortBy === "salary-low") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remoteType}
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
              AND remote_type = ${remoteType}
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
            AND (salary_min IS NULL OR salary_min >= ${salaryMin})
        `;

        // Different sort orders
        if (sortBy === "salary-high") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else if (sortBy === "salary-low") {
          jobs = await sql`
            SELECT id, title, company_name, company_logo_url, location, remote_type,
                   salary_min, salary_max, salary_currency, description, apply_url,
                   is_featured, featured_until, posted_at, source
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
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
              AND (salary_min IS NULL OR salary_min >= ${salaryMin})
            ORDER BY is_featured DESC, posted_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        }
      }
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
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: String(error) },
      { status: 500 }
    );
  }
}
