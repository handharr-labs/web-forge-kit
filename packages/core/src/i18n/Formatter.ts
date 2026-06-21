export interface NumberFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
  display?: "symbol" | "code" | "name";
}

export interface DateFormatOptions {
  style?: "full" | "long" | "medium" | "short";
  includeTime?: boolean;
}

export interface Formatter {
  number(value: number, options?: NumberFormatOptions): string;
  currency(value: number, currency: string, options?: CurrencyFormatOptions): string;
  date(value: Date, options?: DateFormatOptions): string;
  relativeTime(value: Date, from?: Date): string;
}

/**
 * Locale-aware formatter backed by the native Intl API — no external dependency.
 *
 * Usage:
 *   const fmt = new IntlFormatter("id-ID");
 *   fmt.currency(150000, "IDR")   // "Rp 150.000"
 *   fmt.relativeTime(pastDate)    // "3 menit yang lalu"
 */
export class IntlFormatter implements Formatter {
  constructor(private readonly locale: string) {}

  number(value: number, options?: NumberFormatOptions): string {
    return new Intl.NumberFormat(this.locale, options).format(value);
  }

  currency(value: number, currency: string, options?: CurrencyFormatOptions): string {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency,
      currencyDisplay: options?.display ?? "symbol",
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    }).format(value);
  }

  date(value: Date, options?: DateFormatOptions): string {
    const dateStyle = options?.style ?? "medium";
    const timeStyle = options?.includeTime ? (options.style ?? "short") : undefined;
    return new Intl.DateTimeFormat(this.locale, {
      dateStyle,
      ...(timeStyle ? { timeStyle } : {}),
    } as Intl.DateTimeFormatOptions).format(value);
  }

  relativeTime(value: Date, from: Date = new Date()): string {
    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: "auto" });
    const diffMs = value.getTime() - from.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr  = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);
    const diffWk  = Math.round(diffDay / 7);
    const diffMo  = Math.round(diffDay / 30);
    const diffYr  = Math.round(diffDay / 365);

    if (Math.abs(diffSec) < 60)  return rtf.format(diffSec, "second");
    if (Math.abs(diffMin) < 60)  return rtf.format(diffMin, "minute");
    if (Math.abs(diffHr)  < 24)  return rtf.format(diffHr,  "hour");
    if (Math.abs(diffDay) < 7)   return rtf.format(diffDay, "day");
    if (Math.abs(diffWk)  < 4)   return rtf.format(diffWk,  "week");
    if (Math.abs(diffMo)  < 12)  return rtf.format(diffMo,  "month");
    return rtf.format(diffYr, "year");
  }
}
