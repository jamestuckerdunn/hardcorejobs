import { AggregatedJob } from "../types";
import { determineRemoteType } from "../filters";

const BASE_URL = "https://www.arbeitnow.com/api/job-board-api";

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    next?: string;
  };
}

/**
 * Fetch jobs from Arbeitnow API
 * Free API - no authentication required
 */
export async function fetchArbeitnowJobs(): Promise<AggregatedJob[]> {
  const jobs: AggregatedJob[] = [];

  try {
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 3) {
      // Limit to 3 pages
      const url = `${BASE_URL}?page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Arbeitnow API error: ${response.status}`);
        break;
      }

      const data: ArbeitnowResponse = await response.json();

      for (const job of data.data) {
        // Arbeitnow doesn't provide salary, so we need to estimate or skip
        // For now, we'll include jobs that match our keyword criteria
        // and let the filter handle them
        jobs.push({
          source: "arbeitnow",
          source_id: job.slug,
          title: job.title,
          company_name: job.company_name,
          location: job.location || (job.remote ? "Remote" : "Unknown"),
          remote_type: job.remote
            ? "remote"
            : determineRemoteType({
                title: job.title,
                location: job.location,
                description: job.description,
              }),
          salary_currency: "USD",
          description: job.description,
          apply_url: job.url,
          posted_at: new Date(job.created_at * 1000),
        });
      }

      hasMore = !!data.links.next;
      page++;

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error("Error fetching from Arbeitnow:", error);
  }

  return jobs;
}
