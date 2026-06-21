export type ApiErrorCode =
  | "INVALID_URL"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "UNPROCESSABLE"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "ABORTED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "DECODING_FAILED"
  | "UNKNOWN";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static invalidUrl(): ApiError {
    return new ApiError("INVALID_URL", "Invalid URL");
  }

  static notFound(resource?: string): ApiError {
    return new ApiError("NOT_FOUND", resource ? `${resource} not found` : "Not found");
  }

  static unauthorized(): ApiError {
    return new ApiError("UNAUTHORIZED", "Unauthorized");
  }

  static forbidden(): ApiError {
    return new ApiError("FORBIDDEN", "Forbidden");
  }

  static conflict(): ApiError {
    return new ApiError("CONFLICT", "Conflict");
  }

  static decodingFailed(cause: unknown): ApiError {
    return new ApiError("DECODING_FAILED", "Failed to decode response", cause);
  }

  static networkError(cause: unknown): ApiError {
    return new ApiError("NETWORK_ERROR", "Network request failed", cause);
  }

  static unprocessable(cause?: unknown): ApiError {
    return new ApiError("UNPROCESSABLE", "Unprocessable entity", cause);
  }

  static rateLimited(): ApiError {
    return new ApiError("RATE_LIMITED", "Rate limited — too many requests");
  }

  static timeout(): ApiError {
    return new ApiError("TIMEOUT", "Request timed out");
  }

  static aborted(): ApiError {
    return new ApiError("ABORTED", "Request was aborted");
  }

  static serverError(status: number): ApiError {
    return new ApiError("SERVER_ERROR", `Server error: ${status}`);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
