/**
 * Keyword analyzer for detecting experience and degree requirements in job descriptions.
 * Jobs must EXPLICITLY state both "no experience required" AND "no degree required"
 * to be included. Jobs where requirements are not explicitly mentioned are excluded.
 */

import type { JobRequirementAnalysis } from "./types";

// Patterns that indicate NO experience is required
const NO_EXPERIENCE_PATTERNS: RegExp[] = [
  /no\s*(prior\s*)?(experience|exp)\s*(required|needed|necessary)/i,
  /no\s*experience\s*necessary/i,
  /0\s*(\+)?\s*years?\s*(of\s*)?(experience|exp)/i,
  /zero\s*years?\s*(of\s*)?(experience|exp)/i,
  /entry[- ]level/i,
  /entry\s*level\s*position/i,
  /new\s*grad(uate)?s?\s*(welcome|encouraged)?/i,
  /fresh\s*grad(uate)?s?\s*(welcome|encouraged)?/i,
  /recent\s*grad(uate)?s?\s*(welcome|encouraged)?/i,
  /will\s*train/i,
  /we\s*will\s*train/i,
  /training\s*provided/i,
  /on[- ]the[- ]job\s*training/i,
  /no\s*prior\s*knowledge/i,
  /no\s*previous\s*experience/i,
  /beginners?\s*(welcome|encouraged|accepted)/i,
  /experience\s*not\s*(required|needed|necessary)/i,
  /without\s*(any\s*)?(prior\s*)?experience/i,
];

// Patterns that indicate experience IS required (to exclude jobs)
const EXPERIENCE_REQUIRED_PATTERNS: RegExp[] = [
  /([1-9]|[1-9]\d)\+?\s*years?\s*(of\s*)?(experience|exp)/i,
  /minimum\s*([1-9]|[1-9]\d)\s*years?/i,
  /at\s*least\s*([1-9]|[1-9]\d)\s*years?/i,
  /requires?\s*([1-9]|[1-9]\d)\s*years?/i,
  /([1-9]|[1-9]\d)\+?\s*years?\s*(of\s*)?(relevant|related|professional)/i,
  /proven\s*(track\s*record|experience)/i,
  /demonstrated\s*experience/i,
  /extensive\s*experience/i,
  /significant\s*experience/i,
];

// Patterns that indicate NO degree is required
const NO_DEGREE_PATTERNS: RegExp[] = [
  /no\s*degree\s*(required|needed|necessary)/i,
  /degree\s*not\s*(required|needed|necessary)/i,
  /without\s*a?\s*degree/i,
  /don'?t\s*need\s*a?\s*degree/i,
  /high\s*school\s*(diploma|equivalent)\s*(only|or\s*equivalent|accepted)?/i,
  /hs\s*diploma\s*(only|or\s*equivalent|accepted)?/i,
  /ged\s*(accepted|ok|only|or\s*equivalent)?/i,
  /education\s*not\s*(required|needed|necessary)/i,
  /no\s*formal\s*education/i,
  /no\s*college\s*(required|needed|necessary)/i,
  /college\s*degree\s*not\s*(required|needed|necessary)/i,
  /degree\s*preferred\s*but\s*not\s*(required|necessary)/i,
  /no\s*educational\s*requirements?/i,
];

// Patterns that indicate a degree IS required (to exclude jobs)
const DEGREE_REQUIRED_PATTERNS: RegExp[] = [
  /bachelor'?s?\s*(degree)?\s*(required|in|of)/i,
  /master'?s?\s*(degree)?\s*(required|in|of)/i,
  /b\.?s\.?\s*(in|degree|required)/i,
  /b\.?a\.?\s*(in|degree|required)/i,
  /m\.?s\.?\s*(in|degree|required)/i,
  /m\.?b\.?a\.?\s*(required|preferred)/i,
  /phd\s*(required|preferred|in)/i,
  /doctorate\s*(required|preferred|in)/i,
  /college\s*degree\s*(required|in)/i,
  /degree\s*required/i,
  /4[- ]year\s*degree/i,
  /university\s*degree/i,
  /associate'?s?\s*degree\s*(required|in)/i,
  /requires?\s*(a\s*)?(bachelor|master|college|university)\s*degree/i,
];

/**
 * Check if text matches any pattern in the array
 */
function matchesAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text));
}

/**
 * Extract the matching text from patterns
 */
function extractMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
}

/**
 * Analyze a job's text content to determine experience and degree requirements.
 *
 * @param title - Job title
 * @param description - Full job description
 * @param snippet - Job snippet/summary
 * @returns Analysis result with requirement info and qualification status
 */
