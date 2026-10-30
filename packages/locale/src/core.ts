/**
 * @license
 * Copyright (C) 2025 Nofinite
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

import { type Country, countries } from './data/countries';

/**
 * Finds a country by its ISO2 code (e.g., 'IN', 'US').
 * Case-insensitive.
 */
export const getCountryByCode = (iso: string): Country | undefined => {
  if (!iso) return undefined;
  return countries.find((c) => c.iso2.toUpperCase() === iso.toUpperCase());
};

/**
 * Finds a country by its dial code (e.g., '+91', '91').
 * Handles inputs with or without the '+' prefix.
 */
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  if (!dialCode) return undefined;

  // Normalize input: remove spaces and '+' to ensure matching works
  const cleanCode = dialCode.replace(/[\s+]/g, '');

  return countries.find((c) => {
    const cleanCountryCode = c.dialCode.replace(/[\s+]/g, '');
    return cleanCountryCode === cleanCode;
  });
};

/**
 * Retrieves comprehensive metadata for a country by its ISO2 code.
 * Alias / standard entry for country information lookup.
 */
export const getCountryMetadata = (isoCode: string): Country | undefined => {
  return getCountryByCode(isoCode);
};

/**
 * Formats a date using native Intl.DateTimeFormat with zero runtime dependencies.
 *
 * @param date - Date object, timestamp number, or ISO date string
 * @param options - Standard Intl.DateTimeFormatOptions
 * @param locale - BCP 47 language tag (defaults to 'en-US')
 */
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  locale = 'en-US'
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const opts: Intl.DateTimeFormatOptions = options ?? {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, opts).format(d);
}

/**
 * Formats a currency amount using native Intl.NumberFormat with zero dependencies.
 *
 * @param amount - Number value to format
 * @param currency - ISO 4217 currency code (e.g. 'USD', 'EUR', 'GBP', 'JPY')
 * @param options - Standard Intl.NumberFormatOptions overrides
 * @param locale - BCP 47 language tag (defaults to 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US'
): string {
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    ...options,
  };
  return new Intl.NumberFormat(locale, opts).format(amount);
}

/**
 * Formats relative time (e.g., "in 3 days", "2 hours ago") using native Intl.RelativeTimeFormat.
 *
 * @param value - Numeric offset
 * @param unit - Relative time unit ('year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')
 * @param options - Standard Intl.RelativeTimeFormatOptions
 * @param locale - BCP 47 language tag (defaults to 'en-US')
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
  locale = 'en-US'
): string {
  const opts: Intl.RelativeTimeFormatOptions = {
    numeric: 'auto',
    ...options,
  };
  return new Intl.RelativeTimeFormat(locale, opts).format(value, unit);
}

/**
 * Formats a general number (integers, decimals, percentages, compact notation) using native Intl.NumberFormat.
 *
 * @param value - Number value to format
 * @param options - Standard Intl.NumberFormatOptions
 * @param locale - BCP 47 language tag (defaults to 'en-US')
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
