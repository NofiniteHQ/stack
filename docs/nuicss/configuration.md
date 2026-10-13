# Configuration

Configure NUICSS to fit your application structure, custom themes, and design tokens.

---

## Configuration File

NUICSS loads configuration from `nuicss.config.ts` (or `.js`, `.mjs`, `.cjs`) in your project root using the `defineConfig` helper:

```ts
import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [nuicssPreset()],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|html)($|\?)/,
        'src/**/*.{js,ts,jsx,tsx,mdx}',
      ],
    },
  },
});
```

---

## Configuration Options

### 1. `presets`

Presets bundle rules, shortcuts, variants, and theme defaults. By default, always include `nuicssPreset()`, which bundles the complete Nofinite token system, typography scales, and utility rules.

```ts
presets: [
  nuicssPreset({
    // optional preset configurations
  }),
],
```

### 2. `content.pipeline.include`

Specifies which source files the compiler should scan for class names. Use standard glob strings or regex patterns:

```ts
content: {
  pipeline: {
    include: [
      'src/**/*.{js,ts,jsx,tsx,mdx}',
      'components/**/*.{js,ts,jsx,tsx}',
      'pages/**/*.{js,ts,jsx,tsx}',
    ],
  },
},
```

### 3. `theme`

Extend the default color palette, font families, breakpoints, and sizing scales:

```ts
theme: {
  colors: {
    brand: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
},
```

### 4. `shortcuts`

Combine multiple utility classes into clean, reusable aliases or build domain-specific shortcuts on top of superclasses:

```ts
shortcuts: {
  'hero-heading': 'text-4xl font-extrabold tracking-tight lg:text-5xl text-default',
  'metric-badge': 'badge badge-subtle font-mono text-xs',
},
```
