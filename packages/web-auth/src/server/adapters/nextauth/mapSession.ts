import type { Session } from "@handharr-labs/core";

/** The subset of a NextAuth session object this adapter reads. */
export interface RawNextAuthSession {
  user?: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  } | null;
  expires?: string;
}

/**
 * Pure mapping: NextAuth's session shape → the port's `Session`.
 * Returns null for an absent or user-less session so the gateway can report
 * "unauthenticated" uniformly. `id` falls back to email when the app runs
 * JWT-only without a provisioner (no app user id assigned).
 */
export function mapNextAuthSession(raw: RawNextAuthSession | null | undefined): Session | null {
  const user = raw?.user;
  if (!user || !user.email) return null;

  return {
    user: {
      id: user.id ?? user.email,
      email: user.email,
      name: user.name ?? undefined,
      imageUrl: user.image ?? undefined,
    },
    expiresAt: raw?.expires ?? new Date(0).toISOString(),
  };
}
