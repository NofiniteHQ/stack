# @nofinite/charts

## 1.0.0

### Major Changes

- Initial public release of Nofinite Charts:
  - Universal vector data visualization suite powered by fine-grained D3 math algorithms (`d3-shape`, `d3-scale`, `d3-array`).
  - Native SVG path rendering with `curveMonotoneX` smoothing and 0ms CSS dark mode reactivity via `@nofinite/nuicss` tokens.
  - Framework-agnostic DOM class (`Chart`) and React adapters (`AreaChart`, `LineChart`, `BarChart`, `PieChart`, `DonutChart`, `ScatterChart`, `Sparkline`).
  - Frosted glassmorphic tooltip card popovers (`bg-surface/80`, `backdrop-blur-xl`, `saturate-150`, boundary guards preventing clipped headers).
  - Zero-overflow legend layout with adaptive plot height calculation (`plotHeight = height - 38`).
  - Adaptive horizontal bar left margins scaling dynamically up to 35% of chart width with label ellipsis truncation and tooltip titles.
  - Fully accessible data table fallback mode and WCAG 2.1 AA keyboard navigation.
