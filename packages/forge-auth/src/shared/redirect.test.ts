import { describe, expect, it } from "vitest";
import { sanitizeRelativePath } from "./redirect";

describe("sanitizeRelativePath", () => {
  it("passes through same-origin relative paths", () => {
    expect(sanitizeRelativePath("/dashboard")).toBe("/dashboard");
    expect(sanitizeRelativePath("/a/b?c=1#d")).toBe("/a/b?c=1#d");
  });

  it("falls back for absolute URLs (open-redirect attempt)", () => {
    expect(sanitizeRelativePath("https://evil.com")).toBe("/");
    expect(sanitizeRelativePath("http://evil.com/x", "/home")).toBe("/home");
  });

  it("falls back for protocol-relative and backslash tricks", () => {
    expect(sanitizeRelativePath("//evil.com")).toBe("/");
    expect(sanitizeRelativePath("/\\evil.com")).toBe("/");
    expect(sanitizeRelativePath("/a\\b")).toBe("/");
  });

  it("falls back for empty / missing / non-slash input", () => {
    expect(sanitizeRelativePath(undefined)).toBe("/");
    expect(sanitizeRelativePath(null)).toBe("/");
    expect(sanitizeRelativePath("")).toBe("/");
    expect(sanitizeRelativePath("dashboard")).toBe("/");
  });

  it("uses the provided fallback", () => {
    expect(sanitizeRelativePath(undefined, "/login")).toBe("/login");
  });
});
