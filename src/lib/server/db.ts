import "server-only";

import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  const {
    DATABASE_URL,
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    PGSSLMODE,
    PGPOOL_MAX,
    PGPOOL_IDLE_TIMEOUT_MS,
    PGPOOL_CONNECTION_TIMEOUT_MS,
  } = process.env;

  const hasDiscreteConfig = PGHOST && PGUSER && PGPASSWORD && PGDATABASE;
  if (!DATABASE_URL && !hasDiscreteConfig) {
    throw new Error("DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE must be set");
  }

  if (!pool) {
    const poolMax = Math.max(1, Number(PGPOOL_MAX ?? 2) || 2);
    const idleTimeoutMillis = Math.max(1_000, Number(PGPOOL_IDLE_TIMEOUT_MS ?? 10_000) || 10_000);
    const connectionTimeoutMillis = Math.max(
      1_000,
      Number(PGPOOL_CONNECTION_TIMEOUT_MS ?? 10_000) || 10_000,
    );

    pool = new Pool(
      DATABASE_URL
        ? {
            connectionString: DATABASE_URL,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
            max: poolMax,
            idleTimeoutMillis,
            connectionTimeoutMillis,
          }
        : {
            host: PGHOST,
            user: PGUSER,
            password: PGPASSWORD,
            database: PGDATABASE,
            port: PGPORT ? Number(PGPORT) : 5432,
            ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
            max: poolMax,
            idleTimeoutMillis,
            connectionTimeoutMillis,
          },
    );
  }

  return pool;
}

export async function getExistingTableNames(expectedTableNames: string[]) {
  const pool = getPool();
  if (expectedTableNames.length === 0) return new Set<string>();

  const result = await pool.query<{ table_name: string }>(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = current_schema()
       AND table_name = ANY($1::text[])`,
    [expectedTableNames],
  );

  return new Set(result.rows.map((row) => row.table_name));
}
