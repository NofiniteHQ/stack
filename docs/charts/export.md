# Export Utilities

`@nofinite/charts` provides high-performance client-side export functions for saving charts as raster images (`PNG`), vector assets (`SVG`), or tabular datasets (`CSV`).

These utilities are pure JavaScript/TypeScript functions that operate directly on DOM SVG nodes or series data, working identically across Vanilla JS, Vue, Svelte, and React.

```ts
// Framework-Agnostic Core
import { exportToPNG, exportToSVG, exportToCSV } from '@nofinite/charts';

// React Adapter (Components)
import { BarChart, AreaChart } from '@nofinite/charts/react';
```

---

## 1. Framework-Agnostic Core Usage

### Exporting via `Chart` Instance

If you are using the state-managed `Chart` class, call the built-in instance export methods:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const chart = new Chart({
  element: document.getElementById('chart-container'),
  variant: 'bar',
  data: [
    { label: 'Q1', value: 450 },
    { label: 'Q2', value: 680 },
  ],
});

// Download high-resolution 2x retina PNG
await chart.exportPNG('quarterly-report.png', 2);

// Download standalone SVG vector file
chart.exportSVG('chart-vector.svg');

// Download underlying data as CSV spreadsheet
chart.exportCSV('raw-metrics.csv');
```

### Standalone Functional DOM Exporters

Operate directly on any rendered `<svg>` element in the DOM:

```ts
import { exportToPNG, exportToSVG, exportToCSV } from '@nofinite/charts';

const svgElement = document.querySelector(
  '.nui-chart-container svg'
) as SVGElement;

// 1. Export as High-DPI PNG
await exportToPNG(svgElement, 'dashboard-metric.png', 2);

// 2. Export as SVG Vector
exportToSVG(svgElement, 'dashboard-vector.svg');

// 3. Export Data Series as CSV
exportToCSV(seriesList, 'metrics.csv');
```

---

## 2. React Adapter Usage

Use standard React `useRef` to reference the chart container and invoke export functions:

```tsx
import React, { useRef } from 'react';
import { BarChart } from '@nofinite/charts/react';
import { exportToPNG, exportToSVG } from '@nofinite/charts';
import { Button } from '@nofinite/nui';
import '@nofinite/nuicss/styles.css';

const data = [
  { month: 'Jan', val: 45 },
  { month: 'Feb', val: 58 },
  { month: 'Mar', val: 72 },
];

export function ExportableChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (svgEl) {
      await exportToPNG(svgEl, 'report.png', 2);
    }
  };

  const handleDownloadSvg = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (svgEl) {
      exportToSVG(svgEl, 'report.svg');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={handleDownloadPng} size="sm" variant="secondary">
          Download PNG
        </Button>
        <Button onClick={handleDownloadSvg} size="sm" variant="secondary">
          Download SVG
        </Button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-64 p-4 border border-default rounded-xl bg-surface"
      >
        <BarChart
          data={data}
          xAccessor={(d) => d.month}
          yAccessor={(d) => d.val}
        />
      </div>
    </div>
  );
}
```

---

## API Reference

### Export Functions

| Function      | Parameters                                                    | Return Type             | Description                                                             |
| :------------ | :------------------------------------------------------------ | :---------------------- | :---------------------------------------------------------------------- |
| `exportToPNG` | `(svgElement: SVGElement, filename = 'chart.png', scale = 2)` | `Promise<Blob \| null>` | Converts SVG to raster PNG and triggers browser download.               |
| `exportToSVG` | `(svgElement: SVGElement, filename = 'chart.svg')`            | `string`                | Serializes SVG markup and triggers vector file download.                |
| `exportToCSV` | `(seriesList: ChartSeries[], filename = 'chart-data.csv')`    | `string`                | Converts series data into CSV format and triggers spreadsheet download. |
