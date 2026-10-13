# BarChart

BarChart visualizes categorical data comparisons using clean vertical or horizontal bars with rounded caps and hover state highlights.

---

## Import

```tsx
import { BarChart } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { BarChart } from '@nofinite/charts/react';

const REVENUE_DATA = [
  { quarter: 'Q1', revenue: 45000 },
  { quarter: 'Q2', revenue: 62000 },
  { quarter: 'Q3', revenue: 58000 },
  { quarter: 'Q4', revenue: 84000 },
];

export function RevenueBarWidget() {
  return (
    <div className="w-full h-72 p-4 border border-default rounded-xl bg-surface">
      <BarChart
        data={REVENUE_DATA}
        xAccessor={(d) => d.quarter}
        yAccessor={(d) => d.revenue}
        barColor="var(--chart-1)"
        borderRadius={6}
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop             | Type                         | Default            | Description                                           |
| :--------------- | :--------------------------- | :----------------- | :---------------------------------------------------- |
| `data`           | `T[]`                        | Required           | Array of data points.                                 |
| `xAccessor`      | `(d: T) => string \| number` | Required           | Function returning the category name.                 |
| `yAccessor`      | `(d: T) => number`           | Required           | Function returning the bar metric value.              |
| `barColor`       | `string`                     | `'var(--chart-1)'` | OKLCH color token or CSS variable for bar fill.       |
| `borderRadius`   | `number`                     | `4`                | Corner radius for the top caps of each bar in pixels. |
| `orientation`    | `'vertical' \| 'horizontal'` | `'vertical'`       | Layout orientation of bars.                           |
| `showTooltip`    | `boolean`                    | `true`             | Enables hover tooltip displaying exact values.        |
| `legendPosition` | `'top' \| 'bottom'`          | `'bottom'`         | Zero-overflow placement for multi-series legend.      |
| `className`      | `string`                     | `undefined`        | Additional class name for container.                  |
