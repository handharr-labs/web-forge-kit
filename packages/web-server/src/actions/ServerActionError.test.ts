import { describe, it, expect } from "vitest";
import { ok, err, NotFoundError } from "@handharr-labs/core";
import { handleServerActionError, toServerActionResult } from "./ServerActionError";

describe("handleServerActionError", () => {
  it("returns the message for a DomainError", () => {
    expect(handleServerActionError(new NotFoundError("Employee"))).toBe("Employee not found");
  });

  it("returns a generic message for an unknown error", () => {
    expect(handleServerActionError(new Error("stack-trace leak"))).toBe(
      "An unexpected error occurred."
    );
  });
});

describe("toServerActionResult", () => {
  it("projects an ok Result to { data }", () => {
    expect(toServerActionResult(ok({ id: "1" }))).toEqual({ data: { id: "1" } });
  });

  it("projects an err Result to { error } using the DomainError message", () => {
    expect(toServerActionResult(err(new NotFoundError("Employee")))).toEqual({
      error: "Employee not found",
    });
  });
});
