import { createPool } from "@vercel/postgres";

// Create pool with explicit connection string from Vercel-created env vars
const pool = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.hardcorejobs_POSTGRES_URL,
});

export const sql = pool.sql;
export { pool };

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
