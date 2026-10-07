# Implementation Plan: Scatter Chart Enterprise Upgrades & Hover Label Polish

## 1. Objective

Upgrade `@nofinite/charts` Scatter Chart (across both React `<ScatterChart />` and vanilla `Chart.ts` / `renderChart.ts`) to enterprise-grade standards:

1. **Smart Coordinate Tooltip**: When points lack an explicit label (e.g. `{ x: 10, y: 20 }`), eliminate the redundant header ("10") and display clean coordinate title `(10, 20)` with single point/series swatch.
2. **Custom Dimension Names (`xLabel`, `yLabel`)**: Allow props `xLabel="Revenue"` and `yLabel="Conversion"` for semantic metrics.
3. **2D Euclidean Canvas Proximity Scrubbing**: Eliminate pixel-hunting on small dots by enabling canvas-wide pointer scrub that snaps to the nearest point within interactive reach.
4. **Dual Crosshairs (X and Y Projections)**: Project dashed crosshairs to both the X and Y axes, instantly showing the exact value intercept on both scales.
5. **Multi-Series Scatter Cluster Support (`series?: ChartSeries<T>[]`)**: Support multiple color-coded scatter clusters with interactive toggling via `<ChartLegend />`.
6. **Strict `@nofinite/nuicss` Compliance**: Maintain 100% dependency on `@nofinite/nuicss` design tokens and utility classes with zero local CSS files.

---

## 2. Current Behavior & Identified Problems

### Problem 1: Misleading Fallback Header ("10" above "X: 10")

