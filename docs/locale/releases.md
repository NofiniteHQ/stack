---
title: Releases
sidebar_position: 999
---

# @nofinite/locale — v2.1.0

**Latest release:** `2.1.0` (Apache-2.0)

---

## Summary

`@nofinite/locale` `v2.1.0` expands Nofinite Locale from standardized country/dial-code metadata and CSS SVG flags into a full zero-dependency internationalization toolkit with BCP 47 parsing, `Intl` formatters, nested translation dictionaries, and a React provider.

---

## Included in `v2.1.0`

- **Country & Phone Data (`@nofinite/locale`, `@nofinite/locale/countries`):** Standardized ISO-3166 metadata (`countries`, `getCountryByCode`, `getCountryByDialCode`).
- **BCP 47 Utilities (`@nofinite/locale/bcp47`):** `parseLocale`, `getDirection` (`'ltr' | 'rtl'`), and `matchLocale`.
- **Intl Formatters (`@nofinite/locale/format`):** `formatDate`, `formatDateRange`, `formatCurrency`, `formatRelativeTime` (`formatRelative`), `formatNumber`, `formatList`, `getPluralCategory`, and bounded `LruFormatterCache` / `clearFormatterCache`.
- **Lightweight i18n Engine (`@nofinite/locale/i18n`):** `createTranslator`, nested key lookup, interpolation, plural rules, and runtime locale/message updates.
- **React Integration (`@nofinite/locale/react`):** `LocaleProvider`, `LocaleContext`, `useLocale`, and `useTranslation`.
- **CSS Flag Assets (`@nofinite/locale/style`, `@nofinite/locale/dist/style.css`):** Pure CSS SVG country flags for 240+ territories.
