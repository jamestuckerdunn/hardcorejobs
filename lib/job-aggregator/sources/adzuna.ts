import { AggregatedJob } from "../types";
import { determineRemoteType } from "../filters";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
  category: { label: string };
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

/**
 * Fetch jobs from Adzuna API
 * Free tier: 250 calls/month
 */
export async function fetchAdzunaJobs(): Promise<AggregatedJob[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
    console.log("Adzuna API credentials not configured, skipping...");
    return [];
  }

  const jobs: AggregatedJob[] = [];

  // Search queries targeting high-paying entry-level jobs
  const searchQueries = [
    "sales entry level",
    "SDR",
    "BDR",
    "account executive entry",
    "field service technician",
    "insurance sales",
    "real estate agent",
    "solar installer",
    "wind turbine technician",
  ];

  try {
    for (const query of searchQueries) {
      const url = new URL(`${BASE_URL}/us/search/1`);
      url.searchParams.set("app_id", ADZUNA_APP_ID);
      url.searchParams.set("app_key", ADZUNA_API_KEY);
      url.searchParams.set("what", query);
      url.searchParams.set("salary_min", "100000");
      url.searchParams.set("results_per_page", "50");
      url.searchParams.set("content-type", "application/json");

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error(`Adzuna API error: ${response.status}`);
        continue;
      }

      const data: AdzunaResponse = await response.json();

      for (const job of data.results) {
        jobs.push({
          source: "adzuna",
          source_id: job.id,
          title: job.title,
          company_name: job.company.display_name,
          location: job.location.display_name,
          remote_type: determineRemoteType({
            title: job.title,
            location: job.location.display_name,
            description: job.description,
          }),
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          salary_currency: "USD",
          description: job.description,
          apply_url: job.redirect_url,
          posted_at: new Date(job.created),
        });
      }

      // Rate limiting - wait 200ms between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error("Error fetching from Adzuna:", error);
  }

  return jobs;
}
