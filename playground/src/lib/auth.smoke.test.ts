import { defineAuth } from "@handharr-labs/web-auth/server";
import { describe, expect, it } from "vitest";

/**
 * Smoke test for the reference wiring — proves the `nextauth` adapter composes
 * into a complete, correctly-shaped `AuthBundle` and validates config fail-fast,
 * over the public API.
 *
 * Session-resolution and `requireSession`-throwing behavior go through NextAuth's
 * `getServerSession`, which requires a Next request scope, so they are asserted in
 * the adapter-agnostic conformance suite instead (both adapters pass it):
 * `packages/web-auth/src/server/adapters/**\/*.test.ts` via `runAuthGatewayConformance`.
 * A live OAuth flow additionally needs real Google creds — an ops step, not code.
 */
const config = {
  adapter: "nextauth" as const,
  secret: "test-secret",
  providers: { google: { clientId: "id", clientSecret: "secret" } },
};

describe("reference wiring: defineAuth(nextauth)", () => {
  it("returns a complete AuthBundle", () => {
    const auth = defineAuth(config);
    expect(typeof auth.handlers.GET).toBe("function");
    expect(typeof auth.handlers.POST).toBe("function");
    expect(typeof auth.middleware).toBe("function");
    expect(typeof auth.requireSession).toBe("function");
    expect(typeof auth.signIn).toBe("function");
    expect(typeof auth.signOut).toBe("function");
    expect(typeof auth.gateway.getSession).toBe("function");
    expect(typeof auth.gateway.requireSession).toBe("function");
  });

  it("fails fast when required provider credentials are missing", () => {
    expect(() =>
      defineAuth({ ...config, providers: { google: { clientId: "id" } } }),
    ).toThrow(/clientId.*clientSecret/);
  });

  it("fails fast when the signing secret is missing", () => {
    expect(() => defineAuth({ ...config, secret: "" })).toThrow(/secret/);
  });
});
