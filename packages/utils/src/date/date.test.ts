import { describe, it, expect } from 'vitest';
import {
  isValidDate,
  toDate,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isBefore,
  isAfter,
  diffInDays,
  diffInHours,
  diffInMinutes,
  formatDateIso,
} from './index';

describe('Date Utilities', () => {
  describe('isValidDate', () => {
    it('returns true only for valid Date instances', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2026-01-01'))).toBe(true);
    });

    it('returns false for invalid Date instances and non-dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate('2026-01-01')).toBe(false);
      expect(isValidDate(1700000000000)).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
      expect(isValidDate({})).toBe(false);
    });
  });

  describe('toDate', () => {
    it('converts strings and timestamps to Date objects', () => {
      const d1 = toDate('2026-06-15T12:00:00Z');
      expect(d1.toISOString()).toBe('2026-06-15T12:00:00.000Z');

      const timestamp = 1750000000000;
      const d2 = toDate(timestamp);
      expect(d2.getTime()).toBe(timestamp);
    });

    it('returns a clone when a Date instance is passed', () => {
      const original = new Date('2026-01-01T00:00:00Z');
      const clone = toDate(original);
      expect(clone.getTime()).toBe(original.getTime());
      expect(clone).not.toBe(original);
    });

    it('throws TypeError for invalid date representations', () => {
      expect(() => toDate('invalid-date')).toThrow(TypeError);
      expect(() => toDate(NaN)).toThrow(TypeError);
    });
  });

  describe('addDays & subDays', () => {
    it('adds and subtracts positive days', () => {
      const base = new Date('2026-03-10T12:00:00Z');
      expect(addDays(base, 5).toISOString().startsWith('2026-03-15')).toBe(
        true
      );
      expect(subDays(base, 5).toISOString().startsWith('2026-03-05')).toBe(
        true
      );
    });

    it('handles negative days and zero correctly', () => {
      const base = new Date('2026-03-10T12:00:00Z');
      expect(addDays(base, -3).toISOString().startsWith('2026-03-07')).toBe(
        true
      );
      expect(addDays(base, 0).toISOString()).toBe(base.toISOString());
    });

    it('crosses month boundaries', () => {
      const base = new Date('2026-01-30T12:00:00Z');
      expect(addDays(base, 3).toISOString().startsWith('2026-02-02')).toBe(
        true
      );
    });
  });

  describe('addMonths & subMonths', () => {
    it('adds and subtracts months within same year', () => {
      const base = new Date(2026, 0, 15); // Jan 15, 2026
      expect(addMonths(base, 2).getMonth()).toBe(2); // Mar
      expect(subMonths(base, 1).getMonth()).toBe(11); // Dec previous year
    });

    it('clamps to end of month for shorter target months', () => {
      const jan31 = new Date(2026, 0, 31); // Jan 31, 2026
      const feb = addMonths(jan31, 1);
      expect(feb.getMonth()).toBe(1); // Feb
      expect(feb.getDate()).toBe(28); // Clamped to 28
    });
  });

  describe('startOfDay & endOfDay', () => {
    it('zeros out time for startOfDay', () => {
      const d = new Date(2026, 4, 20, 15, 30, 45, 500);
      const start = startOfDay(d);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
      expect(start.getDate()).toBe(20);
    });

    it('sets time to 23:59:59.999 for endOfDay', () => {
      const d = new Date(2026, 4, 20, 15, 30, 45, 500);
      const end = endOfDay(d);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
      expect(end.getDate()).toBe(20);
    });
  });

  describe('startOfWeek & endOfWeek', () => {
    it('calculates start and end of week (Sunday as week start)', () => {
      // 2026-05-06 is a Wednesday (day 3)
      const d = new Date(2026, 4, 6);
      const startSun = startOfWeek(d, 0);
      expect(startSun.getDay()).toBe(0); // Sunday

      const endSat = endOfWeek(d, 0);
      expect(endSat.getDay()).toBe(6); // Saturday
    });

    it('calculates start and end of week (Monday as week start)', () => {
      const d = new Date(2026, 4, 6);
      const startMon = startOfWeek(d, 1);
      expect(startMon.getDay()).toBe(1); // Monday

      const endSun = endOfWeek(d, 1);
      expect(endSun.getDay()).toBe(0); // Sunday
    });
  });

  describe('startOfMonth & endOfMonth', () => {
    it('calculates start and end of February in non-leap year (2026)', () => {
      const d = new Date(2026, 1, 15);
      expect(startOfMonth(d).getDate()).toBe(1);
      expect(endOfMonth(d).getDate()).toBe(28);
    });

    it('calculates end of February in leap year (2024)', () => {
      const d = new Date(2024, 1, 10);
      expect(endOfMonth(d).getDate()).toBe(29);
    });

    it('calculates end of 31-day and 30-day months', () => {
      expect(endOfMonth(new Date(2026, 0, 1)).getDate()).toBe(31); // Jan
      expect(endOfMonth(new Date(2026, 3, 1)).getDate()).toBe(30); // Apr
    });
  });

  describe('isSameDay, isBefore & isAfter', () => {
    const d1 = new Date(2026, 2, 1, 10, 0);
    const d2 = new Date(2026, 2, 1, 18, 0);
    const d3 = new Date(2026, 2, 2, 9, 0);

    it('correctly identifies same day regardless of time', () => {
      expect(isSameDay(d1, d2)).toBe(true);
      expect(isSameDay(d1, d3)).toBe(false);
    });

    it('compares chronology with isBefore and isAfter', () => {
      expect(isBefore(d1, d3)).toBe(true);
      expect(isBefore(d3, d1)).toBe(false);
      expect(isBefore(d1, d1)).toBe(false);

      expect(isAfter(d3, d1)).toBe(true);
      expect(isAfter(d1, d3)).toBe(false);
      expect(isAfter(d1, d1)).toBe(false);
    });
  });

  describe('diffInDays, diffInHours & diffInMinutes', () => {
    it('computes positive differences between earlier and later dates', () => {
      const a = new Date('2026-01-03T12:00:00Z');
      const b = new Date('2026-01-01T12:00:00Z');

      expect(diffInDays(a, b)).toBe(2);
      expect(diffInHours(a, b)).toBe(48);
      expect(diffInMinutes(a, b)).toBe(2880);
    });

    it('computes negative differences when first date is earlier', () => {
      const a = new Date('2026-01-01T12:00:00Z');
      const b = new Date('2026-01-03T12:00:00Z');

      expect(diffInDays(a, b)).toBe(-2);
      expect(diffInHours(a, b)).toBe(-48);
      expect(diffInMinutes(a, b)).toBe(-2880);
    });
  });

  describe('formatDateIso', () => {
    it('formats date part (YYYY-MM-DD)', () => {
      const d = new Date(2026, 3, 5, 14, 25, 30);
      expect(formatDateIso(d, 'date')).toBe('2026-04-05');
    });

    it('formats time part (HH:mm:ss)', () => {
      const d = new Date(2026, 3, 5, 14, 25, 30);
      expect(formatDateIso(d, 'time')).toBe('14:25:30');
    });

    it('formats combined datetime (YYYY-MM-DDTHH:mm:ss)', () => {
      const d = new Date(2026, 3, 5, 9, 5, 7); // single digits with zero padding
      expect(formatDateIso(d, 'datetime')).toBe('2026-04-05T09:05:07');
    });
  });
});
