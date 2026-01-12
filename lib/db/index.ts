import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.hardcorejobs_POSTGRES_URL ||
  "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder";

const sql = neon(connectionString);

export { sql };

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
