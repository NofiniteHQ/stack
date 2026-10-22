# Charts Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Charts** showcasing both **Framework-Agnostic Core** and **React** integrations.

---

## Example 1: Vanilla TypeScript / DOM High-Frequency Dashboard

Direct DOM mounting with real-time streaming data updates and instant PNG export without React:

```ts
import { Chart, downsampleLTTB } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

// 1. Initialize container
const container = document.getElementById('telemetry-dashboard')!;

// 2. Generate initial telemetry series
let telemetryPoints = Array.from({ length: 5000 }, (_, i) => ({
  time: new Date(Date.now() - (5000 - i) * 1000).toISOString(),
  cpu: 20 + Math.random() * 40 + Math.sin(i / 50) * 15,
}));

// Downsample 5,000 points to 400 visually pristine points
let renderedData = downsampleLTTB(telemetryPoints, 400);

// 3. Mount interactive chart
const chart = new Chart({
  element: container,
  variant: 'line',
  data: renderedData,
  xAccessor: (d) => d.time,
  yAccessor: (d) => d.cpu,
  color: 'var(--color-primary)',
  height: 320,
  showGrid: true,
  showAxes: true,
  showCrosshair: true,
  showTooltip: true,
});

// 4. Simulate real-time streaming ticks every second
const interval = setInterval(() => {
  telemetryPoints.push({
    time: new Date().toISOString(),
    cpu: 20 + Math.random() * 40,
  });
  if (telemetryPoints.length > 5000) telemetryPoints.shift();

  // Re-downsample and update
  chart.update(downsampleLTTB(telemetryPoints, 400));
}, 1000);

// 5. Export to PNG button
document.getElementById('export-btn')?.addEventListener('click', async () => {
  await chart.exportPNG('telemetry-report.png', 2);
});
```

---

## Example 2: React Executive SaaS Revenue Dashboard

Combines a multi-series Area Chart (New vs Expansion Revenue) with an executive summary cards grid featuring inline `<Sparkline />` trendlines:

```tsx
import React from 'react';
import { AreaChart, Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const revenueData = [
  { month: 'Jan', newMrr: 28000, expansion: 14000 },
  { month: 'Feb', newMrr: 32000, expansion: 18500 },
  { month: 'Mar', newMrr: 39000, expansion: 22000 },
  { month: 'Apr', newMrr: 43000, expansion: 27000 },
  { month: 'May', newMrr: 49000, expansion: 31500 },
  { month: 'Jun', newMrr: 58000, expansion: 39000 },
];

export function SaasExecutiveDashboard() {
  return (
    <div className="w-full p-6 bg-surface space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 bg-surface border border-default rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted uppercase">
              Total ARR
            </span>
            <h3 className="text-2xl font-bold font-mono text-default mt-1">
              $1.16M
            </h3>
            <span className="text-xs font-semibold text-success">
              +24.5% YoY
            </span>
          </div>
          <Sparkline
            data={[820, 890, 940, 1010, 1080, 1164]}
            width={90}
            height={36}
            color="var(--color-success)"
          />
        </div>

        <div className="card p-5 bg-surface border border-default rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted uppercase">
              Gross Churn
            </span>
            <h3 className="text-2xl font-bold font-mono text-default mt-1">
              0.82%
            </h3>
            <span className="text-xs font-semibold text-success">-0.14%</span>
          </div>
          <Sparkline
            data={[1.2, 1.15, 1.05, 0.98, 0.91, 0.82]}
            width={90}
            height={36}
            color="var(--color-success)"
          />
        </div>
      </div>

      {/* Main Multi-Series Area Chart */}
      <div className="card p-6 bg-surface border border-default rounded-2xl shadow-sm">
        <AreaChart
          data={revenueData}
          xKey="month"
          series={[
            {
              key: 'newMrr',
              label: 'New Logo MRR',
              color: 'var(--color-primary)',
            },
            {
              key: 'expansion',
              label: 'Expansion MRR',
              color: 'var(--color-success)',
            },
          ]}
          height={320}
          showAxes={true}
          showGrid={true}
          showTooltip={true}
          showLegend={true}
        />
      </div>
    </div>
  );
}
```
