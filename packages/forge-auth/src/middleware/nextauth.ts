import { withAuth } from "next-auth/middleware";
import type { DefineAuthConfig } from "../shared/config";
import { DEFAULT_LOGIN_PATH } from "../shared/config";

/**
 * Edge-safe NextAuth route guard. Uses only the edge-runnable config subset
 * (`secret` + `pages`) — no providers, no provisioner, no Node adapter — so it
 * runs in Next.js `middleware.ts` on the edge runtime. The app scopes it with a
 * `matcher` in its own middleware config export.
 */
export function createNextAuthMiddleware(
  config: Pick<DefineAuthConfig, "secret" | "loginPath">,
): (req: unknown) => Promise<unknown> {
  const handler = withAuth({
    secret: config.secret,
    pages: { signIn: config.loginPath ?? DEFAULT_LOGIN_PATH },
  });

  return handler as unknown as (req: unknown) => Promise<unknown>;
}
