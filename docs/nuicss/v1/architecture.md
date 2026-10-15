---
title: Architecture
sidebar_position: 5
---

# NUI CSS Architecture

NUI CSS is designed as a **zero-configuration utility framework powered by design tokens**.

Instead of relying on build-time configuration or runtime JavaScript, the framework uses **precompiled utilities and CSS variables** to create a predictable styling system.

This architecture keeps the framework lightweight, scalable, and compatible with any frontend stack.

---

# Core Principles

The architecture of NUI CSS is built around four key ideas.

### Zero Configuration

NUI CSS requires no configuration files or build plugins.

Developers simply install the package and import the stylesheet.

```js
import '@nofinite/nuicss';
```

This makes the framework easy to adopt in any environment.

---

### Utility-First Styling

The framework provides small reusable classes that map directly to CSS properties.

Example:

```html
<div class="flex items-center justify-between p-4">Content</div>
```

These utilities represent layout, spacing, and sizing primitives.

This approach reduces the need for custom CSS while maintaining full layout control.

---

### Design Token System

All spacing utilities are powered by CSS variables.

Example token:

```css
--nui-space-4: 1rem;
```

Utilities reference these tokens:

```css
.p-4 {
  padding: var(--nui-space-4);
}
```

Because utilities rely on tokens instead of fixed values, developers can modify the entire spacing system by overriding token values.

This architecture enables flexible theming without recompiling CSS.

---

# Utility Generation

NUI CSS utilities are **generated ahead of time** and distributed as a compiled stylesheet.

Example utilities include:

```
flex
items-center
justify-between
p-4
gap-4
w-full
```

Each class maps directly to a CSS property.

Example:

```css
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.p-4 {
  padding: var(--nui-space-4);
}
```

This predictable mapping makes utilities easy to understand and use.

The compiled utilities are included in the framework stylesheet.

---

# Prefixed Mode

NUI CSS ships with two utility modes.

### Standard Utilities

Standard utilities are designed for application development.

Example:

```
flex
p-4
gap-4
```

### Prefixed Utilities

Prefixed utilities are designed for component libraries.

Example:

```
nui-flex
nui-p-4
nui-gap-4
```

The prefixed utilities prevent class collisions when components are distributed across multiple applications.

These prefixed classes are defined in the prefixed stylesheet.

---

# Framework Compatibility

Because NUI CSS is pure CSS, it works with any frontend environment.

Supported environments include:

- React
- Next.js
- Vue
- Svelte
- Vite
- Static HTML
- Server-side rendering frameworks

No framework-specific integration is required.

---

# Performance Characteristics

The framework is optimized for performance.

Key properties include:

- no runtime JavaScript
- minimal CSS specificity
- predictable utility naming
- no configuration overhead

These properties make the framework suitable for both small applications and large design systems.

---

# Relationship with NUI

NUI CSS serves as the **styling foundation of the NUI component library**.

The architecture separates responsibilities:

| Layer        | Responsibility               |
| ------------ | ---------------------------- |
| NUI CSS      | layout and styling utilities |
| NUI          | React UI primitives          |
| Applications | product-specific styling     |

This separation allows teams to build scalable UI systems while maintaining full styling control.

---

# Summary

NUI CSS is built around a simple architecture:

1. **Precompiled utilities**
2. **CSS variable design tokens**
3. **Zero configuration setup**
4. **Optional prefixed utilities**

This architecture enables fast adoption, predictable styling, and flexible design systems across modern web applications.
