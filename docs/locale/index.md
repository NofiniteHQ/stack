# Nofinite Locale

> Zero-dependency country metadata, international dialing codes, and lightweight SVG flags.

---

## Overview

**Nofinite Locale** is a high-performance, tree-shakeable, 100% framework-agnostic utility library providing standardized international country metadata, phone dialing codes, and lightweight CSS-driven SVG flags for web applications.

It is designed to power international phone inputs, registration forms, billing address selectors, and localization layers with strict TypeScript typings and zero external runtime dependencies.

---

## Core Capabilities

- **Normalized Country Metadata**: 240+ international countries and territories with official common names, ISO-2 alpha codes, and international dialing codes.
- **Fast In-Memory Lookup APIs**: Instant case-insensitive resolution by ISO-2 code or telephone dial code (`getCountryByCode`, `getCountryByDialCode`).
- **Optimized CSS Flag Icons**: Pure CSS SVG flags (`@nofinite/locale/style`) avoiding hundreds of heavy raster images or separate HTTP requests.
- **Strict TypeScript Types**: Fully typed `Country` interface with zero `any` leakage.
- **100% Framework Agnostic**: Runs everywhere — Node.js, Edge workers, Deno, Bun, Next.js, Vite, Vue, Svelte, or vanilla HTML/JS.

---

## 1. Usage in Vanilla TypeScript & HTML (Core First)

### In-Memory Metadata Lookups

```ts
import {
  getCountryByCode,
  getCountryByDialCode,
  countries,
} from '@nofinite/locale';

// 1. Lookup country by ISO-2 code (case-insensitive)
const usa = getCountryByCode('US');
console.log(usa);
// { name: 'United States', iso2: 'US', dialCode: '+1' }

// 2. Lookup country by telephone dial code
const india = getCountryByDialCode('+91');
console.log(india);
// { name: 'India', iso2: 'IN', dialCode: '+91' }

// 3. Iterate over the complete country catalog for a select dropdown
const options = countries.map((c) => ({
  value: c.iso2,
  label: `${c.name} (${c.dialCode})`,
}));
```

### Pure HTML & CSS Flag Rendering

Import the stylesheet in your CSS or JavaScript entry:

```ts
import '@nofinite/locale/style';
```

Or in plain HTML via CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/style.css"
/>
```

Use semantic `.nf-flag` and `.nf-flag-{iso}` classes:

```html
<!-- Standard 4:3 Flag -->
<span class="nf-flag nf-flag-us"></span>

<!-- Square 1:1 Flag -->
<span class="nf-flag nf-flag-jp square"></span>

<!-- Flag inside a button -->
<button class="btn btn-outline flex items-center gap-2">
  <span class="nf-flag nf-flag-fr square"></span>
  <span>Français</span>
</button>
```

---

## 2. Usage in React

```tsx
'use client';

import React, { useState } from 'react';
import { countries, getCountryByCode } from '@nofinite/locale';
import '@nofinite/locale/style';
import '@nofinite/nuicss/styles.css';

export function CountryPicker() {
  const [selectedIso, setSelectedIso] = useState('US');
  const activeCountry = getCountryByCode(selectedIso);

  return (
    <div className="card max-w-sm p-4 space-y-3">
      <label className="text-xs font-semibold text-muted">Select Country</label>

      <div className="flex items-center gap-3">
        <span
          className={`nf-flag nf-flag-${selectedIso.toLowerCase()} text-xl`}
        />
        <select
          value={selectedIso}
          onChange={(e) => setSelectedIso(e.target.value)}
          className="select select-sm bg-surface border border-default rounded-md flex-1 text-sm"
        >
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
      </div>

      {activeCountry && (
        <p className="text-xs text-muted">
          Dial Code:{' '}
          <span className="font-mono text-primary">
            {activeCountry.dialCode}
          </span>
        </p>
      )}
    </div>
  );
}
```

---

## API Summary

| Export                                                       | Type                                         | Description                                          |
| :----------------------------------------------------------- | :------------------------------------------- | :--------------------------------------------------- |
| [`countries`](/locale/usage/country-lookup)                  | `Country[]`                                  | Array of all countries with name, ISO2, and dialCode |
| [`getCountryByCode(iso)`](/locale/usage/country-lookup)      | `(iso: string) => Country \| undefined`      | Resolves country metadata by ISO-2 code              |
| [`getCountryByDialCode(code)`](/locale/usage/country-lookup) | `(dialCode: string) => Country \| undefined` | Resolves country metadata by phone dial code         |
| [`@nofinite/locale/style`](/locale/usage/flags)              | Stylesheet                                   | Optimized SVG flag sprites and utility classes       |

---

## Next Steps

- Follow the [Installation Guide](/locale/installation) to install and configure the package.
- Explore [Country Lookup](/locale/usage/country-lookup) for country filtering and search recipes.
- Explore [SVG Flags](/locale/usage/flags) for flag sizing, styling, and form integration.
