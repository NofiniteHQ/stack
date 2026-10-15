# Charts Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Charts** showcasing multi-series area plots, KPI sparkline grids, and high-frequency telemetry downsampling.

---

## Example 1: Executive SaaS Revenue & Retention Dashboard

Combines a multi-series Area Chart (New vs Expansion Revenue) with an executive summary cards grid featuring inline `<Sparkline />` trendlines.

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
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Net Retention (NDR)
            </span>
            <h3 className="text-2xl font-bold font-mono text-default mt-1">
              128.4%
            </h3>
            <span className="text-xs font-semibold text-success">
              +3.2% vs Q1
            </span>
          </div>
          <Sparkline
            data={[121, 122, 124, 125, 127, 128.4]}
            width={90}
            height={36}
            color="var(--color-primary)"
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

      {/* Main Revenue Trajectory Chart */}
      <div className="card p-6 bg-surface border border-default rounded-2xl shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-default">
            Monthly Recurring Revenue Trajectory
          </h2>
          <p className="text-xs text-muted">
            Comparison of New Logo Acquisition vs Account Expansion MRR
          </p>
        </div>

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
          legendPosition="bottom"
        />
      </div>
    </div>
  );
}
```

---

## Example 2: Financial Asset Performance Grid

A high-density financial card overview with color-coded trendlines and tabular pricing:

```tsx
import React from 'react';
import { Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const assets = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$67,420',
    change: '+3.8%',
    trend: [64200, 65100, 64900, 66300, 65800, 67420],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,510',
    change: '+1.9%',
    trend: [3410, 3440, 3420, 3490, 3480, 3510],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: '$158.20',
    change: '-2.4%',
    trend: [165, 163, 161, 162, 159, 158.2],
  },
];

export function CryptoMarketGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-surface">
      {assets.map((asset) => {
        const isUp = asset.change.startsWith('+');
        const color = isUp ? 'var(--color-success)' : 'var(--color-danger)';

        return (
          <div
            key={asset.symbol}
            className="p-4 bg-surface border border-default rounded-2xl flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-default">
                  {asset.symbol}
                </span>
                <span className="text-xs text-muted">{asset.name}</span>
              </div>
              <div className="text-lg font-mono font-bold text-default mt-1">
                {asset.price}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isUp ? 'text-success' : 'text-danger'
                }`}
              >
                {asset.change}
              </span>
            </div>

            <Sparkline
              data={asset.trend}
              width={90}
              height={32}
              color={color}
            />
          </div>
        );
      })}
    </div>
  );
}
```

---

## Example 3: High-Density Telemetry with LTTB Downsampling

Demonstrates using `downsampleLTTB` to downsample a simulated 20,000-point sensor dataset down to 600 points before rendering:

```tsx
import React, { useMemo } from 'react';
import { LineChart } from '@nofinite/charts/react';
import { downsampleLTTB } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

// Generate synthetic 20,000 data point telemetry stream
function generateSyntheticStream(count: number) {
  const points = [];
  let baseValue = 50;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    baseValue += (Math.random() - 0.49) * 4;
    points.push({
      x: new Date(now - (count - i) * 1000),
      y: Number(baseValue.toFixed(2)),
    });
  }
  return points;
}

export function HighDensityTelemetryMonitor() {
  // 1. Raw 20,000 data points
  const rawData = useMemo(() => generateSyntheticStream(20000), []);

  // 2. Downsample to 600 points using Largest Triangle Three Buckets
  const downsampledData = useMemo(() => {
    return downsampleLTTB(rawData, 600).map((p) => ({
      timestamp: p.x.toISOString().slice(11, 19),
      utilization: p.y,
    }));
  }, [rawData]);

  return (
    <div className="card p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-default">
            Cluster Memory Saturation
          </h3>
          <p className="text-xs text-muted">
            Original: 20,000 samples • LTTB Downsampled: 600 points
          </p>
        </div>
        <span className="text-xs font-mono bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full font-semibold">
          60 FPS Fluid
        </span>
      </div>

      <LineChart
        data={downsampledData}
        xKey="timestamp"
        yKey="utilization"
        height={320}
        color="var(--color-primary)"
        showGrid={true}
        showAxes={true}
        showTooltip={true}
      />
    </div>
  );
}
```
