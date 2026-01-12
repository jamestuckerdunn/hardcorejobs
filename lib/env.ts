import { z } from "zod";

// Environment variable schema
const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),

  // Stripe (optional - features disabled if not set)
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_FEATURED_JOB_PRICE_ID: z.string().min(1).optional(),
  STRIPE_RESUME_DB_PRICE_ID: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  CRON_SECRET: z.string().min(16).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Job Board APIs (all optional)
  ADZUNA_APP_ID: z.string().optional(),
  ADZUNA_API_KEY: z.string().optional(),
  RAPIDAPI_KEY: z.string().optional(),
  THEMUSE_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment at runtime
let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  validatedEnv = result.data;
  return validatedEnv;
}

// Check if required features are available
export function hasDatabase(): boolean {
  const env = getEnv();
  return !!(env.POSTGRES_URL || env.DATABASE_URL);
}

export function hasStripe(): boolean {
  const env = getEnv();
  return !!(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function hasAuth(): boolean {
  const env = getEnv();
  return !!(env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}

// Log available features on startup (call this in instrumentation.ts)
export function logFeatureAvailability(): void {
  const features = {
    database: hasDatabase(),
    stripe: hasStripe(),
    auth: hasAuth(),
  };

  console.log("🔧 Feature availability:", features);

  if (!features.database) {
    console.warn("⚠️  Database not configured - some features will be unavailable");
  }
  if (!features.stripe) {
    console.warn("⚠️  Stripe not configured - payment features disabled");
  }
  if (!features.auth) {
    console.warn("⚠️  Auth not configured - authentication disabled");
  }
}
