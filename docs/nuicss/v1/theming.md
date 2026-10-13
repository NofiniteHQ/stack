---
title: Theming & Tokens
sidebar_position: 4
---

# Theming & Design Tokens

NUI CSS is built on top of **CSS design tokens**.

Instead of hardcoding spacing values directly in utilities, the framework uses CSS variables. This makes it possible to customize spacing, themes, and design systems without modifying the framework itself.

---

# What are Design Tokens?

Design tokens are named variables that store design values such as spacing, colors, and typography.

In NUI CSS, tokens are defined using CSS variables.

Example:

```css
--nui-space-4: 1rem;
```

Utilities reference these tokens instead of fixed values.

Example utility:

```css
.p-4 {
  padding: var(--nui-space-4);
}
```

This approach enables flexible design systems.

---

# Spacing Tokens

NUI CSS spacing utilities use the `--nui-space-*` token scale.

Example token definitions:

```css
:root {
  --nui-space-0: 0px;
  --nui-space-0-5: 0.125rem;
  --nui-space-1: 0.25rem;
  --nui-space-1-5: 0.375rem;
  --nui-space-2: 0.5rem;
  --nui-space-2-5: 0.625rem;
  --nui-space-3: 0.75rem;
  --nui-space-4: 1rem;
  --nui-space-5: 1.25rem;
  --nui-space-6: 1.5rem;
  --nui-space-8: 2rem;
  --nui-space-10: 2.5rem;
  --nui-space-12: 3rem;
  --nui-space-14: 3.5rem;
  --nui-space-16: 4rem;
  --nui-space-20: 5rem;
  --nui-space-24: 6rem;
  --nui-space-32: 8rem;
}
```

These tokens power utilities such as:

```
p-4
m-4
gap-4
w-4
h-4
```

---

# Customizing the Spacing Scale

You can override spacing tokens in your application.

Example:

```css
:root {
  --nui-space-4: 1.2rem;
}
```

Now every utility using `4` automatically updates.

Example:

```
p-4
gap-4
m-4
```

This allows easy global design adjustments.

---

# Creating Custom Themes

You can define theme variants using CSS selectors.

Example:

```css
[data-theme='compact'] {
  --nui-space-4: 0.75rem;
}

[data-theme='comfortable'] {
  --nui-space-4: 1.25rem;
}
```

Switch themes dynamically:

```html
<body data-theme="compact"></body>
```

All utilities update automatically.

---

# Runtime Theming

Because NUI CSS uses CSS variables, themes can change at runtime.

Example:

```js
document.documentElement.setAttribute('data-theme', 'compact');
```

No rebuild or recompilation is required.

---

# Future Token Categories

The token system is designed to expand beyond spacing.

Future tokens may include:

```
--nui-color-primary
--nui-color-surface
--nui-color-text

--nui-radius-sm
--nui-radius-md

--nui-font-size-sm
--nui-font-size-lg
```

These tokens will power additional utilities and UI components.

---

# Benefits of Token-Based Utilities

Using design tokens provides several advantages:

- consistent design across the application
- runtime theming support
- customizable design systems
- easier framework extension
- predictable spacing scale

This architecture allows NUI CSS to act as a **foundation for scalable UI systems**.

---

# Summary

NUI CSS utilities are powered by design tokens.

Example mapping:

| Utility | Token         |
| ------- | ------------- |
| p-4     | --nui-space-4 |
| gap-4   | --nui-space-4 |
| w-4     | --nui-space-4 |
| h-4     | --nui-space-4 |

By modifying tokens, developers can customize the entire framework without editing the source CSS.
