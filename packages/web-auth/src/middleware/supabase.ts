import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOGIN_PATH } from "../shared/config";

/**
 * Edge-safe Supabase route guard. `@supabase/ssr`'s `createServerClient` is
 * edge-native — the middleware refreshes the session (rotating cookies onto the
 * response) and redirects unauthenticated requests to the login page.
 */
/**
 * Is `pathname` public? A `'/'` entry matches only the exact root (so it does
 * not swallow every route); any other entry matches by prefix.
 */
export function isPublicPath(pathname: string, publicPaths: string[]): boolean {
  return publicPaths.some((p) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function createSupabaseMiddleware(config: {
  url: string;
  anonKey: string;
  loginPath?: string;
  /**
   * Paths refreshed but never redirected when unauthenticated. `'/'` matches the
   * exact root only; other entries match by prefix. Preserves flows where a
   * page (not the middleware) owns the redirect — e.g. the iOS-Safari-PWA cookie
   * behavior where redirecting from middleware drops refreshed session cookies.
   */
  publicPaths?: string[];
}): (req: unknown) => Promise<unknown> {
  const publicPaths = config.publicPaths ?? [];
  return async (req: unknown) => {
    const request = req as NextRequest;
    let response = NextResponse.next({ request });

    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublicPath(request.nextUrl.pathname, publicPaths)) {
      const url = request.nextUrl.clone();
      url.pathname = config.loginPath ?? DEFAULT_LOGIN_PATH;
      return NextResponse.redirect(url);
    }

    return response;
  };
}
