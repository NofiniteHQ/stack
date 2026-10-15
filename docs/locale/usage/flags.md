# Country Flag Sprites

Display crisp country flags using responsive CSS classes.

---

## Setup Stylesheet

```ts
import '@nofinite/locale/style';
```

---

## Flag Classes Reference

| Class            | Description                                                           |
| :--------------- | :-------------------------------------------------------------------- |
| `.nf-flag`       | Base flag container (required).                                       |
| `.nf-flag-{iso}` | Lowercase ISO-2 country code (e.g., `.nf-flag-us`, `.nf-flag-in`).    |
| `.square`        | Optional modifier enforcing a 1:1 square aspect ratio instead of 4:3. |

---

## Examples

### Standard Flag (4:3 Aspect Ratio)

```html
<span class="nf-flag nf-flag-us"></span>
<span class="nf-flag nf-flag-in"></span>
<span class="nf-flag nf-flag-de"></span>
```

### Square Flag (1:1 Aspect Ratio)

```html
<span class="nf-flag nf-flag-jp square"></span>
<span class="nf-flag nf-flag-gb square"></span>
```

### In React UI Elements

```tsx
import React from 'react';
import '@nofinite/locale/style';

export function CountrySelectorButton() {
  return (
    <button className="btn btn-secondary flex items-center gap-2">
      <span className="nf-flag nf-flag-in square w-4 h-4" />
      <span>India (+91)</span>
    </button>
  );
}
```
