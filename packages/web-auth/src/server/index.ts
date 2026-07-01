/**
 * `@handharr-labs/web-auth/server` — server-only entrypoint.
 *
 * The `server-only` import makes importing this module from a client component
 * fail at build time — the same safety the client/server package split gave us,
 * enforced per-import instead of per-package.
 */
import "server-only";

export { defineAuth } from "./defineAuth";

export type {
  AdapterId,
  AuthBundle,
  DefineAuthConfig,
  GoogleProviderConfig,
  ProvidersConfig,
  RouteHandlers,
} from "../shared/config";

// Re-export the port types apps type against, so `@handharr-labs/web-auth/server`
// is a single import surface (they still originate in `@handharr-labs/core`).
export type {
  AuthGateway,
  AuthProviderId,
  AuthProvisioner,
  AuthUser,
  OAuthProfile,
  ProviderTokenAccess,
  RevocableSessions,
  Session,
} from "@handharr-labs/core";
