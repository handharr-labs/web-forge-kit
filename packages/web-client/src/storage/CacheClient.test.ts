import { describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCacheClient } from "./CacheClient";

afterEach(() => {
  vi.useRealTimers();
});

describe("InMemoryCacheClient", () => {
  it("stores and retrieves a value", () => {
    const cache = new InMemoryCacheClient();
    cache.set("k", { n: 1 });
    expect(cache.get<{ n: number }>("k")).toEqual({ n: 1 });
  });

  it("returns null for a missing key", () => {
    expect(new InMemoryCacheClient().get("nope")).toBeNull();
  });

  it("expires entries after their TTL", () => {
    vi.useFakeTimers();
    const cache = new InMemoryCacheClient();
    cache.set("k", "v", 1000);

    vi.advanceTimersByTime(999);
    expect(cache.get("k")).toBe("v");

    vi.advanceTimersByTime(2);
    expect(cache.get("k")).toBeNull();
  });

  it("has() reflects presence and expiry", () => {
    const cache = new InMemoryCacheClient();
    cache.set("k", "v");
    expect(cache.has("k")).toBe(true);
    cache.remove("k");
    expect(cache.has("k")).toBe(false);
  });

  it("clear() with a namespace only clears that namespace", () => {
    const a = new InMemoryCacheClient("a");
    const b = new InMemoryCacheClient("b");
    a.set("k", "av");
    b.set("k", "bv");

    a.clear();

    expect(a.get("k")).toBeNull();
    expect(b.get("k")).toBe("bv");
  });

  it("namespaces keys so two namespaces do not collide", () => {
    const a = new InMemoryCacheClient("a");
    const b = new InMemoryCacheClient("b");
    a.set("k", "av");
    b.set("k", "bv");

    expect(a.get("k")).toBe("av");
    expect(b.get("k")).toBe("bv");
  });
});
