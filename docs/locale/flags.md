# SVG Flag Icons

**Nofinite Locale** provides lightweight, CSS-driven SVG flag icons for 240+ international countries and territories.

The stylesheet bundles vectorized country flag sprites that scale cleanly, eliminating the need to serve hundreds of loose PNGs or make external network requests.

---

## 1. Import Styles

### In JavaScript / TypeScript Entry

```ts
import '@nofinite/locale/style';
```

### In Plain HTML / CDN

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nofinite/locale/dist/style.css"
/>
```

---

## 2. CSS Flag Classes

| Class            | Description                                                                            |
| :--------------- | :------------------------------------------------------------------------------------- |
| `.nf-flag`       | Base flag container (required)                                                         |
| `.nf-flag-{iso}` | Target country by lowercase ISO-2 code (e.g. `nf-flag-us`, `nf-flag-in`, `nf-flag-de`) |
| `.square`        | Optional modifier for square (1:1) aspect ratio                                        |

---

## 3. Usage in Vanilla HTML (Core First)

### Standard 4:3 Flag

```html
<span class="nf-flag nf-flag-us"></span>
<span class="nf-flag nf-flag-gb"></span>
<span class="nf-flag nf-flag-in"></span>
```

### Square 1:1 Flag

```html
<span class="nf-flag nf-flag-jp square"></span>
<span class="nf-flag nf-flag-br square"></span>
```

### Embedded in Buttons & Form Controls

```html
<button class="btn btn-outline flex items-center gap-2">
  <span class="nf-flag nf-flag-fr square"></span>
  <span>Français (FR)</span>
</button>
```

---

## 4. Usage in React

```tsx
'use client';

import React from 'react';
import '@nofinite/locale/style';

interface FlagProps {
  iso: string;
  square?: boolean;
  className?: string;
}

export function Flag({ iso, square = false, className = '' }: FlagProps) {
  const normalized = iso.toLowerCase();
  const squareClass = square ? 'square' : '';

  return (
    <span
      className={`nf-flag nf-flag-${normalized} ${squareClass} ${className}`.trim()}
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
      <Flag iso="DE" />
    </div>
  );
}
```
