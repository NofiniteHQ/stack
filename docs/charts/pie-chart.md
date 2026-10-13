# PieChart & DonutChart

PieChart and DonutChart visualize proportional part-to-whole relationships across categories.

---

## Import

```tsx
import { PieChart } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { PieChart } from '@nofinite/charts/react';

const BROWSER_SHARE = [
  { browser: 'Chrome', share: 64, color: 'var(--chart-1)' },
  { browser: 'Safari', share: 19, color: 'var(--chart-2)' },
  { browser: 'Edge', share: 9, color: 'var(--chart-3)' },
  { browser: 'Firefox', share: 8, color: 'var(--chart-4)' },
];

export function BrowserShareWidget() {
  return (
    <div className="w-full h-72 p-4 border border-default rounded-xl bg-surface flex items-center justify-center">
      <PieChart
        data={BROWSER_SHARE}
        valueAccessor={(d) => d.share}
        labelAccessor={(d) => d.browser}
        colorAccessor={(d) => d.color}
        innerRadius={0.6} // Set > 0 for Donut chart
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop            | Type               | Default     | Description                                                     |
| :-------------- | :----------------- | :---------- | :-------------------------------------------------------------- |
| `data`          | `T[]`              | Required    | Array of proportional data items.                               |
| `valueAccessor` | `(d: T) => number` | Required    | Function returning the slice value.                             |
| `labelAccessor` | `(d: T) => string` | Required    | Function returning the slice category label.                    |
| `colorAccessor` | `(d: T) => string` | `undefined` | Optional function returning custom slice fill color.            |
| `innerRadius`   | `number`           | `0`         | Inner cutout ratio (0 for full pie, 0.5–0.7 for donut).         |
| `padAngle`      | `number`           | `0.02`      | Separation gap between slices in radians.                       |
| `showTooltip`   | `boolean`          | `true`      | Enables interactive hover highlighting and percentage tooltips. |
