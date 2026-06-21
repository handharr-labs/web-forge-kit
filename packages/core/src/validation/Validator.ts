import { ValidationError } from "../primitives/DomainError";

export interface ValidationFieldError {
  readonly field: string;
  readonly message: string;
}

export interface ValidationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors?: ValidationFieldError[];
}

export interface Validator<T> {
  /** Returns a result — never throws. */
  validate(data: unknown): ValidationResult<T>;
  /** Returns parsed data or throws ValidationError. */
  parse(data: unknown): T;
}

/**
 * Adapter for Zod schemas.
 * Install zod separately: npm install zod
 *
 * Usage:
 *   import { z } from "zod";
 *   const schema = z.object({ name: z.string(), age: z.number() });
 *   const validator = new ZodValidator(schema);
 */
export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: {
    safeParse(data: unknown): { success: true; data: T } | { success: false; error: { errors: { path: (string | number)[]; message: string }[] } };
  }) {}

  validate(data: unknown): ValidationResult<T> {
    const result = this.schema.safeParse(data);
    if (result.success) return { success: true, data: result.data };
    return {
      success: false,
      errors: result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    };
  }

  parse(data: unknown): T {
    const result = this.validate(data);
    if (!result.success) {
      const message = result.errors?.map((e) => `${e.field}: ${e.message}`).join(", ") ?? "Validation failed";
      throw new ValidationError(message, this.toFieldMap(result.errors));
    }
    return result.data!;
  }

  private toFieldMap(
    errors?: ValidationFieldError[]
  ): Record<string, string[]> | undefined {
    if (!errors) return undefined;
    return errors.reduce<Record<string, string[]>>((acc, e) => {
      acc[e.field] = [...(acc[e.field] ?? []), e.message];
      return acc;
    }, {});
  }
}
