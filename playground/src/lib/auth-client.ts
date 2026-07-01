import { defineAuthClient } from "@handharr-labs/web-auth/client";

/**
 * Reference wiring — the ONE client-side auth call an app writes.
 * Same `adapter` field as the server config; the returned client is
 * provider-agnostic, so app UI never learns the vendor.
 */
export const authClient = defineAuthClient({ adapter: "nextauth" });
