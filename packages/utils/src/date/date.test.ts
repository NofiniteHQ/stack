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
  it('validates Date objects', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(isValidDate('2026-01-01')).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });

  it('converts strings and timestamps to Dates', () => {
    const d = toDate('2026-06-15T12:00:00Z');
    expect(d.toISOString()).toBe('2026-06-15T12:00:00.000Z');
    expect(() => toDate('invalid-date')).toThrow(TypeError);
  });

  it('adds and subtracts days', () => {
    const base = new Date('2026-03-10T12:00:00Z');
    expect(addDays(base, 5).toISOString().startsWith('2026-03-15')).toBe(true);
    expect(subDays(base, 5).toISOString().startsWith('2026-03-05')).toBe(true);
  });

  it('adds and subtracts months', () => {
    const base = new Date(2026, 0, 15); // Jan 15, 2026
    expect(addMonths(base, 2).getMonth()).toBe(2); // Mar
    expect(subMonths(base, 1).getMonth()).toBe(11); // Dec previous year
  });

  it('calculates start and end of day', () => {
    const d = new Date(2026, 4, 20, 15, 30, 45, 500);
    const start = startOfDay(d);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getMilliseconds()).toBe(0);

    const end = endOfDay(d);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
  });

  it('calculates start and end of week', () => {
    // 2026-05-06 is a Wednesday (day 3)
    const d = new Date(2026, 4, 6);
    const startSun = startOfWeek(d, 0);
    expect(startSun.getDay()).toBe(0); // Sunday

    const startMon = startOfWeek(d, 1);
    expect(startMon.getDay()).toBe(1); // Monday

    const end = endOfWeek(d, 0);
    expect(end.getDay()).toBe(6); // Saturday
  });

  it('calculates start and end of month', () => {
    const d = new Date(2026, 1, 15); // Feb 15, 2026 (non-leap year)
    const start = startOfMonth(d);
    expect(start.getDate()).toBe(1);

    const end = endOfMonth(d);
    expect(end.getDate()).toBe(28); // 28 days in Feb 2026
  });

  it('checks day comparison and order', () => {
    const d1 = new Date(2026, 2, 1, 10, 0);
    const d2 = new Date(2026, 2, 1, 18, 0);
    const d3 = new Date(2026, 2, 2, 9, 0);

    expect(isSameDay(d1, d2)).toBe(true);
    expect(isSameDay(d1, d3)).toBe(false);

    expect(isBefore(d1, d3)).toBe(true);
    expect(isAfter(d3, d1)).toBe(true);
  });

  it('computes differences in days, hours, and minutes', () => {
    const a = new Date('2026-01-03T12:00:00Z');
    const b = new Date('2026-01-01T12:00:00Z');

    expect(diffInDays(a, b)).toBe(2);
    expect(diffInHours(a, b)).toBe(48);
    expect(diffInMinutes(a, b)).toBe(2880);
  });

  it('formats dates in ISO modes', () => {
    const d = new Date(2026, 3, 5, 14, 25, 30); // April 5, 2026 14:25:30
    expect(formatDateIso(d, 'date')).toBe('2026-04-05');
    expect(formatDateIso(d, 'time')).toBe('14:25:30');
    expect(formatDateIso(d, 'datetime')).toBe('2026-04-05T14:25:30');
  });
});
