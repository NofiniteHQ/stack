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
  const country = NofiniteLocale.getCountryByCode("IN");
  console.log(country.name); // India
  console.log(country.dialCode); // +91
</script>
```

---

### Use Flags

Flags are provided via CSS. Import the stylesheet once.

_(For Javascript/Typescript)_

```ts
import "@nofinite/locale/style";
```

_(For HTML)_

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/style.css"
/>
```

**Flag Classes**

| Class            | Purpose                        |
| ---------------- | ------------------------------ |
| `.nf-flag`       | Base flag class (required)     |
| `.nf-flag-{iso}` | Country ISO-2 code (lowercase) |
| `.square`        | Optional 1:1 ratio             |

**Examples**

- Standard (4:3)
  `<span class="nf-flag nf-flag-us"></span>`
  <br/>
- Square (1:1)
  `<span class="nf-flag nf-flag-jp square"></span>`
  <br/>
- Inside UI Elements

  ```html
  <button>
    <span class="nf-flag nf-flag-fr square"></span>
    Select Language
  </button>
  ```

---

## License

This project is licensed under the
[Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
