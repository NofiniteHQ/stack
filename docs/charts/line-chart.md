# LineChart

LineChart visualizes discrete continuous data points connected by straight or smoothed line segments, ideal for time-series metrics.

---

## Import

```tsx
import { LineChart } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React from 'react';
import { LineChart } from '@nofinite/charts/react';

const CPU_METRICS = [
  { time: '10:00', load: 24 },
  { time: '10:05', load: 38 },
  { time: '10:10', load: 85 },
  { time: '10:15', load: 62 },
  { time: '10:20', load: 45 },
];

export function CpuMonitor() {
  return (
    <div className="w-full h-64 p-4 border border-default rounded-xl bg-surface">
      <LineChart
        data={CPU_METRICS}
        xAccessor={(d) => d.time}
        yAccessor={(d) => d.load}
        strokeColor="var(--color-primary)"
        strokeWidth={2.5}
        showDots={true}
        showTooltip={true}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop             | Type                                | Default                  | Description                                            |
| :--------------- | :---------------------------------- | :----------------------- | :----------------------------------------------------- |
| `data`           | `T[]`                               | Required                 | Array of data points.                                  |
| `xAccessor`      | `(d: T) => string \| number`        | Required                 | Function returning the X-axis coordinate.              |
| `yAccessor`      | `(d: T) => number`                  | Required                 | Function returning the numerical Y-axis value.         |
| `strokeColor`    | `string`                            | `'var(--color-primary)'` | OKLCH color token or CSS variable for the line stroke. |
| `strokeWidth`    | `number`                            | `2`                      | Width of the line stroke in pixels.                    |
| `showDots`       | `boolean`                           | `true`                   | Renders circle markers on individual data points.      |
| `curve`          | `'monotoneX' \| 'linear' \| 'step'` | `'monotoneX'`            | Interpolation curve algorithm.                         |
| `showTooltip`    | `boolean`                           | `true`                   | Enables hover tooltip crosshairs.                      |
| `legendPosition` | `'top' \| 'bottom'`                 | `'bottom'`               | Zero-overflow placement for multi-series legend.       |
