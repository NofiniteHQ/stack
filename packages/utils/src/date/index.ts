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

export type DateInput = Date | number | string;

/**
 * Checks whether an input is a valid Date instance.
 */
export function isValidDate(input: unknown): input is Date {
  return input instanceof Date && !isNaN(input.getTime());
}

/**
 * Converts a Date, timestamp number, or ISO string into a Date instance.
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) {
    return new Date(input.getTime());
  }
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
 * Adds n months to a date, clamping to the last day of shorter target months.
 */
export function addMonths(input: DateInput, n: number): Date {
  const d = toDate(input);
  const desiredDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const maxDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(desiredDay, maxDays));
  return d;
}

/**
 * Subtracts n months from a date.
 */
export function subMonths(input: DateInput, n: number): Date {
  return addMonths(input, -n);
}

/**
 * Returns a new Date set to the start of the day (00:00:00.000).
 */
export function startOfDay(input: DateInput): Date {
  const d = toDate(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a new Date set to the end of the day (23:59:59.999).
 */
export function endOfDay(input: DateInput): Date {
  const d = toDate(input);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns a new Date set to the start of the week.
 *
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function startOfWeek(input: DateInput, weekStartsOn = 0): Date {
  const d = startOfDay(input);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  return d;
}

/**
 * Returns a new Date set to the end of the week.
 *
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 0)
 */
export function endOfWeek(input: DateInput, weekStartsOn = 0): Date {
  const d = startOfWeek(input, weekStartsOn);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns a new Date set to the start of the month (1st, 00:00:00.000).
 */
export function startOfMonth(input: DateInput): Date {
  const d = startOfDay(input);
  d.setDate(1);
  return d;
}

/**
 * Returns a new Date set to the end of the month (last day, 23:59:59.999).
 */
export function endOfMonth(input: DateInput): Date {
  const d = startOfDay(input);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Compares whether two dates fall on the exact same calendar day.
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
 * Checks if date a is chronologically before date b.
 */
export function isBefore(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() < toDate(b).getTime();
}

/**
 * Checks if date a is chronologically after date b.
 */
export function isAfter(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() > toDate(b).getTime();
}

/**
 * Computes difference between two dates in full calendar days.
 */
export function diffInDays(a: DateInput, b: DateInput): number {
  const msA = toDate(a).getTime();
  const msB = toDate(b).getTime();
  const diffMs = msA - msB;
  return Math.trunc(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Computes difference between two dates in full hours.
 */
export function diffInHours(a: DateInput, b: DateInput): number {
  const msA = toDate(a).getTime();
  const msB = toDate(b).getTime();
  return Math.trunc((msA - msB) / (1000 * 60 * 60));
}

/**
 * Computes difference between two dates in full minutes.
 */
export function diffInMinutes(a: DateInput, b: DateInput): number {
  const msA = toDate(a).getTime();
  const msB = toDate(b).getTime();
  return Math.trunc((msA - msB) / (1000 * 60));
}

/**
 * Formats a Date instance into standard ISO-like date, time, or datetime strings.
 */
export function formatDateIso(
  input: DateInput,
  mode: 'date' | 'time' | 'datetime' = 'datetime'
): string {
  const d = toDate(input);
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  if (mode === 'date') {
    return `${year}-${month}-${day}`;
  }
  if (mode === 'time') {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
