import { AggregatedJob, FilteredJob } from "./types";
import { filterJob } from "./filters";
import { fetchAdzunaJobs } from "./sources/adzuna";
import { fetchRemotiveJobs } from "./sources/remotive";
import { fetchArbeitnowJobs } from "./sources/arbeitnow";
import { fetchTheMuseJobs } from "./sources/themuse";
import { fetchJSearchJobs } from "./sources/jsearch";
import { sql } from "../db";

export interface AggregationResult {
  totalFetched: number;
  totalFiltered: number;
  totalSaved: number;
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
      console.log(`Fetching from ${source.name}...`);
      const sourceJobs = await source.fetch();
      console.log(`Fetched ${sourceJobs.length} jobs from ${source.name}`);
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
      console.error(error);
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
 * Save jobs to database
 */
async function saveJobsToDatabase(jobs: FilteredJob[]): Promise<number> {
  let savedCount = 0;

  for (const job of jobs) {
    try {
      // Check if job already exists by source and source_id
      const existing = await sql`
        SELECT id FROM jobs
        WHERE source = ${job.source} AND source_id = ${job.source_id}
      `;

      if (existing.length > 0) {
        // Update existing job
        await sql`
          UPDATE jobs SET
            title = ${job.title},
            company_name = ${job.company_name},
            company_logo_url = ${job.company_logo_url || null},
            location = ${job.location},
            remote_type = ${job.remote_type},
            salary_min = ${job.salary_min || null},
            salary_max = ${job.salary_max || null},
            salary_currency = ${job.salary_currency},
            description = ${job.description},
            requirements = ${job.requirements || null},
            apply_url = ${job.apply_url},
            posted_at = ${job.posted_at},
            confidence_score = ${job.confidence_score},
            meets_salary = ${job.meets_salary},
            no_experience = ${job.no_experience},
            no_degree = ${job.no_degree},
            updated_at = NOW()
          WHERE source = ${job.source} AND source_id = ${job.source_id}
        `;
      } else {
        // Insert new job
        await sql`
          INSERT INTO jobs (
            source, source_id, title, company_name, company_logo_url,
            location, remote_type, salary_min, salary_max, salary_currency,
            description, requirements, apply_url, posted_at,
            confidence_score, meets_salary, no_experience, no_degree
          ) VALUES (
            ${job.source}, ${job.source_id}, ${job.title}, ${job.company_name},
            ${job.company_logo_url || null}, ${job.location}, ${job.remote_type},
            ${job.salary_min || null}, ${job.salary_max || null}, ${job.salary_currency},
            ${job.description}, ${job.requirements || null}, ${job.apply_url},
            ${job.posted_at}, ${job.confidence_score}, ${job.meets_salary},
            ${job.no_experience}, ${job.no_degree}
          )
        `;
        savedCount++;
      }
    } catch (error) {
      console.error(`Failed to save job ${job.source_id}:`, error);
    }
  }

  return savedCount;
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
  console.log("Starting job aggregation...");
  const startTime = Date.now();

  // Fetch from all sources
  const { jobs: allJobs, bySource: fetchedBySource, errors } = await fetchAllJobs();
  console.log(`Total fetched: ${allJobs.length} jobs`);

  // Filter jobs based on criteria
  const { filtered, bySource: filteredBySource } = filterJobs(allJobs);
  console.log(`After filtering: ${filtered.length} jobs`);

  // Deduplicate
  const deduplicated = deduplicateJobs(filtered);
  console.log(`After deduplication: ${deduplicated.length} jobs`);

  // Save to database
  const savedCount = await saveJobsToDatabase(deduplicated);
  console.log(`Saved ${savedCount} new jobs to database`);

  // Remove stale jobs
  const removedCount = await removeStaleJobs();
  if (removedCount > 0) {
    console.log(`Removed ${removedCount} stale jobs`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Job aggregation completed in ${duration}s`);

  // Build result
  const result: AggregationResult = {
    totalFetched: allJobs.length,
    totalFiltered: deduplicated.length,
    totalSaved: savedCount,
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
