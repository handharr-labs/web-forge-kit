import type {
  AuthGateway,
  AuthProviderId,
  AuthProvisioner,
  Session,
} from "@handharr-labs/core";

/** Which adapter backs `defineAuth` / `defineAuthClient`. Swaps everything. */
export type AdapterId = "nextauth" | "supabase";

/** Per-provider config. Keys of the `providers` map declare enabled providers;
 *  values carry adapter-specific config. */
export interface GoogleProviderConfig {
  /** Required for the `nextauth` adapter; ignored for `supabase` (dashboard-set). */
  clientId?: string;
  clientSecret?: string;
}

export interface ProvidersConfig {
  google?: GoogleProviderConfig;
}

/** The single server-side config the app supplies. */
export interface DefineAuthConfig {
  adapter: AdapterId;
  /** JWT signing / session secret (app-supplied, e.g. AUTH_SECRET). */
  secret: string;
  /** Extensible map — keys enable providers, values carry adapter config. */
  providers: ProvidersConfig;
  /** Optional — omit for JWT-only (no DB `users` row). */
  provisioner?: AuthProvisioner;
  /** NextAuth (JWT) adapter only — Supabase manages its own refresh lifetime. */
  sessionMaxAgeSec?: number;
  /** Branded sign-in page path. Default '/login'. */
  loginPath?: string;
  /** Supabase adapter only — project URL, anon key, and cookie access. */
  supabase?: SupabaseServerConfig;
}

/**
 * Request-scoped cookie access. The app supplies this (it's the one place
 * `next/headers` is unavoidable) so the package never imports `next/headers`.
 */
export interface CookieHandlers {
  getAll(): { name: string; value: string }[];
  setAll(
    cookies: { name: string; value: string; options?: Record<string, unknown> }[],
  ): void;
}

export interface SupabaseServerConfig {
  url: string;
  anonKey: string;
  /** Returns request-scoped cookie handlers (app binds `next/headers` here). */
  cookies?: () => CookieHandlers;
  /** Service-role key — enables admin capabilities (RevocableSessions). Server-only. */
  serviceRoleKey?: string;
}

/** Framework route handlers re-exported from `app/api/auth/[...nextauth]/route.ts`. */
export interface RouteHandlers {
  GET: unknown;
  POST: unknown;
}

/** Everything `defineAuth` returns pre-wired. `adapter` is the only thing that changes it. */
export interface AuthBundle {
  /** Inject into DI — the port the app's domain depends on. */
  gateway: AuthGateway;
  /** Re-export from `app/api/auth/[...nextauth]/route.ts`. */
  handlers: RouteHandlers;
  /** Edge route-protection — `export default auth.middleware`. */
  middleware: (req: unknown) => Promise<unknown>;
  /** Guard for RSC / route handlers — throws `UnauthorizedError`. */
  requireSession: () => Promise<Session>;
  /**
   * Server-side redirect into the provider's sign-in. Calls `redirect()`, so it
   * must run inside a request scope (server action / route handler / RSC).
   * NOTE: for a true one-click flow prefer the client `authClient.signIn` — the
   * NextAuth adapter's server helper may route through NextAuth's own page.
   */
  signIn: (provider: AuthProviderId, opts?: { redirectTo?: string }) => Promise<void>;
  /** Clear the session and redirect. Request-scope only (see `signIn`). */
  signOut: (opts?: { redirectTo?: string }) => Promise<void>;
}

export const DEFAULT_LOGIN_PATH = "/login";
