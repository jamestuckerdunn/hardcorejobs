/**
 * Jooble API client for fetching job listings
 */

import type {
  JoobleSearchRequest,
  JoobleSearchResponse,
  JoobleJob,
  SearchConfig,
} from "./types";
import { logger } from "@/lib/logger";

const JOOBLE_BASE_URL = "https://jooble.org/api";
const RATE_LIMIT_DELAY_MS = 1000; // 1 second between requests
const MAX_PAGES_PER_SEARCH = 10;
const MAX_RETRIES = 3;

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get the Jooble API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) {
    throw new Error("JOOBLE_API_KEY environment variable is not set");
  }
  return apiKey;
}

/**
 * Fetch a single page of results from Jooble API
 */
async function fetchJooblePage(
  request: JoobleSearchRequest,
  retryCount = 0
): Promise<JoobleSearchResponse> {
  const apiKey = getApiKey();
  const url = `${JOOBLE_BASE_URL}/${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jooble API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data as JoobleSearchResponse;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      logger.warn("Jooble API request failed, retrying", {
        attempt: retryCount + 1,
        keywords: request.keywords,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      await sleep(Math.pow(2, retryCount) * 1000); // Exponential backoff
      return fetchJooblePage(request, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Search configurations to maximize entry-level job coverage
 */
export const SEARCH_CONFIGS: SearchConfig[] = [
  {
    keywords: "entry level no experience",
    description: "Entry level positions without experience requirement",
  },
  {
    keywords: "no degree required",
    description: "Jobs that don't require a degree",
  },
  {
    keywords: "will train no experience",
    description: "Training provided positions",
  },
  {
    keywords: "entry level software developer",
    description: "Entry level tech positions",
  },
  {
    keywords: "junior no degree",
    description: "Junior positions without degree requirement",
  },
  {
    keywords: "high school diploma only",
    description: "High school diploma positions",
  },
  {
    keywords: "training provided entry level",
    description: "Entry level with training",
  },
];

/**
 * Fetch all jobs for a specific search configuration
 */
async function fetchJobsForSearch(
  config: SearchConfig,
  location: string,
  minSalary: number
): Promise<JoobleJob[]> {
  const allJobs: JoobleJob[] = [];
  let page = 1;
  let hasMore = true;

  logger.info("Starting Jooble search", {
    keywords: config.keywords,
    location,
    minSalary,
  });

  while (hasMore && page <= MAX_PAGES_PER_SEARCH) {
    const request: JoobleSearchRequest = {
      keywords: config.keywords,
      location,
      salary: String(minSalary),
      page,
    };

    try {
      const response = await fetchJooblePage(request);

      if (response.jobs && response.jobs.length > 0) {
        allJobs.push(...response.jobs);
        logger.info("Fetched Jooble page", {
          page,
          jobsOnPage: response.jobs.length,
          totalSoFar: allJobs.length,
          totalAvailable: response.totalCount,
        });
      }

      hasMore = response.jobs && response.jobs.length > 0 && allJobs.length < response.totalCount;
      page++;

      // Rate limiting
      if (hasMore) {
        await sleep(RATE_LIMIT_DELAY_MS);
      }
    } catch (error) {
      logger.error("Failed to fetch Jooble page", error, {
        page,
        keywords: config.keywords,
      });
      break;
    }
  }

  logger.info("Completed Jooble search", {
    keywords: config.keywords,
    totalJobs: allJobs.length,
  });

  return allJobs;
}

/**
 * Fetch all US jobs from Jooble with salary filter
 * Uses multiple search strategies to maximize coverage
 */
export async function fetchAllJoobleJobs(
  minSalary: number = 100000
): Promise<JoobleJob[]> {
  const allJobs: Map<string, JoobleJob> = new Map();
  const location = "United States";

  for (const config of SEARCH_CONFIGS) {
    try {
      const jobs = await fetchJobsForSearch(config, location, minSalary);

      // Deduplicate by job ID
      for (const job of jobs) {
        if (!allJobs.has(job.id)) {
          allJobs.set(job.id, job);
        }
      }

      logger.info("Search config complete", {
        keywords: config.keywords,
        newJobs: jobs.length,
        uniqueTotal: allJobs.size,
      });

      // Rate limiting between search configurations
      await sleep(RATE_LIMIT_DELAY_MS);
    } catch (error) {
      logger.error("Search config failed", error, {
        keywords: config.keywords,
      });
      // Continue with other search configs
    }
  }

  logger.info("All Jooble searches complete", {
    totalUniqueJobs: allJobs.size,
    searchConfigs: SEARCH_CONFIGS.length,
  });

  return Array.from(allJobs.values());
}
