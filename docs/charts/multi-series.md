# Multi-Series Visualizations

**Nofinite Charts** supports multi-series data visualization across Area, Bar, Line, and Scatter plots.

Multi-series charts synchronize multiple data streams onto shared scales, allowing teams to compare performance across regions, cohorts, revenue streams, and time periods with zero visual misalignment.

---

## Architectural Principles

- **Unified Mathematical Scales:** All series share identical X (time or category) and Y (linear metric) scales, preventing misleading comparisons.
- **D3 Vector Engine:** Powered by modular D3 algorithms (`d3-shape`, `d3-scale`, `d3-array`) for sub-pixel vector rendering.
- **Single-Engine Theming:** Multi-series color palettes automatically map to **NUICSS** OKLCH design tokens (`var(--color-primary)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`).
- **Responsive Stacking & Grouping:** Bar charts seamlessly switch between grouped (side-by-side) and stacked configurations.

---

## Multi-Series Area Chart

Multi-series Area charts render overlapping semi-transparent gradients, allowing authors to compare multiple trend volumes:

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

---

## Grouped vs. Stacked Bar Charts

Multi-series bar charts can be rendered as either **Grouped** (independent bars side-by-side within each category) or **Stacked** (bars accumulated vertically):

### 1. Grouped Bar Chart (Side-by-Side Comparison)

```tsx
import React from 'react';
import { BarChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const quarterlyRevenue = [
  { quarter: 'Q1', recurring: 120, services: 45 },
  { quarter: 'Q2', recurring: 145, services: 52 },
  { quarter: 'Q3', recurring: 170, services: 48 },
  { quarter: 'Q4', recurring: 210, services: 65 },
];

export function GroupedRevenueChart() {
  return (
    <BarChart
      data={quarterlyRevenue}
      xKey="quarter"
      series={[
        {
          key: 'recurring',
          label: 'SaaS Recurring',
          color: 'var(--color-primary)',
        },
        {
          key: 'services',
          label: 'Professional Services',
          color: 'var(--color-info)',
        },
      ]}
      mode="grouped" // Side-by-side bars
      height={300}
      showLegend={true}
    />
  );
}
```

### 2. Stacked Bar Chart (Cumulative Contribution)

```tsx
<BarChart
  data={quarterlyRevenue}
  xKey="quarter"
  series={[
    {
      key: 'recurring',
      label: 'SaaS Recurring',
      color: 'var(--color-primary)',
    },
    {
      key: 'services',
      label: 'Professional Services',
      color: 'var(--color-info)',
    },
  ]}
  mode="stacked" // Cumulative vertical stack
  height={300}
  showLegend={true}
/>
```

---

## Multi-Series Scatter Plots

Multi-series scatter plots categorize individual observations across two numerical axes with distinct categorical colors:

```tsx
import React from 'react';
import { ScatterChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const clusterData = [
  // Enterprise Tier
  { latency: 12, throughput: 9500, tier: 'enterprise' },
  { latency: 15, throughput: 9200, tier: 'enterprise' },
  { latency: 11, throughput: 9800, tier: 'enterprise' },
  // Standard Tier
  { latency: 45, throughput: 4200, tier: 'standard' },
  { latency: 52, throughput: 3900, tier: 'standard' },
  { latency: 48, throughput: 4500, tier: 'standard' },
];

export function LatencyThroughputScatter() {
  return (
    <ScatterChart
      data={clusterData}
      xKey="latency"
      yKey="throughput"
      groupKey="tier"
      series={[
        {
          key: 'enterprise',
          label: 'Enterprise Tenants',
          color: 'var(--color-primary)',
        },
        {
          key: 'standard',
          label: 'Standard Tenants',
          color: 'var(--color-muted)',
        },
      ]}
      height={320}
      xAxisLabel="P99 Latency (ms)"
      yAxisLabel="Requests / sec"
      showLegend={true}
    />
  );
}
```

---

## Interactive Synchronized Tooltips

When hovering over multi-series charts, the frosted glass popover displays values for **all active series** at that specific X-coordinate simultaneously:

- Title header indicates the hovered category or date.
- Colored swatch indicators match each series.
- Values render in high-legibility tabular monospace (`font-mono tabular-nums`).
- Floating-UI boundary limits ensure the popover card never clips against the top canvas edge.
