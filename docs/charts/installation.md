# Installation & Setup

Get started with `@nofinite/charts`.

**Nofinite Charts** is engineered as a **universal, framework-agnostic** data visualization suite. The core library (`@nofinite/charts`) runs in any JavaScript or TypeScript environment with zero framework dependencies. The React adapter (`@nofinite/charts/react`) is provided as an optional layer for React and Next.js applications.

---

## 1. Package Installation

Install `@nofinite/charts` alongside `@nofinite/nuicss` using your preferred package manager:

```bash
# pnpm
pnpm add @nofinite/charts @nofinite/nuicss

# npm
npm install @nofinite/charts @nofinite/nuicss

# yarn
yarn add @nofinite/charts @nofinite/nuicss
```

> **Peer Dependency Notice:** `react` and `react-dom` are strictly **optional** peer dependencies (`peerDependenciesMeta.react.optional: true`). If you are using Vanilla JS, Vue, Svelte, or Node.js, you do **not** need to install React.

---

## 2. Stylesheet Configuration

Chart container geometry, interactive crosshair scrubbers, frosted glass popovers, and keyframe animations are pre-compiled directly into **NUICSS**.

Import the single unified stylesheet at the root of your application (`globals.css`, `main.ts`, or `layout.tsx`):

```css
/* In your CSS */
@import '@nofinite/nuicss';
```

Or in your JavaScript/TypeScript entry point:

```ts
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Invariant:** Do **not** import `@nofinite/charts/styles.css`. NUICSS provides all necessary styling classes and OKLCH color variables automatically.

---

## 3. Configure Theme Tokens

`@nofinite/charts` resolves to perceptually uniform OKLCH variables. By default, it inherits your active NUICSS palette:

```css
:root {
  --chart-1: oklch(0.65 0.22 260); /* Primary series accent */
  --chart-2: oklch(0.7 0.19 160); /* Secondary series accent */
  --chart-3: oklch(0.75 0.18 55); /* Tertiary series accent */
  --chart-4: oklch(0.62 0.21 320); /* Fourth series accent */
  --chart-5: oklch(0.8 0.16 85); /* Fifth series accent */
  --chart-6: oklch(0.58 0.2 200); /* Sixth series accent */
  --chart-7: oklch(0.68 0.18 290); /* Seventh series accent */
  --chart-8: oklch(0.72 0.17 120); /* Eighth series accent */
}
```

---

## 4. Verification

### Option A: Framework-Agnostic Core Verification (Vanilla JS / TS / DOM)

Verify that charts mount into a raw HTML element:

```html
<div id="chart" style="width: 100%; height: 260px;"></div>

<script type="module">
  import { Chart } from '@nofinite/charts';
  import '@nofinite/nuicss/styles.css';

  const chart = new Chart({
    element: document.getElementById('chart'),
    variant: 'bar',
    data: [
      { label: 'Q1', value: 45 },
      { label: 'Q2', value: 80 },
      { label: 'Q3', value: 65 },
      { label: 'Q4', value: 95 },
    ],
    showGrid: true,
    showAxes: true,
    showTooltip: true,
  });
</script>
```

### Option B: React Verification (`@nofinite/charts/react`)

If developing in React or Next.js, verify the declarative JSX component:

```tsx
import React from 'react';
import { BarChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

export default function TestChart() {
  return (
    <div className="w-full h-64 p-4 rounded-xl border border-default bg-surface">
      <BarChart
        data={[
          { label: 'Q1', value: 45 },
          { label: 'Q2', value: 80 },
          { label: 'Q3', value: 65 },
          { label: 'Q4', value: 95 },
        ]}
        xAccessor={(d) => d.label}
        yAccessor={(d) => d.value}
        showTooltip={true}
      />
    </div>
  );
}
```
