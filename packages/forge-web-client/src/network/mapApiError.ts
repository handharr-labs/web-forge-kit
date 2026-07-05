import {
  DomainError,
  isDomainError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  UnexpectedError,
} from "@handharr-labs/forge-core";
import { isApiError } from "./ApiError";

export interface MapApiErrorOptions {
  /** Resource name used to build a NotFoundError message (e.g. "Employee"). */
  resource?: string;
}

/**
 * The transport → domain error boundary.
 *
 * Maps a thrown {@link ApiError} (or any unknown error) to a {@link DomainError},
 * so HTTP/transport concerns never leak past the Data layer. Call this in every
 * repository `catch` block:
 *
 *   try {
 *     return ok(mapDtoToEntity(await this.remote.getEmployee(id)));
 *   } catch (e) {
 *     return err(mapApiError(e, { resource: "Employee" }));
 *   }
 *
 * - An existing `DomainError` is passed through unchanged (a UseCase may have
 *   already produced a business error).
 * - Business-meaningful transport codes map to their `DomainError` subclass.
 * - Infrastructure failures (timeout, network, rate-limit, server, decoding…)
 *   map to `UnexpectedError`, preserving the original `ApiError` as `cause` so
 *   callers can still inspect `error.cause` if they need the transport detail.
 */
export function mapApiError(error: unknown, options?: MapApiErrorOptions): DomainError {
  if (isDomainError(error)) return error;
  if (!isApiError(error)) return new UnexpectedError(error);

  switch (error.code) {
    case "NOT_FOUND":
      return new NotFoundError(options?.resource ?? "Resource");
    case "UNAUTHORIZED":
      return new UnauthorizedError(error.message);
    case "FORBIDDEN":
      return new ForbiddenError(error.message);
    case "CONFLICT":
      return new ConflictError(error.message);
    case "UNPROCESSABLE":
      return new ValidationError(error.message);
    default:
      // TIMEOUT, NETWORK_ERROR, RATE_LIMITED, SERVER_ERROR, DECODING_FAILED,
      // ABORTED, INVALID_URL, UNKNOWN — no business meaning; keep the cause.
      return new UnexpectedError(error);
  }
}
