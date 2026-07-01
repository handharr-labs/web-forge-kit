import type { AuthGateway, Session } from "@handharr-labs/core";
import { UnauthorizedError } from "@handharr-labs/core";
import { describe, expect, it } from "vitest";

/**
 * The adapter conformance suite. Any adapter that claims to implement
 * `AuthGateway` must pass this identically — that is what makes the one-field
 * `adapter` swap trustworthy: `getSession` yields the same port `Session` shape,
 * and `requireSession` throws the same `UnauthorizedError`.
 *
 * Import this only from test files — it depends on `vitest` (an optional peer
 * dep of this package; install it in the consuming project to use the suite).
 *
 * Each adapter supplies a `ConformanceAdapter` that builds a gateway backed by a
 * stubbed session source (no live OAuth), plus the port `Session` it must
 * produce for the authenticated state. Provisioner invocation is adapter-specific
 * internal wiring and is covered by each adapter's own unit tests.
 */
export interface ConformanceAdapter {
  name: string;
  /** A gateway whose backing source yields the given logical auth state. */
  gatewayFor(state: "authenticated" | "unauthenticated"): AuthGateway;
  /** The port Session the adapter must map its native session to. */
  expectedSession: Session;
}

export function runAuthGatewayConformance(adapter: ConformanceAdapter): void {
  describe(`AuthGateway conformance: ${adapter.name}`, () => {
    it("getSession returns null when unauthenticated", async () => {
      const gateway = adapter.gatewayFor("unauthenticated");
      expect(await gateway.getSession()).toBeNull();
    });

    it("getSession maps the native session to the port Session shape", async () => {
      const gateway = adapter.gatewayFor("authenticated");
      expect(await gateway.getSession()).toEqual(adapter.expectedSession);
    });

    it("requireSession throws UnauthorizedError when unauthenticated", async () => {
      const gateway = adapter.gatewayFor("unauthenticated");
      await expect(gateway.requireSession()).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("requireSession returns the session when authenticated", async () => {
      const gateway = adapter.gatewayFor("authenticated");
      expect(await gateway.requireSession()).toEqual(adapter.expectedSession);
    });
  });
}
