# Implementation Plan: Enterprise-Grade Charts Deep Audit & UI Bug Resolution

## 1. Objective

Perform a forensic, enterprise-grade deep audit of `@nofinite/charts` and its upstream token foundation in `@nofinite/nuicss`. Eliminate UI bugs including duplicate data rendering, categorical axis mislabeling, inverted negative domain scales, tooltip title/label redundancies, and missing keyboard accessibility, while strictly maintaining 100% style dependency on `@nofinite/nuicss`.

---

## 2. Current Behavior & Identified Problems

### Bug A: Tooltip Duplicate Data Display ("Same Data Showing Multiple Times")

- **Bar Chart**: Hovering over a bar renders the category name as the header AND as the item label (e.g., Title: "Apples", Item: "● Apples 50"). In multi-series bar charts, the series name (e.g. "2025") was ignored.
- **Pie / Donut Chart**: Hovering over a segment renders the segment label twice (e.g., Title: "Compute", Item: "● Compute 45"). Total percentage was not computed.
- **Scatter Chart**: Hovering over a point displayed the X numeric coordinate as the title (e.g. "10") and the label/index as the item label (e.g. "10: 25"), displaying "10" twice without distinct X and Y coordinates.
- **Line / Area Chart (Single Series)**: Scrubbing displayed the category as title AND as item label (e.g., Title: "Jan", Item: "● Jan 100").
- **`defaultTooltipPayload` & `renderTooltipHtml`**: Redundant title-and-label pairing was hardcoded. When `title === item.label`, both lines rendered identical text.

### Bug B: Categorical X-Axis Mislabeling in Continuous Charts (Area & Line)

- When users supply categorical string data (e.g., `['Jan', 'Feb', 'Mar']`), `normalizeData` maps strings to indices `[0, 1, 2]`.
- `calculateAreaPath` and `calculateMultiSeriesAreaPath` treat the scale as linear numeric and call `xScale.ticks(5)`.
- The X-axis renders numeric indices (`0, 0.5, 1, 1.5, 2`) rather than the actual category labels (`Jan, Feb, Mar`), while the tooltip scrub shows the category label.

### Bug C: Scale Inversion for Negative Datasets

- In `math.ts`, scales calculate `domain([yMin, yMax === 0 ? 10 : yMax * 1.1])`.
- If all values are negative (e.g. `-50`), `yMax * 1.1` becomes `-55`, creating domain `[-50, -55]` where `min > max`, inverting and breaking SVG vector rendering.

### Bug D: Horizontal Bar Chart Missing Value Gridlines

- Horizontal bar charts have `showGrid && !isHorizontal`, causing horizontal bar layouts to have zero value gridlines across the height.

### Bug E: Mobile Touch & Keyboard Accessibility (WCAG 2.1 AA)

- Mobile users tapping charts trigger `pointerdown`, but only `pointermove` was bound on the scrub overlay.
- Chart bars, scatter dots, and pie segments lack `tabIndex={0}`, `role="button"`, and keyboard focus handlers (`onFocus`/`onBlur`).

### Bug F: Legend Superclass Synchronization

- `ChartLegend.tsx` used `chart-legend-swatch`, while NUICSS shortcut defines `chart-legend-dot`.

---

## 3. Proposed Solutions

### 1. Tooltip Deduplication & Enterprise Data Contracts (`tooltip.ts`, `useChartTooltip.ts`, React components, `Chart.ts`)

- **`renderTooltipHtml` Safeguard**: If `item.label` matches `payload.title` or is empty, suppress the redundant label and render only the color swatch and value.
- **Bar Chart Tooltip**:
  - Single series: Title: `Category` ("Apples"), Item: `● 50`.
  - Multi-series: Title: `Category` ("Apples"), Item: `● [Series Name] 50`.
- **Pie / Donut Chart Tooltip**:
  - Title: `Slice Label` ("Compute"), Item: `● [Value] ([Percentage]%)`.
- **Scatter Chart Tooltip**:
  - If labeled: Title: `Label` ("Point C"), Items: `X: 45`, `Y: 40`.
  - If unlabeled: Title: `(45, 40)`, Items: `X: 45`, `Y: 40`.
- **Line / Area Chart Tooltip**:
  - Single series: Title: `Category` ("Jan"), Item: `● [Series Name or Value] [y]`.
  - Multi-series: Title: `Category` ("Jan"), Items: `● [Series 1] [y1]`, `● [Series 2] [y2]`.

### 2. Categorical X-Axis Engine (`math.ts`, `axis.ts`, `AreaChart.tsx`, `LineChart.tsx`, `renderChart.ts`)

- Detect categorical strings in `calculateAreaPath` and `calculateMultiSeriesAreaPath`.
- Expose `categories` array and `isCategorical` flag.
- When categorical, place X-axis ticks directly at category data point coordinates with down-sampling for dense screens, rendering `'Jan'`, `'Feb'`, `'Mar'` instead of indices `0, 1, 2`.

