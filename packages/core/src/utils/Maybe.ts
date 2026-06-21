/** T | null | undefined */
export type Maybe<T> = T | null | undefined;

/** Narrows to non-nullable T. Use as a type guard. */
export function isPresent<T>(value: Maybe<T>): value is T {
  return value !== null && value !== undefined;
}

/** Narrows to null | undefined. */
export function isNil<T>(value: Maybe<T>): value is null | undefined {
  return value === null || value === undefined;
}

/** Transform if present, return null otherwise. Mirrors Optional.map in Swift. */
export function mapMaybe<T, U>(value: Maybe<T>, fn: (v: T) => U): U | null {
  return isPresent(value) ? fn(value) : null;
}

/**
 * Transform with a function that may itself return null/undefined.
 * Mirrors Optional.flatMap in Swift — avoids nested Maybe<Maybe<T>>.
 */
export function flatMapMaybe<T, U>(value: Maybe<T>, fn: (v: T) => Maybe<U>): U | null {
  if (isNil(value)) return null;
  const result = fn(value);
  return isPresent(result) ? result : null;
}

/** Return value if present, otherwise the fallback. Explicit alternative to `??`. */
export function orElse<T>(value: Maybe<T>, fallback: T): T {
  return isPresent(value) ? value : fallback;
}

/** Returns value or empty string. */
export function orEmptyString(value: Maybe<string>): string {
  return isPresent(value) ? value : "";
}

/** Returns value or empty array. */
export function orEmptyArray<T>(value: Maybe<T[]>): T[] {
  return isPresent(value) ? value : [];
}

/** Returns value or empty object. */
export function orEmptyObject<T extends object>(value: Maybe<T>): T {
  return isPresent(value) ? value : ({} as T);
}

/** Returns value or 0. */
export function orZero(value: Maybe<number>): number {
  return isPresent(value) ? value : 0;
}

/** Returns value or false. */
export function orFalse(value: Maybe<boolean>): boolean {
  return isPresent(value) ? value : false;
}

/** Assert present — throws if null/undefined. Use at trust boundaries only. */
export function orThrow<T>(value: Maybe<T>, message: string): T {
  if (isNil(value)) throw new Error(message);
  return value;
}

/** Filter null/undefined from an array. Mirrors compactMap in Swift. */
export function compact<T>(array: Maybe<T>[]): T[] {
  return array.filter(isPresent);
}

/**
 * Map over an array and drop nulls from the transform result.
 * Mirrors Array.compactMap in Swift.
 */
export function compactMap<T, U>(array: T[], fn: (v: T) => Maybe<U>): U[] {
  return compact(array.map(fn));
}
