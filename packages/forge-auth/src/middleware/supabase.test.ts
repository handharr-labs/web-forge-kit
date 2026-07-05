import { describe, expect, it } from "vitest";
import { isPublicPath } from "./supabase";

// Mirrors xpnsio's guard: '/' and the auth/login flows stay public (refreshed
// but never redirected — which is what preserves the iOS-Safari-PWA cookie
// behavior), everything else is protected.
const PUBLIC = ["/", "/login", "/auth"];

describe("isPublicPath", () => {
  it("matches '/' only exactly, never as a prefix", () => {
    expect(isPublicPath("/", PUBLIC)).toBe(true);
    expect(isPublicPath("/dashboard", PUBLIC)).toBe(false);
    expect(isPublicPath("/transactions", PUBLIC)).toBe(false);
  });

  it("matches a non-root entry exactly and by path segment prefix", () => {
    expect(isPublicPath("/login", PUBLIC)).toBe(true);
    expect(isPublicPath("/auth/callback", PUBLIC)).toBe(true);
  });

  it("does not treat a shared string prefix as a match", () => {
    expect(isPublicPath("/authenticate", PUBLIC)).toBe(false);
    expect(isPublicPath("/logins", PUBLIC)).toBe(false);
  });

  it("treats everything as protected when no public paths are configured", () => {
    expect(isPublicPath("/", [])).toBe(false);
    expect(isPublicPath("/login", [])).toBe(false);
  });
});
