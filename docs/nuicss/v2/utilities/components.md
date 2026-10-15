---
sidebar_position: 7
title: Semantic Components
---

# Semantic Components

While NUI CSS is utility-first, it embraces the reality that certain UI elements (like buttons and inputs) are heavily reused. We provide standard semantic component classes that combine utilities for you.

## Built-in Components

### Buttons (`.btn`)

Base class for all buttons. Provides standard padding, border-radius, font-weight, transitions, and hover effects.

**Variations:**

- `.btn`: Standard button (inherits text/border colors).
- `.btn-primary`: Primary call to action, uses the `primary` theme color.
- `.btn-success`, `.btn-error`, `.btn-warning`, `.btn-info`
- `.btn-lg`, `.btn-sm`: Sizing variations.

### Form Inputs (`.input`)

Base class for text inputs, selects, textareas, and other form controls.

Applies standard height, padding, border-radius, border color, focus rings, and background transitions.

```html
<input type="text" class="input" placeholder="Type here..." />
```

### Labels (`.label`)

Standard form label styling.

```html
<label class="label">Email Address</label>
```

### Alerts (`.alert`)

Base styling for notification banners and alerts.

## Customizing Components

You can override, extend, or add completely new components by editing your `nuicss.config.ts`.

```ts
import type { NuicssConfig } from '@nofinite/nuicss/dist/plugin/config';

const config: NuicssConfig = {
  components: {
    // Override standard button
    btn: ['px-8', 'py-4', 'font-bold', 'rounded-xl', 'bg-surface'],

    // Create new custom component
    'card-glass': [
      'bg-surface/50',
      'backdrop-blur-xl',
      'border',
      'border-default/30',
      'rounded-3xl',
      'shadow-2xl',
    ],
  },
};

export default config;
```

These definitions are instantly compiled and expanded by the JIT engine when you use the classes in your markup.
