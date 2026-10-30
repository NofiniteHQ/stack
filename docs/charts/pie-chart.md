# PieChart & DonutChart

PieChart and DonutChart illustrate numerical proportions and category shares with dynamic polar arc calculations, central summary callouts, and animated segment hover states.

```ts
// Framework-Agnostic Core
import { Chart, calculatePieSegments } from '@nofinite/charts';

// React Adapter
import { PieChart, DonutChart } from '@nofinite/charts/react';
```

---

## Interactive Preview

<Preview
name="charts-donut"
vanillaCode={`import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('donut-chart-container');

const chart = new Chart({
element: container,
variant: 'donut',
data: [
{ source: 'Direct', visitors: 4500 },
{ source: 'Organic Search', visitors: 3200 },
{ source: 'Referral', visitors: 1800 },
{ source: 'Social Media', visitors: 950 }
],
xAccessor: (d) => d.source,
yAccessor: (d) => d.visitors,
donutCutout: 0.65,
height: 260,
showLegend: true,
showTooltip: true
});`}
/>

---

## 1. Framework-Agnostic Core Usage

### Direct DOM Mounting (`new Chart`)

Mount interactive Donut or solid Pie charts directly to any HTML DOM node:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#traffic-donut');

// Mount Donut Chart (with central cutout)
const donutChart = new Chart({
  element: container,
  variant: 'donut', // 'donut' | 'pie'
  donutCutout: 0.65, // 0 for solid pie, 0.65 for donut
  data: [
    { label: 'Direct', value: 4500, color: 'var(--chart-1)' },
    { label: 'Organic Search', value: 3200, color: 'var(--chart-2)' },
    { label: 'Referral', value: 1800, color: 'var(--chart-3)' },
    { label: 'Social Media', value: 950, color: 'var(--chart-4)' },
  ],
  height: 280,
  showLegend: true,
  showTooltip: true,
});

// Update data reactively
donutChart.update([
  { label: 'Direct', value: 5000 },
  { label: 'Organic Search', value: 3800 },
  { label: 'Referral', value: 2100 },
  { label: 'Social Media', value: 1200 },
]);

// Cleanup
donutChart.destroy();
```

### Pure Polar Arc Calculator (`calculatePieSegments`)

For custom SVG rendering, Canvas pipelines, or backend image generation, calculate raw arc paths (`d="..."`) without mounting to the DOM:

```ts
import { calculatePieSegments } from '@nofinite/charts';

const segments = calculatePieSegments({
  data: [
    { label: 'Chrome', value: 68 },
    { label: 'Safari', value: 19 },
    { label: 'Firefox', value: 8 },
    { label: 'Edge', value: 5 },
  ],
  width: 300,
  height: 300,
  donutRatio: 0.6, // 0 for solid pie
});

segments.forEach((seg) => {
  console.log(
    `Segment ${seg.data.label}: startAngle=${seg.startAngle}, endAngle=${seg.endAngle}, path=${seg.path}`
  );
});
```

---

## 2. React Adapter Usage

Declarative React JSX components for React 18 & 19:

### DonutChart Component

```tsx
import { DonutChart } from '@nofinite/charts/react';

const trafficSources = [
  { source: 'Direct', visitors: 4500 },
  { source: 'Organic Search', visitors: 3200 },
  { source: 'Referral', visitors: 1800 },
  { source: 'Social', visitors: 950 },
];

export default function TrafficDonut() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <DonutChart
        data={trafficSources}
        labelAccessor={(d) => d.source}
        valueAccessor={(d) => d.visitors}
        donutCutout={0.65}
        showTooltip={true}
        showLegend={true}
      />
    </div>
  );
}
```

### Solid PieChart Component

```tsx
import { PieChart } from '@nofinite/charts/react';

<PieChart
  data={trafficSources}
  labelAccessor={(d) => d.source}
  valueAccessor={(d) => d.visitors}
  showTooltip={true}
/>;
```

---

## API Reference

### Framework-Agnostic Core Options (`ChartOptions`)

| Option        | Type                 | Default        | Description                                |
| :------------ | :------------------- | :------------- | :----------------------------------------- |
| `element`     | `HTMLElement`        | —              | Target DOM container to mount into.        |
| `variant`     | `'pie' \| 'donut'`   | `'pie'`        | Specifies circular pie or donut layout.    |
| `data`        | `DataPoint[]`        | `[]`           | Array of category proportion data objects. |
| `donutCutout` | `number`             | `0.6`          | Center hole radius ratio (0 to 0.9).       |
| `xAccessor`   | `(d: any) => any`    | `d => d.label` | Extracts slice category label.             |
| `yAccessor`   | `(d: any) => number` | `d => d.value` | Extracts numeric slice proportion.         |
| `height`      | `number`             | `280`          | Height and bounding diameter in pixels.    |
| `showLegend`  | `boolean`            | `true`         | Renders color chip legend.                 |
| `showTooltip` | `boolean`            | `true`         | Renders glassmorphic hover popover.        |

### React Component Props
