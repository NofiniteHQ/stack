# ChartLegend & Dimensions

`@nofinite/charts` provides modular auxiliary tools for synchronizing legends, measuring responsive container bounds, and positioning custom tooltips across both framework-agnostic DOM and React applications.

```ts
// Framework-Agnostic Core
import { renderLegendHtml, Chart } from '@nofinite/charts';

// React Adapter
import {
  ChartLegend,
  useChartDimensions,
  useChartTooltip,
} from '@nofinite/charts/react';
```

---

## 1. Framework-Agnostic Core Usage

### Pure Legend HTML Generator (`renderLegendHtml`)

Generate a lightweight, semantic color-coded legend in pure HTML:

```ts
import { renderLegendHtml } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const legendHtml = renderLegendHtml([
  { name: 'Organic Search', color: 'var(--chart-1)', hidden: false },
  { name: 'Direct Traffic', color: 'var(--chart-2)', hidden: false },
  { name: 'Social Media', color: 'var(--chart-3)', hidden: true },
]);

// Mount into DOM
document.querySelector('#legend-container').innerHTML = legendHtml;
```

---

## 2. React Adapter Usage

### ChartLegend Component

Renders responsive series chips with semantic OKLCH color indicators and interactive toggle triggers:

```tsx
import { ChartLegend } from '@nofinite/charts/react';

const series = [
  { label: 'Organic Search', color: 'var(--chart-1)' },
  { label: 'Direct Traffic', color: 'var(--chart-2)' },
  { label: 'Social Media', color: 'var(--chart-3)' },
];

export default function LegendDemo() {
  return (
    <div className="p-4 border border-default rounded-xl bg-surface">
      <ChartLegend items={series} />
    </div>
  );
}
```

### useChartDimensions Hook

Measures a parent container's width and height in real time using `ResizeObserver`, ensuring SVG visualizations adapt instantly to viewport changes:

```tsx
import { useRef } from 'react';
import { useChartDimensions } from '@nofinite/charts/react';

function CustomSvgViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useChartDimensions(containerRef, {
    defaultWidth: 400,
    defaultHeight: 300,
  });

  return (
    <div ref={containerRef} className="w-full h-64">
      <svg width={width} height={height}>
        {/* Draw custom elements */}
      </svg>
    </div>
  );
}
```
