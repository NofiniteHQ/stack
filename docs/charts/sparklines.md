# Sparklines and Micro-Charts

**Nofinite Charts** provides a dedicated `<Sparkline />` component engineered for high-density dashboards, KPI summary cards, and data table inline metrics.

Sparklines eliminate axis chrome, grids, and legend overhead to deliver instantaneous trend context in compact footprints.

---

## Key Features

- **Microscopic Footprint:** Renders a lightweight `<polyline>` SVG with zero overhead.
- **Dynamic Normalization:** Automatically scales arbitrary number arrays across allocated width and height bounds.
- **Single-Engine Theming:** Integrates with **NUICSS** color tokens (`var(--color-primary)`, `var(--color-success)`, `var(--color-danger)`).
- **Accessible Markup:** Features `role="img"` and customizable `ariaLabel` attributes for screen reader compatibility.
- **Sub-Millisecond Execution:** Renders thousands of sparklines in real-time tables without impacting frame rates.

---

## Quickstart

```tsx
import React from 'react';
import { Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

export function SimpleSparkline() {
  const trendData = [12, 19, 15, 27, 22, 34, 45];

  return (
    <Sparkline
      data={trendData}
      width={120}
      height={36}
      color="var(--color-primary)"
    />
  );
}
```

---

## API Reference (`SparklineProps`)

| Prop        | Type       | Default                  | Description                                            |
| :---------- | :--------- | :----------------------- | :----------------------------------------------------- |
| `data`      | `number[]` | **Required**             | Array of numerical values representing the trend       |
| `width`     | `number`   | `120`                    | Width of the SVG canvas in pixels                      |
| `height`    | `number`   | `36`                     | Height of the SVG canvas in pixels                     |
| `color`     | `string`   | `'var(--color-primary)'` | Stroke color (accepts CSS tokens, hex, OKLCH)          |
| `className` | `string`   | `undefined`              | Optional CSS superclasses applied to wrapper container |
| `ariaLabel` | `string`   | Auto-generated           | Descriptive label for screen reader users              |

---

## Enterprise Pattern 1: KPI Stat Cards Grid

Sparklines provide immediate visual momentum when paired with primary numerical metrics:

```tsx
import React from 'react';
import { Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

interface KpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  history: number[];
}

const metrics: KpiMetric[] = [
  {
    title: 'Monthly Recurring Revenue',
    value: '$148,290',
    change: '+14.2%',
    trend: 'up',
    history: [110, 118, 125, 122, 134, 141, 148],
  },
  {
    title: 'P99 API Latency',
    value: '18.4 ms',
    change: '-8.1%',
    trend: 'up', // Lower latency is positive
    history: [28, 26, 24, 22, 21, 19, 18],
  },
  {
    title: 'Churn Rate',
    value: '1.24%',
    change: '+0.15%',
    trend: 'down',
    history: [0.95, 1.02, 1.08, 1.15, 1.18, 1.22, 1.24],
  },
];

export function KpiMetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-surface">
      {metrics.map((m) => {
        const isPositive = m.trend === 'up';
        const strokeColor = isPositive
          ? 'var(--color-success)'
          : 'var(--color-danger)';

        return (
          <div
            key={m.title}
            className="card p-5 bg-surface border border-default rounded-2xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                {m.title}
              </p>
              <h3 className="text-2xl font-bold font-mono text-default mt-1">
                {m.value}
              </h3>
              <p
                className={`text-xs font-semibold mt-1 ${
                  isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {m.change} vs last month
              </p>
            </div>

            <Sparkline
              data={m.history}
              width={100}
              height={40}
              color={strokeColor}
              ariaLabel={`${m.title} trend line over past 7 intervals`}
            />
          </div>
        );
      })}
    </div>
  );
}
```

---

## Enterprise Pattern 2: Financial Data Table Inline Trends

Embed sparklines inside table rows to communicate 7-day or 30-day velocity:

```tsx
import React from 'react';
import { Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const holdings = [
  {
    symbol: 'APPL',
    name: 'Apple Inc.',
    price: '$234.10',
    change: '+2.4%',
    history: [225, 228, 224, 230, 231, 234],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: '$138.50',
    change: '+5.8%',
    history: [122, 126, 129, 131, 135, 138],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: '$428.00',
    change: '-0.8%',
    history: [434, 432, 431, 429, 430, 428],
  },
];

export function HoldingsTable() {
  return (
    <div className="table-container p-4 bg-surface rounded-2xl border border-default">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-default text-muted uppercase">
            <th className="p-3">Asset</th>
            <th className="p-3">Price</th>
            <th className="p-3">24h Change</th>
            <th className="p-3">7-Day Trend</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr
              key={h.symbol}
              className="border-b border-default/30 hover:bg-surface-hover"
            >
              <td className="p-3 font-semibold text-default">
                {h.symbol}{' '}
                <span className="text-muted font-normal ml-1">({h.name})</span>
              </td>
              <td className="p-3 font-mono font-medium text-default">
                {h.price}
              </td>
              <td
                className={`p-3 font-semibold ${
                  h.change.startsWith('+') ? 'text-success' : 'text-danger'
                }`}
              >
                {h.change}
              </td>
              <td className="p-3">
                <Sparkline
                  data={h.history}
                  width={80}
                  height={24}
                  color={
                    h.change.startsWith('+')
                      ? 'var(--color-success)'
                      : 'var(--color-danger)'
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```
