import { describe, expect, it, vi } from "vitest";
import type { DefineAuthConfig } from "./config";
import { validateAuthConfig } from "./validate";

const nextauth: DefineAuthConfig = {
  adapter: "nextauth",
  secret: "s",
  providers: { google: { clientId: "id", clientSecret: "secret" } },
};

const supabase: DefineAuthConfig = {
  adapter: "supabase",
  secret: "s",
  providers: { google: {} },
  supabase: { url: "https://x.supabase.co", anonKey: "anon" },
};

describe("validateAuthConfig", () => {
  it("passes a valid nextauth config", () => {
    expect(() => validateAuthConfig(nextauth)).not.toThrow();
  });

  it("throws when secret is missing", () => {
    expect(() => validateAuthConfig({ ...nextauth, secret: "" })).toThrow(/secret/);
  });

  it("throws when no provider is enabled", () => {
    expect(() => validateAuthConfig({ ...nextauth, providers: {} })).toThrow(/providers/);
  });

  it("throws when nextauth google is missing credentials", () => {
    expect(() =>
      validateAuthConfig({ ...nextauth, providers: { google: { clientId: "id" } } }),
    ).toThrow(/clientId.*clientSecret/);
  });

  it("passes a valid supabase config", () => {
    expect(() => validateAuthConfig(supabase)).not.toThrow();
  });

  it("throws when supabase url/anonKey missing", () => {
    expect(() =>
      validateAuthConfig({ ...supabase, supabase: undefined }),
    ).toThrow(/supabase\.url/);
  });

  it("warns (does not throw) when creds are passed to the supabase adapter", () => {
    const warn = vi.fn();
    validateAuthConfig(
      { ...supabase, providers: { google: { clientId: "id", clientSecret: "x" } } },
      warn,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("dashboard"));
  });

  it("warns when sessionMaxAgeSec is passed to the supabase adapter", () => {
    const warn = vi.fn();
    validateAuthConfig({ ...supabase, sessionMaxAgeSec: 3600 }, warn);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("sessionMaxAgeSec"));
  });
});