- In `normalizeData` ([`packages/charts/src/core/normalize.ts`](file:///d:/stack/packages/charts/src/core/normalize.ts#L152)), points without `label` fallback to `label = String(xRaw)`.
- When users supply standard coordinate data `[{ x: 10, y: 20 }]`, `d.label` becomes `"10"`.
- `ScatterChart.tsx` evaluates `d.label || ...`, rendering `"10"` as the header and `● X: 10` below it.
- **Expected**: Unlabeled points must render `Title: (10, 20)`. Explicitly labeled points (e.g. `{ label: "Cluster A", x: 10, y: 20 }`) render `Title: Cluster A`.

### Problem 2: Confusing Dual Color Swatches

- Both `X` and `Y` render colored dots (`● X: 10`, `● Y: 20`).
- Swatches indicate distinct data series. In a single point, two identical swatches falsely suggest two competing series.
- **Expected**: A single swatch associated with the point/series, with clean coordinate metrics below.

### Problem 3: Pixel-Hunting on Small Hit Targets

- Hovering requires directly intercepting a stationary 14px circle. Moving 1px off hides the tooltip immediately.
- Users cannot scrub across the canvas smoothly.
- **Expected**: Canvas-wide pointer tracking using 2D Euclidean distance ($\sqrt{(x - x_0)^2 + (y - y_0)^2}$) to snap to the closest point within interactive distance ($r \le 35\text{px}$).

### Problem 4: Missing Dual Crosshairs

- Scatter charts mathematically exist in 2D space. A single vertical line does not indicate the Y-axis position.
- **Expected**: Dual dashed crosshairs (horizontal line to Y-axis, vertical line to X-axis) when a point is focused.

### Problem 5: Missing Multi-Series Cluster Support

- `ScatterChart` only accepts single-series `data?: T[]`. Users cannot plot "Group A" vs "Group B" with a legend.
- **Expected**: Full support for `series?: ChartSeries<T>[]` alongside `data?: T[]`, with interactive `<ChartLegend />`.

---

## 3. Proposed Solutions

### 1. Smart Title & Dimension Labeling (`ScatterChart.tsx`, `renderChart.ts`, `Chart.ts`)

- Detect whether the point has an explicit label:
  ```ts
  const hasExplicitLabel = Boolean(
    d.raw && (d.raw.label || d.raw.name || d.raw.title)
  );
  const title = hasExplicitLabel
    ? d.label
    : `(${formatMetricNumber(d.x)}, ${formatMetricNumber(d.y)})`;
  ```
- Support props `xLabel?: string` (default `'X'`) and `yLabel?: string` (default `'Y'`).
- In tooltip items, render a single swatch for the point/series, and display coordinates as clean metric entries without redundant swatches:
  ```ts
  items: [
    {
      color: seriesColor,
      label: xLabel || 'X',
      value: formatMetricNumber(d.x),
    },
    {
      color: 'transparent',
      label: yLabel || 'Y',
      value: formatMetricNumber(d.y),
    },
  ];
  ```

### 2. Multi-Series Scatter Layout Engine (`math.ts`)

- Add `calculateMultiScatterLayout`:
  - Accepts `series: ChartSeries<T>[]` (or single series from `data`).
  - Aggregates all active points to compute non-inverted domains for both X and Y using `calculateLinearDomain`.
  - Maps points with series color, series name, and normalized coordinates.

### 3. Canvas Proximity Scrubbing & Dual Crosshairs (`ScatterChart.tsx`, `Chart.ts`)

- Add canvas overlay with `onPointerMove`, `onPointerDown`, `onPointerLeave`.
- On cursor movement `(localX, localY)`:
  - Find point with minimum Euclidean distance $\sqrt{(p.x - localX)^2 + (p.y - localY)^2}$.
  - If distance $\le 35\text{px}$, activate point, position tooltip, and render:
    - Vertical crosshair from $(p.x, 0)$ to $(p.x, \text{innerHeight})$.
    - Horizontal crosshair from $(0, p.y)$ to $(\text{innerWidth}, p.y)$.
    - Active dot radius expansion ($r = 6\text{px}$) with pulse effect.
  - If distance $> 35\text{px}$, deactivate point and hide tooltip.

### 4. Interactive Legend Integration

- Render `<ChartLegend />` below the scatter chart when `showLegend` is enabled.
- Allow clicking legend items to show/hide individual clusters.

---

## 4. Affected Files & Modules

- `packages/charts/src/core/math.ts`: Add multi-series scatter domain calculation & layout helper.
- `packages/charts/src/react/ScatterChart.tsx`: Implement multi-series, proximity scrubbing, dual crosshairs, smart labels, and legend.
- `packages/charts/src/core/renderChart.ts`: Mirror multi-series scatter, dual crosshairs, and proximity overlay in SVG engine.
- `packages/charts/src/core/Chart.ts`: Mirror dual crosshairs and proximity scrubbing in vanilla DOM engine.
- `temp/charts-centralized-audit-unique.mjs`: Expand visual verification test to audit unlabeled scatter coordinates, dual crosshairs, and proximity hover.

---

## 5. Dependencies & Tools

- No new external packages. Uses existing `d3-scale`, `d3-array`, and `@floating-ui/dom`.
- Zero local CSS. 100% styled via `@nofinite/nuicss`.

---

## 6. Alternatives Considered

- **`d3-delaunay` (Voronoi Diagrams)**: Would add ~15kB bundle weight for functionality easily accomplished by a $<0.1\text{ms}$ Euclidean loop over $<1,000$ points.
- **Tooltips without coordinates**: Discarded; coordinates are essential for scatter data exploration.

---

## 7. Risks & Mitigations

- **Backward Compatibility**: Existing code passing `data={clusterData}` continues to work identically without prop changes.
- **Mobile Touch**: `onPointerDown` ensures mobile users dragging across the canvas smoothly snap between scatter points.

---

## 8. Verification Strategy

1. **Build & Package Verification**:
   - `pnpm nx build nuicss`
   - `pnpm nx build charts`
   - `npm pack --dry-run` in `packages/charts`
2. **Playwright Visual Verification**:
   - Hover over `{ x: 10, y: 20 }` -> Verify title is `(10, 20)` and coordinates are distinct without repeating `"10"`.
   - Hover over multi-series cluster point -> Verify series name and color swatch.
   - Canvas proximity hover -> Verify dual crosshairs (horizontal and vertical lines) render.
   - Mobile touch scrub -> Verify touch drag responsiveness.
3. **Local Git Commit**:
   - Commit with header $\le 100$ characters.
