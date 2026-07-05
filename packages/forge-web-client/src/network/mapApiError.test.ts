import { describe, it, expect } from "vitest";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ValidationError,
  UnexpectedError,
} from "@handharr-labs/forge-core";
import { ApiError } from "./ApiError";
import { mapApiError } from "./mapApiError";

describe("mapApiError", () => {
  it("passes an existing DomainError through unchanged", () => {
    const original = new ConflictError("already exists");
    expect(mapApiError(original)).toBe(original);
  });

  it("maps NOT_FOUND to NotFoundError, using the resource hint", () => {
    const result = mapApiError(ApiError.notFound(), { resource: "Employee" });
    expect(result).toBeInstanceOf(NotFoundError);
    expect(result.message).toBe("Employee not found");
  });

  it("maps UNAUTHORIZED / FORBIDDEN / CONFLICT / UNPROCESSABLE to their subclass", () => {
    expect(mapApiError(ApiError.unauthorized())).toBeInstanceOf(UnauthorizedError);
    expect(mapApiError(ApiError.forbidden())).toBeInstanceOf(ForbiddenError);
    expect(mapApiError(ApiError.conflict())).toBeInstanceOf(ConflictError);
    expect(mapApiError(ApiError.unprocessable())).toBeInstanceOf(ValidationError);
  });

  it("maps transport failures to UnexpectedError, preserving the ApiError as cause", () => {
    const timeout = ApiError.timeout();
    const result = mapApiError(timeout);
    expect(result).toBeInstanceOf(UnexpectedError);
    expect(result.cause).toBe(timeout);
  });

  it("maps an unknown non-ApiError to UnexpectedError", () => {
    const result = mapApiError(new Error("???"));
    expect(result).toBeInstanceOf(UnexpectedError);
  });
});
