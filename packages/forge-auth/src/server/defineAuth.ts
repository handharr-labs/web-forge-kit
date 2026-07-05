import type { AuthBundle, DefineAuthConfig } from "../shared/config";
import { validateAuthConfig } from "../shared/validate";
import { createNextAuthAdapter } from "./adapters/nextauth";
import { createSupabaseAdapter } from "./adapters/supabase";

/**
 * The one server-side call an app makes. Validates the config against the chosen
 * adapter (fails fast), then composes everything the app needs pre-wired into an
 * `AuthBundle`. Switching providers is a single field: `adapter`.
 */
export function defineAuth(config: DefineAuthConfig): AuthBundle {
  validateAuthConfig(config);

  switch (config.adapter) {
    case "nextauth":
      return createNextAuthAdapter(config);
    case "supabase":
      return createSupabaseAdapter(config);
    default:
      throw new Error(`[web-auth] unknown adapter: ${String(config.adapter)}`);
  }
}
