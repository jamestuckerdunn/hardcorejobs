export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  location: string;
  remote_type?: "remote" | "hybrid" | "onsite";
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  apply_url: string;
  is_featured?: boolean;
  featured_until?: string;
  posted_at: string;
  expires_at?: string;
  source: string;
  status?: "active" | "expired" | "closed";
  employer_id?: string;
  company_website?: string;
  company_description?: string;
  company_size?: string;
  industry?: string;
  verified?: boolean;
  experience_required?: string | null;
  degree_required?: string | null;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface JobFilters {
  search: string;
  location: string;
  remoteType: string;
  salaryMin: string;
  sortBy: string;
  featuredOnly: boolean;
}

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  headline?: string;
  location?: string;
  willing_to_relocate: boolean;
  linkedin_url?: string;
  portfolio_url?: string;
  bio?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: "pending" | "reviewed" | "interviewing" | "offered" | "rejected" | "withdrawn";
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
}

export interface SavedJob {
  id: string;
  job_id: string;
  user_id: string;
  saved_at: string;
  job?: Job;
}

export interface DashboardStats {
  applications: number;
  savedJobs: number;
  profileViews: number;
  interviews: number;
}

export interface PledgeStatus {
  signed: boolean;
  date?: string;
  commitments: {
    relocate: boolean;
    hours: boolean;
    immediate: boolean;
    twoYears: boolean;
  };
}
