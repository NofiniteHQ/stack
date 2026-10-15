# Nofinite Charts

> High-performance vector data visualizations and animated SVG charts powered by D3 math and OKLCH design tokens.

---

## Overview

**Nofinite Charts** (`@nofinite/charts`) is an enterprise-grade data visualization suite engineered for analytical dashboards, cloud metrics telemetry, and high-density financial platforms.

### Architectural Invariants

- **Precision D3 Mathematical Engine:** Built on precision D3 algorithms (`d3-shape`, `d3-scale`, `d3-array`) with native SVG rendering and zero virtual DOM rendering bottlenecks.
- **Zero Downstream CSS Invariant:** All chart containers, frosted glass popovers, and animated keyframes are bundled directly into **NUICSS**. You only ever need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`).
- **OKLCH Perceptual Theming:** Automatically synchronizes with your active **NUICSS** palette (`var(--color-primary)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`) with 0ms light/dark mode reactivity.
- **High-Frequency Downsampling:** Built-in Largest Triangle Three Buckets (`downsampleLTTB`) downsamples 100,000+ points to preserve 60 FPS fluidity.

---

## Key Capabilities

- **Multi-Series Synchronization:** Synchronized Area, Grouped/Stacked Bar, and Multi-Scatter plots sharing unified scales.
- **Micro-Charts (`<Sparkline />`):** Lightweight trendlines for KPI stat cards, table rows, and dashboard summaries.
- **Frosted Glass Popovers:** Apple-grade popover cards featuring `backdrop-blur-xl`, specular hairline reflections, and tabular monospace numerals.
- **Automated Accessibility (`generateA11yTable`):** Automated W3C data tables and ARIA regions for screen reader users.
- **Universal DOM Core:** Zero-React math and render methods (`renderChart`) for vanilla JS, Vue, and Svelte integration.

---

## Quickstart

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
        xKey="time"
        yKey="latency"
        color="var(--color-primary)"
        showTooltip={true}
        showAxes={true}
      />
    </div>
  );
}
```

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- **[Multi-Series Visualizations](./multi-series.md)** — Multi-series area charts, grouped/stacked bars, and multi-scatter plots on shared scales.
- **[Sparklines & Micro-Charts](./sparklines.md)** — Minimalist `<Sparkline />` component for KPI cards and data table rows.
- **[Theming & Glassmorphism](./theming.md)** — OKLCH palettes, frosted glass popovers (`backdrop-blur-xl`), and dark mode switching.
- **[Accessibility (A11y) Standards](./accessibility.md)** — Screen reader support, automated data table generation (`generateA11yTable`), and keyboard navigation.
- **[Vanilla Core & Math Engine](./vanilla-core.md)** — Pure D3 vector path generators and Largest Triangle Three Buckets (`downsampleLTTB`) downsampling.
- **[Production Examples](./examples.md)** — SaaS Revenue Dashboard, Financial KPI Grid, and High-Density Telemetry.

### Chart Components Catalog

- **[AreaChart](./area-chart.md)** — Quantitative volume progression with smooth Bézier curves and gradient fills.
- **[BarChart](./bar-chart.md)** — Categorical data distributions, stacked bars, and hover highlights.
- **[LineChart](./line-chart.md)** — Multi-series trend monitoring with interactive marker points.
- **[PieChart & DonutChart](./pie-chart.md)** — Radial distributions and central summary callouts.
- **[ScatterChart](./scatter-chart.md)** — Two-dimensional coordinate projections and metric correlations.
- **[ChartLegend](./legend.md)** — Interactive series toggles and categorical color keys.
- **[Exporting Charts](./export.md)** — Exporting SVG charts to PNG or standalone vector files.
- **[Installation & Setup](./installation.md)** — Package installation, peer dependencies, and styling configuration.
