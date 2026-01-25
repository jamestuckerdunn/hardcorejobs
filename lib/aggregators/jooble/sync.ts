/**
 * Jooble job sync service
 * Orchestrates fetching, analyzing, filtering, and storing jobs from Jooble
 */

import { sql } from "@/lib/db";
import { logger } from "@/lib/logger";
import { SALARY } from "@/lib/constants";
import { fetchAllJoobleJobs } from "./client";
import {
  analyzeJobRequirements,
  parseSalary,
  detectRemoteType,
} from "./keyword-analyzer";
import type { JoobleJob, ProcessedJob, SyncResult } from "./types";

/**
 * Create a new aggregator run record
 */
async function createAggregatorRun(): Promise<string> {
  const result = await sql`
    INSERT INTO aggregator_runs (source, status, started_at)
    VALUES ('jooble', 'running', NOW())
    RETURNING id
  `;
  const rows = result as Array<{ id: string }>;
  if (!rows[0]) {
    throw new Error("Failed to create aggregator run record");
  }
  return rows[0].id;
}

/**
 * Update aggregator run with results
 */
async function updateAggregatorRun(
  runId: string,
  status: "completed" | "failed",
  stats: {
    jobsFound: number;
    jobsAdded: number;
    jobsUpdated: number;
    errorMessage?: string;
  }
): Promise<void> {
  await sql`
    UPDATE aggregator_runs
    SET
      status = ${status},
      jobs_found = ${stats.jobsFound},
      jobs_added = ${stats.jobsAdded},
      jobs_updated = ${stats.jobsUpdated},
      error_message = ${stats.errorMessage || null},
      completed_at = NOW()
    WHERE id = ${runId}::uuid
  `;
}

/**
 * Process a raw Jooble job into our database format
 */
function processJob(joobleJob: JoobleJob): ProcessedJob | null {
  // Parse salary
  const { min: salaryMin, max: salaryMax } = parseSalary(joobleJob.salary);

  // Only include jobs with salary >= $100k
  if (salaryMin === null || salaryMin < SALARY.MINIMUM) {
    return null;
  }

  // Analyze requirements
  const analysis = analyzeJobRequirements(
    joobleJob.title,
    joobleJob.snippet, // Jooble provides snippet, not full description
    ""
  );

  // Only include jobs that explicitly meet entry-level criteria
  if (!analysis.meetsEntryCriteria) {
    return null;
  }

  // Detect remote type
  const remoteType = detectRemoteType(
    joobleJob.title,
    joobleJob.location,
    joobleJob.snippet
  );

  return {
    source: "jooble",
    source_id: joobleJob.id,
    title: joobleJob.title,
    company_name: joobleJob.company || "Unknown Company",
    location: joobleJob.location || "United States",
    remote_type: remoteType,
    salary_min: salaryMin,
    salary_max: salaryMax,
    salary_currency: "USD",
    description: joobleJob.snippet || "",
    apply_url: joobleJob.link,
    experience_required: analysis.experienceRequired,
    degree_required: analysis.degreeRequired,
    posted_at: joobleJob.updated ? new Date(joobleJob.updated) : new Date(),
  };
}

/**
 * Upsert a job into the database
 * Returns 'added', 'updated', or 'skipped'
 */
async function upsertJob(job: ProcessedJob): Promise<"added" | "updated" | "skipped"> {
  try {
    // Check if job already exists
    const existing = await sql`
      SELECT id FROM jobs
      WHERE source = ${job.source} AND source_id = ${job.source_id}
    `;

    if (existing.length > 0) {
      // Update existing job
      await sql`
        UPDATE jobs
        SET
          title = ${job.title},
          company_name = ${job.company_name},
          location = ${job.location},
          remote_type = ${job.remote_type},
          salary_min = ${job.salary_min},
          salary_max = ${job.salary_max},
          salary_currency = ${job.salary_currency},
          description = ${job.description},
          apply_url = ${job.apply_url},
          experience_required = ${job.experience_required},
          degree_required = ${job.degree_required},
          updated_at = NOW(),
          status = 'active'
        WHERE source = ${job.source} AND source_id = ${job.source_id}
      `;
      return "updated";
    } else {
      // Insert new job
      await sql`
        INSERT INTO jobs (
          source, source_id, title, company_name, location, remote_type,
          salary_min, salary_max, salary_currency, description, apply_url,
          experience_required, degree_required, posted_at, status
        ) VALUES (
          ${job.source}, ${job.source_id}, ${job.title}, ${job.company_name},
          ${job.location}, ${job.remote_type}, ${job.salary_min}, ${job.salary_max},
          ${job.salary_currency}, ${job.description}, ${job.apply_url},
          ${job.experience_required}, ${job.degree_required}, ${job.posted_at},
          'active'
        )
      `;
      return "added";
    }
  } catch (error) {
    logger.error("Failed to upsert job", error, {
      source_id: job.source_id,
      title: job.title,
    });
    return "skipped";
  }
}

/**
 * Main sync function - fetches jobs from Jooble and stores qualified ones
 */
export async function syncJoobleJobs(): Promise<SyncResult> {
  const runId = await createAggregatorRun();
  const errors: string[] = [];

  let jobsFound = 0;
  let jobsAnalyzed = 0;
  let jobsQualified = 0;
  let jobsAdded = 0;
  let jobsUpdated = 0;
  let jobsFiltered = 0;

  try {
    logger.info("Starting Jooble sync", { runId });

    // Fetch all jobs from Jooble
    const joobleJobs = await fetchAllJoobleJobs(SALARY.MINIMUM);
    jobsFound = joobleJobs.length;

    logger.info("Fetched jobs from Jooble", {
      runId,
      jobsFound,
    });

    // Process each job
    for (const joobleJob of joobleJobs) {
      jobsAnalyzed++;

      const processedJob = processJob(joobleJob);

      if (processedJob === null) {
        jobsFiltered++;
        continue;
      }

      jobsQualified++;

      // Upsert to database
      const result = await upsertJob(processedJob);

      if (result === "added") {
        jobsAdded++;
      } else if (result === "updated") {
        jobsUpdated++;
      }
    }

    // Update aggregator run as completed
    await updateAggregatorRun(runId, "completed", {
      jobsFound,
      jobsAdded,
      jobsUpdated,
    });

    logger.info("Jooble sync completed", {
      runId,
      jobsFound,
      jobsAnalyzed,
      jobsQualified,
      jobsAdded,
      jobsUpdated,
      jobsFiltered,
    });

    return {
      runId,
      jobsFound,
      jobsAnalyzed,
      jobsQualified,
      jobsAdded,
      jobsUpdated,
      jobsFiltered,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    errors.push(errorMessage);

    // Update aggregator run as failed
    await updateAggregatorRun(runId, "failed", {
      jobsFound,
      jobsAdded,
      jobsUpdated,
      errorMessage,
    });

    logger.error("Jooble sync failed", error, { runId });

    return {
      runId,
      jobsFound,
      jobsAnalyzed,
      jobsQualified,
      jobsAdded,
      jobsUpdated,
      jobsFiltered,
      errors,
    };
  }
}
