# Theming and Glassmorphic Popovers

**Nofinite Charts** strictly adheres to the **Zero Downstream CSS Invariant**: it bundles no independent stylesheets. All colors, frosted glass surfaces, hairline reflections, and micro-typography are governed by **NUICSS** design tokens and superclasses.

---

## The OKLCH Color Palette

In **NUICSS**, chart series map directly to perceptually uniform OKLCH design tokens:

```css
:root {
  --color-primary: oklch(0.62 0.24 255);
  --color-info: oklch(0.65 0.18 220);
  --color-success: oklch(0.64 0.2 145);
  --color-warning: oklch(0.72 0.18 75);
  --color-danger: oklch(0.6 0.24 25);

  --chart-1: var(--color-primary);
  --chart-2: var(--color-success);
  --chart-3: var(--color-warning);
  --chart-4: var(--color-danger);
  --chart-5: var(--color-info);
}
```

---

## 1. Framework-Agnostic Core Theming

In Vanilla JavaScript, TypeScript, or any framework, configure colors directly via CSS variables or the `color` option:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const chart = new Chart({
  element: document.querySelector('#themed-chart'),
  variant: 'line',
  data: myData,
  color: 'var(--chart-2)', // Directly inherits OKLCH success token
  series: [
    { name: 'Primary Metric', key: 'primary', color: 'var(--color-primary)' },
    { name: 'Benchmark Metric', key: 'benchmark', color: 'var(--fg-muted)' },
  ],
});
```

---

## 2. React Adapter Theming

When passing series colors in React, reference CSS variables directly:

```tsx
import { LineChart } from '@nofinite/charts/react';

<LineChart
  data={data}
  xAccessor={(d) => d.date}
  yAccessor={(d) => d.value}
  strokeColor="var(--chart-1)"
  fillColor="var(--chart-1)"
/>;
```

---

## Frosted Glass Popover Card (`.chart-tooltip`)

Tooltips in **Nofinite Charts** render as modern, frosted glass popovers matching macOS / visionOS standards:

- **`.chart-tooltip`:** `absolute pointer-events-none bg-surface/75 backdrop-blur-xl saturate-150 border border-white/10 dark:border-white/10 rounded-xl shadow-2xl px-3.5 py-2.5 text-xs text-default z-50`
- **`.chart-tooltip-title`:** `text-[11px] font-semibold text-muted tracking-wider uppercase pb-1.5 mb-1.5 border-b border-default/20 opacity-80`
- **`.chart-tooltip-swatch`:** `w-2 h-2 rounded-full ring-2 ring-current/25 shrink-0`
- **`.chart-tooltip-value`:** `font-semibold font-mono text-default tabular-nums ml-auto`

### Specular Hairline & Ambient Shadows

```css
/* Dark Mode */
.chart-tooltip {
  box-shadow: 0 16px 36px -6px oklch(0 0 0 / 0.35), inset 0 1px 0 0 oklch(1 0
          0 / 0.15);
}

/* Light Mode */
[data-theme='light'] .chart-tooltip,
.light .chart-tooltip {
  box-shadow: 0 12px 30px -4px oklch(0 0 0 / 0.12), inset 0 1px 0 0 oklch(1 0
          0 / 0.6);
}
```
