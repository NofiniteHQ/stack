# Multi-Series Visualizations

**Nofinite Charts** supports synchronized multi-series data visualization across Area, Bar, Line, and Scatter plots.

Multi-series charts synchronize multiple data streams onto shared scales, allowing teams to compare performance across regions, cohorts, revenue streams, and time periods with zero visual misalignment.

```ts
// Framework-Agnostic Core
import {
  Chart,
  calculateMultiSeriesAreaPath,
  calculateMultiBarLayout,
} from '@nofinite/charts';

// React Adapter
import { AreaChart, BarChart } from '@nofinite/charts/react';
```

---

## 1. Framework-Agnostic Core Usage

### Multi-Series DOM Instance (`new Chart`)

Mount synchronized multi-series plots directly to any DOM container:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#multi-area-chart');

const chart = new Chart({
  element: container,
  variant: 'area',
  data: [
    { date: '2026-01-01', usEast: 4200, euCentral: 3100, apSouth: 1800 },
    { date: '2026-02-01', usEast: 5100, euCentral: 3800, apSouth: 2400 },
    { date: '2026-03-01', usEast: 6300, euCentral: 4200, apSouth: 3100 },
    { date: '2026-04-01', usEast: 5800, euCentral: 4900, apSouth: 3900 },
    { date: '2026-05-01', usEast: 7200, euCentral: 5400, apSouth: 4800 },
    { date: '2026-06-01', usEast: 8500, euCentral: 6200, apSouth: 5900 },
  ],
  series: [
    {
      name: 'US East (N. Virginia)',
      key: 'usEast',
      color: 'var(--color-primary)',
    },
    {
      name: 'EU Central (Frankfurt)',
      key: 'euCentral',
      color: 'var(--color-success)',
    },
    {
      name: 'AP South (Mumbai)',
      key: 'apSouth',
      color: 'var(--color-warning)',
    },
  ],
  height: 320,
  showAxes: true,
  showGrid: true,
  showTooltip: true,
  showLegend: true,
});
```

### Multi-Series Mathematical Geometry (`calculateMultiBarLayout`)

For headless bar layout calculations:

```ts
import { calculateMultiBarLayout } from '@nofinite/charts';

const layout = calculateMultiBarLayout({
  categories: ['Q1', 'Q2', 'Q3', 'Q4'],
  series: [
    { name: 'Direct', data: [45, 52, 58, 64], color: 'var(--chart-1)' },
    { name: 'Partner', data: [20, 26, 31, 38], color: 'var(--chart-2)' },
  ],
  width: 600,
  height: 300,
  mode: 'grouped', // 'grouped' | 'stacked' | 'percent'
});
```

---

## 2. React Adapter Usage

### Multi-Series Area Chart

```tsx
import React from 'react';
import { AreaChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const multiSeriesData = [
  { date: '2026-01-01', usEast: 4200, euCentral: 3100, apSouth: 1800 },
  { date: '2026-02-01', usEast: 5100, euCentral: 3800, apSouth: 2400 },
  { date: '2026-03-01', usEast: 6300, euCentral: 4200, apSouth: 3100 },
  { date: '2026-04-01', usEast: 5800, euCentral: 4900, apSouth: 3900 },
  { date: '2026-05-01', usEast: 7200, euCentral: 5400, apSouth: 4800 },
  { date: '2026-06-01', usEast: 8500, euCentral: 6200, apSouth: 5900 },
];

export function CloudRegionalTrafficChart() {
  return (
    <div className="card p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-default">
          Global API Ingestion
        </h3>
        <p className="text-xs text-muted">
          Ingestion throughput (req/sec) across top AWS regions
        </p>
      </div>

      <AreaChart
        data={multiSeriesData}
        xKey="date"
        series={[
          {
            key: 'usEast',
            label: 'US East (N. Virginia)',
            color: 'var(--color-primary)',
          },
          {
            key: 'euCentral',
            label: 'EU Central (Frankfurt)',
            color: 'var(--color-success)',
          },
          {
            key: 'apSouth',
            label: 'AP South (Mumbai)',
            color: 'var(--color-warning)',
          },
        ]}
        height={320}
        showAxes={true}
        showGrid={true}
        showTooltip={true}
        showLegend={true}
        legendPosition="bottom"
      />
    </div>
  );
}
```

### Grouped vs. Stacked Bar Charts

```tsx
import { BarChart } from '@nofinite/charts/react';

// Grouped Bars (side-by-side)
<BarChart
  data={multiSeriesData}
  xKey="date"
  series={seriesConfig}
  barLayout="grouped"
/>

// Stacked Bars (accumulated vertical total)
<BarChart
  data={multiSeriesData}
  xKey="date"
  series={seriesConfig}
  barLayout="stacked"
/>
```
