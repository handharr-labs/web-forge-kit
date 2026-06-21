import { isDomainError } from "@handharr-labs/core";

export interface ServerActionResult<T> {
  data?: T;
  error?: string;
}

export function handleServerActionError(error: unknown): string {
  if (isDomainError(error)) return error.message;
  return "An unexpected error occurred.";
}
