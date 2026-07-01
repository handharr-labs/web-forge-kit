/**
 * Local-time date formatting.
 *
 * `Date.prototype.toISOString()` formats in UTC, so near midnight it reports the
 * wrong calendar day for users east/west of UTC (e.g. 00:20 in Jakarta / GMT+7
 * is still "yesterday" in UTC). These helpers format in the runtime's *local*
 * timezone instead.
 */

/**
 * Format a `Date` in local time using a small token pattern.
 *
 * Supported tokens (date-only): `yyyy`, `yy`, `MM`, `M`, `dd`, `d`.
 * Any other characters are emitted verbatim, so separators like `-`, `/`, or `.`
 * work as-is.
 *
 * Defaults to `yyyy-MM-dd` — the ISO 8601 calendar date. That is the format
 * required by `<input type="date">`, typical SQL `date` columns, and
 * lexicographic date comparison, so prefer the default for values you store,
 * submit, or compare. Reach for a custom pattern only for human-facing display.
 *
 * @example formatLocalDate(new Date(2026, 6, 2))              // "2026-07-02"
 * @example formatLocalDate(new Date(2026, 6, 2), 'dd/MM/yyyy') // "02/07/2026"
 */
export function formatLocalDate(date: Date, pattern = 'yyyy-MM-dd'): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const tokens: Record<string, string> = {
    yyyy: String(year),
    yy: pad(year % 100),
    MM: pad(month),
    M: String(month),
    dd: pad(day),
    d: String(day),
  };

  // Longest tokens first; substituted output is numeric, so already-replaced
  // characters can never re-match a (letter) token within the same pass.
  return pattern.replace(/yyyy|yy|MM|M|dd|d/g, (token) => tokens[token]);
}

/**
 * Today's calendar date in the runtime's local timezone.
 * Defaults to ISO `yyyy-MM-dd`; pass a pattern for other shapes.
 *
 * @example todayLocal()             // "2026-07-02"
 * @example todayLocal('dd/MM/yyyy') // "02/07/2026"
 */
export function todayLocal(pattern = 'yyyy-MM-dd'): string {
  return formatLocalDate(new Date(), pattern);
}
