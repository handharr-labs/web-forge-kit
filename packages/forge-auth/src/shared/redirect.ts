/**
 * Constrain a redirect target to a **same-origin relative path**, defeating
 * open-redirect attacks when the target comes from user-controlled input (e.g. a
 * `?next=` query param). Anything that isn't a plain `/path` — absolute URLs,
 * protocol-relative `//host`, backslash tricks — falls back to `fallback`.
 */
export function sanitizeRelativePath(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;

  // Must start with a single "/" and not "//" or "/\" (protocol-relative / host).
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return fallback;
  }

  // Reject anything that still parses as absolute (scheme, backslashes, control chars).
  if (/[\\]|^\/*[a-z][a-z0-9+.-]*:/i.test(target)) {
    return fallback;
  }

  return target;
}
