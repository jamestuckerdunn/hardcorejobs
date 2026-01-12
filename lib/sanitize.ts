import DOMPurify from "isomorphic-dompurify";

// Configure DOMPurify with safe defaults
const purifyConfig = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "strong", "b", "em", "i", "u", "s", "strike",
    "a", "span", "div",
    "table", "thead", "tbody", "tr", "th", "td",
    "blockquote", "pre", "code",
  ],
  ALLOWED_ATTR: [
    "href", "target", "rel", "class", "id",
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target"],
  FORBID_TAGS: ["script", "style", "iframe", "form", "input", "button"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return String(DOMPurify.sanitize(dirty, purifyConfig));
}

/**
 * Sanitize and ensure links open in new tab safely
 */
export function sanitizeHtmlWithSafeLinks(dirty: string): string {
  if (!dirty) return "";

  // First sanitize
  let clean = String(DOMPurify.sanitize(dirty, purifyConfig));

  // Add rel="noopener noreferrer" to all links
  clean = clean.replace(
    /<a\s+([^>]*href=)/gi,
    '<a rel="noopener noreferrer" $1'
  );

  return clean;
}

/**
 * Strip all HTML tags and return plain text
 */
export function stripHtml(dirty: string): string {
  if (!dirty) return "";
  return String(DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], RETURN_TRUSTED_TYPE: false }));
}

/**
 * Truncate text to a maximum length, preserving word boundaries
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}
