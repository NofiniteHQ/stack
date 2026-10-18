# Accessibility (A11y) Standards

**Nofinite Charts** incorporates automated W3C WAI-ARIA standards, screen-reader data table generation (`generateA11yTableHtml`), and keyboard navigation directly into its universal core rendering engine.

```ts
// Framework-Agnostic Core
import { generateA11yTableHtml, Chart } from '@nofinite/charts';

// React Adapter
import { AreaChart, BarChart } from '@nofinite/charts/react';
```

---

## Architectural Accessibility Standards

1. **Semantic Roles:** The parent container announces `role="region"` with an informative `aria-label`. The root SVG specifies `role="img"`.
2. **Automated Hidden Data Table (`generateA11yTableHtml`):** Automatically injects a visually hidden (`sr-only`) semantic HTML `<table>` mirroring all chart data points. Screen reader users can inspect tabular numbers without relying on mouse coordinate hovers.
3. **SVG `<title>` and `<desc>` Tags:** Every chart embeds dynamic SVG titles summarizing overall trend direction, data point count, and axis ranges.
4. **High-Contrast Mode Support:** Honors `forced-colors: active` media queries by utilizing system strokes (`CanvasText`, `Highlight`).

---

## 1. Framework-Agnostic Core Usage

### Automated Table Generation (`generateA11yTableHtml`)

For server-side rendering, static site generation, or custom DOM builders, generate accessible tabular data representations:

```ts
import { generateA11yTableHtml } from '@nofinite/charts';

const series = [
  {
    name: 'Revenue',
    data: [
      { label: 'Q1', y: 45000 },
      { label: 'Q2', y: 58000 },
      { label: 'Q3', y: 72000 },
    ],
  },
];

// Returns: <table class="sr-only"><caption>REVENUE data table</caption>...</table>
const tableHtml = generateA11yTableHtml(series, {
  title: 'Quarterly Revenue Performance',
});
```

### Native DOM Mounting with A11y

When using `new Chart()`, accessibility structures are mounted automatically:

```ts
import { Chart } from '@nofinite/charts';
import '@nofinite/nuicss/styles.css';

const chart = new Chart({
  element: document.querySelector('#a11y-chart'),
  variant: 'area',
  data: [
    { time: '12:00', cpu: 42 },
    { time: '12:05', cpu: 65 },
    { time: '12:10', cpu: 88 },
  ],
  xAccessor: (d) => d.time,
  yAccessor: (d) => d.cpu,
  xLabel: 'Timestamp (UTC)',
  yLabel: 'CPU Load (%)',
});
```

---

## 2. React Adapter Usage

All React chart components provide first-class accessibility props:

```tsx
import React from 'react';
import { AreaChart } from '@nofinite/charts/react';
import '@nofinite/nuicss/styles.css';

const telemetryData = [
  { time: '12:00', cpu: 42 },
  { time: '12:05', cpu: 65 },
  { time: '12:10', cpu: 88 },
  { time: '12:15', cpu: 54 },
];

export function AccessibleTelemetryChart() {
  return (
    <AreaChart
      data={telemetryData}
      xAccessor={(d) => d.time}
      yAccessor={(d) => d.cpu}
      height={300}
      showTooltip={true}
    />
  );
}
```
