import { AggregatedJob } from "../types";

const BASE_URL = "https://remotive.com/api/remote-jobs";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

/**
 * Parse salary string from Remotive
 * Examples: "$100,000 - $150,000", "100k-150k", etc.
 */
function parseSalary(salaryStr: string): { min?: number; max?: number } {
  if (!salaryStr) return {};

  // Remove currency symbols and normalize
  const normalized = salaryStr.toLowerCase().replace(/[,$]/g, "");

  // Match patterns like "100k - 150k" or "100000 - 150000"
  const rangeMatch = normalized.match(/(\d+)k?\s*[-–to]+\s*(\d+)k?/);
  if (rangeMatch) {
    let min = parseInt(rangeMatch[1]);
    let max = parseInt(rangeMatch[2]);

    // Convert k notation
    if (min < 1000) min *= 1000;
    if (max < 1000) max *= 1000;

    return { min, max };
  }

  // Match single value like "100k" or "100000"
  const singleMatch = normalized.match(/(\d+)k?/);
  if (singleMatch) {
    let value = parseInt(singleMatch[1]);
    if (value < 1000) value *= 1000;
    return { min: value, max: value };
  }

  return {};
}

/**
 * Fetch remote jobs from Remotive API
 * Free API - no rate limits documented
 */
export async function fetchRemotiveJobs(): Promise<AggregatedJob[]> {
  const jobs: AggregatedJob[] = [];

  // Categories that tend to have high-paying entry-level jobs
  const categories = [
    "sales",
    "customer-support",
    "marketing",
    "business",
    "all-others",
  ];

  try {
    for (const category of categories) {
      const url = `${BASE_URL}?category=${category}&limit=50`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Remotive API error: ${response.status}`);
        continue;
      }

      const data: RemotiveResponse = await response.json();

      for (const job of data.jobs) {
        const salary = parseSalary(job.salary);

        // Only include if salary meets threshold
        if (!salary.min || salary.min < 100000) continue;

        jobs.push({
          source: "remotive",
          source_id: job.id.toString(),
          title: job.title,
          company_name: job.company_name,
          company_logo_url: job.company_logo || undefined,
          location: job.candidate_required_location || "Remote",
          remote_type: "remote", // All Remotive jobs are remote
          salary_min: salary.min,
          salary_max: salary.max,
          salary_currency: "USD",
          description: job.description,
          apply_url: job.url,
          posted_at: new Date(job.publication_date),
        });
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error("Error fetching from Remotive:", error);
  }

  return jobs;
}
