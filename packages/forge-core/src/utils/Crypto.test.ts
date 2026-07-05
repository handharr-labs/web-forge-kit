import { describe, it, expect } from "vitest";
import { generateId, sha256, randomBytes, safeCompare } from "./Crypto";

describe("generateId", () => {
  it("returns a v4 UUID", () => {
    expect(generateId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("returns a different value each call", () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe("sha256", () => {
  it("matches the known digest for the empty string", async () => {
    expect(await sha256("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });

  it("matches the known digest for 'abc'", async () => {
    expect(await sha256("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });
});

describe("randomBytes", () => {
  it("returns the requested length", () => {
    expect(randomBytes(16)).toHaveLength(16);
  });
});

describe("safeCompare", () => {
  it("returns true for equal strings", async () => {
    expect(await safeCompare("s3cr3t-token", "s3cr3t-token")).toBe(true);
  });

  it("returns false for strings differing by one char", async () => {
    expect(await safeCompare("s3cr3t-token", "s3cr3t-tokeN")).toBe(false);
  });

  it("returns false for strings of different length", async () => {
    expect(await safeCompare("short", "short-and-longer")).toBe(false);
  });

  it("returns true for two empty strings", async () => {
    expect(await safeCompare("", "")).toBe(true);
  });
});
