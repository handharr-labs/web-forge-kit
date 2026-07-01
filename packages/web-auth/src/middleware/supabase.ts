import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOGIN_PATH } from "../shared/config";

/**
 * Edge-safe Supabase route guard. `@supabase/ssr`'s `createServerClient` is
 * edge-native — the middleware refreshes the session (rotating cookies onto the
 * response) and redirects unauthenticated requests to the login page.
 */
export function createSupabaseMiddleware(config: {
  url: string;
  anonKey: string;
  loginPath?: string;
}): (req: unknown) => Promise<unknown> {
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

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = config.loginPath ?? DEFAULT_LOGIN_PATH;
      return NextResponse.redirect(url);
    }

    return response;
  };
}
