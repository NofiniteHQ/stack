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
 * Bounded LRU Cache for Intl Formatter instances.
 * Prevents memory exhaustion attacks via unbounded locale tag creation (LOCALE-SEC-01).
 */
export class LruFormatterCache<K, V> {
  private readonly max: number;
  private readonly cache = new Map<K, V>();

  constructor(max = 256) {
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

const dateCache = new LruFormatterCache<string, Intl.DateTimeFormat>(256);
const currencyCache = new LruFormatterCache<string, Intl.NumberFormat>(256);
const relativeTimeCache = new LruFormatterCache<
  string,
  Intl.RelativeTimeFormat
>(256);
const numberCache = new LruFormatterCache<string, Intl.NumberFormat>(256);
const listCache = new LruFormatterCache<string, Intl.ListFormat>(256);
const pluralCache = new LruFormatterCache<string, Intl.PluralRules>(256);

/**
 * Clears all internal LRU formatter caches.
 * Useful for test isolation and high-frequency memory reclamation.
 */
export function clearFormatterCache(): void {
  dateCache.clear();
  currencyCache.clear();
  relativeTimeCache.clear();
  numberCache.clear();
  listCache.clear();
  pluralCache.clear();
}

function parseDateInput(input: DateInput): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a date using native Intl.DateTimeFormat with zero runtime dependencies.
 */
export function formatDate(
  date: DateInput,
  options?: Intl.DateTimeFormatOptions,
  locale = 'en-US'
): string {
  const d = parseDateInput(date);
  if (!d) return '';

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
 * Formats a date range between start and end dates.
 */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  options?: Intl.DateTimeFormatOptions,
  locale = 'en-US'
): string {
  const dStart = parseDateInput(start);
  const dEnd = parseDateInput(end);
  if (!dStart || !dEnd) return '';

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
      try {
        formatter = new Intl.DateTimeFormat('en-US', opts);
        dateCache.set(key, formatter);
      } catch {
        return `${dStart.toLocaleDateString()} – ${dEnd.toLocaleDateString()}`;
      }
    }
  }

  try {
    const fmt = formatter as Intl.DateTimeFormat & {
      formatRange?: (a: Date, b: Date) => string;
    };
    if (typeof fmt.formatRange === 'function') {
      return fmt.formatRange(dStart, dEnd);
    }
    return `${formatter.format(dStart)} – ${formatter.format(dEnd)}`;
  } catch {
    return `${dStart.toLocaleDateString()} – ${dEnd.toLocaleDateString()}`;
  }
}

/**
 * Formats a currency amount using native Intl.NumberFormat with zero dependencies.
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
 * Convenient alias for formatRelativeTime.
 */
export const formatRelative = formatRelativeTime;

/**
 * Formats a general number (integers, decimals, percentages) using native Intl.NumberFormat.
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

/**
 * Formats an array of items into a localized linguistic list (e.g., "A, B, and C").
 */
export function formatList(
  items: string[],
  options?: Intl.ListFormatOptions,
  locale = 'en-US'
): string {
  if (!Array.isArray(items) || items.length === 0) return '';
  const opts: Intl.ListFormatOptions = options ?? {
    style: 'long',
    type: 'conjunction',
  };

  const key = `${locale}:${JSON.stringify(opts)}`;
  let formatter = listCache.get(key);

  if (!formatter) {
    try {
      if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
        formatter = new Intl.ListFormat(locale, opts);
        listCache.set(key, formatter);
      }
    } catch {
      try {
        formatter = new Intl.ListFormat('en-US', opts);
        listCache.set(key, formatter);
      } catch {
        return items.join(', ');
      }
    }
  }

  try {
    return formatter ? formatter.format(items) : items.join(', ');
  } catch {
    return items.join(', ');
  }
}

/**
 * Resolves the plural rule category for a count under the given locale.
 */
export function getPluralCategory(
  count: number,
  options?: Intl.PluralRulesOptions,
  locale = 'en-US'
): Intl.LDMLPluralRule {
  const key = `${locale}:${JSON.stringify(options ?? {})}`;
  let rules = pluralCache.get(key);

  if (!rules) {
    try {
      rules = new Intl.PluralRules(locale, options);
      pluralCache.set(key, rules);
    } catch {
      try {
        rules = new Intl.PluralRules('en-US', options);
        pluralCache.set(key, rules);
      } catch {
        return count === 1 ? 'one' : 'other';
      }
    }
  }

  try {
    return rules.select(count);
  } catch {
    return count === 1 ? 'one' : 'other';
  }
}
