/**
 * @license
 * Copyright (C) 2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type DateInput = Date | string | number;

/**
 * Validates if a value is a valid non-NaN Date instance.
 */
export function isValidDate(val: unknown): val is Date {
  return val instanceof Date && !isNaN(val.getTime());
}

/**
 * Safely coerces a Date, ISO timestamp string, or epoch millisecond number into a Date instance.
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) return new Date(input.getTime());
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    throw new TypeError(`Invalid date input: ${String(input)}`);
  }
  return d;
}

/**
 * Adds n days to a date.
 */
export function addDays(input: DateInput, n: number): Date {
  const d = toDate(input);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Subtracts n days from a date.
 */
export function subDays(input: DateInput, n: number): Date {
  return addDays(input, -n);
}

/**
 * Adds n months to a date, preserving day of month when possible.
 */
export function addMonths(input: DateInput, n: number): Date {
  const d = toDate(input);
  const targetMonth = d.getMonth() + n;
  d.setMonth(targetMonth);
  return d;
}

/**
 * Subtracts n months from a date.
 */
export function subMonths(input: DateInput, n: number): Date {
  return addMonths(input, -n);
}

/**
 * Returns the start of the day (00:00:00.000) for the given date.
 */
export function startOfDay(input: DateInput): Date {
  const d = toDate(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns the end of the day (23:59:59.999) for the given date.
 */
export function endOfDay(input: DateInput): Date {
  const d = toDate(input);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns the start of the week for the given date (default weekStartsOn = 0, Sunday).
 */
export function startOfWeek(input: DateInput, weekStartsOn = 0): Date {
  const d = startOfDay(input);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  return d;
}

/**
 * Returns the end of the week for the given date.
 */
export function endOfWeek(input: DateInput, weekStartsOn = 0): Date {
  const d = startOfWeek(input, weekStartsOn);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns the start of the month (1st day at 00:00:00.000).
 */
export function startOfMonth(input: DateInput): Date {
  const d = toDate(input);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns the end of the month (last day at 23:59:59.999).
 */
export function endOfMonth(input: DateInput): Date {
  const d = toDate(input);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Checks if two dates fall on the exact same calendar day.
 */
export function isSameDay(a: DateInput, b: DateInput): boolean {
  const da = toDate(a);
  const db = toDate(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/**
 * Checks if date a is strictly before date b.
 */
export function isBefore(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() < toDate(b).getTime();
}

/**
 * Checks if date a is strictly after date b.
 */
export function isAfter(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() > toDate(b).getTime();
}

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Computes difference between two dates in full calendar days.
 */
export function diffInDays(a: DateInput, b: DateInput): number {
  return Math.trunc((toDate(a).getTime() - toDate(b).getTime()) / MS_PER_DAY);
}

/**
 * Computes difference between two dates in full hours.
 */
export function diffInHours(a: DateInput, b: DateInput): number {
  return Math.trunc((toDate(a).getTime() - toDate(b).getTime()) / MS_PER_HOUR);
}

/**
 * Computes difference between two dates in full minutes.
 */
export function diffInMinutes(a: DateInput, b: DateInput): number {
  return Math.trunc(
    (toDate(a).getTime() - toDate(b).getTime()) / MS_PER_MINUTE
  );
}

/**
 * Formats a date into ISO 8601 string subsets ('date', 'time', or full 'datetime').
 */
export function formatDateIso(
  input: DateInput,
  mode: 'date' | 'time' | 'datetime' = 'date'
): string {
  const d = toDate(input);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  if (mode === 'date') return `${year}-${month}-${day}`;
  if (mode === 'time') return `${hours}:${minutes}:${seconds}`;
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
