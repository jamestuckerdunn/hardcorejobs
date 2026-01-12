import { neon, neonConfig } from "@neondatabase/serverless";

// Get connection string from various possible env var names
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.hardcorejobs_POSTGRES_URL;

if (!connectionString) {
  console.warn(
    "No database connection string found. Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("POSTGRES") || k.includes("DATABASE"))
  );
}

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Create SQL template tag function
const sql = neon(connectionString || "");

export { sql };

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: typeof sql) => Promise<T>
): Promise<T> {
  try {
    await sql`BEGIN`;
    const result = await callback(sql);
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}
