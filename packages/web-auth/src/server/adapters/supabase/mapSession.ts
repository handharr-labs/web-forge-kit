import type { Session } from "@handharr-labs/core";

/** The subset of a Supabase session this adapter reads. */
export interface RawSupabaseSession {
  user: {
    id: string;
    email?: string | null;
    user_metadata?: {
      full_name?: string | null;
      name?: string | null;
      avatar_url?: string | null;
    } | null;
  } | null;
  access_token?: string;
  /** Unix seconds. */
  expires_at?: number;
}

/**
 * Pure mapping: Supabase's session shape → the port's `Session`. Produces the
 * identical shape the NextAuth adapter does, which is what lets the app swap
 * adapters without touching a line — verified by the conformance suite.
 */
export function mapSupabaseSession(raw: RawSupabaseSession | null | undefined): Session | null {
  const user = raw?.user;
  if (!user || !user.email) return null;

  const meta = user.user_metadata ?? {};
  return {
    user: {
      id: user.id,
      email: user.email,
      name: meta.full_name ?? meta.name ?? undefined,
      imageUrl: meta.avatar_url ?? undefined,
    },
    expiresAt: raw?.expires_at
      ? new Date(raw.expires_at * 1000).toISOString()
      : new Date(0).toISOString(),
  };
}
