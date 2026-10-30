# ScatterChart

ScatterChart visualizes multi-dimensional numeric data using Cartesian coordinates to identify clusters, mathematical correlations, and anomalies across large datasets.

```ts
// Framework-Agnostic Core
import { Chart } from '@nofinite/charts';

// React Adapter
import { ScatterChart } from '@nofinite/charts/react';
```

---

## Interactive Preview

<Preview
name="charts-scatter"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('scatter-chart-container');

const chart = new Chart({
element: container,
variant: 'scatter',
data: [
{ x: 10, y: 20 },
{ x: 25, y: 45 },
{ x: 40, y: 30 },
{ x: 55, y: 70 },
{ x: 70, y: 65 },
{ x: 85, y: 90 }
],
xAccessor: (d) => d.x,
yAccessor: (d) => d.y,
color: 'var(--color-primary)',
height: 260,
showGrid: true,
showAxes: true,
showCrosshair: true,
showTooltip: true
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new Chart`)

Mount an interactive scatter chart directly to any HTML DOM node with crosshair scrubbing:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#cluster-chart');

const chart = new Chart({
  element: container,
  variant: 'scatter',
  data: [
    { x: 10, y: 20 },
    { x: 25, y: 45 },
    { x: 40, y: 30 },
    { x: 55, y: 70 },
    { x: 70, y: 65 },
    { x: 85, y: 90 },
  ],
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
  color: 'var(--color-primary)',
  showGrid: true,
  showAxes: true,
  showCrosshair: true,
  showTooltip: true,
});

// Update coordinate points reactively
chart.update([
  { x: 12, y: 24 },
  { x: 28, y: 50 },
  { x: 45, y: 35 },
  { x: 60, y: 78 },
]);

// Cleanup
chart.destroy();
```

---

## 2. React Adapter Usage

Declarative React JSX component for React 18 & 19:

```tsx
import { ScatterChart } from '@nofinite/charts/react';

const clusterData = [
  { x: 10, y: 20 },
  { x: 25, y: 45 },
  { x: 40, y: 30 },
  { x: 55, y: 70 },
  { x: 70, y: 65 },
  { x: 85, y: 90 },
];

export default function ScatterCluster() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <ScatterChart
        data={clusterData}
        xAccessor={(d) => d.x}
        yAccessor={(d) => d.y}
        pointColor="var(--color-primary)"
        showCrosshair={true}
        showTooltip={true}
      />
    </div>
  );
}
```

---

## API Reference

### Framework-Agnostic Core Options (`ChartOptions`)

| Option          | Type                 | Default                  | Description                                    |
| :-------------- | :------------------- | :----------------------- | :--------------------------------------------- |
| `element`       | `HTMLElement`        | —                        | Target DOM container to mount into.            |
| `variant`       | `'scatter'`          | `'scatter'`              | Specifies coordinate scatter layout.           |
| `data`          | `DataPoint[]`        | `[]`                     | Array of Cartesian coordinate data objects.    |
| `xAccessor`     | `(d: any) => number` | `d => d.x`               | Extracts continuous X coordinate value.        |
| `yAccessor`     | `(d: any) => number` | `d => d.y`               | Extracts continuous Y coordinate value.        |
| `color`         | `string`             | `'var(--color-primary)'` | Point marker fill and highlight color.         |
| `height`        | `number`             | `260`                    | Height in pixels.                              |
| `showCrosshair` | `boolean`            | `true`                   | Renders dual-axis interactive scrubbing lines. |
| `showTooltip`   | `boolean`            | `true`                   | Renders glassmorphic hover popover.            |

### React Component Props
