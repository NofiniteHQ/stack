# Phase 5: Nofinite Locale — Target Architecture Specification (v3.0.0)

**Package:** `@nofinite/locale`  
**Current Version:** `2.0.0`  
**Target Architecture Version:** `3.0.0`  
**Target Repository:** `D:\stack\packages\locale`  
**Author:** Antigravity Main Engineering Agent (Technical Assurance Lead)  
**Governing Standard:** NEAS 1.0 (Nofinite Engineering Assurance Standard) / Rule 14 (Zero Downstream CSS Invariant)  
**Date:** November 6, 2026  
**Status:** Architectural Specification — Pending Project Owner Approval

---

## 1. Architectural Mission & Core Responsibilities

`@nofinite/locale` is the authoritative localization, internationalization, and formatting engine for the Nofinite ecosystem.

In version 3.0.0, the package undergoes a strategic transformation from an ad-hoc formatting wrapper into a **zero-dependency, enterprise-grade localization framework** built strictly on top of native ECMAScript `Intl` standards.

### 1.1 Core Responsibilities

1. **BCP 47 Locale Resolution & Negotiation:** RFC 4647 language matching, subtags parsing, and directionality detection (`ltr` vs. `rtl`).
2. **Native ECMAScript Formatters:** High-performance, LRU-cached wrappers around `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`, `Intl.PluralRules`, and `Intl.ListFormat`.
3. **Smart Relative Time Calculation:** Automated unit selection (`"just now"`, `"14 minutes ago"`, `"in 2 days"`) from raw timestamps.
4. **Zero-Dependency Translation Catalog & Interpolation:** Lightweight dictionary registry, fallback resolution chains (`fr-CA` -> `fr` -> `en-US`), variable substitution (`{name}`), and pluralized message formatting without runtime bloat.
5. **Decoupled Country Metadata:** Standalone subpath export (`@nofinite/locale/countries`) for ISO 3166-1 country records, calling codes, and ISO 4217 currencies.
6. **Idiomatic React 18/19 Integration:** `<LocaleProvider>`, `useLocale()`, and `useTranslation()` hooks with automatic document `dir` and `lang` DOM synchronization.
7. **Universal Runtime Support:** 100% isomorphic across Node.js (18+), Edge Workers (Cloudflare, Vercel), Deno, Bun, and client web browsers.

### 1.2 Non-Responsibilities (Strict Boundaries)

- **Zero Downstream CSS Invariant (Rule 14):** Authoring, compiling, or distributing CSS flag stylesheets is strictly prohibited. Flag sizing belongs in `@nofinite/nuicss`.
- **Vector Media Assets:** Bundling raw SVG flag files is strictly prohibited. Flag vector assets belong in `@nofinite/media` or a dedicated vector CDN.
- **Heavy Third-Party Runtimes:** The package will never depend on `i18next`, `formatjs`, `moment`, or `date-fns`.

---

## 2. Directory Layout & Module Structure (v3.0.0)

```text
packages/locale/
├── src/
│   ├── index.ts                  # Root vanilla entry: core formatters, direction, i18n, types
│   ├── bcp47/                    # BCP 47 parsing, direction & language negotiation
│   │   ├── parse.ts              # Subtag parser (language, script, region)
│   │   ├── negotiate.ts          # RFC 4647 best-fit locale matching
│   │   └── direction.ts          # LTR / RTL directionality detection (retained & optimized)
│   ├── format/                   # Native ECMAScript Intl formatting engines
│   │   ├── cache.ts              # Generic Bounded LRU Cache (max 100 entries)
│   │   ├── date.ts               # formatDate, formatDateTime, formatDateRange
│   │   ├── number.ts             # formatNumber, formatPercent, formatCompactNumber
│   │   ├── currency.ts           # formatCurrency with ISO 4217 validation
│   │   ├── relative.ts           # formatRelativeTime & smart auto-unit formatRelative
│   │   ├── plural.ts             # getPluralCategory using Intl.PluralRules
│   │   └── list.ts               # formatList using Intl.ListFormat
│   ├── i18n/                     # Translation dictionaries & interpolation engine
│   │   ├── catalog.ts            # Translation dictionary registry & fallback chains
│   │   ├── interpolate.ts        # Fast zero-dependency template compiler ({name}, plurals)
│   │   └── loader.ts             # Asynchronous lazy-catalog registration
│   ├── data/                     # Decoupled Country & Currency Metadata
│   │   ├── countries.ts          # Cleaned ISO 3166-1 dataset (name, iso2, iso3, dialCode, currency)
│   │   ├── lookup.ts             # O(1) Map-indexed lookups (by ISO2, ISO3, dialCode)
│   │   └── index.ts              # Subpath export: @nofinite/locale/countries
│   ├── server/                   # Server & Edge specific helpers
│   │   └── http.ts               # parseAcceptLanguage header parser
│   └── react/                    # React 18 / 19 Bindings (Subpath: @nofinite/locale/react)
│       ├── index.ts              # Re-exports provider and hooks
│       ├── LocaleProvider.tsx    # Context provider with DOM lang/dir synchronization
│       ├── useLocale.ts          # Formatting, currency, and locale state hook
│       └── useTranslation.ts     # Type-safe t() translation hook
├── tests/                        # Comprehensive unit, contract, and resilience test suites
├── vite.config.ts                # Dual-entry Vite build (zero Sass, zero SVG plugins)
└── package.json                  # Clean exports: ".", "./react", "./countries", "./style" (compat)
```

