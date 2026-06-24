import { describe, it, expect } from "vitest";
import { buildPageMeta } from "./Pagination";

describe("buildPageMeta", () => {
  it("computes totalPages by ceiling division", () => {
    expect(buildPageMeta(1, 20, 45).totalPages).toBe(3);
    expect(buildPageMeta(1, 20, 40).totalPages).toBe(2);
  });

  it("flags hasNext/hasPrev on a middle page", () => {
    const meta = buildPageMeta(2, 20, 100);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(true);
  });

  it("has no prev on the first page and no next on the last", () => {
    expect(buildPageMeta(1, 20, 100).hasPrev).toBe(false);
    expect(buildPageMeta(5, 20, 100).hasNext).toBe(false);
  });

  it("handles an empty result set", () => {
    const meta = buildPageMeta(1, 20, 0);
    expect(meta).toMatchObject({ totalPages: 0, hasNext: false, hasPrev: false });
  });

  it("treats a zero pageSize as zero pages without dividing by zero", () => {
    expect(buildPageMeta(1, 0, 50).totalPages).toBe(0);
  });
});
