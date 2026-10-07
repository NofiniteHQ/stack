# Implementation Plan: Charts Suite Phase B — Enterprise Stacking Modes, Full WCAG 2.1 AA Accessibility & Keyboard Scrubbing

## 1. Objective

Elevate `@nofinite/charts` to full enterprise-grade readiness across all variants (`area`, `bar`, `line`, `pie`, `scatter`) prior to public NPM publishing by implementing:

1. **Stacked & 100% Normalized Area Modes (`areaMode?: 'overlapping' | 'stacked' | 'percent'`)**:
   - Enable financial and SaaS analytics stacked area charts where upper series curves accumulate baseline values from lower curves, plus 100% normalized share area distributions.
2. **100% Normalized Stacked Bar Mode (`barLayout?: 'grouped' | 'stacked' | 'horizontal' | 'percent'`)**:
   - Complete the bar layout suite with full 100% proportional composition bars.
3. **WCAG 2.1 AA Semantic Screen-Reader Tables in React Components**:
   - Embed the semantic accessible table (`generateA11yTableHtml`) into all React charts (`<AreaChart />`, `<BarChart />`, `<LineChart />`, `<ScatterChart />`, `<PieChart />`), matching the vanilla `Chart.ts` and `renderChart.ts` implementation.
4. **Keyboard Focus & Arrow-Key Navigation**:
   - Make charts accessible via keyboard: `tabIndex={0}`, ARIA roles (`role="region"` / `aria-label`), and `ArrowLeft` / `ArrowRight` arrow key scrubbing to navigate data points without a mouse.
5. **Smooth SVG Entry Animations via `@nofinite/nuicss` Transition Tokens**:
   - Zero-dependency, lightweight CSS animations (`stroke-dashoffset` path drawing and bar scale entry) utilizing standard NUICSS transitions.
6. **Strict Architecture & Design Token Compliance**:
   - 100% styled via `@nofinite/nuicss` design tokens and utility superclasses; zero standalone CSS files; framework-agnostic core preserved.

---

## 2. Current Behavior & Identified Problems

### Problem 1: Multi-Series Area Only Renders Overlapping Curves

- In `packages/charts/src/core/math.ts` (`calculateMultiSeriesAreaPath`), every series area generator anchors to `.y0(innerHeight)`:
  ```ts
  const areaGenerator = d3Area<NormalizedDataPoint>()
    .x((d) => xScale(d.x)!)
    .y0(innerHeight)
    .y1((d) => yScale(d.y)!);
  ```
- This results only in overlapping semi-transparent fills. Users cannot generate stacked area charts (e.g., breakdown of operating expenses or multi-channel revenue accumulation) or 100% normalized area charts without manual pre-aggregation.

### Problem 2: Missing 100% Normalized Stacked Bar Mode

- `calculateMultiBarLayout` supports `'grouped'`, `'stacked'`, and `'horizontal'`, but lacks `'percent'` (100% proportional normalization), which is standard in business intelligence suites.

### Problem 3: React Charts Lack Screen-Reader Accessibility & Keyboard Scrubbing

- While `renderChart.ts` outputs `generateA11yTableHtml(...)` for screen readers, the React chart components (`AreaChart`, `BarChart`, `LineChart`, `ScatterChart`, `PieChart`) currently omit this table.
- Screen reader users and keyboard-only users cannot navigate data points using `ArrowLeft` and `ArrowRight` keys, failing WCAG 2.1 AA keyboard operability guidelines.

### Problem 4: Abrupt Canvas Mounts (Missing Entry Polish)

- Charts appear instantaneously without graceful entrance or transition, looking static compared to top-tier design systems.

---

## 3. Proposed Solutions

### 1. Stacked & Percent Area Layout Engine (`math.ts`, `AreaChart.tsx`, `renderChart.ts`, `Chart.ts`)

- Add `areaMode?: 'overlapping' | 'stacked' | 'percent'` to `ChartOptions` and `AreaChartProps`.
- In `calculateMultiSeriesAreaPath`:
  - When `areaMode === 'stacked'`:
    - Compute baseline accumulators: for point index $j$, baseline $y0_j = \sum_{k < i} y_{k, j}$ and upper bound $y1_j = y0_j + y_{i, j}$.
    - Y scale domain: $[0, \max_j(\sum_i y_{i, j}) \times 1.1]$.
    - Area path uses `.y0(d => yScale(d.y0)).y1(d => yScale(d.y1))`.
  - When `areaMode === 'percent'`:
    - Normalize each category total to 100%: $y_{i, j} = (y_{i, j} / \text{total}_j) \times 100$.
    - Y scale domain: $[0, 100]$ with automatic `%` axis tick formatter.

### 2. Percent Mode in Multi-Bar Layout (`math.ts`, `BarChart.tsx`, `renderChart.ts`, `Chart.ts`)

