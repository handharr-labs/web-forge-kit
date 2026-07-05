export interface EnvField {
  /** Throws at startup if missing and no default provided. */
  required?: boolean;
  default?: string;
  /** Mask value in error messages (passwords, secrets). */
  secret?: boolean;
}

type EnvSchema = Record<string, EnvField>;
type EnvOutput<T extends EnvSchema> = {
  readonly [K in keyof T]: string;
};

/**
 * Validates and returns typed env vars at module load time.
 * Missing required vars throw immediately — fail fast, not at runtime.
 *
 * Usage:
 *   export const env = createEnv({
 *     API_URL:      { required: true },
 *     API_TIMEOUT:  { required: true, default: "30000" },
 *     STRIPE_KEY:   { required: true, secret: true },
 *   });
 */
/**
 * Default env source. Read via `globalThis` rather than the Node-only `process`
 * global so `core` stays platform-agnostic — it compiles and runs unchanged in
 * the browser and Edge runtimes (where `process` is absent) without requiring
 * `@types/node`. Node callers get `process.env` automatically.
 */
const defaultEnvSource: Record<string, string | undefined> =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export function createEnv<T extends EnvSchema>(
  schema: T,
  source: Record<string, string | undefined> = defaultEnvSource
): EnvOutput<T> {
  const result: Record<string, string> = {};
  const missing: string[] = [];

  for (const [key, field] of Object.entries(schema)) {
    const raw = source[key] ?? field.default;

    if (raw === undefined || raw === "") {
      if (field.required !== false) {
        missing.push(key);
      }
      continue;
    }

    result[key] = raw;
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}`
    );
  }

  return result as EnvOutput<T>;
}
