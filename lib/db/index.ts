import { neon, neonConfig } from "@neondatabase/serverless";

// Get connection string from various possible env var names
function getConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.hardcorejobs_POSTGRES_URL ||
    null
  );
}

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Lazy initialization to avoid build-time errors
let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  if (sqlInstance) return sqlInstance;

  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error(
      "Database connection string not found. Please set POSTGRES_URL or DATABASE_URL environment variable."
    );
  }

  sqlInstance = neon(connectionString);
  return sqlInstance;
}

// Type for query results
type QueryResult = Record<string, unknown>[];

// Export sql as a tagged template function
export function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<QueryResult> {
  return getSql()(strings, ...values) as Promise<QueryResult>;
}

// Helper function for transactions
export async function withTransaction<T>(
  callback: (db: typeof sql) => Promise<T>
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

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return !!getConnectionString();
}
