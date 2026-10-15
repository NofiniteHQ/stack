# Nofinite Charts

> Modern, interactive data visualizations and animated SVG charts powered by OKLCH design tokens in NUICSS.

---

## Overview

**Nofinite Charts** (`@nofinite/charts`) provides responsive, themeable chart primitives for React dashboards. It features:

- **Zero Style Duplication:** Chart animation keyframes and tooltip styles are powered directly by **NUICSS**, eliminating the 196 kB duplicate stylesheet previously bundled.
- **Dynamic OKLCH Theming:** Automatically synchronizes chart stroke, fill, and gradient colors with your active NUICSS palette (`var(--color-primary)`, `var(--color-accent)`, etc.).
- **Interactive Tooltips:** Smooth cursor tracking, hover crosshairs, and accessible data formatting.
- **Responsive Geometry:** Automatically computes viewport boundaries with aspect ratio preservation.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/charts @nofinite/nuicss
# or
pnpm add @nofinite/charts @nofinite/nuicss
```

### 2. Stylesheet Import

Import the unified NUICSS stylesheet:

```tsx
import '@nofinite/nuicss/styles.css';
```

### 3. Usage Example

```tsx
import React from 'react';
import { AreaChart, ResponsiveContainer } from '@nofinite/charts';

const DATA = [
  { month: 'Jan', revenue: 4200, users: 2400 },
  { month: 'Feb', revenue: 5800, users: 3100 },
  { month: 'Mar', revenue: 7200, users: 4300 },
  { month: 'Apr', revenue: 8900, users: 5100 },
  { month: 'May', revenue: 11400, users: 6800 },
];

export function RevenueChart() {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4">Monthly Growth</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DATA}
            xKey="month"
            series={[
              {
                key: 'revenue',
                label: 'Revenue ($)',
                color: 'var(--color-primary)',
              },
              {
                key: 'users',
                label: 'Active Users',
                color: 'var(--color-accent)',
              },
            ]}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## Chart Catalog

- `AreaChart` — Smooth interpolated spline and stepped area visualizations with OKLCH opacity gradients.
- `BarChart` — Single and stacked bar charts with rounded caps and hover highlights.
- `LineChart` — High-performance multi-series trend lines with animated markers.
- `PieChart` / `DonutChart` — Radial share distributions with central metric callouts.
- `RadarChart` — Multi-axis metric performance comparisons.
