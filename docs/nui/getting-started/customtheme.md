---
title: Theme Customization
sidebar_position: 3
---

# Theme Customization

NUI uses **CSS design tokens** for theming.

To customize the UI, override **semantic tokens** instead of primitive scales.

This ensures:

- component consistency
- dark-mode compatibility
- forward compatibility with future NUI updates

---

## Token Strategy

NUI follows semantic layering:

1. primitives → internal palette
2. semantic tokens → component logic
3. app overrides → branding

Consumers should operate only at **layer 3**.

---

## What You Should Override

### Semantic tokens (safe to override)

```
--nui-bg-page
--nui-bg-surface
--nui-fg-default
--nui-border-default
--nui-color-primary
--nui-color-success
--nui-color-danger
--nui-color-warning
```

These control component appearance.

---

### Primitive tokens (do NOT override)

```
--nui-slate-500
--nui-brand-600
--nui-red-500
```

These are internal palette values used by semantic tokens.

---

## Override Theme Tokens

Create a global stylesheet (example: `theme.css`) and override tokens inside `:root`.

```css
:root {
  /* Primary brand */
  --nui-color-primary: #7c3aed;
  --nui-color-primary-hover: #6d28d9;
  --nui-color-primary-fg: #ffffff;

  /* Surface */
  --nui-bg-surface: #fafafa;

  /* Borders */
  --nui-border-default: #e5e7eb;

  /* Text */
  --nui-fg-default: #111827;
}
```

---

## Import Order (Important)

Load overrides **after** NUI styles.

```tsx
import '@nofinite/nui/styles.css';
import './theme.css';
```

This guarantees correct CSS cascade precedence.

---

## Dark Mode Overrides

Override tokens inside the dark theme selector.

```css
[data-theme='dark'] {
  --nui-bg-page: #020617;
  --nui-bg-surface: #0f172a;
  --nui-fg-default: #f8fafc;

  --nui-color-primary: #8b5cf6;
  --nui-color-primary-hover: #7c3aed;
}
```

---

## Example: Full Brand Theme

```css
:root {
  --nui-color-primary: #0ea5e9;
  --nui-color-primary-hover: #0284c7;
  --nui-color-success: #22c55e;
  --nui-color-warning: #f97316;
  --nui-color-danger: #ef4444;
}
```

---

## Runtime Theme Switching (Advanced)

Tokens can be updated dynamically.

```ts
document.documentElement.style.setProperty('--nui-color-primary', '#ec4899');
```

Useful for:

- theme editors
- white-label SaaS
- multi-tenant apps

---

## Best Practices

- Prefer semantic tokens over primitive palette overrides.
- Override only necessary tokens.
- Keep all overrides in a single theme file.
- Combine global tokens with component tokens when needed.
- Respect reduced-motion user preferences when overriding animation tokens.
