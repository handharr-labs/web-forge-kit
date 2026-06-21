import type { Maybe } from "./Maybe";
import { isPresent } from "./Maybe";

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

// --- Constructors ---

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// --- Transforms ---

export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}

export function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  return result.ok ? result : err(fn(result.error));
}

// --- Extraction ---

export function getOrElse<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

export function getOrThrow<T, E>(result: Result<T, E>): T {
  if (!result.ok) throw result.error;
  return result.value;
}

// --- Interop with Maybe ---

export function fromMaybe<T, E>(value: Maybe<T>, error: E): Result<T, E> {
  return isPresent(value) ? ok(value) : err(error);
}

export function toMaybe<T>(result: Result<T, unknown>): T | null {
  return result.ok ? result.value : null;
}

// --- Async helpers ---

/** Wraps an async function — returns ok on resolve, err on reject. */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}
