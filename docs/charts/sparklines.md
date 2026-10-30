# Sparklines and Micro-Charts

**Nofinite Charts** provides high-density micro-charts engineered for executive KPI summary cards, data table inline metrics, and high-frequency sparkline feeds.

Sparklines eliminate axis chrome, gridlines, and legend overhead to deliver immediate trend momentum in compact, high-density footprints.

```ts
// Framework-Agnostic Core
import { calculateAreaPath, downsampleLTTB } from '@nofinite/charts';

// React Adapter
import { Sparkline } from '@nofinite/charts/react';
```

---

## 1. Framework-Agnostic Core Usage

### Pure Vector Trendline Generation

In Vanilla JavaScript, TypeScript, Svelte, or Vue, generate high-performance SVG trendlines with zero Virtual DOM overhead:

```ts
import { calculateAreaPath } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

export function createSparklineSvg(
  data: number[],
  width = 120,
  height = 36,
  color = 'var(--color-primary)'
): string {
  // Normalize array into coordinate points
  const points = data.map((val, idx) => ({
    x: idx,
    y: val,
  }));

  const { path, linePath } = calculateAreaPath({
    data: points,
    width,
    height,
    curve: 'monotoneX',
    margin: { top: 2, right: 2, bottom: 2, left: 2 },
  });

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible inline-block">
      <path d="${path}" fill="${color}" fill-opacity="0.12" />
      <path d="${linePath}" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `.trim();
}

// Inject directly into an HTML table or card:
const container = document.getElementById('kpi-trend');
container.innerHTML = createSparklineSvg([12, 19, 15, 27, 22, 34, 45]);
```

---

## 2. React Adapter Usage

### Simple Sparkline Component

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

### KPI Stat Cards Example

Sparklines provide immediate visual context when paired with primary numbers:

```tsx
import React from 'react';
import { Sparkline } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

export function KpiMetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-surface">
      <div className="card p-5 bg-surface border border-default rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase">ARR</p>
          <h3 className="text-2xl font-bold font-mono text-default mt-1">
            $1.16M
          </h3>
          <p className="text-xs font-semibold text-success mt-1">+24.5% YoY</p>
        </div>
        <Sparkline
          data={[820, 890, 940, 1010, 1080, 1164]}
          width={100}
          height={40}
          color="var(--color-success)"
        />
      </div>

      <div className="card p-5 bg-surface border border-default rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase">
            P99 Latency
          </p>
          <h3 className="text-2xl font-bold font-mono text-default mt-1">
            42ms
          </h3>
          <p className="text-xs font-semibold text-success mt-1">-8.2ms</p>
        </div>
        <Sparkline
          data={[68, 55, 62, 49, 44, 42]}
          width={100}
          height={40}
          color="var(--color-primary)"
        />
      </div>
    </div>
  );
}
```

---

## API Reference

### React Sparkline Props

| Prop       | Type       | Default                  | Description                                                 |
| :--------- | :--------- | :----------------------- | :---------------------------------------------------------- |
| `data`     | `number[]` | `[]`                     | Sequential numeric trend array.                             |
| `width`    | `number`   | `120`                    | Bounding width in pixels.                                   |
| `height`   | `number`   | `36`                     | Bounding height in pixels.                                  |
| `color`    | `string`   | `'var(--color-primary)'` | Stroke line color and subtle fill tint.                     |
| `showFill` | `boolean`  | `true`                   | Renders semi-transparent translucent area fill under curve. |
