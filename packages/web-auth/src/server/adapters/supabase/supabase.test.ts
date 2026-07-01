import { describe, expect, it } from "vitest";
import { runAuthGatewayConformance } from "../../../conformance";
import { createSupabaseGateway } from "./gateway";
import { mapSupabaseSession, type RawSupabaseSession } from "./mapSession";

// 4070908800 === 2099-01-01T00:00:00Z in unix seconds.
const RAW: RawSupabaseSession = {
  user: {
    id: "u_1",
    email: "a@b.com",
    user_metadata: { full_name: "A", avatar_url: "https://x/y.png" },
  },
  access_token: "tok_123",
  expires_at: 4070908800,
};

runAuthGatewayConformance({
  name: "supabase",
  gatewayFor: (state) =>
    createSupabaseGateway({
      readRawSession: async () => (state === "authenticated" ? RAW : null),
    }),
  expectedSession: {
    user: { id: "u_1", email: "a@b.com", name: "A", imageUrl: "https://x/y.png" },
    expiresAt: "2099-01-01T00:00:00.000Z",
  },
});

describe("supabase adapter capabilities", () => {
  it("exposes the native access token via ProviderTokenAccess", async () => {
    const gateway = createSupabaseGateway({ readRawSession: async () => RAW });
    expect(await gateway.getAccessToken()).toBe("tok_123");
  });

  it("only exposes signOutAllSessions when an admin signer is wired", () => {
    const withoutAdmin = createSupabaseGateway({ readRawSession: async () => null });
    expect("signOutAllSessions" in withoutAdmin).toBe(false);

    const withAdmin = createSupabaseGateway({
      readRawSession: async () => null,
      adminSignOut: async () => {},
    });
    expect("signOutAllSessions" in withAdmin).toBe(true);
  });

  it("maps user_metadata name fallbacks", () => {
    const mapped = mapSupabaseSession({
      user: { id: "u_2", email: "c@d.com", user_metadata: { name: "Only Name" } },
      expires_at: 4070908800,
    });
    expect(mapped?.user.name).toBe("Only Name");
    expect(mapped?.user.imageUrl).toBeUndefined();
  });
});