export function analyzeJobRequirements(
  title: string,
  description: string,
  snippet: string
): JobRequirementAnalysis {
  // Combine all text for analysis
  const fullText = `${title} ${description} ${snippet}`.toLowerCase();

  // Check for explicit "no experience" statements
  const hasNoExperienceStatement = matchesAnyPattern(fullText, NO_EXPERIENCE_PATTERNS);
  const noExperienceMatch = hasNoExperienceStatement
    ? extractMatch(fullText, NO_EXPERIENCE_PATTERNS)
    : null;

  // Check for explicit experience requirements (disqualifying)
  const hasExperienceRequirement = matchesAnyPattern(fullText, EXPERIENCE_REQUIRED_PATTERNS);
  const experienceRequirementMatch = hasExperienceRequirement
    ? extractMatch(fullText, EXPERIENCE_REQUIRED_PATTERNS)
    : null;

  // Check for explicit "no degree" statements
  const hasNoDegreeStatement = matchesAnyPattern(fullText, NO_DEGREE_PATTERNS);
  const noDegreeMatch = hasNoDegreeStatement
    ? extractMatch(fullText, NO_DEGREE_PATTERNS)
    : null;

  // Check for explicit degree requirements (disqualifying)
  const hasDegreeRequirement = matchesAnyPattern(fullText, DEGREE_REQUIRED_PATTERNS);
  const degreeRequirementMatch = hasDegreeRequirement
    ? extractMatch(fullText, DEGREE_REQUIRED_PATTERNS)
    : null;

  // Determine experience requirement status
  let experienceRequired: string | null = null;
  if (hasNoExperienceStatement && !hasExperienceRequirement) {
    experienceRequired = "none";
  } else if (hasExperienceRequirement) {
    experienceRequired = experienceRequirementMatch;
  }
  // If neither is found, experienceRequired remains null (not explicitly stated)

  // Determine degree requirement status
  let degreeRequired: string | null = null;
  if (hasNoDegreeStatement && !hasDegreeRequirement) {
    degreeRequired = "none";
  } else if (hasDegreeRequirement) {
    degreeRequired = degreeRequirementMatch;
  }
  // If neither is found, degreeRequired remains null (not explicitly stated)

  // Job qualifies only if BOTH requirements are explicitly stated as "none"
  const meetsEntryCriteria = experienceRequired === "none" && degreeRequired === "none";

  return {
    experienceRequired,
    degreeRequired,
    meetsEntryCriteria,
  };
}

/**
 * Parse salary string to extract numeric value
 * Examples: "$100,000 - $150,000", "100k-150k/year", "$120,000"
 */
export function parseSalary(salaryString: string): { min: number | null; max: number | null } {
  if (!salaryString) {
    return { min: null, max: null };
  }

  const cleanedSalary = salaryString.toLowerCase().replace(/,/g, "");

  // Try to find salary patterns
  // Pattern: $XXX,XXX or XXXk
  const dollarPattern = /\$?\s*(\d+(?:\.\d+)?)\s*k?/gi;
  const matches: number[] = [];

  let match;
  while ((match = dollarPattern.exec(cleanedSalary)) !== null) {
    const matchValue = match[1];
    if (!matchValue) continue;
    let value = parseFloat(matchValue);
    // If value is less than 1000 and contains 'k' context, multiply by 1000
    if (value < 1000 && (cleanedSalary.includes("k") || match[0].includes("k"))) {
      value *= 1000;
    }
    // Only include values that look like annual salaries
    if (value >= 10000 && value <= 10000000) {
      matches.push(value);
    }
  }

  if (matches.length === 0) {
    return { min: null, max: null };
  }

  if (matches.length === 1) {
    const value = matches[0] ?? null;
    return { min: value, max: value };
  }

  // Sort and return min/max
  matches.sort((a, b) => a - b);
  const minVal = matches[0] ?? null;
  const maxVal = matches[matches.length - 1] ?? null;
  return { min: minVal, max: maxVal };
}

/**
 * Detect remote work type from job text
 */
export function detectRemoteType(
  title: string,
  location: string,
  description: string
): "remote" | "hybrid" | "onsite" | null {
  const fullText = `${title} ${location} ${description}`.toLowerCase();

  // Check for remote indicators
  if (
    fullText.includes("fully remote") ||
    fullText.includes("100% remote") ||
    fullText.includes("work from home") ||
    fullText.includes("work remotely") ||
    /remote\s*(position|role|job|opportunity)/i.test(fullText) ||
    location.toLowerCase().includes("remote")
  ) {
    return "remote";
  }

  // Check for hybrid indicators
  if (
    fullText.includes("hybrid") ||
    fullText.includes("remote/onsite") ||
    fullText.includes("onsite/remote") ||
    /\d+\s*days?\s*(in\s*office|onsite)/i.test(fullText)
  ) {
    return "hybrid";
  }

  // Default to null if not explicitly stated
  return null;
}
