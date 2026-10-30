# AreaChart

AreaChart displays quantitative progression and continuous volume over time, featuring smooth Bézier curves, semi-transparent gradient fills, and interactive crosshair scrubbing.

```ts
// Framework-Agnostic Core
import { Chart, calculateAreaPath } from '@nofinite/charts';

// React Adapter
import { AreaChart } from '@nofinite/charts/react';
```

---

## Interactive Preview

<Preview
name="charts-area"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('area-chart-container');

const chart = new Chart({
element: container,
variant: 'area',
data: [
{ time: '00:00', latency: 42 },
{ time: '04:00', latency: 38 },
{ time: '08:00', latency: 45 },
{ time: '12:00', latency: 68 },
{ time: '16:00', latency: 52 },
{ time: '20:00', latency: 31 }
],
xAccessor: (d) => d.time,
yAccessor: (d) => d.latency,
color: 'var(--color-primary)',
height: 260,
showGrid: true,
showAxes: true,
showTooltip: true
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new Chart`)

Mount interactive area charts directly to any HTML DOM node with automatic `ResizeObserver` responsiveness and crosshairs:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#latency-chart');

const chart = new Chart({
  element: container,
  variant: 'area',
  data: [
    { time: '00:00', latency: 42 },
    { time: '04:00', latency: 38 },
    { time: '08:00', latency: 45 },
    { time: '12:00', latency: 68 },
    { time: '16:00', latency: 52 },
    { time: '20:00', latency: 31 },
  ],
  xAccessor: (d) => d.time,
  yAccessor: (d) => d.latency,
  color: 'var(--color-primary)',
  showGrid: true,
  showAxes: true,
  showTooltip: true,
});

// Update data reactively
chart.update([
  { time: '00:00', latency: 40 },
  { time: '04:00', latency: 35 },
  { time: '08:00', latency: 50 },
  { time: '12:00', latency: 62 },
  { time: '16:00', latency: 48 },
  { time: '20:00', latency: 29 },
]);

// Clean up listeners and observers
chart.destroy();
```

### Pure Mathematical Vector Path (`calculateAreaPath`)

For custom SVG pipelines, SSR, or Canvas drawing, calculate closed area SVG path data (`d="..."`) without mounting to the DOM:

```ts
import { calculateAreaPath } from '@nofinite/charts';

const { path, linePath } = calculateAreaPath({
  data: [
    { x: '2026-01-01', y: 100 },
    { x: '2026-02-01', y: 150 },
    { x: '2026-03-01', y: 130 },
  ],
  width: 600,
  height: 300,
  curve: 'monotoneX',
});

// Use directly in SVG:
// <path d={path} fill="url(#gradient)" />
// <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2" />
```

---

## 2. React Adapter Usage

Declarative React JSX component for React 18 & 19:

```tsx
import { AreaChart } from '@nofinite/charts/react';

const latencyData = [
  { time: '00:00', latency: 42 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 45 },
  { time: '12:00', latency: 68 },
  { time: '16:00', latency: 52 },
  { time: '20:00', latency: 31 },
];

export default function LatencyWidget() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <AreaChart
        data={latencyData}
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

## API Reference

### Framework-Agnostic Core Options (`ChartOptions`)

| Option        | Type                 | Default                  | Description                              |
| :------------ | :------------------- | :----------------------- | :--------------------------------------- |
| `element`     | `HTMLElement`        | —                        | Target DOM container to mount into.      |
| `variant`     | `'area'`             | `'area'`                 | Specifies the area visualization engine. |
| `data`        | `DataPoint[]`        | `[]`                     | Array of data objects.                   |
| `xAccessor`   | `(d: any) => any`    | `d => d.x`               | Extracts the X-axis key or date.         |
| `yAccessor`   | `(d: any) => number` | `d => d.y`               | Extracts the numeric Y-axis value.       |
| `color`       | `string`             | `'var(--color-primary)'` | Primary stroke and gradient color.       |
| `height`      | `number`             | `300`                    | Height in pixels.                        |
| `showGrid`    | `boolean`            | `true`                   | Renders background Cartesian gridlines.  |
| `showAxes`    | `boolean`            | `true`                   | Renders X and Y axis text labels.        |
| `showTooltip` | `boolean`            | `true`                   | Renders glassmorphic hover popover.      |

### React Component Props
