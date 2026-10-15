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
import {
  LocaleProvider,
  useLocale,
  formatCurrency,
  formatDate,
} from '@nofinite/locale';

function PriceTag({ amount }: { amount: number }) {
  const { locale, currency } = useLocale();

  return (
    <div className="badge badge-primary">
      {formatCurrency(amount, { locale, currency })}
    </div>
  );
}

export function App() {
  return (
    <LocaleProvider defaultLocale="en-US" defaultCurrency="USD">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        <p className="text-muted text-sm mb-4">
          Date: {formatDate(new Date(), { dateStyle: 'full' })}
        </p>
        <PriceTag amount={149.99} />
      </div>
    </LocaleProvider>
  );
}
```

---

## Core API Utilities

- `formatCurrency(amount, options)` — Localized currency formatting using native `Intl.NumberFormat`.
- `formatDate(date, options)` — Localized date, time, and timestamp formatting.
- `formatRelativeTime(date, options)` — Relative time strings (e.g., "5 minutes ago", "in 2 days").
- `getDirection(locale)` — Determines whether a locale requires `'rtl'` (Right-to-Left) or `'ltr'` (Left-to-Right) layout.
