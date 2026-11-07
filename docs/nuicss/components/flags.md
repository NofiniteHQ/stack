# Country Flag System

Vectorized, responsive country flag utilities for web interfaces, forms, and country pickers.

---

## 1. Overview

**NUICSS** includes a lightweight, modular Country Flag System providing crisp, vector-based flag indicators for 245 international countries and territories.

Flags are delivered on-demand via standard CSS background images, meaning browsers only download vector data for the flags actually rendered on the active page.

---

## 2. Setup & Import

The Flag System is packaged as an optional, dedicated subpath in `@nofinite/nuicss`.

### In CSS:

```css
@import '@nofinite/nuicss/flags.css';
```

### In JavaScript / TypeScript (Vite, Next.js, Remix):

```ts
import '@nofinite/nuicss/flags.css';
```

### In Plain HTML / CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/flags.css"
/>
```

---

## 3. Class Naming Convention

Flags use the `flag-` namespace followed by the lowercase **ISO 3166-1 alpha-2** country code:

```html
<span class="flag-in" aria-hidden="true"></span>
<!-- India -->
<span class="flag-us" aria-hidden="true"></span>
<!-- United States -->
<span class="flag-gb" aria-hidden="true"></span>
<!-- United Kingdom -->
<span class="flag-de" aria-hidden="true"></span>
<!-- Germany -->
<span class="flag-fr" aria-hidden="true"></span>
<!-- France -->
<span class="flag-jp" aria-hidden="true"></span>
<!-- Japan -->
```

> [!NOTE]
> Standalone usage (`<span class="flag-in">`) works out of the box. Compound syntax (`<span class="flag flag-in">`) is also supported.

---

## 4. Sizing & Aspect Ratios

Flags default to a **4:3 aspect ratio** and fluidly scale relative to text using `1em`:

```html
<!-- Coupled to text size -->
<p class="text-sm">Small: <span class="flag-in" aria-hidden="true"></span></p>
<p class="text-lg">Large: <span class="flag-in" aria-hidden="true"></span></p>
<p class="text-3xl">
  Extra Large: <span class="flag-in" aria-hidden="true"></span>
</p>
```

### Modifiers: Square & Circular Avatar Presentation

```html
<!-- Square 1:1 Presentation -->
<span class="flag-in flag-square" aria-hidden="true"></span>
<span class="flag-us flag-square" aria-hidden="true"></span>

<!-- Circular Avatar Presentation -->
<span class="flag-gb flag-circle" aria-hidden="true"></span>
<span class="flag-de flag-circle" aria-hidden="true"></span>
```

### Custom Sizing via CSS Variables:

```css
.my-custom-flag {
  --nf-flag-height: 24px;
  --nf-flag-radius: 4px;
}
```

---

## 5. UI Integration Examples

### 5.1 Country Selector Dropdown

```html
<button class="btn btn-outline flex items-center gap-2">
  <span class="flag-in flag-square" aria-hidden="true"></span>
  <span>India (+91)</span>
  <span class="text-xs opacity-60">▼</span>
</button>
```

### 5.2 Phone Input Prefix

```html
<div
  class="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white"
>
  <div
    class="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border-r border-slate-300 text-sm"
  >
    <span class="flag-us" aria-hidden="true"></span>
    <span>+1</span>
  </div>
  <input
    type="tel"
    class="px-3 py-2 outline-none text-sm"
    placeholder="(555) 000-0000"
  />
</div>
```

### 5.3 React Integration with `@nofinite/locale`

```tsx
import React from 'react';
import { getCountryByCode } from '@nofinite/locale/countries';
import '@nofinite/nuicss/flags.css';

interface CountryBadgeProps {
  iso: string;
}

export function CountryBadge({ iso }: CountryBadgeProps) {
  const country = getCountryByCode(iso);
  const code = iso.toLowerCase();

  return (
    <span className="badge badge-subtle gap-2">
      <span className={`flag-${code} flag-square`} aria-hidden="true" />
      <span>{country?.name ?? iso}</span>
    </span>
  );
}
```

---

## 6. Accessibility Guidance (WCAG 2.1 AA)

- **Decorative Flags (Recommended):** When a country name or dial code is visible as text, mark the flag with `aria-hidden="true"` so screen readers do not make redundant announcements:
  ```html
  <span class="flag-in" aria-hidden="true"></span> <span>India</span>
  ```
- **Standalone Flags (No Visible Text):** If a flag is displayed as an icon button without text, provide an accessible label:
  ```html
  <button class="btn btn-icon" aria-label="Select India">
    <span class="flag-in" role="img" aria-label="India flag"></span>
  </button>
  ```

---

## 7. Supported Codes & Coverage

The system supports **271 flag designs**:

- **All 245 sovereign nations and territories** in `@nofinite/locale/countries`.
- **Extended international bodies:** `eu` (European Union), `un` (United Nations), `arab` (Arab League), `asean` (ASEAN).
- **Regional subdivisions:** `gb-eng` (England), `gb-sct` (Scotland), `gb-wls` (Wales), `gb-nir` (Northern Ireland), `es-ct` (Catalonia).

---

## 8. Asset Licensing & Attribution

Flag vector assets are derived from the [lipis/flag-icons](https://github.com/lipis/flag-icons) project, licensed under the **MIT License** (Copyright (c) 2013-present Panayiotis Lipiridis and contributors). See `THIRD_PARTY_LICENSES.md` for full copyright details.

---

## 9. Browser Support & Performance

- **Supported Browsers:** Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome (all modern browsers supporting CSS `@layer` and CSS custom properties).
- **Performance:** Micro-downloads on demand. Initial download cost for unused flags is 0 bytes.
