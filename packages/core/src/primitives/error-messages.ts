import type { DomainError } from "./DomainError";

const DEFAULT_MESSAGES: Record<string, string> = {
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  CONFLICT: "This action conflicts with the current state.",
  NETWORK_ERROR: "No internet connection. Please check your network.",
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
};

export function humanizeError(
  error: DomainError,
  overrides?: Record<string, string>,
): string {
  const messages = overrides ? { ...DEFAULT_MESSAGES, ...overrides } : DEFAULT_MESSAGES;
  return messages[error.code] ?? DEFAULT_MESSAGES.UNEXPECTED_ERROR;
}
