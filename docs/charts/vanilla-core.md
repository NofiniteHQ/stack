# Framework-Agnostic Core & Mathematical Engine

The foundation of **Nofinite Charts** is an isomorphic, zero-React mathematical calculation and rendering engine (`@nofinite/charts`).

It exports pure vector path generators, scale builders, downsampling algorithms, export utilities, and a stateful DOM renderer (`Chart` class and `renderChart` function).

```ts
import {
  Chart,
  renderChart,
  downsampleLTTB,
  calculateAreaPath,
  calculateBarLayout,
  calculatePieSegments,
  exportToPNG,
  exportToSVG,
  generateA11yTableHtml,
} from '@nofinite/charts';
```

---

## 1. High-Performance Time-Series Downsampling (`downsampleLTTB`)

When rendering datasets with 10,000 to 1,000,000 data points (e.g. real-time telemetry, IoT sensors, high-frequency financial ticks), rendering raw SVG nodes causes DOM thrashing and frame drops.

**Nofinite Charts** provides an optimized implementation of the **Largest Triangle Three Buckets (LTTB)** algorithm:

- **$O(N)$ Linear Complexity:** Processes 100,000 points in sub-15ms.
- **Morphology Preservation:** Unlike naive decimation (which skips intermediate points and misses critical spikes), LTTB evaluates triangular areas between consecutive buckets to preserve exact visual peaks, troughs, and volatility signatures.

```ts
import { downsampleLTTB } from '@nofinite/charts';

const rawHighFrequencyData = [
  // 50,000 telemetry samples
  { x: new Date('2026-01-01T00:00:00Z'), y: 12.4 },
  { x: new Date('2026-01-01T00:00:01Z'), y: 14.1 },
];

// Downsample down to 800 visually pristine points
const optimizedData = downsampleLTTB(rawHighFrequencyData, 800);

console.log(`Original points: ${rawHighFrequencyData.length}`); // 50,000
console.log(`Rendered points: ${optimizedData.length}`); // 800
```

---

## 2. Stateful DOM Engine (`new Chart`)

The `Chart` class handles responsive element bounding, Cartesian scales, axis generation, interactive hover dots, crosshairs, and glassmorphic tooltips with zero virtual DOM overhead:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('chart-container')!;

const chart = new Chart({
  element: container,
  variant: 'area', // 'area' | 'line' | 'bar' | 'pie' | 'donut' | 'scatter'
  data: [
    { date: '2026-01-01', value: 45 },
    { date: '2026-02-01', value: 52 },
    { date: '2026-03-01', value: 68 },
  ],
  xAccessor: (d) => d.date,
  yAccessor: (d) => d.value,
  height: 300,
  showGrid: true,
  showAxes: true,
  showTooltip: true,
});

// Programmatic update
chart.update([
  { date: '2026-01-01', value: 50 },
  { date: '2026-02-01', value: 65 },
  { date: '2026-03-01', value: 82 },
]);

// Switch variant on the fly
chart.setVariant('bar');

// Clean up observers and listeners
chart.destroy();
```

---

## 3. Pure Mathematical Vector Calculators

For custom graphics engines, server-side SVG generation, or Canvas rendering, the core exposes pure mathematical geometry calculators:

### `calculateAreaPath`

Generates closed SVG path data (`d="..."`) for area fills and line paths:

```ts
import { calculateAreaPath } from '@nofinite/charts';

const { path, linePath } = calculateAreaPath({
  data: [
    { x: 0, y: 10 },
    { x: 1, y: 25 },
    { x: 2, y: 18 },
  ],
  width: 500,
  height: 250,
  curve: 'monotoneX',
});
```

### `calculateBarLayout`

Computes column geometry (`x`, `y`, `width`, `height`) for category data:

```ts
import { calculateBarLayout } from '@nofinite/charts';

const bars = calculateBarLayout({
  data: [
    { label: 'Q1', value: 100 },
    { label: 'Q2', value: 200 },
  ],
  width: 500,
  height: 250,
  orientation: 'vertical',
});
```

### `calculatePieSegments`

Computes polar coordinates and arc paths:

```ts
import { calculatePieSegments } from '@nofinite/charts';

const segments = calculatePieSegments({
  data: [
    { label: 'A', value: 60 },
    { label: 'B', value: 40 },
  ],
  width: 300,
  height: 300,
  donutRatio: 0.6,
});
```

---

## 4. Universal Exporters & Accessibility

```ts
import {
  exportToPNG,
  exportToSVG,
  exportToCSV,
  generateA11yTableHtml,
} from '@nofinite/charts';

// Export SVG to PNG
await exportToPNG(svgElement, 'chart.png', 2);

// Generate accessible W3C data table
const a11yHtml = generateA11yTableHtml(seriesList, { title: 'Telemetry Data' });
```
