import type { AuthProviderId } from "@handharr-labs/forge-core";
import NextAuth, { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { AuthBundle, DefineAuthConfig, SignInOptions } from "../../../shared/config";
import { buildAuthOptions } from "./authOptions";
import { createNextAuthGateway } from "./gateway";
import { createNextAuthMiddleware } from "../../../middleware/nextauth";

/**
 * Composes the `nextauth` adapter into an `AuthBundle`. Internal — apps call
 * `defineAuth`, never this. Maps the v5-flavored bundle sketch onto NextAuth v4's
 * real API: `NextAuth(options)` for handlers, `getServerSession` for the gateway,
 * `next-auth/middleware` for edge protection, redirect-based server sign-in/out.
 */
export function createNextAuthAdapter(config: DefineAuthConfig): AuthBundle {
  const authOptions = buildAuthOptions(config);
  const handler = NextAuth(authOptions);

  const gateway = createNextAuthGateway(() => getServerSession(authOptions));

  return {
    gateway,
    handlers: { GET: handler, POST: handler },
    middleware: createNextAuthMiddleware(config),
    requireSession: () => gateway.requireSession(),
    // NextAuth v4 has NO server-side one-click signIn/signOut: the real
    // one-click flow (POST + CSRF token) lives in the client — prefer
    // `authClient.signIn('google')`. These server helpers GET-redirect to
    // NextAuth's own pages (which may show an interstitial) for redirect-flow
    // convenience. Both call `redirect()`, so they only work inside a request
    // scope (server action / route handler / RSC) and throw NEXT_REDIRECT there.
    async signIn(provider: AuthProviderId, opts?: SignInOptions) {
      // queryParams (e.g. `prompt`) aren't forwarded through the GET-redirect
      // server helper — use the client `authClient.signIn` for those.
      const params = opts?.redirectTo
        ? `?callbackUrl=${encodeURIComponent(opts.redirectTo)}`
        : "";
      redirect(`/api/auth/signin/${provider}${params}`);
    },
    async signOut(opts?: { redirectTo?: string }) {
      const params = opts?.redirectTo
        ? `?callbackUrl=${encodeURIComponent(opts.redirectTo)}`
        : "";
      redirect(`/api/auth/signout${params}`);
    },
  };
}
