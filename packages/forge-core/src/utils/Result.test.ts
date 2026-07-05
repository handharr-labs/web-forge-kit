import { describe, it, expect } from "vitest";
import {
  ok,
  err,
  mapResult,
  flatMapResult,
  mapError,
  getOrElse,
  getOrThrow,
  tryCatchAsync,
} from "./Result";

describe("Result", () => {
  it("ok carries the value", () => {
    const r = ok(1);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(1);
  });

  it("err carries the error", () => {
    const r = err("boom");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("boom");
  });

  it("mapResult transforms ok, passes err through", () => {
    expect(mapResult(ok(2), (n) => n * 5)).toEqual(ok(10));
    expect(mapResult(err<string>("e"), (n: number) => n * 5)).toEqual(err("e"));
  });

  it("flatMapResult chains ok, short-circuits err", () => {
    expect(flatMapResult(ok(2), (n) => ok(n + 1))).toEqual(ok(3));
    expect(flatMapResult(ok(2), () => err("bad"))).toEqual(err("bad"));
    expect(flatMapResult(err<string>("e"), () => ok(1))).toEqual(err("e"));
  });

  it("mapError transforms err, passes ok through", () => {
    expect(mapError(err("e"), (e) => `${e}!`)).toEqual(err("e!"));
    expect(mapError(ok(1), (e: string) => `${e}!`)).toEqual(ok(1));
  });

  it("getOrElse extracts value or falls back", () => {
    expect(getOrElse(ok(1), 9)).toBe(1);
    expect(getOrElse(err<string>("e"), 9)).toBe(9);
  });

  it("getOrThrow returns value or throws the error", () => {
    expect(getOrThrow(ok(1))).toBe(1);
    expect(() => getOrThrow(err(new Error("nope")))).toThrow("nope");
  });

  describe("tryCatchAsync", () => {
    it("returns ok when the fn resolves", async () => {
      expect(await tryCatchAsync(async () => 42)).toEqual(ok(42));
    });

    it("returns err with an Error when the fn rejects", async () => {
      const r = await tryCatchAsync(async () => {
        throw new Error("kaboom");
      });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.message).toBe("kaboom");
    });
  });
});
