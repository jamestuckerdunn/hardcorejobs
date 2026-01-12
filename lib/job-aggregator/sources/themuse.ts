import { AggregatedJob } from "../types";
import { determineRemoteType } from "../filters";

const BASE_URL = "https://www.themuse.com/api/public/jobs";
const API_KEY = process.env.THEMUSE_API_KEY || ""; // Optional - higher rate limits with key

interface TheMuseJob {
  id: number;
  name: string; // Job title
  company: {
    name: string;
    short_name: string;
  };
  locations: { name: string }[];
  levels: { name: string; short_name: string }[];
  refs: {
    landing_page: string;
  };
  contents: string;
  publication_date: string;
  categories: { name: string }[];
}

interface TheMuseResponse {
  results: TheMuseJob[];
  page: number;
  page_count: number;
}

/**
 * Fetch jobs from The Muse API
 * Free API - 500 requests/hour without key
 */
export async function fetchTheMuseJobs(): Promise<AggregatedJob[]> {
  const jobs: AggregatedJob[] = [];

  // Categories for high-paying entry-level jobs
  const categories = [
    "Sales",
    "Business Development",
    "Customer Success",
    "Account Management",
  ];

  // Entry level only
  const levels = ["Entry Level", "Internship"];

  try {
    for (const category of categories) {
      const url = new URL(BASE_URL);
      url.searchParams.set("category", category);
      url.searchParams.set("level", levels.join(","));
      url.searchParams.set("page", "1");
      if (API_KEY) {
        url.searchParams.set("api_key", API_KEY);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error(`The Muse API error: ${response.status}`);
        continue;
      }

      const data: TheMuseResponse = await response.json();

      for (const job of data.results) {
        const location =
          job.locations.length > 0
            ? job.locations.map((l) => l.name).join(", ")
            : "Remote";

        jobs.push({
          source: "themuse",
          source_id: job.id.toString(),
          title: job.name,
          company_name: job.company.name,
          location,
          remote_type: determineRemoteType({
            title: job.name,
            location,
            description: job.contents,
          }),
          salary_currency: "USD",
          description: job.contents,
          apply_url: job.refs.landing_page,
          posted_at: new Date(job.publication_date),
        });
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error("Error fetching from The Muse:", error);
  }

  return jobs;
}
