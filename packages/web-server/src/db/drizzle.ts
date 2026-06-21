import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { DatabaseClient } from "./DatabaseClient";

export interface DrizzlePostgresConfig {
  connectionString: string;
  /** postgres.js `prepare` option. Defaults to false (required for Supabase transaction pooler). */
  prepare?: boolean;
  /** Additional postgres.js options. */
  options?: Record<string, unknown>;
}

export function createDrizzlePostgresClient(
  config: DrizzlePostgresConfig,
): DatabaseClient<PostgresJsDatabase> {
  const client = postgres(config.connectionString, {
    prepare: config.prepare ?? false,
    ...config.options,
  });
  return { db: drizzle(client) };
}
