import { describe, expect, it } from "vitest";
import { mapNextAuthSession } from "./mapSession";

describe("mapNextAuthSession", () => {
  it("returns null for null / undefined / user-less sessions", () => {
    expect(mapNextAuthSession(null)).toBeNull();
    expect(mapNextAuthSession(undefined)).toBeNull();
    expect(mapNextAuthSession({})).toBeNull();
    expect(mapNextAuthSession({ user: null })).toBeNull();
  });

  it("returns null when the session user has no email", () => {
    expect(mapNextAuthSession({ user: { name: "A" } })).toBeNull();
  });

  it("maps a full session to the port shape", () => {
    expect(
      mapNextAuthSession({
        user: { id: "u_1", email: "a@b.com", name: "A", image: "https://x/y.png" },
        expires: "2099-01-01T00:00:00.000Z",
      }),
    ).toEqual({
      user: { id: "u_1", email: "a@b.com", name: "A", imageUrl: "https://x/y.png" },
      expiresAt: "2099-01-01T00:00:00.000Z",
    });
  });

  it("falls back id to email when no app user id is present (JWT-only)", () => {
    const mapped = mapNextAuthSession({
      user: { email: "a@b.com" },
      expires: "2099-01-01T00:00:00.000Z",
    });
    expect(mapped?.user.id).toBe("a@b.com");
    expect(mapped?.user.name).toBeUndefined();
    expect(mapped?.user.imageUrl).toBeUndefined();
  });
});
