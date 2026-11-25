import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  formatDateRange,
  formatCurrency,
  formatRelativeTime,
  formatRelative,
  formatNumber,
  formatList,
  getPluralCategory,
  clearFormatterCache,
  LruFormatterCache,
} from './index';

beforeEach(() => {
  clearFormatterCache();
});

describe('Native Intl Formatting Engine', () => {
  describe('formatDate', () => {
    it('formats dates consistently in default en-US locale', () => {
      const d = new Date(Date.UTC(2026, 4, 15, 12, 0, 0));
      const formatted = formatDate(
        d,
        { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' },
        'en-US'
      );
      expect(formatted).toBe('May 15, 2026');
    });

    it('formats ISO date strings and numeric timestamps', () => {
      const strFormatted = formatDate('2026-05-15T12:00:00Z', {
        timeZone: 'UTC',
        year: 'numeric',
      });
      expect(strFormatted).toBe('2026');

      const numFormatted = formatDate(Date.UTC(2026, 4, 15), {
        timeZone: 'UTC',
        year: 'numeric',
      });
      expect(numFormatted).toBe('2026');
    });

    it('formats in alternate locales (de-DE, fr-FR)', () => {
      const d = new Date(Date.UTC(2026, 9, 31));
      const de = formatDate(
        d,
        { timeZone: 'UTC', month: 'long', year: 'numeric' },
        'de-DE'
      );
      expect(de.toLowerCase()).toContain('oktober');

      const fr = formatDate(
        d,
        { timeZone: 'UTC', month: 'long', year: 'numeric' },
        'fr-FR'
      );
      expect(fr.toLowerCase()).toContain('octobre');
    });

    it('returns empty string for invalid dates', () => {
      expect(formatDate('invalid-date-string')).toBe('');
      expect(formatDate(NaN)).toBe('');
      expect(formatDate(new Date('invalid'))).toBe('');
    });

    it('falls back gracefully on malformed locale tags', () => {
      const d = new Date(Date.UTC(2026, 4, 15));
      const res = formatDate(d, { timeZone: 'UTC' }, 'bad---tag!@#$');
      expect(typeof res).toBe('string');
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe('formatDateRange', () => {
    it('formats range between two dates in same month', () => {
      const start = new Date(Date.UTC(2026, 4, 15));
      const end = new Date(Date.UTC(2026, 4, 20));
      const range = formatDateRange(
        start,
        end,
        { timeZone: 'UTC', month: 'short', day: 'numeric' },
        'en-US'
      );
      expect(range).toContain('May 15');
      expect(range).toContain('20');
    });

    it('formats range spanning different months and years', () => {
      const start = new Date(Date.UTC(2025, 11, 28));
      const end = new Date(Date.UTC(2026, 0, 4));
      const range = formatDateRange(
        start,
        end,
        { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' },
        'en-US'
      );
      expect(range).toContain('2025');
      expect(range).toContain('2026');
    });

    it('handles numeric timestamp inputs for range', () => {
      const start = Date.UTC(2026, 2, 1);
      const end = Date.UTC(2026, 2, 10);
      const range = formatDateRange(
        start,
        end,
        { timeZone: 'UTC', month: 'short', day: 'numeric' },
        'en-US'
      );
      expect(range).toContain('Mar 1');
      expect(range).toContain('10');
    });

    it('returns empty string if start or end is invalid', () => {
      expect(formatDateRange('invalid', new Date())).toBe('');
      expect(formatDateRange(new Date(), 'invalid')).toBe('');
      expect(formatDateRange(NaN, NaN)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD currency correctly in en-US', () => {
      const usd = formatCurrency(1234.5, 'USD', undefined, 'en-US');
      expect(usd).toContain('$1,234.50');
    });

    it('formats EUR currency correctly in fr-FR and de-DE', () => {
      const fr = formatCurrency(1234.5, 'EUR', undefined, 'fr-FR');
      expect(fr.replace(/\s/g, ' ')).toContain('1 234,50');

      const de = formatCurrency(1234.5, 'EUR', undefined, 'de-DE');
      expect(de.replace(/\s/g, ' ')).toContain('1.234,50');
    });

    it('formats zero-decimal currencies like JPY', () => {
      const jpy = formatCurrency(5000, 'JPY', undefined, 'ja-JP');
      expect(jpy).toMatch(/￥\s*5,000/);
    });

    it('formats negative currency amounts', () => {
      const neg = formatCurrency(-49.99, 'USD', undefined, 'en-US');
      expect(neg).toContain('-$49.99');
    });

    it('supports custom currencyDisplay options (name, code, symbol)', () => {
      const name = formatCurrency(
        100,
        'USD',
        { currencyDisplay: 'name' },
        'en-US'
      );
      expect(name).toContain('US dollars');

      const code = formatCurrency(
        100,
        'USD',
        { currencyDisplay: 'code' },
        'en-US'
      );
      expect(code).toContain('USD');
    });

    it('defensively handles invalid numbers and invalid currency codes', () => {
      expect(formatCurrency(NaN, 'USD')).toBe('');
      expect(formatCurrency('100' as unknown as number, 'USD')).toBe('');

      const invalidCode = formatCurrency(100, 'XYZ_NOT_REAL');
      expect(typeof invalidCode).toBe('string');
      expect(invalidCode.length).toBeGreaterThan(0);
    });
  });

  describe('formatRelativeTime & formatRelative', () => {
    it('formats past and future days', () => {
      expect(formatRelativeTime(-1, 'day', undefined, 'en-US')).toBe(
        'yesterday'
      );
      expect(formatRelativeTime(1, 'day', undefined, 'en-US')).toBe('tomorrow');
      expect(formatRelativeTime(-5, 'day', undefined, 'en-US')).toBe(
        '5 days ago'
      );
      expect(formatRelativeTime(5, 'day', undefined, 'en-US')).toBe(
        'in 5 days'
      );
    });

    it('formats hours, minutes, and seconds', () => {
      expect(formatRelativeTime(-2, 'hour', undefined, 'en-US')).toBe(
        '2 hours ago'
      );
      expect(formatRelativeTime(30, 'minute', undefined, 'en-US')).toBe(
        'in 30 minutes'
      );
      expect(formatRelativeTime(-10, 'second', undefined, 'en-US')).toBe(
        '10 seconds ago'
      );
    });

    it('supports numeric: "always"', () => {
      const always = formatRelativeTime(
        -1,
        'day',
        { numeric: 'always' },
        'en-US'
      );
      expect(always).toBe('1 day ago');
    });

    it('formatRelative is a functional alias for formatRelativeTime', () => {
      expect(formatRelative(-1, 'day', undefined, 'en-US')).toBe(
        formatRelativeTime(-1, 'day', undefined, 'en-US')
      );
    });

    it('returns empty string for invalid numeric input', () => {
      expect(formatRelativeTime(NaN, 'day')).toBe('');
      expect(formatRelativeTime('5' as unknown as number, 'day')).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('formats standard integers with thousand separators', () => {
      expect(formatNumber(1000000, undefined, 'en-US')).toBe('1,000,000');
      expect(formatNumber(1234567.89, undefined, 'en-US')).toBe('1,234,567.89');
    });

    it('formats percentages', () => {
      expect(formatNumber(0.42, { style: 'percent' }, 'en-US')).toBe('42%');
      expect(
        formatNumber(
          0.125,
          { style: 'percent', minimumFractionDigits: 1 },
          'en-US'
        )
      ).toBe('12.5%');
    });

    it('formats compact notation', () => {
      expect(formatNumber(1500000, { notation: 'compact' }, 'en-US')).toBe(
        '1.5M'
      );
      expect(formatNumber(2500, { notation: 'compact' }, 'en-US')).toBe('2.5K');
    });

    it('returns empty string for NaN or non-number inputs', () => {
      expect(formatNumber(NaN)).toBe('');
      expect(formatNumber('42' as unknown as number)).toBe('');
    });
  });

  describe('formatList', () => {
    it('formats lists with default conjunction ("and")', () => {
      expect(
        formatList(['Apple', 'Banana', 'Orange'], undefined, 'en-US')
      ).toBe('Apple, Banana, and Orange');
    });

    it('formats lists with two items', () => {
      expect(formatList(['Cats', 'Dogs'], undefined, 'en-US')).toBe(
        'Cats and Dogs'
      );
    });

    it('formats lists with single item', () => {
      expect(formatList(['Solo'], undefined, 'en-US')).toBe('Solo');
    });

    it('returns empty string for empty array or non-array', () => {
      expect(formatList([])).toBe('');
      expect(formatList(null as unknown as string[])).toBe('');
    });

    it('formats lists with disjunction ("or")', () => {
      const disj = formatList(
        ['Tea', 'Coffee'],
        { type: 'disjunction' },
        'en-US'
      );
      expect(disj).toBe('Tea or Coffee');
    });
  });

  describe('getPluralCategory', () => {
    it('resolves English cardinal plural rules (one vs other)', () => {
      expect(getPluralCategory(1, undefined, 'en-US')).toBe('one');
      expect(getPluralCategory(0, undefined, 'en-US')).toBe('other');
      expect(getPluralCategory(2, undefined, 'en-US')).toBe('other');
      expect(getPluralCategory(100, undefined, 'en-US')).toBe('other');
    });

    it('resolves Arabic plural rules (zero, one, two, few, many, other)', () => {
      expect(getPluralCategory(0, undefined, 'ar-EG')).toBe('zero');
      expect(getPluralCategory(1, undefined, 'ar-EG')).toBe('one');
      expect(getPluralCategory(2, undefined, 'ar-EG')).toBe('two');
      expect(getPluralCategory(3, undefined, 'ar-EG')).toBe('few');
      expect(getPluralCategory(11, undefined, 'ar-EG')).toBe('many');
      expect(getPluralCategory(100, undefined, 'ar-EG')).toBe('other');
    });

    it('resolves Russian plural rules (one, few, many)', () => {
      expect(getPluralCategory(1, undefined, 'ru-RU')).toBe('one');
      expect(getPluralCategory(2, undefined, 'ru-RU')).toBe('few');
      expect(getPluralCategory(5, undefined, 'ru-RU')).toBe('many');
    });

    it('resolves ordinal plural rules', () => {
      expect(getPluralCategory(1, { type: 'ordinal' }, 'en-US')).toBe('one'); // 1st
      expect(getPluralCategory(2, { type: 'ordinal' }, 'en-US')).toBe('two'); // 2nd
      expect(getPluralCategory(3, { type: 'ordinal' }, 'en-US')).toBe('few'); // 3rd
      expect(getPluralCategory(4, { type: 'ordinal' }, 'en-US')).toBe('other'); // 4th
    });
  });

  describe('LruFormatterCache unit tests', () => {
    it('respects maximum capacity and evicts oldest entries', () => {
      const cache = new LruFormatterCache<string, number>(3);
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(cache.size).toBe(3);

      cache.set('d', 4); // should evict 'a'
      expect(cache.size).toBe(3);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('updates access order on get', () => {
      const cache = new LruFormatterCache<string, number>(2);
      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a'); // 'a' is now most recently used; 'b' is oldest
      cache.set('c', 3); // should evict 'b'

      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('a')).toBe(1);
      expect(cache.get('c')).toBe(3);
    });

    it('clears all items on clear()', () => {
      const cache = new LruFormatterCache<string, number>(5);
      cache.set('x', 10);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('x')).toBeUndefined();
    });
  });
});
