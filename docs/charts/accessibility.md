# Accessibility (A11y) Standards

Data visualizations often present severe accessibility barriers for users relying on screen readers or keyboard navigation.

**Nofinite Charts** incorporates automated W3C WAI-ARIA patterns, screen-reader data table generation (`generateA11yTable`), and keyboard traversal standards directly into its SVG rendering engine.

---

## Architectural Accessibility Standards

1. **Semantic Roles:** The parent container announces `role="region"` with an informative `aria-label`. The root SVG specifies `role="img"`.
2. **Automated Hidden Data Table (`generateA11yTable`):** Automatically injects a visually hidden (`sr-only`) semantic HTML `<table>` mirroring all chart data points. Screen reader users can inspect tabular numbers without relying on mouse coordinate hovers.
3. **SVG `<title>` and `<desc>` Tags:** Every chart embeds dynamic SVG titles summarizing overall trend direction, data point count, and axis ranges.
4. **Perceptually Uniform Contrast:** All **NUICSS** color palettes conform to WCAG 2.1 AA / AAA contrast ratios against surface backgrounds.
5. **High-Contrast Mode Support:** Honors `forced-colors: active` media queries by utilizing system strokes (`CanvasText`, `Highlight`).

---

## The Hidden Data Table Pattern (`generateA11yTable`)

Visual charts are paired with an accessible tabular fallback:

```html
<div role="region" aria-label="Monthly Revenue Chart">
  <!-- Visual SVG Plot (Ignored by screen readers when table is active) -->
  <svg role="img" aria-hidden="true">...</svg>

  <!-- Visually Hidden Table for Screen Readers -->
  <table class="sr-only">
    <caption>
      Monthly Revenue Summary from Jan 2026 to Jun 2026
    </caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        <th scope="col">US East</th>
        <th scope="col">EU Central</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">January 2026</th>
        <td>$42,000</td>
        <td>$31,000</td>
      </tr>
      ...
    </tbody>
  </table>
</div>
```

Screen reader users can press <kbd>T</kbd> (in NVDA / JAWS / VoiceOver) to jump directly into the data table and navigate rows with standard table shortcuts.

---

## Configuring Accessibility in React

All charts support explicit accessibility options:

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
      xKey="time"
      yKey="cpu"
      height={300}
      ariaLabel="Cluster CPU Utilization over past 20 minutes"
      ariaDescription="CPU spiked to a peak of 88% at 12:10 UTC before returning to nominal levels."
      showA11yTable={true} // Injects hidden semantic table for screen readers
    />
  );
}
```

---

## Automated Table Generator (`generateA11yTable`)

For headless implementations or vanilla usage, call the core generator directly:

```ts
import { generateA11yTable } from '@nofinite/charts';

const htmlTable = generateA11yTable({
  title: 'Quarterly Operating Margins',
  data: [
    { quarter: 'Q1', margin: 24.2 },
    { quarter: 'Q2', margin: 28.5 },
    { quarter: 'Q3', margin: 31.0 },
  ],
  columns: [
    { key: 'quarter', label: 'Fiscal Quarter', isRowHeader: true },
    { key: 'margin', label: 'Operating Margin (%)', format: (v) => `${v}%` },
  ],
});

// Injects sr-only table into DOM
container.insertAdjacentHTML('beforeend', htmlTable);
```

---

## Keyboard Navigation

When focus enters the chart container:

- <kbd>Tab</kbd>: Focuses the chart region.
- <kbd>→</kbd> / <kbd>←</kbd>: Steps through data points chronologically.
- <kbd>Home</kbd> / <kbd>End</kbd>: Jumps to the first and last data points.
- Active data points emit live ARIA announcements (e.g. `"Data point 3 of 12: March 2026, Value: 6,300"`).
