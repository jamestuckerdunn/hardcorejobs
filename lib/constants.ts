/**
 * Application constants and configuration values.
 * All hardcoded values should be defined here for easy maintenance.
 */

// Featured job configuration
export const FEATURED_JOB = {
  /** Duration in days for featured job placement */
  DURATION_DAYS: parseInt(process.env.FEATURED_JOB_DURATION_DAYS || "30", 10),
  /** Price in cents */
  PRICE_CENTS: 9900,
};

// Resume database configuration
export const RESUME_DATABASE = {
  /** Duration in months for resume database access */
  DURATION_MONTHS: parseInt(process.env.RESUME_DB_DURATION_MONTHS || "1", 10),
  /** Price in cents */
  PRICE_CENTS: 19900,
};

// Cache configuration
export const CACHE = {
  /** Jobs API cache TTL in seconds */
  JOBS_TTL_SECONDS: parseInt(process.env.JOBS_CACHE_TTL_SECONDS || "300", 10),
  /** Stale-while-revalidate duration in seconds */
  STALE_WHILE_REVALIDATE_SECONDS: 600,
};

// API configuration
export const API = {
  /** Maximum jobs per page */
  MAX_JOBS_PER_PAGE: 100,
  /** Default jobs per page */
  DEFAULT_JOBS_PER_PAGE: 20,
  /** Maximum featured jobs to display */
  MAX_FEATURED_JOBS: 10,
  /** Maximum similar jobs to display */
  MAX_SIMILAR_JOBS: 6,
};

// Job filtering configuration
export const JOB_FILTERS = {
  /** Minimum salary threshold for "high-paying" jobs */
  MIN_SALARY_THRESHOLD: 100000,
  /** Maximum years of experience for "entry-level" jobs */
  MAX_ENTRY_LEVEL_EXPERIENCE: 2,
};

// Security configuration
export const SECURITY = {
  /** Maximum request body size */
  MAX_REQUEST_BODY_SIZE: "1mb",
  /** CORS allowed origins (empty = same origin only) */
  ALLOWED_ORIGINS: [] as string[],
};

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/employer",
  "/onboarding",
  "/saved-jobs",
  "/applications",
] as const;
