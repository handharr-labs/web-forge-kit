import { isDomainError, type Result, type DomainError } from "@handharr-labs/forge-core";

export interface ServerActionResult<T> {
  data?: T;
  error?: string;
}

export function handleServerActionError(error: unknown): string {
  if (isDomainError(error)) return error.message;
  return "An unexpected error occurred.";
}

/**
 * Converts a domain `Result` into the serialization-friendly `ServerActionResult`
 * returned across the server→client boundary. Keep `Result` everywhere inside;
 * convert only at the Server Action edge.
 *
 *   "use server";
 *   export async function updateEmployeeAction(form: FormData) {
 *     const result = await useCase.execute(parse(form));
 *     return toServerActionResult(result);
 *   }
 */
export function toServerActionResult<T>(
  result: Result<T, DomainError>
): ServerActionResult<T> {
  return result.ok ? { data: result.value } : { error: result.error.message };
}
