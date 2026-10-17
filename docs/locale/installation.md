# Installation & Setup

Complete guide to installing and using **Nofinite Locale** in Node.js, modern web runtimes, and frontend frameworks.

---

## 1. Package Installation

Install `@nofinite/locale` using your preferred package manager:

```bash
# pnpm
pnpm add @nofinite/locale

# npm
npm install @nofinite/locale

# yarn
yarn add @nofinite/locale

# bun
bun add @nofinite/locale
```

> [!NOTE] > **Zero Runtime Dependencies:** `@nofinite/locale` has **0 external runtime dependencies**. It executes natively on any JavaScript engine (Node.js `>= 18`, Cloudflare Workers, Deno, Bun, and all modern browsers).

---

## 2. Flag Stylesheet (Optional)

If your application renders SVG country flags, import the lightweight flag stylesheet:

```ts
import '@nofinite/locale/style';
```

Or in your HTML via CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/style.css"
/>
```

---

## 3. Verify Installation

### In Node.js / TypeScript / Vanilla DOM

```ts
import {
  getCountryByCode,
  getCountryByDialCode,
  countries,
} from '@nofinite/locale';

// Lookup metadata for a country by ISO-2 code
const country = getCountryByCode('US');
console.log(country);
// { name: 'United States', iso2: 'US', dialCode: '+1' }

// Total countries in catalog
console.log(`Loaded ${countries.length} countries.`);
```

### In Plain HTML via CDN

```html
<script type="module">
  import { getCountryByCode } from 'https://esm.sh/@nofinite/locale';

  const de = getCountryByCode('DE');
  console.log(de.name); // 'Germany'
</script>
```

---

## Next Steps

- Explore the [Country Lookup API](/locale/usage/country-lookup) for searching and filtering country data.
- Learn how to render [SVG Flags](/locale/usage/flags) using optimized CSS classes.
