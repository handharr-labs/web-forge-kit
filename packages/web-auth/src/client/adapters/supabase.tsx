"use client";

import type { AuthProviderId, AuthUser } from "@handharr-labs/core";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthClient, SessionStatus, UseSessionResult } from "../config";

/** Map a Supabase user → the port's `AuthUser`. */
function toAuthUser(user: User | null): AuthUser | null {
  if (!user?.email) return null;
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    name: meta.full_name ?? meta.name ?? undefined,
    imageUrl: meta.avatar_url ?? undefined,
  };
}

export function createSupabaseClient(config: { url: string; anonKey: string }): AuthClient {
  const client: SupabaseClient = createBrowserClient(config.url, config.anonKey);

  const SessionContext = createContext<UseSessionResult>({
    status: "loading",
    user: null,
  });

  const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<UseSessionResult>({
      status: "loading",
      user: null,
    });

    useEffect(() => {
      let active = true;

      client.auth
        .getUser()
        .then(({ data, error }) => {
          if (!active) return;
          if (error) {
            setState({ status: "error", user: null, error });
            return;
          }
          const user = toAuthUser(data.user);
          setState({
            status: user ? "authenticated" : "unauthenticated",
            user,
          });
        })
        .catch((error: Error) => {
          if (active) setState({ status: "error", user: null, error });
        });

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        const user = toAuthUser(session?.user ?? null);
        const status: SessionStatus = user ? "authenticated" : "unauthenticated";
        setState({ status, user });
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }, []);

    return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
  };

  return {
    AuthProvider,
    useSession(): UseSessionResult {
      return useContext(SessionContext);
    },
    async signIn(provider: AuthProviderId, opts?: { redirectTo?: string }) {
      await client.auth.signInWithOAuth({
        provider,
        options: opts?.redirectTo ? { redirectTo: opts.redirectTo } : undefined,
      });
    },
    async signOut(opts?: { redirectTo?: string }) {
      await client.auth.signOut({ scope: "global" });
      if (opts?.redirectTo && typeof window !== "undefined") {
        window.location.assign(opts.redirectTo);
      }
    },
  };
}
