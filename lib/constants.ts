/**
 * Centralized constants for the Hardcore Jobs application
 */

// Pagination settings
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
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

// Jooble API settings
export const JOOBLE = {
  BASE_URL: "https://jooble.org/api",
  RATE_LIMIT_DELAY_MS: 1000,
  MAX_PAGES_PER_SEARCH: 10,
  MAX_RETRIES: 3,
  DEFAULT_LOCATION: "United States",
} as const;
