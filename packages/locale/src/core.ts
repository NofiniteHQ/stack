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
 * Bounded LRU Cache for Intl Formatter instances.
 * Prevents memory exhaustion attacks via unbounded locale tag creation (LOCALE-M1-04).
 */
class LruFormatterCache<K, V> {
  private readonly max: number;
  private readonly cache = new Map<K, V>();

  constructor(max = 100) {
    this.max = max;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.max) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

const dateCache = new LruFormatterCache<string, Intl.DateTimeFormat>(100);
const currencyCache = new LruFormatterCache<string, Intl.NumberFormat>(100);
const relativeTimeCache = new LruFormatterCache<
  string,
  Intl.RelativeTimeFormat
>(100);
const numberCache = new LruFormatterCache<string, Intl.NumberFormat>(100);

/**
 * Formats a date using native Intl.DateTimeFormat with zero runtime dependencies.
 * Defensively catches RangeError on invalid locale tags and falls back safely (LOCALE-M1-03).
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

  const key = `${locale}:${JSON.stringify(opts)}`;
  let formatter = dateCache.get(key);

  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat(locale, opts);
      dateCache.set(key, formatter);
    } catch {
      // Safe fallback: try default en-US locale
      try {
        formatter = new Intl.DateTimeFormat('en-US', opts);
        dateCache.set(key, formatter);
      } catch {
        return d.toLocaleDateString();
      }
    }
  }

  try {
    return formatter.format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/**
 * Formats a currency amount using native Intl.NumberFormat with zero dependencies.
 * Defensively catches RangeError on invalid currency codes or locale tags (LOCALE-M1-03).
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
  if (typeof amount !== 'number' || isNaN(amount)) return '';
  const safeCurrency = (currency || 'USD').toUpperCase().trim();
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: safeCurrency,
    ...options,
  };

  const key = `${locale}:${JSON.stringify(opts)}`;
  let formatter = currencyCache.get(key);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, opts);
      currencyCache.set(key, formatter);
    } catch {
      // Safe fallback: try USD currency with en-US or format as raw text
      try {
        formatter = new Intl.NumberFormat('en-US', {
          ...opts,
          currency: 'USD',
        });
        currencyCache.set(key, formatter);
      } catch {
        return `${amount} ${safeCurrency}`;
      }
    }
  }

  try {
    return formatter.format(amount);
  } catch {
    return `${amount} ${safeCurrency}`;
  }
}

/**
 * Formats relative time (e.g., "in 3 days", "2 hours ago") using native Intl.RelativeTimeFormat.
 * Defensively catches RangeError on invalid locale tags (LOCALE-M1-03).
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
  if (typeof value !== 'number' || isNaN(value)) return '';
  const opts: Intl.RelativeTimeFormatOptions = {
    numeric: 'auto',
    ...options,
  };

  const key = `${locale}:${JSON.stringify(opts)}`;
  let formatter = relativeTimeCache.get(key);

  if (!formatter) {
    try {
      formatter = new Intl.RelativeTimeFormat(locale, opts);
      relativeTimeCache.set(key, formatter);
    } catch {
      try {
        formatter = new Intl.RelativeTimeFormat('en-US', opts);
        relativeTimeCache.set(key, formatter);
      } catch {
        return `${value} ${unit}`;
      }
    }
  }

  try {
    return formatter.format(value, unit);
  } catch {
    return `${value} ${unit}`;
  }
}

/**
 * Formats a general number (integers, decimals, percentages, compact notation) using native Intl.NumberFormat.
 * Defensively catches RangeError on invalid locale tags (LOCALE-M1-03).
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
  if (typeof value !== 'number' || isNaN(value)) return '';
  const key = `${locale}:${JSON.stringify(options ?? {})}`;
  let formatter = numberCache.get(key);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, options);
      numberCache.set(key, formatter);
    } catch {
      try {
        formatter = new Intl.NumberFormat('en-US', options);
        numberCache.set(key, formatter);
      } catch {
        return String(value);
      }
    }
  }

  try {
    return formatter.format(value);
  } catch {
    return String(value);
  }
}

// Comprehensive set of known RTL languages (LOCALE-M1-05)
// Includes Arabic (ar), Hebrew (he), Persian/Farsi (fa), Urdu (ur), Pashto (ps),
// Sindhi (sd), Uyghur (ug), Yiddish (yi), Dhivehi/Maldivian (dv), Central Kurdish/Sorani (ckb),
// Kashmiri (ks), and Western Punjabi (pnb).
const RTL_LANGUAGES = new Set([
  'ar',
  'he',
  'fa',
  'ur',
  'ps',
  'sd',
  'ug',
  'yi',
  'dv',
  'ckb',
  'ks',
  'pnb',
]);

// Known Right-to-Left ISO 15924 script codes
const RTL_SCRIPTS = new Set(['arab', 'hebr', 'thaa', 'syrc', 'mand', 'samr']);

/**
 * Determines text direction ('ltr' or 'rtl') for a given BCP 47 locale tag.
 *
 * Uses native Intl.Locale (with textInfo) when available, falling back
 * to a standardized set of known right-to-left language codes and script subtags (LOCALE-M1-05).
 *
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG', 'fa', 'ckb', 'ur-Arab')
 * @returns 'ltr' | 'rtl'
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  if (!locale || typeof locale !== 'string') {
    return 'ltr';
  }

  const trimmed = locale.trim();
  if (!trimmed) {
    return 'ltr';
  }

  // Extract subtags (e.g., 'ar-EG' -> ['ar', 'eg'])
  const subtags = trimmed.split(/[-_]/).map((s) => s.toLowerCase());
  const langSubtag = subtags[0] || '';

  // 1. Try native Intl.Locale if available
  try {
    if (typeof Intl !== 'undefined' && 'Locale' in Intl) {
      const loc = new Intl.Locale(trimmed) as any;
      const textInfo =
        loc.textInfo ??
        (typeof loc.getTextInfo === 'function' ? loc.getTextInfo() : undefined);
      if (textInfo?.direction === 'rtl' || textInfo?.direction === 'ltr') {
        return textInfo.direction;
      }
    }
  } catch {
    // If Intl.Locale constructor throws (e.g., invalid/malformed tag), fall through
  }

  // 2. Fallback for known RTL languages
  if (RTL_LANGUAGES.has(langSubtag)) {
    return 'rtl';
  }

  // 3. Fallback for known RTL script subtags (e.g., 'ku-Arab', 'az-Arab')
  for (const subtag of subtags.slice(1)) {
    if (RTL_SCRIPTS.has(subtag)) {
      return 'rtl';
    }
  }

  return 'ltr';
}
