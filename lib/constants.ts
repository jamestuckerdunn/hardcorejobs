/**
 * Centralized constants for the Hardcore Jobs application
 */

// Pagination settings
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Site statistics (displayed on homepage and header)
export const SITE_STATS = {
  TOTAL_JOBS: "500+",
  AVG_SALARY: "$127K",
  JOB_SEEKERS: "10K+",
  AVG_INTERVIEW_TIME: "48hrs",
} as const;

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/hardcorejobs",
  LINKEDIN: "https://linkedin.com/company/hardcorejobs",
} as const;

// Contact information
export const CONTACT = {
  EMAIL: "hello@hardcorejobs.com",
} as const;

// Salary requirements
export const SALARY = {
  MINIMUM: 100000,
  CURRENCY: "USD",
} as const;

// Input validation limits
export const INPUT_LIMITS = {
  FULL_NAME: 200,
  HEADLINE: 200,
  LOCATION: 200,
  BIO: 2000,
  COVER_LETTER: 5000,
} as const;