---

## 3. Detailed Architectural Breakdown Across 15 Dimensions

### Dimension 1: Core Locale Resolution & BCP 47 Negotiation

- **Mechanism:** Implements RFC 4647 lookup matching (`matchLocale(requested, supported, defaultLocale)`).
- **Subtag Parsing:** `parseLocale(tag)` cleanly decomposes tags into canonical components:
  ```ts
  export interface LocaleInfo {
    tag: string; // 'zh-Hans-CN'
    language: string; // 'zh'
    script?: string; // 'Hans'
    region?: string; // 'CN'
    direction: 'ltr' | 'rtl';
  }
  ```
- **Fallback Chain:** Computes standard language fallback paths (e.g., `de-CH-1996` -> `de-CH` -> `de` -> default).

### Dimension 2: Locale & Language Identification

- **Directionality:** Enhanced `getDirection(locale)` maintains cached `Intl.Locale` evaluation, retaining fast-path sets for 12 primary RTL language families (`ar`, `he`, `fa`, `ur`, `ps`, `sd`, `ug`, `yi`, `dv`, `ckb`, `ks`, `pnb`) and 6 ISO 15924 script subtags (`arab`, `hebr`, `thaa`, `syrc`, `mand`, `samr`).
- **Identification Helpers:** Exposes `getLanguage(locale)`, `getRegion(locale)`, and `getScript(locale)`.

### Dimension 3: Regional Preferences & Fallback Behavior

- **Configurable Fallback Chains:** Translation and formatting operations accept hierarchical fallback lists rather than defaulting strictly to hardcoded `'en-US'`.
- **First Day of Week & Measurement:** Exposes `getWeekInfo(locale)` resolving `firstDay` (0 for Sunday, 1 for Monday) via `Intl.Locale.prototype.getWeekInfo()` where available, with static fallback tables for older runtimes.

### Dimension 4: Number Formatting

- **Core Function:** `formatNumber(value: number | bigint | string, options?: Intl.NumberFormatOptions, locale?: string): string`.
- **Specialized Helpers:**
  - `formatPercent(value: number, options?: Intl.NumberFormatOptions, locale?: string): string`
  - `formatCompactNumber(value: number, options?: Intl.NumberFormatOptions, locale?: string): string` (outputs `1.2M`, `45K` according to locale standards).
- **Caching:** Governed by `LruFormatterCache<string, Intl.NumberFormat>(100)`.

### Dimension 5: Currency Formatting

- **Standardized Signature:** `formatCurrency(amount: number, currencyOrOptions?: string | CurrencyOptions, options?: Intl.NumberFormatOptions, locale?: string): string`.
- **Defensive Normalization:** Normalizes currency codes to uppercase ISO 4217 strings, defaulting to `USD` upon invalid input, catching `RangeError` safely.
- **Default Currency Resolution:** Can automatically resolve default currency from country metadata (`getCountryByCode('JP')?.currency` -> `'JPY'`).

### Dimension 6: Date and Time Formatting

- **Standardized Signature:** `formatDate(date: Date | number | string, options?: Intl.DateTimeFormatOptions, locale?: string): string`.
- **Preset Options:** Supports standard presets (`'full'`, `'long'`, `'medium'`, `'short'`).
- **Date Range Formatting:** Exposes `formatDateRange(startDate, endDate, options, locale)` leveraging `Intl.DateTimeFormat.prototype.formatRange()`.

### Dimension 7: Relative Time Formatting

