import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { createApiError } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    // Get secret from Authorization header (not query params to avoid logging)
    const authHeader = request.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "");

    // In production, always require the secret
    const isProduction = process.env.NODE_ENV === "production";
    const secretConfigured = !!process.env.CRON_SECRET;
    const secretValid = secret === process.env.CRON_SECRET;

    if (isProduction && (!secretConfigured || !secretValid)) {
      return NextResponse.json(
        { error: "Unauthorized - Migration requires CRON_SECRET in production" },
        { status: 401 }
      );
    }

    // In development, still check secret if configured
    if (!isProduction && secretConfigured && !secretValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('job_seeker', 'employer', 'admin')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS job_seeker_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        headline TEXT,
        location TEXT,
        willing_to_relocate BOOLEAN DEFAULT true,
        resume_url TEXT,
        resume_text TEXT,
        hardcore_pledge_signed BOOLEAN DEFAULT false,
        hardcore_pledge_date TIMESTAMPTZ,
        phone TEXT,
        linkedin_url TEXT,
        portfolio_url TEXT,
        visibility TEXT DEFAULT 'visible' CHECK (visibility IN ('visible', 'hidden')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS employer_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_name TEXT NOT NULL,
        company_website TEXT,
        company_description TEXT,
        company_logo_url TEXT,
        company_size TEXT,
        industry TEXT,
        verified BOOLEAN DEFAULT false,
        stripe_customer_id TEXT,
        resume_db_subscription_id TEXT,
        resume_db_access_until TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source TEXT NOT NULL,
        source_id TEXT,
        employer_id UUID REFERENCES employer_profiles(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        company_name TEXT NOT NULL,
        company_logo_url TEXT,
        location TEXT NOT NULL,
        remote_type TEXT CHECK (remote_type IN ('onsite', 'remote', 'hybrid')),
        salary_min INTEGER,
        salary_max INTEGER,
        salary_currency TEXT DEFAULT 'USD',
        description TEXT NOT NULL,
        requirements TEXT,
        apply_url TEXT NOT NULL,
        is_featured BOOLEAN DEFAULT false,
        featured_until TIMESTAMPTZ,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'removed')),
        posted_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(source, source_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, job_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
        notes TEXT,
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, job_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS resume_views (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
        job_seeker_id UUID REFERENCES job_seeker_profiles(id) ON DELETE CASCADE,
        viewed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
        stripe_payment_id TEXT UNIQUE,
        stripe_subscription_id TEXT,
        type TEXT NOT NULL CHECK (type IN ('featured_job', 'resume_subscription')),
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'usd',
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS job_alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        keywords TEXT[],
        locations TEXT[],
        min_salary INTEGER,
        remote_only BOOLEAN DEFAULT false,
        frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('instant', 'daily', 'weekly')),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS aggregator_runs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
        jobs_found INTEGER DEFAULT 0,
        jobs_added INTEGER DEFAULT 0,
        jobs_updated INTEGER DEFAULT 0,
        error_message TEXT,
        started_at TIMESTAMPTZ DEFAULT NOW(),
        completed_at TIMESTAMPTZ
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_salary ON jobs(salary_min, salary_max)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(is_featured, featured_until)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_job_seeker_visibility ON job_seeker_profiles(visibility)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`;

    return NextResponse.json({ success: true, message: "Migrations completed" });
  } catch (error) {
    return NextResponse.json(
      createApiError("Migration failed", error, { route: "/api/db/migrate" }),
      { status: 500 }
    );
  }
}
