// Supabase as a browser DATA client (RLS-authorized reads) — not auth.
// Authentication lives in `@handharr-labs/web-auth`; this factory is for
// data/storage access from the browser.
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient(url: string, anonKey: string) {
  return createBrowserClient(url, anonKey);
}