- **Smart Relative Formatter:** `formatRelative(targetDate: Date | number | string, baseDate: Date | number | string = new Date(), options?: RelativeOptions, locale?: string): string`.
- **Automated Thresholds:**
  - $< 45\text{ seconds}$: `"just now"`
  - $< 45\text{ minutes}$: `X minutes ago`
  - $< 22\text{ hours}$: `X hours ago`
  - $< 26\text{ days}$: `X days ago`
  - $< 10\text{ months}$: `X months ago`
  - $\ge 10\text{ months}$: `X years ago`
- **Low-Level Formatter:** Retains explicit `formatRelativeTime(value, unit, options, locale)`.

### Dimension 8: Translation Dictionaries & Catalog Management

- **Catalog Registry:** `createTranslator(options: TranslatorOptions): Translator`.
- **Dictionary Schema:**
  ```ts
  export type TranslationCatalog = Record<string, string | Record<string, any>>;
  ```
- **Namespace Support:** Supports nested dictionary keys via dot notation: `t('dashboard.stats.usersCount')`.

### Dimension 9: Interpolation & Variable Substitution

- **Zero-Dependency Engine:** Implements micro-template interpolation replacing `{param}` tokens:
  ```ts
  t('greeting', { name: 'Alice' }); // "Hello, Alice!"
  ```
- **XSS Safety:** Parameters are sanitized against HTML/script injection when rendered through React bindings.

### Dimension 10: Pluralization Rules (`Intl.PluralRules`)

- **Native Plural Resolution:** Implements `getPluralCategory(count, options, locale)` wrapping native `Intl.PluralRules`.
- **ICU Plural Syntax Support:**
  ```ts
  // Dictionary entry:
  // "cart.items": "{count, plural, =0 {No items} one {1 item} other {# items}}"
  t('cart.items', { count: 5 }); // "5 items"
  ```

### Dimension 11: Lazy-Loaded Translation Catalogs

- **Asynchronous Registry:** `addCatalog(locale: string, loader: () => Promise<TranslationCatalog>)`.
- **Concurrent Request Deduplication:** In-flight network fetches for the same locale catalog are deduplicated to prevent duplicate HTTP requests.

### Dimension 12: React Bindings & Integration (`./react`)

- **`<LocaleProvider>` Enhancements:**
  - Accepts `locale`, `fallbackLocales`, `messages`, `defaultCurrency`.
  - Automatically updates `<html lang="..." dir="...">` when `syncHtmlAttributes={true}` is set.
- **`useLocale()` Hook:**
  - Exposes `locale`, `direction`, `currency`, `setLocale(nextLocale)`.
  - Exposes curried formatting functions (`formatDate`, `formatCurrency`, `formatNumber`, `formatRelative`, `formatList`).
- **`useTranslation(namespace?)` Hook:**
  - Exposes `t(key, params)`, `locale`, `direction`, `isLoading`.

### Dimension 13: TypeScript Contracts & Type Inference

- **Typed Catalog Generics:**
  ```ts
  export function useTranslation<
    T extends TranslationCatalog = TranslationCatalog
  >(
    namespace?: string
  ): {
    t: (
      key: NestedKeyOf<T>,
      params?: Record<string, string | number>
    ) => string;
  };
  ```
- **Strict Union Types:** Currencies typed against ISO 4217 union (`'USD' | 'EUR' | 'GBP' | ...`); text directions strictly `'ltr' | 'rtl'`.

### Dimension 14: Server-Side & Browser-Side Compatibility

- **Node & Edge Isomorphism:** Zero DOM dependencies in `src/index.ts`. All `globalThis.navigator` accesses safely guarded.
- **HTTP Header Parsing:** `parseAcceptLanguage(header: string): string[]` utility for Next.js, Express, and Cloudflare Worker route handlers.

### Dimension 15: Extensibility & Custom Providers

- **Configurable Cache:** Formatter LRU cache size can be configured or flushed via `clearFormatterCache()`.
- **Custom Plural & Number Formatter Hooks:** Allows custom formatting engines to be plugged into the translator pipeline.

---

## 4. Public API Contracts (v3.0.0)

### 4.1 Core Package Root (`@nofinite/locale`)

