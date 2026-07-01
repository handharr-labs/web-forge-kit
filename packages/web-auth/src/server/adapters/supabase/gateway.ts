import type {
  AuthGateway,
  ProviderTokenAccess,
  RevocableSessions,
  Session,
} from "@handharr-labs/core";
import { UnauthorizedError } from "@handharr-labs/core";
import { mapSupabaseSession, type RawSupabaseSession } from "./mapSession";

/** Reads the current raw Supabase session. Injectable for conformance testing. */
export type RawSupabaseReader = () => Promise<RawSupabaseSession | null>;

/** Revokes every session for a user (admin scope). Injected — needs service role. */
export type AdminSignOut = (userId: string) => Promise<void>;

export interface SupabaseGatewayDeps {
  readRawSession: RawSupabaseReader;
  /** Optional — only present when a service-role key is configured. */
  adminSignOut?: AdminSignOut;
}

/**
 * The Supabase-backed gateway. Implements the base `AuthGateway` plus the
 * capability interfaces Supabase can honor: `ProviderTokenAccess` (the native
 * access token, for RLS-authorized queries) and — when an admin signer is wired —
 * `RevocableSessions` (instant "log out all devices", which JWT can't do).
 */
export function createSupabaseGateway(
  deps: SupabaseGatewayDeps,
): AuthGateway & ProviderTokenAccess & Partial<RevocableSessions> {
  const getSession = async (): Promise<Session | null> =>
    mapSupabaseSession(await deps.readRawSession());

  const base: AuthGateway & ProviderTokenAccess = {
    getSession,
    async requireSession(): Promise<Session> {
      const session = await getSession();
      if (!session) throw new UnauthorizedError();
      return session;
    },
    async getAccessToken(): Promise<string | null> {
      const raw = await deps.readRawSession();
      return raw?.access_token ?? null;
    },
  };

  if (deps.adminSignOut) {
    return { ...base, signOutAllSessions: deps.adminSignOut };
  }
  return base;
}
