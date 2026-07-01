import type { DefineAuthConfig } from "./config";

/**
 * Fail-fast validation of `DefineAuthConfig` against the chosen adapter.
 * The adapter config is asymmetric (open question #1): `nextauth` requires OAuth
 * client credentials; `supabase` configures providers in its dashboard, so creds
 * are ignored and a warning is emitted if passed.
 */
export function validateAuthConfig(
  config: DefineAuthConfig,
  warn: (message: string) => void = console.warn,
): void {
  if (!config.secret) {
    throw new Error("[web-auth] `secret` is required (e.g. AUTH_SECRET).");
  }

  const enabledProviders = Object.keys(config.providers ?? {});
  if (enabledProviders.length === 0) {
    throw new Error("[web-auth] `providers` must enable at least one provider.");
  }

  if (config.adapter === "nextauth") {
    const google = config.providers.google;
    if (google && (!google.clientId || !google.clientSecret)) {
      throw new Error(
        "[web-auth] nextauth adapter: google requires `clientId` and `clientSecret`.",
      );
    }
    return;
  }

  if (config.adapter === "supabase") {
    if (!config.supabase?.url || !config.supabase?.anonKey) {
      throw new Error(
        "[web-auth] supabase adapter: `supabase.url` and `supabase.anonKey` are required.",
      );
    }
    const google = config.providers.google;
    if (google && (google.clientId || google.clientSecret)) {
      warn(
        "[web-auth] supabase adapter: provider credentials are configured in the " +
          "Supabase dashboard, not in code — `clientId`/`clientSecret` are ignored.",
      );
    }
    if (config.sessionMaxAgeSec !== undefined) {
      warn(
        "[web-auth] supabase adapter: `sessionMaxAgeSec` is ignored — Supabase " +
          "manages its own refresh lifetime.",
      );
    }
    return;
  }

  throw new Error(`[web-auth] unknown adapter: ${String((config as DefineAuthConfig).adapter)}`);
}
