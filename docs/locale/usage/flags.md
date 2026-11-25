# Country Flag Sprites

Display crisp country flags using responsive CSS classes from **NUICSS** (`@nofinite/nuicss`).

---

## Setup Stylesheet

```ts
import '@nofinite/nuicss/flags.css';
```

_(Legacy import `import '@nofinite/locale/style';` is also supported as a backward-compatibility shim)._

---

## Flag Classes Reference

| Class            | Description                                                           |
| :--------------- | :-------------------------------------------------------------------- |
| `flag-{iso}`     | Lowercase ISO-2 country code (e.g., `flag-in`, `flag-us`, `flag-gb`). |
| `.flag-square`   | Optional modifier enforcing a 1:1 square aspect ratio instead of 4:3. |
| `.flag-circle`   | Optional modifier enforcing circular avatar presentation.             |
| `.nf-flag`       | Legacy base container (supported for backward compatibility).         |
| `.nf-flag-{iso}` | Legacy ISO-2 class (supported for backward compatibility).            |
| `.square`        | Legacy square modifier (supported for backward compatibility).        |

---

## Examples

### Standard Flag (4:3 Aspect Ratio)

```html
<span class="flag-us" aria-hidden="true"></span>
<span class="flag-in" aria-hidden="true"></span>
<span class="flag-de" aria-hidden="true"></span>
```

### Square Flag (1:1 Aspect Ratio)

```html
<span class="flag-jp flag-square" aria-hidden="true"></span>
<span class="flag-gb flag-square" aria-hidden="true"></span>
```

### In React UI Elements

```tsx
import React from 'react';
import '@nofinite/nuicss/flags.css';

export function CountrySelectorButton() {
  return (
    <button className="btn btn-secondary flex items-center gap-2">
      <span class="flag-in flag-square" aria-hidden="true" />
      <span>India (+91)</span>
    </button>
  );
}
```
