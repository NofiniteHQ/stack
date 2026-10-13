# AreaChart

AreaChart displays quantitative progression and continuous volume over time, featuring smooth Bézier curves and subtle translucent gradient fills.

---

## Import

```tsx
import { AreaChart } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { AreaChart } from '@nofinite/charts/react';

const DATA = [
  { time: '00:00', latency: 42 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 45 },
  { time: '12:00', latency: 68 },
  { time: '16:00', latency: 52 },
  { time: '20:00', latency: 31 },
];

export function LatencyWidget() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <AreaChart
        data={DATA}
        xAccessor={(d) => d.time}
        yAccessor={(d) => d.latency}
        strokeColor="var(--color-primary)"
        fillColor="var(--color-primary)"
        showTooltip={true}
        tooltipFormatter={(point) =>
          `<strong>${point.time}</strong>: ${point.latency} ms`
        }
      />
    </div>
  );
}
```

---

## Props Reference

| Prop               | Type                                | Default                  | Description                                              |
| :----------------- | :---------------------------------- | :----------------------- | :------------------------------------------------------- |
| `data`             | `T[]`                               | Required                 | Array of data points.                                    |
| `xAccessor`        | `(d: T) => string \| number`        | Required                 | Function returning the X-axis coordinate or category.    |
| `yAccessor`        | `(d: T) => number`                  | Required                 | Function returning the numerical Y-axis value.           |
| `strokeColor`      | `string`                            | `'var(--color-primary)'` | OKLCH color or CSS variable for the curve outline.       |
| `fillColor`        | `string`                            | `'var(--color-primary)'` | Base color for the translucent area gradient.            |
| `curve`            | `'monotoneX' \| 'linear' \| 'step'` | `'monotoneX'`            | Interpolation curve algorithm.                           |
| `showTooltip`      | `boolean`                           | `true`                   | Enables interactive cursor crosshairs and hover details. |
| `tooltipFormatter` | `(d: T) => React.ReactNode`         | `undefined`              | Custom renderer for tooltip popup contents.              |
| `className`        | `string`                            | `undefined`              | Additional class name for the SVG container.             |
