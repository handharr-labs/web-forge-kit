// Database
export type { DatabaseClient } from "./db/DatabaseClient";

// Server Actions
export type { ServerActionResult } from "./actions/ServerActionError";
export { handleServerActionError, toServerActionResult } from "./actions/ServerActionError";

// Supabase data/storage client (auth lives in @handharr-labs/web-auth)
export type { SupabaseCookieHandlers } from "./db/supabase";
export { createSupabaseServerClient, createSupabaseAdminClient } from "./db/supabase";