- Extend `BarLayoutMode = 'grouped' | 'stacked' | 'horizontal' | 'percent'`.
- In `calculateMultiBarLayout`:
  - Calculate category total sums.
  - Scale individual bar heights and cumulative positions proportionally to 100% of inner dimensions.

### 3. Screen-Reader Table & Keyboard Navigation in React Charts

- Add `generateA11yTableHtml` inside `<div className="sr-only chart-a11y-container" ... />` across all React charts.
- Add `role="region"`, `aria-label={ariaLabel || `${name} chart`}`, and `tabIndex={0}` to the container.
- Add `onKeyDown={(e) => { ... }}` on the interactive overlay:
  - `ArrowRight`: advance active point index by +1.
  - `ArrowLeft`: advance active point index by -1.
  - `Escape`: dismiss tooltip and unfocus.

### 4. Zero-Dependency CSS Entry Transitions

- Add `@nofinite/nuicss` transition utility classes:
  - Bars: `origin-bottom transition-all duration-300 ease-out`
  - Area & Line paths: smooth CSS fade/stroke entry with `duration-300`.

---

## 4. Affected Files & Modules

| File                                                                                                        | Change Scope                                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`packages/charts/src/core/math.ts`](file:///d:/stack/packages/charts/src/core/math.ts)                     | Add `areaMode` in `calculateMultiSeriesAreaPath`, extend `calculateMultiBarLayout` for `percent` mode. |
| [`packages/charts/src/core/renderChart.ts`](file:///d:/stack/packages/charts/src/core/renderChart.ts)       | Accept `areaMode`, support stacked/percent area rendering and percent bar rendering.                   |
| [`packages/charts/src/core/Chart.ts`](file:///d:/stack/packages/charts/src/core/Chart.ts)                   | Forward `areaMode` and `barLayout="percent"`, update keyboard event listeners.                         |
| [`packages/charts/src/react/AreaChart.tsx`](file:///d:/stack/packages/charts/src/react/AreaChart.tsx)       | Add `areaMode` prop, embed a11y table, enable keyboard arrow navigation.                               |
| [`packages/charts/src/react/BarChart.tsx`](file:///d:/stack/packages/charts/src/react/BarChart.tsx)         | Support `barLayout="percent"`, embed a11y table, enable keyboard arrow navigation.                     |
| [`packages/charts/src/react/LineChart.tsx`](file:///d:/stack/packages/charts/src/react/LineChart.tsx)       | Embed a11y table, enable keyboard arrow navigation.                                                    |
| [`packages/charts/src/react/ScatterChart.tsx`](file:///d:/stack/packages/charts/src/react/ScatterChart.tsx) | Embed a11y table, enable keyboard arrow navigation.                                                    |
| [`packages/charts/src/react/PieChart.tsx`](file:///d:/stack/packages/charts/src/react/PieChart.tsx)         | Embed a11y table, enable keyboard navigation across slices.                                            |

---

## 5. Dependencies & Tools

- **No New Dependencies**: Uses existing `d3-shape`, `d3-scale`, and `@nofinite/nuicss` design tokens.
- **Vite & Playwright**: Visual validation via Chromium test in `/temp/`.

---

## 6. Alternatives Considered

1. **Third-party Animation Engine (e.g. Framer Motion or GSAP)**:
   - _Rejected_: Violates bundle size goals and breaks zero-dependency framework-agnostic design. CSS tokens provide instant, fluid 60fps rendering without extra overhead.
2. **Client-Only Canvas Rendering**:
   - _Rejected_: Incompatible with headless SSR SVG generation in `renderChart.ts`, breaks screen readers and vector scaling.

---

## 7. Risks & Mitigations

- **Risk**: Stacked areas with mismatched X categories across series could cause misaligned baselines.
  - _Mitigation_: Harmonize X domain across all series to an indexed category grid before accumulating baselines.
- **Risk**: Division by zero in 100% normalized mode if category sum is 0.
  - _Mitigation_: Fall back to 0% if total sum $\le 0$.

---

## 8. Verification Strategy

1. **Build & Type Checking**:
   - `pnpm nx build charts` (0 errors in Vite and DTS generation).
   - `npm pack --dry-run` in `packages/charts` to verify package contents.
2. **Automated Visual Validation via Playwright**:
   - Test stacked area chart with multiple accumulating series.
   - Test 100% normalized area chart with `%` axis ticks.
   - Test 100% normalized stacked bar chart.
   - Verify keyboard arrow scrubbing (`ArrowLeft` / `ArrowRight`) triggering tooltips.
   - Verify presence of screen reader accessible table (`.sr-only table`).
   - Capture desktop and mobile screenshots in `/temp/`.
3. **Git Commit**:
   - Compulsory local Git commit with header $\le 100$ characters.
   - Strictly avoid modifying `packages/kanban/`.
