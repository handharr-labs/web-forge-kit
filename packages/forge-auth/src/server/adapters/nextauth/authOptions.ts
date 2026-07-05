import type { AuthProviderId, AuthUser } from "@handharr-labs/forge-core";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefineAuthConfig } from "../../../shared/config";
import { DEFAULT_LOGIN_PATH } from "../../../shared/config";

/** We stash the resolved app user on the JWT so `session` can expose it. */
declare module "next-auth/jwt" {
  interface JWT {
    appUser?: AuthUser;
  }
}

/**
 * Build NextAuth v4 options from the kit's `DefineAuthConfig`. The provisioner
 * (if supplied) runs once, in the `jwt` callback on first sign-in, and its result
 * is carried on the token so every later request exposes the app's `AuthUser`
 * without re-provisioning. JWT session strategy — stateless, fits serverless.
 */
export function buildAuthOptions(config: DefineAuthConfig): NextAuthOptions {
  const providers: NextAuthOptions["providers"] = [];

  if (config.providers.google) {
    providers.push(
      GoogleProvider({
        clientId: config.providers.google.clientId ?? "",
        clientSecret: config.providers.google.clientSecret ?? "",
      }),
    );
  }

  return {
    secret: config.secret,
    providers,
    session: {
      strategy: "jwt",
      ...(config.sessionMaxAgeSec ? { maxAge: config.sessionMaxAgeSec } : {}),
    },
    pages: { signIn: config.loginPath ?? DEFAULT_LOGIN_PATH },
    callbacks: {
      async jwt({ token, account, profile, user }) {
        // First sign-in only: `account` is present. Provision (or synthesize)
        // the app user, then cache it on the token for subsequent requests.
        if (account && user) {
          const oauthProfile = {
            provider: account.provider as AuthProviderId,
            providerAccountId: account.providerAccountId,
            email: user.email ?? (profile as { email?: string } | undefined)?.email ?? "",
            name: user.name ?? undefined,
            imageUrl: user.image ?? undefined,
          };

          token.appUser = config.provisioner
            ? await config.provisioner.onSignIn(oauthProfile)
            : {
                id: token.sub ?? oauthProfile.providerAccountId,
                email: oauthProfile.email,
                name: oauthProfile.name,
                imageUrl: oauthProfile.imageUrl,
              };
        }
        return token;
      },
      async session({ session, token }) {
        if (token.appUser) {
          // Augment NextAuth's session user with the app id — read back by
          // mapNextAuthSession. Cast: NextAuth's default user type omits `id`.
          session.user = {
            ...session.user,
            id: token.appUser.id,
            email: token.appUser.email,
            name: token.appUser.name ?? null,
            image: token.appUser.imageUrl ?? null,
          } as typeof session.user;
        }
        return session;
      },
    },
  };
}
