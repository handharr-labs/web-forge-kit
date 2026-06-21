export interface Serializer {
  serialize<T>(value: T): string;
  deserialize<T>(raw: string): T;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/**
 * JSON serializer that preserves Date objects.
 * Dates are serialized as ISO strings and revived back to Date on deserialize.
 */
export class JsonSerializer implements Serializer {
  serialize<T>(value: T): string {
    return JSON.stringify(value, (_key, val) => {
      if (val instanceof Date) return val.toISOString();
      return val;
    });
  }

  deserialize<T>(raw: string): T {
    return JSON.parse(raw, (_key, val) => {
      if (typeof val === "string" && ISO_DATE_RE.test(val)) return new Date(val);
      return val;
    }) as T;
  }
}

export const defaultSerializer = new JsonSerializer();
