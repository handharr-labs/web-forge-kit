"use client";

/**
 * `@handharr-labs/forge-auth/client` — the one client-side call an app makes.
 * Returns an `AuthClient` (session hook + actions + provider) whose shape is
 * identical across adapters, so app UI never learns the vendor.
 */
import { createNextAuthClient } from "./adapters/nextauth";
import { createSupabaseClient } from "./adapters/supabase";
import type { AuthClient, DefineAuthClientConfig } from "./config";

export function defineAuthClient(config: DefineAuthClientConfig): AuthClient {
  switch (config.adapter) {
    case "nextauth":
      return createNextAuthClient();
    case "supabase":
      if (!config.supabase) {
        throw new Error("[web-auth/client] supabase adapter requires `supabase` config.");
      }
      return createSupabaseClient(config.supabase);
    default:
      throw new Error(`[web-auth/client] unknown adapter: ${String(config.adapter)}`);
  }
}

export type {
  AuthClient,
  DefineAuthClientConfig,
  SessionStatus,
  UseSessionResult,
} from "./config";
export type { AuthProviderId, AuthUser } from "@handharr-labs/forge-core";
