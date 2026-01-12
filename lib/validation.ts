// Simple input validation utilities for API routes

export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 10000); // Limit string length
}

export function sanitizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
}

export function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function sanitizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const phone = value.trim().replace(/[^\d+\-().\s]/g, "");
  return phone.length >= 7 && phone.length <= 20 ? phone : null;
}

export function sanitizeUUID(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value) ? value : null;
}

export function sanitizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return false;
}

export function sanitizeInt(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number | null {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (typeof num !== "number" || isNaN(num)) return null;
  if (num < min || num > max) return null;
  return Math.floor(num);
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(
  fields: Record<string, unknown>,
  required: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const field of required) {
    const value = fields[field];
    if (value === undefined || value === null || value === "") {
      errors.push({ field, message: `${field} is required` });
    }
  }
  return errors;
}
