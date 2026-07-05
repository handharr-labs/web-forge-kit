/**
 * Auth port — the platform- and provider-agnostic contract every auth adapter
 * implements. Pure TypeScript, zero runtime deps, so the domain layer can depend
 * on it directly. Implementations (NextAuth, Supabase) live in
 * `@handharr-labs/forge-auth`; the contract stays here in `core`.
 */

/** Extensible — add 'github' | 'apple' | 'email' without changing the API. */
export type AuthProviderId = "google";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export interface Session {
  user: AuthUser;
  /** ISO 8601 timestamp. */
  expiresAt: string;
}

/**
 * The minimal seam every adapter implements — the intersection of what all
 * providers do cleanly. Provider-exclusive behavior lives in the optional
 * capability interfaces below, never here, so the base port stays honest.
 */
export interface AuthGateway {
  /** Current session, or null if unauthenticated. */
  getSession(): Promise<Session | null>;
  /** Current session, or throws `UnauthorizedError` if absent. */
  requireSession(): Promise<Session>;
}

/**
 * Provider-exclusive capability — instant revocation across all sessions.
 * Supabase implements it; NextAuth-JWT cannot (valid until expiry).
 * Callers narrow with `'signOutAllSessions' in gateway`.
 */
export interface RevocableSessions {
  signOutAllSessions(userId: string): Promise<void>;
}

/**
 * Provider-exclusive capability — exposes the provider-native access token so the
 * app can make row-level-security-authorized DB queries as the user. Supabase
 * implements it; the base port stays vendor-token-free.
 */
export interface ProviderTokenAccess {
  getAccessToken(): Promise<string | null>;
}

/** OAuth profile handed to the app's provisioner on sign-in. */
export interface OAuthProfile {
  provider: AuthProviderId;
  providerAccountId: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

/**
 * App-supplied provisioning contract. The adapter never touches the app's schema
 * on its own — it invokes this callback on sign-in. Omit it entirely for
 * JWT-only auth (the session carries the profile; no DB `users` row).
 */
export interface AuthProvisioner {
  /** Called on sign-in — upsert the app's `users` row and return the AuthUser. */
  onSignIn(profile: OAuthProfile): Promise<AuthUser>;
  /** Optional — called on account deletion so the app can remove its row (GDPR). */
  onDeleteUser?(userId: string): Promise<void>;
}
