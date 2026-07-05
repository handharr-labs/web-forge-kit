import { defineAuth } from "@handharr-labs/forge-auth/server";

/**
 * Reference wiring — the ONE server-side auth config an app writes.
 * Swap `adapter: 'nextauth'` → `'supabase'` and nothing else in the app changes.
 *
 * Secrets are the app's own — read from env here (apps may read process.env; the
 * kit package never does). For a real app, register the OAuth callback URL in
 * Google Cloud Console per environment (see docs/guides/auth-consumer-guide.md).
 */
export const auth = defineAuth({
  adapter: "nextauth",
  secret: process.env.AUTH_SECRET ?? "dev-secret-change-me",
  providers: {
    google: {
      // Placeholders keep the reference buildable; real apps supply real creds.
      clientId: process.env.GOOGLE_ID ?? "dev-google-client-id",
      clientSecret: process.env.GOOGLE_SECRET ?? "dev-google-client-secret",
    },
  },
  // provisioner is optional — omit for JWT-only (no DB `users` row).
});
