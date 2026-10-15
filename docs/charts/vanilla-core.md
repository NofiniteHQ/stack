# Framework-Agnostic Core & Mathematical Engine

The foundation of **Nofinite Charts** is an isomorphic, zero-React mathematical calculation and rendering engine (`@nofinite/charts`).

It exports pure vector path generators, scale builders, downsampling algorithms, and a direct DOM renderer (`renderChart`) that can be executed in vanilla JavaScript/TypeScript, Node.js SVG generators, or non-React web frameworks.

---

## High-Performance Time-Series Downsampling (`downsampleLTTB`)

When rendering datasets with 10,000 to 1,000,000 data points (e.g., real-time telemetry, IoT sensors, high-frequency financial ticks), rendering raw SVG nodes causes DOM thrashing and frame drops.

**Nofinite Charts** provides an optimized implementation of the **Largest Triangle Three Buckets (LTTB)** algorithm:

- **$O(N)$ Linear Complexity:** Processes 100,000 points in sub-15ms.
- **Morphology Preservation:** Unlike naive decimation (which skips intermediate points and misses critical spikes), LTTB evaluates triangular areas between consecutive buckets to preserve exact visual peaks, troughs, and volatility signatures.

### Using `downsampleLTTB`

```ts
import { downsampleLTTB } from '@nofinite/charts';

const rawHighFrequencyData = [
  // 50,000 telemetry samples
  { x: new Date('2026-01-01T00:00:00Z'), y: 12.4 },
  { x: new Date('2026-01-01T00:00:01Z'), y: 14.1 },
  // ...
];

// Downsample down to 800 visually pristine points
const optimizedData = downsampleLTTB(rawHighFrequencyData, 800);

console.log(`Original points: ${rawHighFrequencyData.length}`); // 50,000
console.log(`Rendered points: ${optimizedData.length}`); // 800
```

---

## Core Vector Path Calculators

The core library exposes pure D3-powered mathematical calculators for generating SVG path definitions:

### 1. `calculateAreaPath`

Generates closed SVG path data strings (`d="..."`) for area fills and top stroke curves:

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
  margin: { top: 20, right: 20, bottom: 30, left: 40 },
  curve: 'monotoneX', // 'linear' | 'monotoneX' | 'step'
});

// Render directly into an SVG element
svgElement.innerHTML = `
  <path d="${path}" fill="url(#grad)" />
  <path d="${linePath}" fill="none" stroke="var(--color-primary)" stroke-width="2" />
`;
```

---

### 2. `calculateBarLayout`

Calculates geometry rectangles (`x`, `y`, `width`, `height`) for category bars:

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
  orientation: 'vertical', // 'vertical' | 'horizontal'
});

bars.forEach((bar) => {
  console.log(
    `Bar ${bar.label}: x=${bar.x}, y=${bar.y}, w=${bar.width}, h=${bar.height}`
  );
});
```

---

### 3. `calculatePieSegments`

Computes polar arc coordinates, inner/outer radii, and start/end angles:

```ts
import { calculatePieSegments } from '@nofinite/charts';

const segments = calculatePieSegments({
  data: [
    { label: 'Chrome', value: 68 },
    { label: 'Safari', value: 19 },
    { label: 'Firefox', value: 8 },
  ],
  width: 300,
  height: 300,
  donutRatio: 0.6, // 0 for solid pie, 0.6 for donut
});
```

---

## Universal DOM Renderer (`renderChart`)

Mount charts into standard HTML DOM elements without React:

```ts
import { renderChart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('chart-container')!;

const chart = renderChart({
  element: container,
  type: 'area', // 'area' | 'line' | 'bar' | 'pie' | 'scatter'
  data: [
    { date: '2026-01-01', value: 45 },
    { date: '2026-02-01', value: 52 },
    { date: '2026-03-01', value: 68 },
  ],
  xKey: 'date',
  yKey: 'value',
  height: 300,
  showGrid: true,
  showAxes: true,
});

// Programmatic update
chart.update([
  { date: '2026-01-01', value: 50 },
  { date: '2026-02-01', value: 65 },
  { date: '2026-03-01', value: 82 },
]);

// Clean up
chart.destroy();
```
