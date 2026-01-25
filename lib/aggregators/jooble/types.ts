/**
 * TypeScript types for Jooble API integration
 */

// Jooble API request body
export interface JoobleSearchRequest {
  keywords: string;
  location: string;
  salary?: string;
  page?: number;
}

// Individual job from Jooble API response
export interface JoobleJob {
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
  id: string;
}

// Jooble API response
export interface JoobleSearchResponse {
  totalCount: number;
  jobs: JoobleJob[];
}

// Result of analyzing job requirements
export interface JobRequirementAnalysis {
  experienceRequired: string | null;
  degreeRequired: string | null;
  meetsEntryCriteria: boolean;
}

// Job ready to be inserted into database
export interface ProcessedJob {
  source: "jooble";
  source_id: string;
  title: string;
  company_name: string;
  location: string;
  remote_type: "remote" | "hybrid" | "onsite" | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  description: string;
  apply_url: string;
  experience_required: string | null;
  degree_required: string | null;
  posted_at: Date;
}

// Sync operation result
export interface SyncResult {
  runId: string;
  jobsFound: number;
  jobsAnalyzed: number;
  jobsQualified: number;
  jobsAdded: number;
  jobsUpdated: number;
  jobsFiltered: number;
  errors: string[];
}

// Search configuration for multiple keyword strategies
export interface SearchConfig {
  keywords: string;
  description: string;
}
