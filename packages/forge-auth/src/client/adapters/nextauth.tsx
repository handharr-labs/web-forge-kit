"use client";

import type { AuthProviderId, AuthUser } from "@handharr-labs/forge-core";
import {
  SessionProvider,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession as useNextAuthSession,
} from "next-auth/react";
import type { ReactNode } from "react";
import type { AuthClient, SignInOptions, UseSessionResult } from "../config";

/** Map NextAuth's client session user → the port's `AuthUser`. */
function toAuthUser(user: {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): AuthUser | null {
  if (!user.email) return null;
  return {
    id: user.id ?? user.email,
    email: user.email,
    name: user.name ?? undefined,
    imageUrl: user.image ?? undefined,
  };
}

export function createNextAuthClient(): AuthClient {
  return {
    AuthProvider: ({ children }: { children: ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    ),
    useSession(): UseSessionResult {
      const { data, status } = useNextAuthSession();
      const user = data?.user ? toAuthUser(data.user) : null;
      return { status, user };
    },
    async signIn(provider: AuthProviderId, opts?: SignInOptions) {
      // NextAuth forwards a 3rd arg as OAuth authorization params (e.g. `prompt`).
      await nextAuthSignIn(provider, { callbackUrl: opts?.redirectTo }, opts?.queryParams);
    },
    async signOut(opts?: { redirectTo?: string }) {
      await nextAuthSignOut({ callbackUrl: opts?.redirectTo });
    },
  };
}
