# @nofinite/charts

> Universal, framework-agnostic vector data visualization suite powered by modular D3 and styled with @nofinite/nuicss design tokens.

[![npm](https://img.shields.io/npm/v/@nofinite/charts?style=flat-square)](https://www.npmjs.com/package/@nofinite/charts)

---

## Features

- **Universal Core**: Pure SVG vector rendering with smooth monotone cubic hermite splines (`curveMonotoneX`), multi-stop gradient falloffs, and responsive `viewBox`.
- **Zero Framework Lock-in**: Works in plain HTML, HTMX, Vue, Svelte, and React.
- **Idiomatic React Export**: Dedicated `@nofinite/charts/react` with `<AreaChart />`, `<BarChart />`, `<LineChart />`, `<PieChart />`, `<DonutChart />`, `<ScatterChart />`, and `<Sparkline />`.
- **Token-Driven Design**: Styled natively with `@nofinite/nuicss` CSS variables (`var(--chart-1)`, `var(--color-primary)`, `var(--bg-surface)`). Dark mode switches instantly with 0ms delay.
- **Featherweight**: Modular D3 mathematics under 25 kB gzipped.

---

## Installation

```bash
npm install @nofinite/charts @nofinite/nuicss
```

---

## Usage

### In React

```tsx
import { AreaChart } from '@nofinite/charts/react';

const data = [
  { date: '2026-01-01', value: 120 },
  { date: '2026-02-01', value: 240 },
  { date: '2026-03-01', value: 190 },
  { date: '2026-04-01', value: 380 },
];

export function RevenueChart() {
  return (
    <AreaChart
      data={data}
      xAccessor={(d) => new Date(d.date)}
      yAccessor={(d) => d.value}
      height={300}
    />
  );
}
```

### In Vanilla JavaScript / HTMX

```html
<div id="chart-container"></div>

<script type="module">
  import { renderChart } from '@nofinite/charts';

  const html = renderChart({
    variant: 'area',
    data: [
      { label: 'Jan', value: 120 },
      { label: 'Feb', value: 240 },
      { label: 'Mar', value: 190 },
      { label: 'Apr', value: 380 },
    ],
    height: 300,
  });

  document.getElementById('chart-container').innerHTML = html;
</script>
```

---

## License

Apache-2.0 © Nofinite
