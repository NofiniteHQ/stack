# LineChart

LineChart visualizes continuous data sequences, dynamic rates, and time-series fluctuations with precision Bézier curves, active marker points, and interactive crosshair scrubbing.

```ts
// Framework-Agnostic Core
import { Chart, downsampleLTTB } from '@nofinite/charts';

// React Adapter
import { LineChart } from '@nofinite/charts/react';
```

---

## Interactive Preview

<Preview
name="charts-line"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('line-chart-container');

const chart = new Chart({
element: container,
variant: 'line',
data: [
{ time: '00:00', cpu: 22 },
{ time: '04:00', cpu: 35 },
{ time: '08:00', cpu: 68 },
{ time: '12:00', cpu: 84 },
{ time: '16:00', cpu: 52 },
{ time: '20:00', cpu: 40 }
],
xAccessor: (d) => d.time,
yAccessor: (d) => d.cpu,
color: 'var(--color-primary)',
height: 240,
showGrid: true,
showAxes: true,
showTooltip: true,
showCrosshair: true
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new Chart`)

Mount an interactive line chart directly to any HTML DOM node:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#cpu-trend-chart');

const chart = new Chart({
  element: container,
  variant: 'line',
  data: [
    { time: '00:00', cpu: 22 },
    { time: '04:00', cpu: 35 },
    { time: '08:00', cpu: 68 },
    { time: '12:00', cpu: 84 },
    { time: '16:00', cpu: 52 },
    { time: '20:00', cpu: 40 },
  ],
  xAccessor: (d) => d.time,
  yAccessor: (d) => d.cpu,
  color: 'var(--color-primary)',
  showGrid: true,
  showAxes: true,
  showTooltip: true,
  showCrosshair: true,
});

// Real-time telemetry tick update
chart.update([
  { time: '00:00', cpu: 22 },
  { time: '04:00', cpu: 35 },
  { time: '08:00', cpu: 68 },
  { time: '12:00', cpu: 84 },
  { time: '16:00', cpu: 52 },
  { time: '20:00', cpu: 40 },
  { time: '24:00', cpu: 38 },
]);

// Cleanup
chart.destroy();
```

### High-Density Time-Series Downsampling (`downsampleLTTB`)

When monitoring 10,000 to 1,000,000 telemetry points, use the built-in **Largest Triangle Three Buckets (LTTB)** algorithm to preserve visual peaks and troughs while keeping SVG frame rates at 60 FPS:

```ts
import { downsampleLTTB, Chart } from '@nofinite/charts';

const rawHighFrequencyData = [
  // 50,000 high-frequency sensor ticks
];

// Downsample 50,000 points to 600 visually identical points
const optimizedData = downsampleLTTB(rawHighFrequencyData, 600);

const chart = new Chart({
  element: document.querySelector('#telemetry-chart'),
  variant: 'line',
  data: optimizedData,
});
```

---

## 2. React Adapter Usage

Declarative React JSX component for React 18 & 19:

```tsx
import { LineChart } from '@nofinite/charts/react';

const serverLoad = [
  { time: '00:00', cpu: 22 },
  { time: '04:00', cpu: 35 },
  { time: '08:00', cpu: 68 },
  { time: '12:00', cpu: 84 },
  { time: '16:00', cpu: 52 },
  { time: '20:00', cpu: 40 },
];

export default function CpuLoadChart() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <LineChart
        data={serverLoad}
        xAccessor={(d) => d.time}
        yAccessor={(d) => d.cpu}
        strokeColor="var(--color-primary)"
        showTooltip={true}
        showCrosshair={true}
      />
    </div>
  );
}
```

---

## API Reference

### Framework-Agnostic Core Options (`ChartOptions`)

| Option          | Type                 | Default                  | Description                                     |
| :-------------- | :------------------- | :----------------------- | :---------------------------------------------- |
| `element`       | `HTMLElement`        | —                        | Target DOM container to mount into.             |
| `variant`       | `'line'`             | `'line'`                 | Specifies continuous line visualization engine. |
| `data`          | `DataPoint[]`        | `[]`                     | Array of continuous sequence data objects.      |
| `xAccessor`     | `(d: any) => any`    | `d => d.x`               | Extracts sequential X key or timestamp.         |
| `yAccessor`     | `(d: any) => number` | `d => d.y`               | Extracts numeric trend value.                   |
| `color`         | `string`             | `'var(--color-primary)'` | Line stroke color or token variable.            |
| `height`        | `number`             | `260`                    | Height in pixels.                               |
| `showCrosshair` | `boolean`            | `true`                   | Renders dual-axis interactive scrubbing lines.  |
| `showTooltip`   | `boolean`            | `true`                   | Renders glassmorphic hover popover.             |

### React Component Props
