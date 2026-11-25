# Nofinite Locale

> Type-safe internationalization, date/number formatting, and timezone primitives for React applications.

---

## Overview

**Nofinite Locale** (`@nofinite/locale`) provides lightweight, zero-dependency localization and internationalization engines for the Nofinite ecosystem. It features:

- **Zero-Dependency Runtime:** Built directly on native browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`).
- **Strict TypeScript Types:** Complete autocompletion for BCP 47 language tags and ICU message formats.
- **Dynamic Directionality (RTL / LTR):** Automatic text direction detection with seamless NUICSS bidirectional layout support.
- **Timezone Awareness:** Instant conversion and formatting across IANA timezone identifiers.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/locale
# or
pnpm add @nofinite/locale
```

### 2. Usage Example

```tsx
import React from 'react';
import { LocaleProvider, useLocale } from '@nofinite/locale/react';

function PriceTag({ amount }: { amount: number }) {
  const { locale, formatCurrency, formatDate } = useLocale();

  return (
    <div className="badge badge-primary" data-locale={locale}>
      {formatCurrency(amount, 'USD')} • {formatDate(new Date())}
    </div>
  );
}

export function App() {
  return (
    <LocaleProvider defaultLocale="en-US" supportedLocales={['en-US', 'ar-AE']}>
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        <PriceTag amount={149.99} />
      </div>
    </LocaleProvider>
  );
}
```

---

## Core API Utilities

- **`@nofinite/locale/countries` / `@nofinite/locale`**: `countries`, `getCountryByCode`, `getCountryByDialCode`.
- **`@nofinite/locale/bcp47`**: `parseLocale(locale)`, `getDirection(locale)`, `matchLocale(requested, supported, defaultLocale)`.
- **`@nofinite/locale/format`**: `formatDate`, `formatDateRange`, `formatCurrency`, `formatRelativeTime` (`formatRelative`), `formatNumber`, `formatList`, `getPluralCategory`.
- **`@nofinite/locale/i18n`**: `createTranslator(config)` returning a `Translator`.
- **`@nofinite/locale/react`**: `LocaleProvider`, `useLocale`, `useTranslation`.
- **`@nofinite/locale/style`** (`@nofinite/locale/dist/style.css`): CSS SVG flag stylesheet.