### 3. Safe Domain Scaling for Negative & Zero Values (`math.ts`)

- Calculate proper mathematical extents:
  - If `yMax < 0`: domain `[yMin * 1.15, 0]`.
  - If `yMin > 0`: domain `[0, yMax * 1.1]`.
  - If mixed: domain `[yMin * 1.1, yMax * 1.1]`.
  - Guarantee `domain[0] <= domain[1]`.

### 4. Horizontal Bar Gridlines (`BarChart.tsx`, `renderChart.ts`)

- When `isHorizontal === true`, generate vertical value gridlines using `xScale.ticks(5)` spanning `y1={0}` to `y2={innerHeight}`.

### 5. Touch & Keyboard Accessibility

- Add `onPointerDown={handlePointerMove}` to scrub overlays for instant mobile tap responsiveness.
- Add `tabIndex={0}`, `role="img"` or `role="button"`, and `onFocus`/`onBlur` to interactive points and bars.

### 6. Strict NUICSS Stylesheet Verification

- Ensure all chart elements continue to consume `@nofinite/nuicss` superclasses and tokens with zero external style files.

---

## 4. Affected Files & Modules

- `packages/charts/src/core/tooltip.ts`: Deduplicate title and item labels, support percentage and (X, Y) pairs.
- `packages/charts/src/core/math.ts`: Fix negative domain calculation; support categorical axis detection and category extraction in `calculateAreaPath` and `calculateMultiSeriesAreaPath`.
- `packages/charts/src/core/axis.ts`: Deduplicate adjacent axis ticks.
- `packages/charts/src/react/BarChart.tsx`: Pass series names to tooltip, fix single-series duplicate labels, add horizontal gridlines.
- `packages/charts/src/react/PieChart.tsx`: Compute percentage in tooltip, eliminate duplicate label.
- `packages/charts/src/react/ScatterChart.tsx`: Format scatter tooltip with coordinates (X, Y), eliminate duplicate X label.
- `packages/charts/src/react/LineChart.tsx`: Render categorical labels on X-axis; deduplicate tooltip in single series; add `onPointerDown`.
- `packages/charts/src/react/AreaChart.tsx`: Render categorical labels on X-axis; deduplicate tooltip in single series; add `onPointerDown`.
- `packages/charts/src/react/ChartLegend.tsx`: Add `chart-legend-dot` superclass.
- `packages/charts/src/core/renderChart.ts` & `Chart.ts`: Mirror all deduplication, categorical X-axis, and gridline fixes in vanilla engine.

---

## 5. Dependencies & Tools

- Monorepo build: `pnpm nx build nuicss`, `pnpm nx build charts`.
- Visual verification: Playwright via Chromium in `/temp/charts-enterprise-audit-unique.mjs`.
- Tarball verification: `npm pack --dry-run` in `packages/charts`.

---

## 6. Alternatives Considered

- **Hiding Tooltip Header entirely**: Discarded because multi-series charts benefit from a shared category header ("Jan") above individual series entries ("Revenue", "Cost").
- **External D3 formatting packages**: Discarded to maintain lean bundle size (<30kB) and keep `@nofinite/charts` lightweight.

---

## 7. Risks & Mitigations

- **Breaking custom formatters**: `tooltipFormatter` prop signature remains unchanged (`(point: NormalizedDataPoint) => TooltipPayload | string`). Custom formatters continue to take precedence.
- **Non-breaking layout**: Default margins, SVG viewports, and responsive `useChartDimensions` remain intact.

---

## 8. Verification Strategy

1. **Automated Unit & Build Verification**:
   - `pnpm nx build nuicss`: Passed.
   - `pnpm nx build charts`: Passed.
   - `npm pack --dry-run`: Passed (65 files, types, cjs/esm chunks).
2. **Playwright Visual & DOM Verification (`temp/charts-centralized-audit-unique.mjs`)**:
   - Tooltips for Bar, Pie, Scatter, Line, Area have ZERO duplicate text: Verified.
   - X-axis on Area/Line charts with categorical data shows string labels (`Jan, Feb, Mar`), not indices (`0, 1, 2`): Verified.
   - Negative values chart renders valid SVG without inverted scales: Verified.
   - Horizontal bar chart renders vertical gridlines: Verified.
   - Multi-viewport screenshots saved to `temp/`: Verified.
3. **Pre-commit Linter & Git Savepoint**:
   - Local commit with header $\le 100$ characters.

---

## 9. Verification Results: ALL CHECKS PASSED

- Playwright Chromium visual verification passed with zero regressions.
- Redundant item labels eliminated across single-series and multi-series variants.
- 100% styled via `@nofinite/nuicss` design tokens and utility shortcuts. Zero chart-specific standalone CSS files.
