# Nofinite Charts

> High-performance vector data visualizations and animated SVG charts powered by D3 math and OKLCH design tokens.

---

## Interactive Preview

<Preview
name="chart"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('chart-container');

// Mount responsive interactive bar chart directly to DOM
const chart = new Chart({
element: container,
variant: 'bar',
data: [
{ label: 'Jan', value: 45 },
{ label: 'Feb', value: 52 },
{ label: 'Mar', value: 68 },
{ label: 'Apr', value: 84 },
{ label: 'May', value: 95 },
{ label: 'Jun', value: 110 }
],
height: 240,
showGrid: true,
showAxes: true,
showTooltip: true
});

// Update data dynamically
// chart.update(newSampleData);

// Clean up when unmounting
// chart.destroy();`}
/>

---

## Quickstart

### 1. Framework-Agnostic Core (`@nofinite/charts`)

Mount directly to any DOM element without React. Works in **Vanilla JavaScript**, **TypeScript**, **Vue 3**, **Svelte 5**, **SolidJS**, or backend **Node.js**:

```ts
import { Chart, renderChart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('chart')!;

// Method A: State-managed, responsive interactive instance
const chart = new Chart({
  element: container,
  variant: 'area', // 'area' | 'line' | 'bar' | 'pie' | 'donut' | 'scatter'
  data: [
    { date: '2026-01-01', value: 42 },
    { date: '2026-02-01', value: 58 },
    { date: '2026-03-01', value: 74 },
  ],
  height: 280,
  showGrid: true,
  showAxes: true,
  showTooltip: true,
});

// Method B: Pure isomorphic SVG HTML generator (zero DOM required)
const svgHtml = renderChart({
  variant: 'area',
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 25 },
  ],
  width: 600,
  height: 300,
});
```

### 2. React Adapter (`@nofinite/charts/react`)

Declarative JSX components for React 18 & 19 applications:

```tsx
import React from 'react';
import { AreaChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const metrics = [
  { time: '00:00', latency: 42 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 45 },
  { time: '12:00', latency: 68 },
  { time: '16:00', latency: 52 },
  { time: '20:00', latency: 31 },
];

export function LatencyChart() {
  return (
    <div className="w-full h-64 p-5 border border-default rounded-2xl bg-surface">
      <AreaChart
        data={metrics}
        xAccessor={(d) => d.time}
        yAccessor={(d) => d.latency}
        strokeColor="var(--color-primary)"
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Architectural Invariants

- **Universal Framework-Agnostic Core:** Zero React dependency required. The root export (`@nofinite/charts`) provides class-based DOM mounting, D3 math, downsampling, and SVG path generation. React (`@nofinite/charts/react`) is an optional adapter.
- **Precision D3 Mathematical Engine:** Built on precision D3 algorithms (`d3-shape`, `d3-scale`, `d3-array`) with native SVG rendering and zero virtual DOM rendering bottlenecks.
- **Zero Downstream CSS Invariant:** All chart containers, frosted glass popovers, and animated keyframes are bundled directly into **NUICSS**. You only ever need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`).
- **OKLCH Perceptual Theming:** Automatically synchronizes with your active **NUICSS** palette (`var(--color-primary)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`) with 0ms light/dark mode reactivity.
- **High-Frequency Downsampling:** Built-in Largest Triangle Three Buckets (`downsampleLTTB`) downsamples 100,000+ points to preserve 60 FPS fluidity.

---

## Supported Visualizations

| Framework-Agnostic (`variant`) | React Component                             | Description                            | Best For                                         |
| :----------------------------- | :------------------------------------------ | :------------------------------------- | :----------------------------------------------- |
| `variant: 'area'`              | [`<AreaChart />`](/charts/area-chart)       | Filled area curves with gradient fills | Cumulative volume, bandwidth, time-series growth |
| `variant: 'bar'`               | [`<BarChart />`](/charts/bar-chart)         | Vertical or categorical columns        | Categorical comparisons, revenue per quarter     |
| `variant: 'line'`              | [`<LineChart />`](/charts/line-chart)       | Continuous smooth trendlines           | CPU load, real-time rates, stock prices          |
| `variant: 'pie'` / `'donut'`   | [`<PieChart />`](/charts/pie-chart)         | Proportional circular segments         | Market share, segment allocation                 |
| `variant: 'scatter'`           | [`<ScatterChart />`](/charts/scatter-chart) | Multidimensional X/Y coordinate points | Statistical distribution, clusters, correlations |
| Direct Vector Path             | [`<Sparkline />`](/charts/sparklines)       | Ultra-lightweight trendline            | KPI summary cards, inline table rows             |

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- [Vanilla Core & Math Engine](/charts/vanilla-core) — Pure D3 vector path generators, DOM mounting API, and Largest Triangle Three Buckets (`downsampleLTTB`) downsampling.
- [Multi-Series Visualizations](/charts/multi-series) — Multi-series area charts, grouped/stacked bars, and multi-scatter plots on shared scales.
- [Sparklines & Micro-Charts](/charts/sparklines) — Minimalist trendlines for KPI cards and data table rows.
- [Theming & Glassmorphism](/charts/theming) — OKLCH palettes, frosted glass popovers (`backdrop-blur-xl`), and dark mode switching.
- [Accessibility (A11y) Standards](/charts/accessibility) — Screen reader support, automated data table generation (`generateA11yTable`), and keyboard navigation.
- [Exporting Charts](/charts/export) — Exporting SVG charts to PNG or standalone vector files.
- [Production Examples](/charts/examples) — SaaS Revenue Dashboard, Financial KPI Grid, and High-Density Telemetry.
- [Installation & Setup](/charts/installation) — Package installation, peer dependencies, and styling configuration.

### Visualizations Catalog

- [AreaChart](/charts/area-chart) — Quantitative volume progression with smooth Bézier curves and gradient fills.
- [BarChart](/charts/bar-chart) — Categorical data distributions, stacked bars, and hover highlights.
- [LineChart](/charts/line-chart) — Multi-series trend monitoring with interactive marker points.
- [PieChart & DonutChart](/charts/pie-chart) — Radial distributions and central summary callouts.
- [ScatterChart](/charts/scatter-chart) — Two-dimensional coordinate projections and metric correlations.
- [ChartLegend](/charts/legend) — Interactive series toggles and categorical color keys.
