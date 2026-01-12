import { AggregatedJob } from "../types";
import { determineRemoteType } from "../filters";
import { logger } from "../../logger";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL = "https://jsearch.p.rapidapi.com/search";

interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  job_title: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_is_remote: boolean;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
  };
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_certification?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
    professional_certification_mentioned?: boolean;
  };
}

interface JSearchResponse {
  status: string;
  data: JSearchJob[];
}

/**
 * Fetch jobs from JSearch API (RapidAPI)
 * Free tier: 200 requests/month
 */
export async function fetchJSearchJobs(): Promise<AggregatedJob[]> {
  if (!RAPIDAPI_KEY) {
    logger.debug("RapidAPI key not configured, skipping JSearch");
    return [];
  }

  const jobs: AggregatedJob[] = [];

  // Search queries for high-paying entry-level jobs
  const searchQueries = [
    "sales development representative entry level $100000",
    "account executive no experience $100000",
    "field service technician entry level $100000",
    "insurance agent no degree $100000",
    "solar technician entry level",
  ];

  try {
    for (const query of searchQueries) {
      const url = new URL(BASE_URL);
      url.searchParams.set("query", query);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("date_posted", "week"); // Recent jobs only

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        logger.warn("JSearch API error", { status: response.status });
        continue;
      }

      const data: JSearchResponse = await response.json();

      if (data.status !== "OK" || !data.data) {
        continue;
      }

      for (const job of data.data) {
        // Skip if salary is too low
        if (job.job_min_salary && job.job_min_salary < 100000) {
          continue;
        }

        // Skip if degree is required
        if (
          job.job_required_education?.bachelors_degree ||
          job.job_required_education?.postgraduate_degree
        ) {
          continue;
        }

        // Skip if too much experience required
        if (
          job.job_required_experience?.required_experience_in_months &&
          job.job_required_experience.required_experience_in_months > 24
        ) {
          continue;
        }

        const location = [job.job_city, job.job_state, job.job_country]
          .filter(Boolean)
          .join(", ");

        jobs.push({
          source: "jsearch",
          source_id: job.job_id,
          title: job.job_title,
          company_name: job.employer_name,
          company_logo_url: job.employer_logo || undefined,
          location: location || "Unknown",
          remote_type: job.job_is_remote
            ? "remote"
            : determineRemoteType({
                title: job.job_title,
                location,
                description: job.job_description,
              }),
          salary_min: job.job_min_salary || undefined,
          salary_max: job.job_max_salary || undefined,
          salary_currency: job.job_salary_currency || "USD",
          description: job.job_description,
          apply_url: job.job_apply_link,
          posted_at: new Date(job.job_posted_at_datetime_utc),
        });
      }

      // Rate limiting - JSearch has strict limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    logger.error("Error fetching from JSearch", error);
  }

  return jobs;
}
