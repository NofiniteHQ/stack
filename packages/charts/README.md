<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.nofinite.com/brand/oss/charts/logos/charts-horizontal-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.nofinite.com/brand/oss/charts/logos/charts-horizontal.svg">
  <img alt="Nofinite Charts" src="https://cdn.nofinite.com/brand/oss/charts/logos/charts-horizontal.svg" width="300">
</picture>

<br/>
<br/>

**Universal, framework-agnostic vector data visualization suite powered by modular D3 and styled with NUICSS tokens.**

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  </a>
  <a href="https://opensource.nofinite.com/charts">
    <img alt="Documentation" src="https://img.shields.io/badge/Docs-OpenSource-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-%23000133?style=for-the-badge&labelColor=slategray">
  </a>
  <a href="https://www.npmjs.com/package/@nofinite/charts">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nofinite%2Fcharts?style=for-the-badge&logo=npm&logoColor=white&labelColor=slategray&color=%23000133">
  </a>
</p>

</div>

---

## Overview

Nofinite Charts provides an ultra-lightweight, modular charting engine designed for modern web applications. Engineered on pure SVG vector rendering and mathematically grounded D3 layout primitives, it pairs seamlessly with the NUICSS design token ecosystem.

- **Universal Core:** Pure SVG vector rendering with smooth monotone cubic hermite splines (`curveMonotoneX`), multi-stop gradient falloffs, and responsive `viewBox`.
- **Zero Framework Lock-in:** Works across plain HTML, HTMX, Vue, Svelte, and React.
- **Idiomatic React Export:** Dedicated `@nofinite/charts/react` with `<AreaChart />`, `<BarChart />`, `<LineChart />`, `<PieChart />`, `<DonutChart />`, `<ScatterChart />`, and `<Sparkline />`.
- **Token-Driven Theming:** Styled natively with NUICSS design tokens (`var(--chart-1)`, `var(--color-primary)`, `var(--bg-surface)`). Dark mode switches instantly with 0ms delay.
- **Featherweight Bundle:** Modular D3 mathematics under 25 kB gzipped.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/charts @nofinite/nuicss

# npm
npm install @nofinite/charts @nofinite/nuicss

# yarn
yarn add @nofinite/charts @nofinite/nuicss
```

---

## Styles Setup

Nofinite Charts is styled natively via NUICSS design tokens (`var(--chart-1)`, `var(--color-primary)`, `var(--bg-surface)`). Import the stylesheet once at the root of your application (e.g., `main.tsx`, `_app.tsx`, or `layout.tsx`):

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Note:** For modular or bundle-isolated setups, NUICSS also exports widget and chart tokens via: `@nofinite/nuicss/widgets.css`.

---

## Quick Start

### In React

```tsx
import '@nofinite/nuicss/styles.css';
import { AreaChart } from '@nofinite/charts/react';

const data = [
  { date: '2026-01-01', value: 120 },
  { date: '2026-02-01', value: 240 },
  { date: '2026-03-01', value: 190 },
  { date: '2026-04-01', value: 380 },
];

export function RevenueChart() {
  return (
    <AreaChart
      data={data}
      xAccessor={(d) => new Date(d.date)}
      yAccessor={(d) => d.value}
      height={300}
    />
  );
}
```

### In Vanilla JavaScript / HTMX

```html
<div id="chart-container"></div>

<script type="module">
  import { renderChart } from '@nofinite/charts';

  const html = renderChart({
    variant: 'area',
    data: [
      { label: 'Jan', value: 120 },
      { label: 'Feb', value: 240 },
      { label: 'Mar', value: 190 },
      { label: 'Apr', value: 380 },
    ],
    height: 300,
  });

  document.getElementById('chart-container').innerHTML = html;
</script>
```

### Zero-Build CDN (ESM)

For rapid prototyping or server-rendered environments without a build step:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- NUICSS Design Tokens & Stylesheet -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@nofinite/nuicss/dist/styles.css"
    />
  </head>
  <body class="bg-surface p-6">
    <div id="chart-container"></div>

    <script type="module">
      import { renderChart } from 'https://esm.sh/@nofinite/charts';

      const html = renderChart({
        variant: 'area',
        data: [
          { label: 'Jan', value: 120 },
          { label: 'Feb', value: 240 },
          { label: 'Mar', value: 190 },
          { label: 'Apr', value: 380 },
        ],
        height: 300,
      });

      document.getElementById('chart-container').innerHTML = html;
    </script>
  </body>
</html>
```

---

## Chart Catalog

| Component                         | Export Subpath           | Description                                              |
| :-------------------------------- | :----------------------- | :------------------------------------------------------- |
| `<AreaChart />`                   | `@nofinite/charts/react` | Gradient-filled smooth spline and stepped area charts    |
| `<BarChart />`                    | `@nofinite/charts/react` | Grouped, stacked, horizontal, and 100% normalized bars   |
| `<LineChart />`                   | `@nofinite/charts/react` | Single and multi-series trendlines with markers          |
| `<PieChart />` / `<DonutChart />` | `@nofinite/charts/react` | Proportional radial slices with customizable inner radii |
| `<ScatterChart />`                | `@nofinite/charts/react` | Multi-dimensional correlation and point distributions    |
| `<Sparkline />`                   | `@nofinite/charts/react` | Minimalist inline trend indicators                       |
| `renderChart()`                   | `@nofinite/charts`       | Framework-agnostic vanilla HTML / DOM generator          |

---

## Documentation

For full setup guides, component examples, and API references, [read documentation](https://opensource.nofinite.com/charts).

---

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