```ts
// --- Types ---
export interface LocaleInfo {
  tag: string;
  language: string;
  script?: string;
  region?: string;
  direction: 'ltr' | 'rtl';
}

export type PluralRuleType = 'cardinal' | 'ordinal';
export type ListType = 'conjunction' | 'disjunction' | 'unit';

// --- BCP 47 & Direction ---
export function parseLocale(locale: string): LocaleInfo;
export function getDirection(locale: string): 'ltr' | 'rtl';
export function matchLocale(
  requested: readonly string[],
  supported: readonly string[],
  defaultLocale: string
): string;

// --- Formatting ---
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string;

export function formatDateRange(
  startDate: Date | number | string,
  endDate: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string;

export function formatNumber(
  value: number | bigint | string,
  options?: Intl.NumberFormatOptions,
  locale?: string
): string;

export function formatCurrency(
  amount: number,
  currency?: string,
  options?: Intl.NumberFormatOptions,
  locale?: string
): string;

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
  locale?: string
): string;

export function formatRelative(
  date: Date | number | string,
  baseDate?: Date | number | string,
  options?: { numeric?: 'always' | 'auto'; locale?: string }
): string;

export function formatList(
  items: string[],
  type?: ListType,
  locale?: string
): string;

export function getPluralCategory(
  count: number,
  options?: { type?: PluralRuleType; locale?: string }
): Intl.LDMLPluralRule;

// --- Translation Engine ---
export type TranslationMessages = Record<string, any>;

export interface TranslatorOptions {
  locale: string;
  fallbackLocale?: string;
  messages?: Record<string, TranslationMessages>;
}

export interface Translator {
  readonly locale: string;
  readonly direction: 'ltr' | 'rtl';
  t(key: string, params?: Record<string, string | number>): string;
  setLocale(locale: string): void;
  addMessages(locale: string, messages: TranslationMessages): void;
}

export function createTranslator(options: TranslatorOptions): Translator;

// --- Cache Management ---
export function clearFormatterCache(): void;
```

### 4.2 Decoupled Country Catalog (`@nofinite/locale/countries`)

```ts
export interface Country {
  name: string;
  dialCode: string;
  iso2: string;
  iso3: string;
  currency: string;
}

export const countries: readonly Country[];
export function getCountryByCode(iso: string): Country | undefined;
export function getCountryByDialCode(dialCode: string): Country | undefined;
export function getCountriesByDialCode(dialCode: string): Country[];
export function getCountryMetadata(iso: string): Country | undefined;
```

### 4.3 React Bindings (`@nofinite/locale/react`)

```tsx
export interface LocaleProviderProps {
  locale: string;
  defaultCurrency?: string;
  fallbackLocales?: string[];
  messages?: Record<string, TranslationMessages>;
  syncHtmlAttributes?: boolean;
  children: React.ReactNode;
}

export interface LocaleContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  currency: string;
  setLocale: (locale: string) => void;
  formatDate: (
    date: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatDateRange: (
    start: Date | number | string,
    end: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatCurrency: (
    amount: number,
    currency?: string,
    options?: Intl.NumberFormatOptions
  ) => string;
  formatNumber: (
    value: number | bigint | string,
    options?: Intl.NumberFormatOptions
  ) => string;
  formatRelative: (
    date: Date | number | string,
    baseDate?: Date | number | string
  ) => string;
  formatList: (items: string[], type?: ListType) => string;
}

export function LocaleProvider(props: LocaleProviderProps): React.JSX.Element;
export function useLocale(): LocaleContextValue;
export function useTranslation(namespace?: string): {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
  direction: 'ltr' | 'rtl';
  isLoading: boolean;
};
```

---

## 5. Compatibility Decisions & Migration Plan

1. **Zero Downstream CSS Cleanup:**
   - Delete `src/flags/` (all 542 SVGs) and `src/styles/` (all 4 SCSS files).
   - Retain the Vite build plugin `locale-style-shim` that writes `dist/style.css` containing `@import '@nofinite/nuicss/styles.css';`.
   - Retain `"./style"` in `package.json#exports` so legacy imports in existing applications do not cause bundler resolution 404s.
2. **Backward-Compatible Root Re-exports:**
   - Root `@nofinite/locale` continues to re-export `getCountryByCode`, `getCountryByDialCode`, `getCountryMetadata`, `Country`, and `countries` for full backward compatibility with v2.0.0, but also exposes the new dedicated subpath `@nofinite/locale/countries` for tree-shaken imports.
3. **Country Data Normalization:**
   - Correct Cayman Islands `dialCode` from `"+ 345"` to `"+345"`.
   - Correct Heard Island `dialCode` from `"+0"` to `"+672"`.
   - Normalize Åland Islands character encoding and add `iso3` + `currency` fields across all records.
4. **Bundle Performance Budget:**
   - Decoupled core bundle target: $< 3.5\text{ KB}$ raw / $< 1.2\text{ KB}$ gzip.
   - Comprehensive test suite target: $\ge 180$ tests (100% pass rate, $\ge 95\%$ statement and branch coverage).

This architecture establishes `@nofinite/locale` as a world-class, zero-dependency localization engine completely aligned with Nofinite's core ecosystem invariants.
