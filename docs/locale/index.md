# Nofinite Locale

> Lightweight country metadata resolver, international dial code lookups, and SVG flag asset classes.

---

## Overview

**Nofinite Locale** (`@nofinite/locale`) provides zero-runtime country lookups, ISO-3166 code resolvers, and responsive SVG flag sprites for international forms and checkout funnels.

### Key Highlights

- **Fast Country Resolution:** Look up countries by case-insensitive ISO-2 code or international dial code (`+91`, `1`, `44`).
- **Comprehensive Flag Catalog:** Over 250 SVG country flags with standard (4:3) and square (1:1) aspect ratios.
- **Zero Heavy Dependencies:** Lightweight data arrays compiled into pure JavaScript without external network lookups.

---

## Basic Example

```ts
import { getCountryByCode, getCountryByDialCode } from '@nofinite/locale';

// Lookup country by ISO2 code
const country = getCountryByCode('US');
console.log(country?.name); // "United States"
console.log(country?.dialCode); // "+1"

// Lookup by dial code
const india = getCountryByDialCode('+91');
console.log(india?.name); // "India"
console.log(india?.iso2); // "IN"
```

---

## Guides & Documentation

- [Installation & Setup](./getting-started/installation.md) — Package installation and style imports.
- [Country Lookup API](./usage/country-lookup.md) — Helper functions for ISO codes and telephone dial codes.
- [Flag Sprites & Classes](./usage/flags.md) — Rendering country flags using CSS classes.
