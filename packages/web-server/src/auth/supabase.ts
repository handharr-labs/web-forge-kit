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
