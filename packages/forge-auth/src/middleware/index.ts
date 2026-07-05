/**
 * `@handharr-labs/forge-auth/middleware` — edge-safe entrypoint.
 *
 * No `server-only` guard and no Node adapter, so it is safe to import from
 * Next.js `middleware.ts` (edge runtime). `defineAuth().middleware` delegates
 * here; apps can also build a middleware directly:
 *
 *   // middleware.ts
 *   import { createAuthMiddleware } from '@handharr-labs/forge-auth/middleware';
 *   export default createAuthMiddleware({ adapter: 'nextauth', secret: env.AUTH_SECRET });
 *   export const config = { matcher: ['/dashboard/:path*'] };
 */
import type { AdapterId } from "../shared/config";
import { createNextAuthMiddleware } from "./nextauth";
import { createSupabaseMiddleware } from "./supabase";

export interface AuthMiddlewareConfig {
  adapter: AdapterId;
  secret?: string;
  loginPath?: string;
  /**
   * Paths refreshed but never redirected when unauthenticated (supabase adapter).
   * `'/'` matches the exact root; other entries match by prefix.
   */
  publicPaths?: string[];
  supabase?: { url: string; anonKey: string };
}

export function createAuthMiddleware(
  config: AuthMiddlewareConfig,
): (req: unknown) => Promise<unknown> {
  if (config.adapter === "supabase") {
    if (!config.supabase) {
      throw new Error("[web-auth/middleware] supabase adapter requires `supabase` config.");
    }
    return createSupabaseMiddleware({
      ...config.supabase,
      loginPath: config.loginPath,
      publicPaths: config.publicPaths,
    });
  }

  if (!config.secret) {
    throw new Error("[web-auth/middleware] nextauth adapter requires `secret`.");
  }
  return createNextAuthMiddleware({ secret: config.secret, loginPath: config.loginPath });
}

export { createNextAuthMiddleware } from "./nextauth";
export { createSupabaseMiddleware } from "./supabase";
