// Supabase as a DATABASE / STORAGE client (server-side) — not auth.
// Authentication lives in `@handharr-labs/forge-auth`; these factories give the app
// a Supabase client for data/storage access (the "dumb database" role: anon+cookies
// for RLS reads, service-role for privileged server-only queries).
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export interface SupabaseCookieHandlers {
  getAll(): { name: string; value: string }[];
  setAll(
    cookies: {
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }[],
  ): void;
}

export function createSupabaseServerClient(
  url: string,
  anonKey: string,
  cookieHandlers: SupabaseCookieHandlers,
) {
  return createServerClient(url, anonKey, { cookies: cookieHandlers });
}

export function createSupabaseAdminClient(url: string, serviceRoleKey: string) {
  return createClient(url, serviceRoleKey);
}
