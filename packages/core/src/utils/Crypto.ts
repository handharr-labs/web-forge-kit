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

/**
 * Constant-time string comparison — prevents timing attacks on token/secret
 * comparison.
 *
 * Uses the double-HMAC technique: both inputs are HMAC'd under a single
 * per-call random key, producing two fixed-length (32-byte) digests that are
 * then compared without early return. Because the digests are always the same
 * length regardless of input, neither the length nor the content of `a`/`b`
 * leaks through timing.
 */
export async function safeCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    crypto.getRandomValues(new Uint8Array(32)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigA = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(a)));
  const sigB = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(b)));

  let diff = 0;
  for (let i = 0; i < sigA.length; i++) {
    diff |= sigA[i] ^ sigB[i];
  }
  return diff === 0;
}
