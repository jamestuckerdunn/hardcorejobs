import { sql, isDatabaseAvailable } from "@/lib/db";
import { NextResponse } from "next/server";
import { jobsQuerySchema, parseQuery, formatZodError } from "@/lib/validations";

interface JobRow {
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
  apply_url: string;
  is_featured: boolean;
  featured_until?: string;
  posted_at: string;
  source: string;
  total_count: string;
}

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
    const minSalary = salary_min || 0;

    // Use a single query with COUNT(*) OVER() window function to get total in same query
    // This eliminates the need for separate count queries
    let rows: JobRow[];

    if (featured) {
      // Featured jobs - always sorted by posted_at DESC
      if (remote_type) {
        rows = await sql`
          SELECT
            id, title, company_name, company_logo_url, location, remote_type,
            salary_min, salary_max, salary_currency, description, apply_url,
            is_featured, featured_until, posted_at, source,
            COUNT(*) OVER() as total_count
          FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND remote_type = ${remote_type}
            AND (salary_min IS NULL OR salary_min >= ${minSalary})
          ORDER BY posted_at DESC
          LIMIT ${limit} OFFSET ${offset}
        ` as unknown as JobRow[];
      } else {
        rows = await sql`
          SELECT
            id, title, company_name, company_logo_url, location, remote_type,
            salary_min, salary_max, salary_currency, description, apply_url,
            is_featured, featured_until, posted_at, source,
            COUNT(*) OVER() as total_count
          FROM jobs
          WHERE status = 'active'
            AND is_featured = true
            AND (featured_until IS NULL OR featured_until > NOW())
            AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
            AND location ILIKE ${locationPattern}
            AND (salary_min IS NULL OR salary_min >= ${minSalary})
          ORDER BY posted_at DESC
          LIMIT ${limit} OFFSET ${offset}
        ` as unknown as JobRow[];
      }
    } else {
      // Regular jobs - sort by specified order
      if (remote_type) {
        // With remote_type filter
        if (sort === "salary-high") {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        } else if (sort === "salary-low") {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY salary_min ASC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        } else {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND remote_type = ${remote_type}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY is_featured DESC, posted_at DESC
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        }
      } else {
        // Without remote_type filter
        if (sort === "salary-high") {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY salary_max DESC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        } else if (sort === "salary-low") {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY salary_min ASC NULLS LAST
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        } else {
          rows = await sql`
            SELECT
              id, title, company_name, company_logo_url, location, remote_type,
              salary_min, salary_max, salary_currency, description, apply_url,
              is_featured, featured_until, posted_at, source,
              COUNT(*) OVER() as total_count
            FROM jobs
            WHERE status = 'active'
              AND (title ILIKE ${searchPattern} OR company_name ILIKE ${searchPattern})
              AND location ILIKE ${locationPattern}
              AND (salary_min IS NULL OR salary_min >= ${minSalary})
            ORDER BY is_featured DESC, posted_at DESC
            LIMIT ${limit} OFFSET ${offset}
          ` as unknown as JobRow[];
        }
      }
    }

    // Extract total count from first row (same for all rows due to window function)
    const total = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
    const totalPages = Math.ceil(total / limit);

    // Remove total_count from response (internal field)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const jobs = rows.map(({ total_count, ...job }) => job);

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

