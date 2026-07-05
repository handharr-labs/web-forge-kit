import type { AuthProvisioner, OAuthProfile } from "@handharr-labs/forge-core";
import { describe, expect, it, vi } from "vitest";
import type { DefineAuthConfig } from "../../../shared/config";
import { buildAuthOptions } from "./authOptions";

const baseConfig: DefineAuthConfig = {
  adapter: "nextauth",
  secret: "test-secret",
  providers: { google: { clientId: "id", clientSecret: "secret" } },
};

// Minimal stand-ins for NextAuth's callback args (only fields the callbacks read).
const account = { provider: "google", providerAccountId: "google-123", type: "oauth" };
const user = { email: "a@b.com", name: "A", image: "https://x/y.png" };

describe("buildAuthOptions", () => {
  it("uses the JWT session strategy and configured login page", () => {
    const options = buildAuthOptions({ ...baseConfig, loginPath: "/enter" });
    expect(options.session?.strategy).toBe("jwt");
    expect(options.pages?.signIn).toBe("/enter");
  });

  it("applies sessionMaxAgeSec when provided", () => {
    const options = buildAuthOptions({ ...baseConfig, sessionMaxAgeSec: 3600 });
    expect(options.session?.maxAge).toBe(3600);
  });

  it("invokes the provisioner once on first sign-in and caches the app user on the token", async () => {
    const onSignIn = vi.fn(async (p: OAuthProfile) => ({
      id: "app_1",
      email: p.email,
      name: p.name,
      imageUrl: p.imageUrl,
    }));
    const provisioner: AuthProvisioner = { onSignIn };
    const options = buildAuthOptions({ ...baseConfig, provisioner });

    const token = await options.callbacks!.jwt!({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token: { sub: "google-123" } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      account: account as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: user as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: user as any,
    });

    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledWith({
      provider: "google",
      providerAccountId: "google-123",
      email: "a@b.com",
      name: "A",
      imageUrl: "https://x/y.png",
    });
    expect(token.appUser).toEqual({
      id: "app_1",
      email: "a@b.com",
      name: "A",
      imageUrl: "https://x/y.png",
    });

    // A later request (no `account`) must not re-provision.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await options.callbacks!.jwt!({ token } as any);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("synthesizes an app user from the profile when no provisioner is supplied (JWT-only)", async () => {
    const options = buildAuthOptions(baseConfig);
    const token = await options.callbacks!.jwt!({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token: { sub: "google-123" } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      account: account as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: user as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: user as any,
    });
    expect(token.appUser).toEqual({
      id: "google-123",
      email: "a@b.com",
      name: "A",
      imageUrl: "https://x/y.png",
    });
  });

  it("exposes the app user through the session callback", async () => {
    const options = buildAuthOptions(baseConfig);
    const session = await options.callbacks!.session!({
      session: { user: {}, expires: "2099-01-01T00:00:00.000Z" },
      token: { appUser: { id: "app_1", email: "a@b.com", name: "A" } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((session.user as any).id).toBe("app_1");
    expect(session.user?.email).toBe("a@b.com");
  });
});
