import type { AuthProviderId, AuthUser } from "@handharr-labs/core";
import type { ReactNode, JSX } from "react";
import type { AdapterId, SignInOptions } from "../shared/config";

export type { SignInOptions } from "../shared/config";

export interface DefineAuthClientConfig {
  adapter: AdapterId;
  /** Supabase adapter only — browser client credentials. */
  supabase?: { url: string; anonKey: string };
}

export type SessionStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export interface UseSessionResult {
  status: SessionStatus;
  user: AuthUser | null;
  error?: Error;
}

/**
 * The one client-side surface an app touches. Same shape regardless of adapter,
 * so app UI is provider-agnostic.
 */
export interface AuthClient {
  /** Mount once at the app root — supplies session context so `useSession` works. */
  AuthProvider: (props: { children: ReactNode }) => JSX.Element;
  useSession(): UseSessionResult;
  signIn(provider: AuthProviderId, opts?: SignInOptions): Promise<void>;
  signOut(opts?: { redirectTo?: string }): Promise<void>;
}
