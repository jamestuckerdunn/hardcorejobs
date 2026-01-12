import { z } from "zod";

// Common validation patterns
const uuidSchema = z.string().uuid();
const urlSchema = z.string().url();

// Jobs API validation
export const jobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  remote_type: z.enum(["remote", "hybrid", "onsite"]).optional(),
  salary_min: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["recent", "salary-high", "salary-low", "featured"]).default("recent"),
});

export type JobsQuery = z.infer<typeof jobsQuerySchema>;

// Job ID validation
export const jobIdSchema = z.object({
  id: uuidSchema,
});

// Stripe checkout validation
export const checkoutSchema = z.object({
  type: z.enum(["featured_job", "resume_subscription"]),
  jobId: uuidSchema.optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Profile validation
export const profileSchema = z.object({
  fullName: z.string().min(1).max(100),
  headline: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  willingToRelocate: z.boolean().default(true),
  phone: z.string().max(20).optional(),
  linkedinUrl: urlSchema.optional().or(z.literal("")),
  portfolioUrl: urlSchema.optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// Job application validation
export const applicationSchema = z.object({
  jobId: uuidSchema,
  coverLetter: z.string().max(5000).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// Job alert validation
export const jobAlertSchema = z.object({
  keywords: z.array(z.string().max(50)).max(10).optional(),
  locations: z.array(z.string().max(100)).max(5).optional(),
  minSalary: z.number().int().min(0).optional(),
  remoteOnly: z.boolean().default(false),
  frequency: z.enum(["instant", "daily", "weekly"]).default("daily"),
});

export type JobAlertInput = z.infer<typeof jobAlertSchema>;

// Helper function to parse and validate request body
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ data: T; error: null } | { data: null; error: z.ZodError }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error };
    }
    throw error;
  }
}

// Helper to parse query params
export function parseQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): { data: T; error: null } | { data: null; error: z.ZodError } {
  try {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const data = schema.parse(params);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error };
    }
    throw error;
  }
}

// Format Zod errors for API response
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
