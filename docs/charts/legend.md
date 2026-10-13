# ChartLegend

ChartLegend provides interactive series toggling and color categorization for multi-series visualizations.

---

## Import

```tsx
import { ChartLegend } from '@nofinite/charts/react';
```

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { ChartLegend } from '@nofinite/charts/react';

const SERIES = [
  { id: 'revenue', label: 'Revenue ($)', color: 'var(--color-primary)' },
  { id: 'expenses', label: 'Expenses ($)', color: 'var(--chart-2)' },
  { id: 'profit', label: 'Net Profit ($)', color: 'var(--color-success)' },
];

export function InteractiveLegend() {
  const [activeSeries, setActiveSeries] = useState([
    'revenue',
    'expenses',
    'profit',
  ]);

  const handleToggle = (seriesId: string) => {
    setActiveSeries((prev) =>
      prev.includes(seriesId)
        ? prev.filter((id) => id !== seriesId)
        : [...prev, seriesId]
    );
  };

  return (
    <div className="p-4 border border-default rounded-xl bg-surface">
      <ChartLegend
        series={SERIES}
        activeSeries={activeSeries}
        onToggle={handleToggle}
      />
    </div>
  );
}
```

---

## Props Reference

| Prop           | Type                                                  | Default     | Description                                   |
| :------------- | :---------------------------------------------------- | :---------- | :-------------------------------------------- |
| `series`       | `Array<{ id: string; label: string; color: string }>` | Required    | List of series definitions.                   |
| `activeSeries` | `string[]`                                            | `[]`        | Array of currently visible series IDs.        |
| `onToggle`     | `(seriesId: string) => void`                          | `undefined` | Callback fired when a series item is clicked. |
| `position`     | `'top' \| 'bottom' \| 'left' \| 'right'`              | `'top'`     | Alignment position of the legend container.   |
