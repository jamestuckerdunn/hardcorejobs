import {
  AggregatedJob,
  FilteredJob,
  NO_EXPERIENCE_KEYWORDS,
  NO_DEGREE_KEYWORDS,
  EXCLUDE_KEYWORDS,
  MIN_SALARY,
} from "./types";

/**
 * Check if a job meets salary requirements ($100K+)
 */
export function meetsSalaryRequirement(job: AggregatedJob): boolean {
  // If salary is specified, check if it meets minimum
  if (job.salary_min && job.salary_min >= MIN_SALARY) {
    return true;
  }

  // If max salary is specified and seems reasonable, might be commission-based
  if (job.salary_max && job.salary_max >= MIN_SALARY) {
    return true;
  }

  // If no salary specified, we can't verify - exclude for safety
  // unless we want to include and flag for review
  return false;
}

/**
 * Check if job description suggests no experience required
 */
export function isNoExperienceRequired(job: AggregatedJob): boolean {
  const textToSearch = `${job.title} ${job.description} ${job.requirements || ""}`.toLowerCase();

  // Check for no experience keywords
  const hasNoExpKeyword = NO_EXPERIENCE_KEYWORDS.some((keyword) =>
    textToSearch.includes(keyword.toLowerCase())
  );

  // Check for exclusion keywords (senior roles, etc.)
  const hasExclusionKeyword = EXCLUDE_KEYWORDS.some((keyword) =>
    textToSearch.includes(keyword.toLowerCase())
  );

  // Check for years of experience requirements
  const yearsPattern = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/gi;
  const matches = textToSearch.match(yearsPattern);

  if (matches) {
    for (const match of matches) {
      const years = parseInt(match.match(/\d+/)?.[0] || "0");
      if (years > 2) {
        return false; // More than 2 years required
      }
    }
  }

  return hasNoExpKeyword && !hasExclusionKeyword;
}

/**
 * Check if job description suggests no degree required
 */
export function isNoDegreeRequired(job: AggregatedJob): boolean {
  const textToSearch = `${job.title} ${job.description} ${job.requirements || ""}`.toLowerCase();

  // Check for no degree keywords
  const hasNoDegreeKeyword = NO_DEGREE_KEYWORDS.some((keyword) =>
    textToSearch.includes(keyword.toLowerCase())
  );

  // Check for strict degree requirements
  const strictDegreePatterns = [
    /bachelor'?s?\s+(?:degree\s+)?required/i,
    /master'?s?\s+(?:degree\s+)?required/i,
    /degree\s+required/i,
    /must\s+have\s+(?:a\s+)?(?:bachelor|master|phd|doctorate)/i,
    /requires?\s+(?:a\s+)?(?:bachelor|master|phd|doctorate)/i,
  ];

  const hasStrictDegreeRequirement = strictDegreePatterns.some((pattern) =>
    pattern.test(textToSearch)
  );

  // If explicitly says no degree, trust it
  if (hasNoDegreeKeyword) {
    return true;
  }

  // If has strict requirement, definitely exclude
  if (hasStrictDegreeRequirement) {
    return false;
  }

  // For certain job types, degree is often not required
  const noDegreeJobTypes = [
    "sales",
    "sdr",
    "bdr",
    "account executive",
    "real estate",
    "insurance",
    "technician",
    "field service",
    "installation",
    "driver",
    "operator",
    "trades",
    "construction",
    "hvac",
    "solar",
    "wind turbine",
    "customer success",
  ];

  const jobTypeMatch = noDegreeJobTypes.some(
    (type) =>
      job.title.toLowerCase().includes(type) ||
      textToSearch.includes(type)
  );

  return jobTypeMatch;
}

/**
 * Determine remote type from job data
 */
export function determineRemoteType(
  job: Partial<AggregatedJob>
): "remote" | "hybrid" | "onsite" {
  const textToSearch = `${job.title || ""} ${job.location || ""} ${job.description || ""}`.toLowerCase();

  if (
    textToSearch.includes("fully remote") ||
    textToSearch.includes("100% remote") ||
    textToSearch.includes("work from home") ||
    textToSearch.includes("work from anywhere") ||
    job.location?.toLowerCase() === "remote"
  ) {
    return "remote";
  }

  if (
    textToSearch.includes("hybrid") ||
    textToSearch.includes("remote/onsite") ||
    textToSearch.includes("flexible")
  ) {
    return "hybrid";
  }

  return "onsite";
}

/**
 * Main filter function - checks all criteria and returns FilteredJob or null
 */
export function filterJob(job: AggregatedJob): FilteredJob | null {
  const meetsSalary = meetsSalaryRequirement(job);
  const noExp = isNoExperienceRequired(job);
  const noDegree = isNoDegreeRequired(job);

  // Calculate confidence score (0-1)
  let score = 0;
  if (meetsSalary) score += 0.4;
  if (noExp) score += 0.3;
  if (noDegree) score += 0.3;

  // Must pass all criteria
  if (!meetsSalary || !noExp || !noDegree) {
    return null;
  }

  return {
    ...job,
    confidence_score: score,
    meets_salary: meetsSalary,
    no_experience: noExp,
    no_degree: noDegree,
  };
}

/**
 * Legacy filter function for backward compatibility
 */
export function filterJobWithReasons(job: AggregatedJob): {
  passes: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  const meetsSalary = meetsSalaryRequirement(job);
  if (!meetsSalary) {
    reasons.push(`Salary below $${MIN_SALARY / 1000}K or not specified`);
  }

  const noExp = isNoExperienceRequired(job);
  if (!noExp) {
    reasons.push("Experience required or not entry-level");
  }

  const noDegree = isNoDegreeRequired(job);
  if (!noDegree) {
    reasons.push("Degree appears to be required");
  }

  return {
    passes: meetsSalary && noExp && noDegree,
    reasons,
  };
}

/**
 * Filter an array of jobs
 */
export function filterJobs(jobs: AggregatedJob[]): FilteredJob[] {
  const passed: FilteredJob[] = [];

  for (const job of jobs) {
    const result = filterJob(job);
    if (result) {
      passed.push(result);
    }
  }

  return passed;
}
