/**
 * Uses the native Web Crypto API — available in Node 18+, all modern browsers,
 * and Next.js Edge Runtime. No external dependency.
 */

/** Generates a UUID v4. Use for entity IDs and idempotency keys. */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Alias — makes intent explicit at call sites for mutation requests. */
export const generateIdempotencyKey = generateId;

/**
 * SHA-256 hash of a string. Returns a lowercase hex digest.
 * Use for cache keys, content hashing — not for passwords (use bcrypt server-side).
 */
export async function sha256(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const buffer  = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Cryptographically random bytes. */
export function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/** Constant-time string comparison — prevents timing attacks on token/secret comparison. */
export async function safeCompare(a: string, b: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(a),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig1 = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(a));
  const sig2 = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(b));
  const arr1 = new Uint8Array(sig1);
  const arr2 = new Uint8Array(sig2);
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, i) => val === arr2[i]);
}
