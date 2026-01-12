import { AggregatedJob, FilteredJob } from "./types";
import { filterJob } from "./filters";
import { fetchAdzunaJobs } from "./sources/adzuna";
import { fetchRemotiveJobs } from "./sources/remotive";
import { fetchArbeitnowJobs } from "./sources/arbeitnow";
import { fetchTheMuseJobs } from "./sources/themuse";
import { fetchJSearchJobs } from "./sources/jsearch";
import { sql } from "../db";
import { logger } from "../logger";

export interface AggregationResult {
  totalFetched: number;
  totalFiltered: number;
  totalInserted: number;
  totalUpdated: number;
  totalFailed: number;
  bySource: Record<string, { fetched: number; filtered: number }>;
  errors: string[];
}

/**
 * Fetch jobs from all sources
 */
async function fetchAllJobs(): Promise<{
  jobs: AggregatedJob[];
  bySource: Record<string, number>;
  errors: string[];
}> {
  const jobs: AggregatedJob[] = [];
  const bySource: Record<string, number> = {};
  const errors: string[] = [];

  const sources = [
    { name: "adzuna", fetch: fetchAdzunaJobs },
    { name: "remotive", fetch: fetchRemotiveJobs },
    { name: "arbeitnow", fetch: fetchArbeitnowJobs },
    { name: "themuse", fetch: fetchTheMuseJobs },
    { name: "jsearch", fetch: fetchJSearchJobs },
  ];

  // Fetch from all sources in parallel
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      logger.info("Fetching jobs from source", { source: source.name });
      const sourceJobs = await source.fetch();
      logger.info("Fetched jobs from source", { source: source.name, count: sourceJobs.length });
      return { name: source.name, jobs: sourceJobs };
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      jobs.push(...result.value.jobs);
      bySource[result.value.name] = result.value.jobs.length;
    } else {
      const error = `Failed to fetch from source: ${result.reason}`;
      errors.push(error);
      logger.error("Failed to fetch from source", result.reason);
    }
  }

  return { jobs, bySource, errors };
}

/**
 * Filter jobs based on criteria (100K+, no experience, no degree)
 */
function filterJobs(jobs: AggregatedJob[]): {
  filtered: FilteredJob[];
  bySource: Record<string, number>;
} {
  const filtered: FilteredJob[] = [];
  const bySource: Record<string, number> = {};

  for (const job of jobs) {
    const filterResult = filterJob(job);
    if (filterResult) {
      filtered.push(filterResult);
      bySource[job.source] = (bySource[job.source] || 0) + 1;
    }
  }

  return { filtered, bySource };
}

/**
 * Deduplicate jobs by title + company combination
 */
function deduplicateJobs(jobs: FilteredJob[]): FilteredJob[] {
  const seen = new Map<string, FilteredJob>();

  for (const job of jobs) {
    const key = `${job.title.toLowerCase()}-${job.company_name.toLowerCase()}`;
    const existing = seen.get(key);

    // Keep the one with higher salary or better confidence score
    if (!existing) {
      seen.set(key, job);
    } else if (
      (job.salary_min || 0) > (existing.salary_min || 0) ||
      job.confidence_score > existing.confidence_score
    ) {
      seen.set(key, job);
    }
  }

  return Array.from(seen.values());
}

/**
 * Save jobs to database using UPSERT for better performance
 */
async function saveJobsToDatabase(jobs: FilteredJob[]): Promise<{ inserted: number; updated: number; failed: number }> {
  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      // Use UPSERT (INSERT ... ON CONFLICT ... DO UPDATE) for better performance
      const result = await sql`
        INSERT INTO jobs (
          source, source_id, title, company_name, company_logo_url,
          location, remote_type, salary_min, salary_max, salary_currency,
          description, requirements, apply_url, posted_at,
          confidence_score, meets_salary, no_experience, no_degree, status
        ) VALUES (
          ${job.source}, ${job.source_id}, ${job.title}, ${job.company_name},
          ${job.company_logo_url || null}, ${job.location}, ${job.remote_type},
          ${job.salary_min || null}, ${job.salary_max || null}, ${job.salary_currency},
          ${job.description}, ${job.requirements || null}, ${job.apply_url},
          ${job.posted_at}, ${job.confidence_score}, ${job.meets_salary},
          ${job.no_experience}, ${job.no_degree}, 'active'
        )
        ON CONFLICT (source, source_id) DO UPDATE SET
          title = EXCLUDED.title,
          company_name = EXCLUDED.company_name,
          company_logo_url = EXCLUDED.company_logo_url,
          location = EXCLUDED.location,
          remote_type = EXCLUDED.remote_type,
          salary_min = EXCLUDED.salary_min,
          salary_max = EXCLUDED.salary_max,
          salary_currency = EXCLUDED.salary_currency,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          apply_url = EXCLUDED.apply_url,
          posted_at = EXCLUDED.posted_at,
          confidence_score = EXCLUDED.confidence_score,
          meets_salary = EXCLUDED.meets_salary,
          no_experience = EXCLUDED.no_experience,
          no_degree = EXCLUDED.no_degree,
          updated_at = NOW()
        RETURNING (xmax = 0) AS is_insert
      `;

      if (result[0]?.is_insert) {
        inserted++;
      } else {
        updated++;
      }
    } catch (error) {
      logger.error("Failed to save job", error, { sourceId: job.source_id });
      failed++;
    }
  }

  return { inserted, updated, failed };
}

/**
 * Remove stale jobs older than 30 days
 */
async function removeStaleJobs(): Promise<number> {
  const result = await sql`
    DELETE FROM jobs
    WHERE posted_at < NOW() - INTERVAL '30 days'
    RETURNING id
  `;
  return result.length;
}

/**
 * Main aggregation function - fetches, filters, and saves jobs
 */
export async function aggregateJobs(): Promise<AggregationResult> {
  logger.info("Starting job aggregation");
  const startTime = Date.now();

  // Fetch from all sources
  const { jobs: allJobs, bySource: fetchedBySource, errors } = await fetchAllJobs();
  logger.info("Total jobs fetched", { count: allJobs.length });

  // Filter jobs based on criteria
  const { filtered, bySource: filteredBySource } = filterJobs(allJobs);
  logger.info("Jobs after filtering", { count: filtered.length });

  // Deduplicate
  const deduplicated = deduplicateJobs(filtered);
  logger.info("Jobs after deduplication", { count: deduplicated.length });

  // Save to database
  const saveResult = await saveJobsToDatabase(deduplicated);
  logger.info("Jobs saved to database", { inserted: saveResult.inserted, updated: saveResult.updated, failed: saveResult.failed });

  // Remove stale jobs
  const removedCount = await removeStaleJobs();
  if (removedCount > 0) {
    logger.info("Removed stale jobs", { count: removedCount });
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  logger.info("Job aggregation completed", { durationSeconds: duration });

  // Build result
  const result: AggregationResult = {
    totalFetched: allJobs.length,
    totalFiltered: deduplicated.length,
    totalInserted: saveResult.inserted,
    totalUpdated: saveResult.updated,
    totalFailed: saveResult.failed,
    bySource: {},
    errors,
  };

  // Combine source stats
  const allSources = new Set([
    ...Object.keys(fetchedBySource),
    ...Object.keys(filteredBySource),
  ]);
  for (const source of allSources) {
    result.bySource[source] = {
      fetched: fetchedBySource[source] || 0,
      filtered: filteredBySource[source] || 0,
    };
  }

  return result;
}

// Export individual functions for testing
export { fetchAllJobs, filterJobs, deduplicateJobs, saveJobsToDatabase, removeStaleJobs };
