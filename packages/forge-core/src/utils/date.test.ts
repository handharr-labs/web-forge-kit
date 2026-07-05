import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatLocalDate, todayLocal } from './date';

// All dates are constructed with the local-time `new Date(y, mIndex, d, ...)`
// form and read back via local getters, so these assertions are deterministic
// regardless of the machine's timezone.

describe('formatLocalDate', () => {
  const jul2 = new Date(2026, 6, 2); // 2 Jul 2026, local

  it('defaults to ISO yyyy-MM-dd', () => {
    expect(formatLocalDate(jul2)).toBe('2026-07-02');
  });

  it('supports dd/MM/yyyy', () => {
    expect(formatLocalDate(jul2, 'dd/MM/yyyy')).toBe('02/07/2026');
  });

  it('supports MM/dd/yyyy', () => {
    expect(formatLocalDate(jul2, 'MM/dd/yyyy')).toBe('07/02/2026');
  });

  it('supports non-padded tokens and yy', () => {
    expect(formatLocalDate(new Date(2026, 0, 5), 'd/M/yy')).toBe('5/1/26');
  });

  it('emits literal separators verbatim', () => {
    expect(formatLocalDate(jul2, 'yyyy.MM.dd')).toBe('2026.07.02');
  });
});

describe('todayLocal', () => {
  afterEach(() => vi.useRealTimers());

  it('returns the current local calendar date, not the UTC one', () => {
    vi.useFakeTimers();
    // 2 Jul 2026 00:20 local. Under the old toISOString() approach this would
    // wrongly read as 1 Jul in any timezone west of the date line's UTC offset.
    vi.setSystemTime(new Date(2026, 6, 2, 0, 20));
    expect(todayLocal()).toBe('2026-07-02');
    expect(todayLocal('dd/MM/yyyy')).toBe('02/07/2026');
  });
});
