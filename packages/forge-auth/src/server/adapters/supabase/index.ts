import type { AuthProviderId, OAuthProfile } from "@handharr-labs/forge-core";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type {
  AuthBundle,
  DefineAuthConfig,
  SignInOptions,
  SupabaseServerConfig,
} from "../../../shared/config";
import { createSupabaseMiddleware } from "../../../middleware/supabase";
import { sanitizeRelativePath } from "../../../shared/redirect";
import { createSupabaseGateway, type AdminSignOut } from "./gateway";
import type { RawSupabaseSession } from "./mapSession";

/** Build a request-scoped Supabase server client from the app's cookie handlers. */
async function createClientForRequest(cfg: SupabaseServerConfig) {
  if (!cfg.cookies) {
    throw new Error(
      "[web-auth] supabase adapter: `supabase.cookies` is required for server-side " +
        "session access (bind it to next/headers `cookies()` in the app).",
    );
  }
  const handlers = await cfg.cookies();
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: { getAll: handlers.getAll, setAll: handlers.setAll },
  });
}

/** Reader that validates via getUser() and reads token/expiry via getSession(). */
function buildReader(cfg: SupabaseServerConfig): () => Promise<RawSupabaseSession | null> {
  return async () => {
    const client = await createClientForRequest(cfg);
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return null;

    const {
      data: { session },
    } = await client.auth.getSession();

    return {
      user,
      access_token: session?.access_token,
      expires_at: session?.expires_at,
    };
  };
}

/** Revoke all sessions for a user via GoTrue's admin logout endpoint (userId-based). */
function buildAdminSignOut(cfg: SupabaseServerConfig): AdminSignOut | undefined {
  if (!cfg.serviceRoleKey) return undefined;
  const serviceRoleKey = cfg.serviceRoleKey;
  return async (userId: string) => {
    const res = await fetch(`${cfg.url}/auth/v1/admin/users/${userId}/logout`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!res.ok) {
      throw new Error(`[web-auth] supabase signOutAllSessions failed: ${res.status}`);
    }
  };
}

/**
 * Composes the `supabase` adapter into an `AuthBundle`. Internal — apps call
 * `defineAuth`. The gateway additionally implements `ProviderTokenAccess` and,
 * when a service-role key is configured, `RevocableSessions`. OAuth providers are
 * configured in the Supabase dashboard, so there are no provider credentials here.
 */
export function createSupabaseAdapter(config: DefineAuthConfig): AuthBundle {
  const cfg = config.supabase!;
  const gateway = createSupabaseGateway({
    readRawSession: buildReader(cfg),
    adminSignOut: buildAdminSignOut(cfg),
  });

  return {
    gateway,
    // Supabase's OAuth callback exchanges the `?code=` for a session on GET.
    // NOTE: unlike NextAuth's `[...nextauth]` route, mount these at the app's
    // Supabase callback route, e.g. `app/auth/callback/route.ts`:
    //   export const { GET } = auth.handlers;
    // and point the OAuth `redirectTo` at `/auth/callback`.
    handlers: {
      GET: async (request: Request) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        if (code) {
          const client = await createClientForRequest(cfg);
          await client.auth.exchangeCodeForSession(code);

          // Provisioning (optional): first sign-in upserts the app's `users`
          // row. Omit `provisioner` for JWT-only. Mirrors the nextauth adapter —
          // `providerAccountId` carries the Supabase auth user id, which is what
          // the port's `Session.user.id` resolves to.
          if (config.provisioner) {
            const {
              data: { user },
            } = await client.auth.getUser();
            if (user?.email) {
              const meta = (user.user_metadata ?? {}) as {
                full_name?: string | null;
                name?: string | null;
                avatar_url?: string | null;
              };
              const profile: OAuthProfile = {
                provider: "google",
                providerAccountId: user.id,
                email: user.email,
                name: meta.full_name ?? meta.name ?? undefined,
                imageUrl: meta.avatar_url ?? undefined,
              };
              await config.provisioner.onSignIn(profile);
            }
          }
        }
        // `next` is user-controlled — constrain to a same-origin relative path.
        const next = sanitizeRelativePath(url.searchParams.get("next"), "/");
        // MUST be NextResponse.redirect (not the native Response.redirect): the
        // session cookies written by exchangeCodeForSession via the cookie store
        // are only merged onto a NextResponse, so a plain Response drops them and
        // the session never persists.
        return NextResponse.redirect(new URL(next, url.origin));
      },
      POST: async () => new Response(null, { status: 405 }),
    },
    middleware: createSupabaseMiddleware({
      url: cfg.url,
      anonKey: cfg.anonKey,
      loginPath: config.loginPath,
      publicPaths: config.publicPaths,
    }),
    requireSession: () => gateway.requireSession(),
    async signIn(provider: AuthProviderId, opts?: SignInOptions) {
      const client = await createClientForRequest(cfg);
      const { data } = await client.auth.signInWithOAuth({
        provider,
        options:
          opts?.redirectTo || opts?.queryParams
            ? { redirectTo: opts.redirectTo, queryParams: opts.queryParams }
            : undefined,
      });
      if (data?.url) redirect(data.url);
    },
    async signOut(opts?: { redirectTo?: string }) {
      const client = await createClientForRequest(cfg);
      await client.auth.signOut({ scope: "global" });
      redirect(sanitizeRelativePath(opts?.redirectTo, config.loginPath ?? "/login"));
    },
  };
}
