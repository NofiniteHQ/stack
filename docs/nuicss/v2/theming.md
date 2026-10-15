---
sidebar_position: 3
title: Theming & Configuration
---

# Theming NUI CSS

NUI CSS uses a unified configuration file to define theme values and semantic components.

## The Config File

Create a `nuicss.config.ts` (or `.js`) in the root of your project:

```typescript
export default {
  // Add a custom prefix to all classes (e.g. `tw-bg-surface`)
  prefix: '',

  // Directories for the PostCSS engine to scan
  content: [
    './src/**/*.{js,ts,jsx,tsx,html,vue,svelte}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],

  // Override or extend theme tokens
  theme: {
    colorsBg: {
      brand: '#ff0055',
      secondary: '#4b5563',
    },
    colorsText: {
      brand: '#ff0055',
    },
    spacings: {
      '128': '32rem',
    },
  },

  // Create semantic components that compile down to utilities
  components: {
    'btn-brand': [
      'bg-brand',
      'text-white',
      'px-6',
      'py-3',
      'rounded-full',
      'shadow-lg',
      'transition-transform',
      'hover:scale-105',
    ],
  },
};
```

## CSS Variables

Under the hood, all theme values are injected as CSS variables on `:root`.

For example, `colorsBg.brand` generates `--nui-bg-brand: #ff0055`. This allows you to dynamically change themes at runtime (e.g. implementing a user-selectable theme color) without regenerating the CSS!

## Component Expansion

When you define a component like `btn-brand` in your configuration, the JIT engine will automatically map it, expand the base classes, and generate a single `.btn-brand` selector in the output CSS.

**Rule Specificity:** NUI CSS parses components and utility classes in a strict, organic order. Components always receive a `ruleOrder` of `0`, meaning they appear first in the generated CSS. This guarantees that base component styles are easily overridden by utility classes (like `px-4`) via standard CSS specificity rules—without needing `!important` hacks.

This is the recommended way to handle highly reusable components while maintaining the performance benefits of the utility-first engine.
