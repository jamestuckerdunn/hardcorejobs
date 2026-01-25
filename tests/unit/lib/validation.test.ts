import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
  sanitizePhone,
  sanitizeUUID,
  sanitizeBoolean,
  sanitizeInt,
  validateRequired,
} from "@/lib/validation";

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("returns empty string for non-strings", () => {
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(123)).toBe("");
  });

  it("truncates long strings", () => {
    const longString = "a".repeat(15000);
    expect(sanitizeString(longString).length).toBe(10000);
  });
});

describe("sanitizeEmail", () => {
  it("validates correct emails", () => {
    expect(sanitizeEmail("test@example.com")).toBe("test@example.com");
    expect(sanitizeEmail("Test@Example.COM")).toBe("test@example.com");
  });

  it("rejects invalid emails", () => {
    expect(sanitizeEmail("notanemail")).toBeNull();
    expect(sanitizeEmail("@example.com")).toBeNull();
    expect(sanitizeEmail("test@")).toBeNull();
  });

  it("returns null for non-strings", () => {
    expect(sanitizeEmail(null)).toBeNull();
    expect(sanitizeEmail(123)).toBeNull();
  });
});

describe("sanitizeUrl", () => {
  it("validates http and https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
    expect(sanitizeUrl("http://example.com/path")).toBe(
      "http://example.com/path"
    );
  });

  it("rejects non-http protocols", () => {
    expect(sanitizeUrl("ftp://example.com")).toBeNull();
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects invalid URLs", () => {
    expect(sanitizeUrl("not a url")).toBeNull();
    expect(sanitizeUrl("")).toBeNull();
  });
});

describe("sanitizePhone", () => {
  it("accepts valid phone numbers", () => {
    expect(sanitizePhone("555-123-4567")).toBe("555-123-4567");
    expect(sanitizePhone("+1 (555) 123-4567")).toBe("+1 (555) 123-4567");
  });

  it("rejects invalid phone numbers", () => {
    expect(sanitizePhone("123")).toBeNull(); // Too short
    expect(sanitizePhone("a".repeat(25))).toBeNull(); // Too long
  });
});

describe("sanitizeUUID", () => {
  it("validates correct UUIDs", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";
    expect(sanitizeUUID(validUUID)).toBe(validUUID);
  });

  it("rejects invalid UUIDs", () => {
    expect(sanitizeUUID("not-a-uuid")).toBeNull();
    expect(sanitizeUUID("123e4567-e89b-12d3-a456")).toBeNull();
  });
});

describe("sanitizeBoolean", () => {
  it("handles boolean values", () => {
    expect(sanitizeBoolean(true)).toBe(true);
    expect(sanitizeBoolean(false)).toBe(false);
  });

  it("handles string values", () => {
    expect(sanitizeBoolean("true")).toBe(true);
    expect(sanitizeBoolean("false")).toBe(false);
  });

  it("handles numeric values", () => {
    expect(sanitizeBoolean(1)).toBe(true);
    expect(sanitizeBoolean(0)).toBe(false);
  });

  it("defaults to false for unknown values", () => {
    expect(sanitizeBoolean("yes")).toBe(false);
    expect(sanitizeBoolean(null)).toBe(false);
  });
});

describe("sanitizeInt", () => {
  it("parses valid integers", () => {
    expect(sanitizeInt(42)).toBe(42);
    expect(sanitizeInt("123")).toBe(123);
  });

  it("respects min/max bounds", () => {
    expect(sanitizeInt(5, 10, 100)).toBeNull();
    expect(sanitizeInt(150, 10, 100)).toBeNull();
    expect(sanitizeInt(50, 10, 100)).toBe(50);
  });

  it("floors decimal values", () => {
    expect(sanitizeInt(42.9)).toBe(42);
  });

  it("returns null for invalid input", () => {
    expect(sanitizeInt("not a number")).toBeNull();
    expect(sanitizeInt(NaN)).toBeNull();
  });
});

describe("validateRequired", () => {
  it("returns errors for missing fields", () => {
    const errors = validateRequired({ name: "test" }, ["name", "email"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("email");
  });

  it("returns empty array when all fields present", () => {
    const errors = validateRequired({ name: "test", email: "test@test.com" }, [
      "name",
      "email",
    ]);
    expect(errors).toHaveLength(0);
  });

  it("treats empty strings as missing", () => {
    const errors = validateRequired({ name: "" }, ["name"]);
    expect(errors).toHaveLength(1);
  });
});
