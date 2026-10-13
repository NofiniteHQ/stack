# ScatterChart

ScatterChart visualizes the correlation and statistical distribution between two continuous numerical variables on Cartesian coordinates.

---

## Import

```tsx
import { ScatterChart } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { ScatterChart } from '@nofinite/charts/react';

const PERFORMANCE_DATA = [
  { size: 120, speed: 450 },
  { size: 240, speed: 380 },
  { size: 380, speed: 310 },
  { size: 512, speed: 220 },
  { size: 680, speed: 180 },
  { size: 1024, speed: 95 },
];

export function SpeedBenchmark() {
  return (
    <div className="w-full h-72 p-4 border border-default rounded-xl bg-surface">
      <ScatterChart
        data={PERFORMANCE_DATA}
        xAccessor={(d) => d.size}
        yAccessor={(d) => d.speed}
        dotColor="var(--color-primary)"
        dotRadius={5}
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop          | Type               | Default                  | Description                                  |
| :------------ | :----------------- | :----------------------- | :------------------------------------------- |
| `data`        | `T[]`              | Required                 | Array of coordinate data points.             |
| `xAccessor`   | `(d: T) => number` | Required                 | Numerical value for the horizontal X-axis.   |
| `yAccessor`   | `(d: T) => number` | Required                 | Numerical value for the vertical Y-axis.     |
| `dotColor`    | `string`           | `'var(--color-primary)'` | Fill color for the scatter points.           |
| `dotRadius`   | `number`           | `4`                      | Radius of individual points in pixels.       |
| `showTooltip` | `boolean`          | `true`                   | Enables hover tooltip on point intersection. |
