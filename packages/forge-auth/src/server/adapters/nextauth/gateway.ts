import type { AuthGateway, Session } from "@handharr-labs/forge-core";
import { UnauthorizedError } from "@handharr-labs/forge-core";
import { mapNextAuthSession, type RawNextAuthSession } from "./mapSession";

/** Reads the current raw NextAuth session. Injectable so the gateway is testable
 *  without the full NextAuth runtime (used by the conformance suite). */
export type RawSessionReader = () => Promise<RawNextAuthSession | null>;

/**
 * The NextAuth-backed `AuthGateway`. Pure over its injected reader — all the
 * NextAuth wiring (getServerSession + authOptions) is bound in the adapter and
 * passed in, keeping this contract-shaped and unit-testable.
 */
export function createNextAuthGateway(readRawSession: RawSessionReader): AuthGateway {
  const getSession = async (): Promise<Session | null> =>
    mapNextAuthSession(await readRawSession());

  return {
    getSession,
    async requireSession(): Promise<Session> {
      const session = await getSession();
      if (!session) throw new UnauthorizedError();
      return session;
    },
  };
}
