// Standard job format for internal use
export interface AggregatedJob {
  source: string;
  source_id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  location: string;
  remote_type: "remote" | "hybrid" | "onsite";
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description: string;
  requirements?: string;
  apply_url: string;
  posted_at: Date;
}

// Filtered job with additional metadata
export interface FilteredJob extends AggregatedJob {
  confidence_score: number;
  meets_salary: boolean;
  no_experience: boolean;
  no_degree: boolean;
}

// Configuration for job sources
export interface JobSourceConfig {
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl: string;
}

// Keywords and patterns for filtering
export const NO_EXPERIENCE_KEYWORDS = [
  "no experience",
  "no prior experience",
  "entry level",
  "entry-level",
  "junior",
  "trainee",
  "graduate",
  "new grad",
  "will train",
  "training provided",
  "no experience required",
  "no experience necessary",
  "0-1 years",
  "0-2 years",
  "0 years",
  "fresh graduate",
  "recent graduate",
  "no exp",
];

export const NO_DEGREE_KEYWORDS = [
  "no degree",
  "no degree required",
  "degree not required",
  "without degree",
  "without a degree",
  "high school",
  "ged",
  "no college",
  "no university",
  "no formal education",
  "self-taught",
  "bootcamp",
  "equivalent experience",
  "or equivalent",
  "degree preferred but not required",
  "degree optional",
];

export const EXCLUDE_KEYWORDS = [
  "phd required",
  "masters required",
  "md required",
  "jd required",
  "cpa required",
  "10+ years",
  "15+ years",
  "senior director",
  "vp of",
  "vice president",
  "chief",
  "principal architect",
];

// Minimum salary threshold (annual)
export const MIN_SALARY = 100000;
