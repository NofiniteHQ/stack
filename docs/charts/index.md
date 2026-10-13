# Nofinite Charts

> High-performance vector data visualizations and animated SVG charts powered by D3 math and OKLCH design tokens.

---

## Overview

**Nofinite Charts** (`@nofinite/charts`) is a modern React data visualization suite engineered for analytical dashboards, metrics monitoring, and financial applications.

### Key Architectural Highlights

- **Fine-Grained D3 Vector Math:** Built on precision D3 algorithms (`d3-shape`, `d3-scale`, `d3-array`) with native SVG rendering and zero virtual DOM rendering bottlenecks.
- **Zero Duplicate CSS (Single NUICSS Engine):** Chart animation keyframes, cursor crosshairs, and tooltip containers are powered directly by **NUICSS**, eliminating the 196 kB duplicate stylesheet previously bundled.
- **Instant OKLCH Theming:** Automatically synchronizes with your active NUICSS palette (`var(--color-primary)`, `var(--color-accent)`, `--chart-1` through `--chart-5`) with 0ms light/dark mode reactivity.
- **Micro-Weight React Adapters:** Import modern, accessible React wrappers directly from `@nofinite/charts/react`.

---

## Basic Example

```tsx
import React from 'react';
import { AreaChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const METRICS = [
  { time: '00:00', latency: 42 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 45 },
  { time: '12:00', latency: 68 },
  { time: '16:00', latency: 52 },
  { time: '20:00', latency: 31 },
];

export function LatencyChart() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <AreaChart
        data={METRICS}
        xAccessor={(d) => d.time}
        yAccessor={(d) => d.latency}
        strokeColor="var(--color-primary)"
        fillColor="var(--color-primary)"
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Chart Catalog & Guides

- [Installation & Setup](./installation.md) — Package installation, peer dependencies, and styling configuration.
- [AreaChart](./area-chart.md) — Quantitative volume progression with smooth Bézier curves and gradient fills.
- [BarChart](./bar-chart.md) — Categorical data distributions, stacked bars, and hover highlights.
- [LineChart](./line-chart.md) — Multi-series trend monitoring with interactive marker points.
- [PieChart & DonutChart](./pie-chart.md) — Radial distributions and central summary callouts.
- [ScatterChart](./scatter-chart.md) — Two-dimensional coordinate projections and metric correlations.
- [ChartLegend](./legend.md) — Interactive series toggles and categorical color keys.
- [Exporting Charts](./export.md) — Exporting SVG charts to PNG or standalone vector files.
