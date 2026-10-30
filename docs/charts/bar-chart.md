# BarChart

BarChart compares discrete values across categories using responsive rectangular columns with hover elevation, category axis alignment, and tooltip coordination.

```ts
// Framework-Agnostic Core
import { Chart, calculateBarLayout } from '@nofinite/charts';

// React Adapter
import { BarChart } from '@nofinite/charts/react';
```

---

## Interactive Preview

<Preview
name="chart"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('bar-chart-container');

const chart = new Chart({
element: container,
variant: 'bar',
data: [
{ label: 'Q1', revenue: 45000 },
{ label: 'Q2', revenue: 58000 },
{ label: 'Q3', revenue: 72000 },
{ label: 'Q4', revenue: 91000 }
],
xAccessor: (d) => d.label,
yAccessor: (d) => d.revenue,
height: 240,
showGrid: true,
showAxes: true,
showTooltip: true
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new Chart`)

Mount an interactive bar chart directly to any HTML DOM node:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#revenue-chart');

const chart = new Chart({
  element: container,
  variant: 'bar',
  data: [
    { quarter: 'Q1', revenue: 45000 },
    { quarter: 'Q2', revenue: 58000 },
    { quarter: 'Q3', revenue: 72000 },
    { quarter: 'Q4', revenue: 91000 },
  ],
  xAccessor: (d) => d.quarter,
  yAccessor: (d) => d.revenue,
  barLayout: 'grouped', // 'grouped' | 'stacked' | 'percent'
  height: 280,
  showGrid: true,
  showAxes: true,
  showTooltip: true,
});

// Update data in real-time
chart.update([
  { quarter: 'Q1', revenue: 50000 },
  { quarter: 'Q2', revenue: 64000 },
  { quarter: 'Q3', revenue: 81000 },
  { quarter: 'Q4', revenue: 105000 },
]);

// Clean up listeners and observers
chart.destroy();
```

### Pure Mathematical Geometry Calculator (`calculateBarLayout`)

For custom SVG pipelines or headless canvas generation, compute exact bar coordinate geometry (`x`, `y`, `width`, `height`) mathematically:

```ts
import { calculateBarLayout } from '@nofinite/charts';

const bars = calculateBarLayout({
  data: [
    { label: 'Q1', value: 450 },
    { label: 'Q2', value: 680 },
    { label: 'Q3', value: 520 },
  ],
  width: 500,
  height: 250,
  orientation: 'vertical',
});

bars.forEach((bar) => {
  console.log(
    `Bar ${bar.label}: x=${bar.x}, y=${bar.y}, w=${bar.width}, h=${bar.height}`
  );
});
```

---

## 2. React Adapter Usage

Declarative React JSX component for React 18 & 19:

```tsx
import { BarChart } from '@nofinite/charts/react';

const quarterlyData = [
  { quarter: 'Q1', revenue: 45000 },
  { quarter: 'Q2', revenue: 58000 },
  { quarter: 'Q3', revenue: 72000 },
  { quarter: 'Q4', revenue: 91000 },
];

export default function QuarterlyRevenueChart() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <BarChart
        data={quarterlyData}
        xAccessor={(d) => d.quarter}
        yAccessor={(d) => d.revenue}
        showTooltip={true}
      />
    </div>
  );
}
```

---

## API Reference

### Framework-Agnostic Core Options (`ChartOptions`)

| Option      | Type                                  | Default                  | Description                              |
| :---------- | :------------------------------------ | :----------------------- | :--------------------------------------- |
| `element`   | `HTMLElement`                         | —                        | Target DOM container to mount into.      |
| `variant`   | `'bar'`                               | `'bar'`                  | Specifies the bar visualization engine.  |
| `data`      | `DataPoint[]`                         | `[]`                     | Array of data objects.                   |
| `barLayout` | `'grouped' \| 'stacked' \| 'percent'` | `'grouped'`              | Multi-series bar stacking geometry mode. |
| `xAccessor` | `(d: any) => any`                     | `d => d.label`           | Extracts category label key.             |
| `yAccessor` | `(d: any) => number`                  | `d => d.value`           | Extracts numeric bar height value.       |
| `color`     | `string`                              | `'var(--color-primary)'` | Column fill color or token variable.     |
| `height`    | `number`                              | `280`                    | Height in pixels.                        |
| `showGrid`  | `boolean`                             | `true`                   | Renders background Cartesian gridlines.  |
| `showAxes`  | `boolean`                             | `true`                   | Renders category and value axis labels.  |

### React Component Props
