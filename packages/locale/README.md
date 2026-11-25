<div align="center">

# Nofinite Locale

**Lightweight library for country metadata, flags, and international dialing codes for web applications.**

[![npm](https://img.shields.io/npm/v/@nofinite/locale?style=flat-square)](https://www.npmjs.com/package/@nofinite/locale)
[![License](https://img.shields.io/npm/l/@nofinite/locale?style=flat-square)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@nofinite/locale?style=flat-square)](https://bundlephobia.com/package/@nofinite/locale)
[![TypeScript](https://img.shields.io/badge/TypeScript-Yes-blue?style=flat-square)](https://www.typescriptlang.org/)

</div>

---

## What this package provides

- Country metadata (name, ISO code, dial code)
- Type-safe country metadata
- CSS-based SVG flags (4:3 and 1:1)
- Works with modern frameworks and plain HTML (CDN)

---

## Installation

### Package Managers (Recommended)

```bash
# pnpm
pnpm add @nofinite/locale

# npm
npm install @nofinite/locale

# yarn
yarn add @nofinite/locale
```

### CDN (No build step)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/style.css"
/>

<script src="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/index.global.js"></script>
```

---

## Usage

### Get Country (name, iso2, dial code)

_(For Javascript/Typescript)_

```ts
import { getCountryByCode, getCountryByDialCode } from '@nofinite/locale';

// Lookup by ISO-2 code (case-insensitive)
const in = getCountryByCode('IN');

// Lookup by dial code
const india = getCountryByDialCode('+91');
// or
const indiaAlt = getCountryByDialCode('91');

console.log(india);

/*
{
  name: "India",
  iso2: "IN",
  dialCode: "+91"
}
*/
```

_(For HTML)_

```html
<script>
  const country = NofiniteLocale.getCountryByCode('IN');
  console.log(country.name); // India
  console.log(country.dialCode); // +91
</script>
```

---

### Internationalized Formatting & Direction

Use lightweight, dependency-free ECMAScript `Intl` helpers with built-in defense against malformed locale tags and an LRU cache:

```ts
import {
  formatDate,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
  getDirection,
} from '@nofinite/locale';

// Date formatting with locale fallback
formatDate(new Date(), { month: 'long', year: 'numeric' }, 'fr-FR'); // e.g. "novembre 2026"

// Currency formatting with ISO 4217 validation
formatCurrency(149.99, 'USD', undefined, 'en-US'); // "$149.99"
formatCurrency(149.99, 'EUR', undefined, 'de-DE'); // "149,99 €"

// Relative time formatting
formatRelativeTime(-2, 'day', undefined, 'en-US'); // "2 days ago"

// Number formatting
formatNumber(1250000, { notation: 'compact' }, 'en-US'); // "1.3M"

// Text direction detection (LTR vs. RTL)
getDirection('ar-EG'); // 'rtl'
getDirection('he'); // 'rtl'
getDirection('en-US'); // 'ltr'
```

---

### React Integration

Wrap your application in `<LocaleProvider>` to supply locale context and formatted helpers across your component tree:

```tsx
import { LocaleProvider, useLocale } from '@nofinite/locale/react';

function UserGreeting() {
  const { locale, formatCurrency, formatDate } = useLocale();
  return (
    <div>
      <p>Locale: {locale}</p>
      <p>Total: {formatCurrency(49.99, 'USD')}</p>
    </div>
  );
}

export function App() {
  return (
    <LocaleProvider locale="en-US">
      <UserGreeting />
    </LocaleProvider>
  );
}
```

---

### Design Tokens & Styling Contract

Per Nofinite ecosystem standards, styling tokens and component classes are centralized in **NUICSS** (`@nofinite/nuicss`).

Import the compatibility style shim:

```ts
import '@nofinite/locale/style';
```

Or consume `@nofinite/nuicss` directly. Flag icons and country UI indicators consume NUICSS tokens (`var(--color-primary)`, `var(--bg-surface)`).

---

## License

This project is licensed under the
[Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
