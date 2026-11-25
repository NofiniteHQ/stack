# SVG Flag Icons

**Nofinite Locale** provides standardized country metadata and ISO 3166-1 alpha-2 codes. Visual styling and vector flag indicators are provided by **NUICSS** (`@nofinite/nuicss`).

---

## 1. Import Styles

Country flag styling is packaged in `@nofinite/nuicss`:

### Recommended (NUICSS):

```ts
import '@nofinite/nuicss/flags.css';
```

### Via Locale Shim:

```ts
import '@nofinite/locale/style';
```

### In Plain HTML / CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/flags.css"
/>
```

---

## 2. CSS Flag Classes Reference

| Class            | Description                                                                                |
| :--------------- | :----------------------------------------------------------------------------------------- |
| `flag-{iso}`     | Canonical class for country by lowercase ISO-2 code (e.g. `flag-in`, `flag-us`, `flag-de`) |
| `.flag-square`   | Optional modifier for square (1:1) aspect ratio                                            |
| `.flag-circle`   | Optional modifier for circular avatar presentation                                         |
| `.nf-flag`       | Legacy base container (supported for backward compatibility)                               |
| `.nf-flag-{iso}` | Legacy ISO-2 class (supported for backward compatibility)                                  |
| `.square`        | Legacy square modifier (supported for backward compatibility)                              |

---

## 3. Usage in Vanilla HTML

### Standard 4:3 Flag (Canonical)

```html
<span class="flag-us" aria-hidden="true"></span>
<span class="flag-gb" aria-hidden="true"></span>
<span class="flag-in" aria-hidden="true"></span>
```

### Square 1:1 Flag

```html
<span class="flag-jp flag-square" aria-hidden="true"></span>
<span class="flag-br flag-square" aria-hidden="true"></span>
```

### Circular Avatar Flag

```html
<span class="flag-fr flag-circle" aria-hidden="true"></span>
<span class="flag-de flag-circle" aria-hidden="true"></span>
```

---

## 4. Usage in React with `@nofinite/locale`

```tsx
'use client';

import React from 'react';
import { getCountryByCode } from '@nofinite/locale/countries';
import '@nofinite/nuicss/flags.css';

interface FlagProps {
  iso: string;
  square?: boolean;
  className?: string;
}

export function Flag({ iso, square = false, className = '' }: FlagProps) {
  const normalized = iso.toLowerCase();
  const squareClass = square ? 'flag-square' : '';

  return (
    <span
      className={`flag-${normalized} ${squareClass} ${className}`.trim()}
      role="img"
      aria-label={`${iso.toUpperCase()} flag`}
    />
  );
}

// Example usage
export function LanguageSelector() {
  return (
    <div className="flex items-center gap-3">
      <Flag iso="US" />
      <Flag iso="JP" square={true} />
      <Flag iso="IN" />
    </div>
  );
}
```
