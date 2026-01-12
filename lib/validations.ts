import { z } from "zod";

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

// Stripe checkout validation
export const checkoutSchema = z.object({
  type: z.enum(["featured_job", "resume_subscription"]),
  jobId: z.string().uuid().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

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
