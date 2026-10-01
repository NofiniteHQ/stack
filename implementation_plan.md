# Implementation Plan: `@nofinite/charts` Enterprise-Grade & Framework-Agnostic Transformation

## 1. Objective

Elevate `@nofinite/charts` into an enterprise-grade, high-performance, truly framework-agnostic vector charting suite adhering strictly to `@nofinite/nuicss` design tokens and standards. Eliminate all regressions, React bundle pollution on the main entrypoint, spatial coordinate detachment bugs, missing axes/labels, and missing stylesheets, while introducing production-grade capabilities (interactive glassmorphic tooltips, multi-series support, robust data normalization, and accessibility).

The work will proceed **strictly phase-by-phase**, requiring user review and explicit `"next"` approval before initiating each subsequent phase.

---

## 2. Current Behavior & Forensic Audit Findings

From our visual Playwright audit and deep AST inspection:

1. **Framework-Agnostic Isolation Breach:** The root export `.` in `packages/charts/src/index.ts` re-exports React components (`AreaChart`, `LineChart`, etc.). Rollup bundles them into shared chunks that import `react` and `react/jsx-runtime`. Non-React consumers (Vanilla JS, Svelte, Vue, Angular) fail to load the package if React is absent.
2. **Coordinate Detachment Bug (Spatial Disharmony):** In `AreaChart` and `LineChart`, lines and area paths use D3 `scaleTime`/`scaleLinear`, but point circles (`<circle cx>`) are hardcoded to `(i / (length - 1)) * innerWidth`. On irregular time intervals, dots float in empty air up to 260px away from the actual line.
3. **Data Schema Fragility & NaN Collapses:** `Chart.stories.tsx` passes `{ x, y }` data, while core and React components expect `{ label, value }` or `{ date, value }`. This causes SVG path generator errors (`M0,NaNC...`), `cy="undefined"` on circles, stacked monolithic bar charts, and invisible zero-area pie charts.
4. **Zero Axes & Zero Labels:** Across all chart variants, exactly zero `<text>` elements are generated (`totalTextElements = 0`). Charts render faint grid lines with no numbers, no dates, and no category names, rendering data unreadable.
5. **Dormant Tooltip Engine & Dead Dependency:** `@floating-ui/dom` is declared as a runtime dependency in `package.json` but is never imported or utilized. No tooltips appear when hovering over data points.
6. **Circular Aspect Ratio Distortion:** `renderChart.ts` applies `preserveAspectRatio="none"` to all charts. Inside responsive container widths, Pie and Donut charts stretch into horizontally elongated ellipses and clip in half.
7. **Nested DOM Container Bug (`Chart.ts`):** `new Chart({ variant, data })` without an existing element creates a `.nui-chart-container`, then `this.render()` injects another `.nui-chart-container` inside it, duplicating height styles and wrappers.
8. **Missing `dist/styles.css`:** `package.json` exports `"./styles.css": "./dist/styles.css"`, but no CSS file is produced or packaged. Any consumer importing it crashes with `ERR_MODULE_NOT_FOUND`.
9. **NUICSS Standard Violations:** Ignores NUICSS superclasses (`.chart-container`, `.chart-grid`, `.chart-axes`), limits color cycling to 5 colors instead of the 8 defined tokens (`--chart-1` to `--chart-8`), and lacks glassmorphic styling.
10. **Downstream Documentation Desync:** `oss-docs` still attempts to import charts from `@nofinite/nui`, which removed chart exports during the initial decoupling refactor.

---

## 3. Phased Implementation Strategy

Work will be executed in 6 dedicated, non-overlapping phases. Each phase concludes with automated verification, Playwright visual confirmation, git commit save points, and a mandatory stop condition awaiting user instruction (`"next"`).

```
Phase 1: Package Boundaries, Clean Exports & Build Pipeline
    ↓ (Wait for "next")
Phase 2: Universal Data Normalization & Geometry Alignment Engine
    ↓ (Wait for "next")
Phase 3: Native SVG Axes, Ticks & NUICSS Typography Engine
    ↓ (Wait for "next")
Phase 4: Precision Crosshair, Glassmorphic Tooltip (@floating-ui) & Interactivity
    ↓ (Wait for "next")
Phase 5: Multi-Series, Grouped/Stacked Layouts & Legend Engine
    ↓ (Wait for "next")
Phase 6: Enterprise Polish, Accessibility (a11y), Storybook & Docs Sync
```

---

### Phase 1: Package Boundaries, Clean Exports & Build Pipeline

**Goal:** Establish clean module boundaries, guarantee zero React footprint in core bundle, fix `styles.css` generation, and repair the `Chart.ts` DOM lifecycle.

- **Tasks:**
  1. Decouple `packages/charts/src/index.ts`:
     - Root entry `.` strictly exports framework-agnostic code: `Chart`, `renderChart`, mathematical functions, axis helpers, data normalizers, and core types.
     - Move all React components (`AreaChart`, `LineChart`, `BarChart`, `PieChart`, `DonutChart`, `ScatterChart`, `Sparkline`, and unified `<Chart />`) exclusively to `packages/charts/src/react/index.ts` exported under `./react`.
  2. Configure Vite/Rollup in `packages/charts/vite.config.ts`:
     - Ensure tree-shaking prevents any React symbols from leaking into `dist/index.js` or `dist/index.cjs`.
     - Build a standalone `dist/styles.css` exporting NUICSS token integration, CSS variables, and fallback chart utility rules.
  3. Fix `Chart.ts` DOM Class:
     - When `options.element` is omitted, create an un-nested container and render directly into it.
     - Provide robust `.update(newData, newOptions?)` and `.destroy()` cleanup without recursive DOM nesting.
  4. Verify with `npm pack --dry-run`:
     - Confirm tarball contains `dist/index.js` (no react), `dist/react/index.js`, `dist/styles.css`, and declaration files.

---

### Phase 2: Universal Data Normalization & Geometry Alignment Engine

**Goal:** Make data ingestion completely resilient to any data shape and fix the critical point detachment bug.

- **Tasks:**
  1. Universal Data Normalizer (`src/core/normalize.ts`):
     - Support `{ x, y }`, `{ label, value }`, `{ date, value }`, `{ timestamp, val }`, or raw numbers seamlessly.
     - Accept optional custom accessor functions `xAccessor` and `yAccessor` with automated fallbacks.
     - Detect date/time strings vs categorical labels vs continuous numbers automatically.
     - Handle edge cases gracefully: empty array `[]` (renders empty state guide), single point `[d]` (centers point, spans full range), zero and negative numbers.
  2. Fix Circle Point Coordinate Bug:
     - Update `renderChart.ts`, `AreaChart.tsx`, and `LineChart.tsx`: circles must position `cx` using `xScale(d.x)` rather than array index arithmetic.
  3. Fix Circular Aspect Ratio Distortion:
     - Remove `preserveAspectRatio="none"` for `pie` and `donut` variants. Use `preserveAspectRatio="xMidYMid meet"`.
     - Auto-calculate radius based on `Math.min(innerWidth, innerHeight) / 2` so circles remain perfect circles across any container dimension.

---

### Phase 3: Native SVG Axes, Ticks & NUICSS Typography Engine

**Goal:** Provide professional, readable axis lines and labels adhering to NUICSS design standards.

- **Tasks:**
  1. SVG Axis Generator (`src/core/axis.ts`):
     - Generate X-axis tick marks and labels `<text>` positioned cleanly below the chart.
     - Generate Y-axis tick marks and labels `<text>` end-aligned to the left margin.
     - Formatters: auto-detect and format currency (`$10k`), large numbers (`1.5M`, `200k`), percentages (`45%`), and dates (`Jan 15`, `Q1`).
  2. Apply NUICSS Superclasses & Design Tokens:
     - Wrap charts in `.chart-container` (`relative w-full overflow-hidden font-sans`).
     - Style grid lines with `.chart-grid` (`stroke-default opacity-50`).
     - Style axis text with `.chart-axes` (`fill-muted text-xs select-none`).
     - Cycle through all 8 tokens: `--chart-1` through `--chart-8` from `@nofinite/nuicss`.

---

### Phase 4: Precision Crosshair, Glassmorphic Tooltip & Interactivity

**Goal:** Replace the dead `@floating-ui/dom` dependency with an active, enterprise-grade floating tooltip and cursor crosshair.

- **Tasks:**
  1. Interactive Overlay & Scrubbing:
     - Invisible overlay `<rect>` capturing `mousemove`, `touchmove`, and `mouseleave`.
     - Crosshair guide line snapping to the nearest X coordinate.
     - Point highlighting (pulse circle dot, slice elevation on pie hover, bar brightness).
  2. Glassmorphic Tooltip Card (`src/core/tooltip.ts`):
     - Integrate `@floating-ui/dom` (`computePosition`, `flip`, `shift`, `offset`).
     - Render floating tooltip element adhering to NUICSS: `bg-glass backdrop-blur-md border border-default shadow-lg rounded-lg p-2.5 text-xs text-default z-50`.
     - Multi-metric readout showing series color indicator, label, value, and timestamp.
     - Framework-agnostic implementation working seamlessly in vanilla `Chart` class and React components.

---

### Phase 5: Multi-Series, Grouped/Stacked Layouts & Legend Engine

**Goal:** Expand charting portfolio to handle multi-metric business dashboards.

- **Tasks:**
  1. Multi-Series Line & Area Engine:
     - Support multiple data series (`series: [{ name: 'Revenue', data: [...] }, { name: 'Cost', data: [...] }]`).
     - Automatic palette distribution across `--chart-1` to `--chart-8`.
  2. Stacked & Grouped Bar Charts:
     - Grouped columns for side-by-side category comparisons.
     - Stacked bars for cumulative volume breakdown.
     - Horizontal bar chart layout for rankings and leaderboards.
  3. Reference Lines & Target Thresholds:
     - Horizontal reference lines for targets (e.g. SLA target `y=99.9%`, budget cap).
  4. Interactive Legend Component:
     - Toggleable legend items allowing users to mute or solo individual series.

---

### Phase 6: Enterprise Polish, Accessibility (a11y), Storybook & Docs Sync

**Goal:** Production readiness, accessibility compliance (WCAG 2.1 AA), and documentation alignment.

- **Tasks:**
  1. Accessibility Engine:
     - Generate hidden semantic HTML `<table>` representation for screen readers.
     - Keyboard navigation (`Tab` + `ArrowLeft`/`ArrowRight`) reading current point values via `aria-live`.
  2. Export Utilities:
     - Add `.toSVG()`, `.toPNG()`, and `.toCSV()` export helper functions.
  3. Storybook & Visual Regression Suite:
     - Rewrite `packages/charts/src/react/Chart.stories.tsx` to showcase all variants, multi-series, tooltips, and light/dark modes.
  4. Sync `d:\oss-docs`:
     - Update `oss-docs` imports from `@nofinite/nui` to `@nofinite/charts` / `@nofinite/charts/react`.
  5. Full Playwright Visual Verification:
     - Capture light and dark mode screenshots in `/temp/` and verify pixel-perfect spatial harmony.

---

## 4. Affected Files & Packages

| Package / Directory          | File                                    | Purpose                                       |
| :--------------------------- | :-------------------------------------- | :-------------------------------------------- |
| `packages/charts`            | `package.json`                          | Exports configuration, dependency cleanup     |
| `packages/charts`            | `vite.config.ts`                        | Multi-entry build, CSS emission, tree-shaking |
| `packages/charts/src`        | `index.ts`                              | Pure framework-agnostic root export           |
| `packages/charts/src/core`   | `Chart.ts`                              | DOM class lifecycle & container fix           |
| `packages/charts/src/core`   | `math.ts`                               | D3 layout math, multi-series calculations     |
| `packages/charts/src/core`   | `normalize.ts`                          | Universal data schema normalizer (New)        |
| `packages/charts/src/core`   | `axis.ts`                               | SVG X/Y axis & tick generator (New)           |
| `packages/charts/src/core`   | `tooltip.ts`                            | Floating-UI glassmorphic tooltip engine (New) |
| `packages/charts/src/core`   | `renderChart.ts`                        | SVG universal rendering pipeline              |
| `packages/charts/src/react`  | `index.ts`                              | React subpath exports                         |
| `packages/charts/src/react`  | `*.tsx`                                 | React chart components & ResizeObserver       |
| `packages/charts/src/styles` | `charts.css`                            | NUICSS token mappings & chart styles (New)    |
| `packages/charts/src/react`  | `Chart.stories.tsx`                     | Comprehensive Storybook stories               |
| `oss-docs`                   | `src/app/nui/components/chart/page.mdx` | Docs update                                   |
| `oss-docs`                   | `src/registry/chart.tsx`                | Component preview registry fix                |

---

## 5. Risk Assessment & Mitigations

| Risk                            | Mitigation                                                                                                                           |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Breaking Existing Consumers** | Support legacy property names (`label`, `value`, `date`) alongside new normalized keys (`x`, `y`) with backward-compatible adapters. |
| **Bundle Size Overhead**        | Keep D3 dependencies strictly modular (`d3-shape`, `d3-scale`, `d3-array`, `d3-axis`). Avoid importing full D3.                      |
| **SVG Layout Drift on Resize**  | Use modern `ResizeObserver` in React and vanilla `Chart` class with debounce, re-rendering only when container bounds change.        |

---

## 6. Verification Strategy

1. **Unit & Mathematical Tests:** Vitest suite running in Happy-DOM testing normalization, scales, ticks, and path generation.
2. **NPM Package Verification:** `npm pack --dry-run` to verify all distribution files (`dist/styles.css`, `dist/index.js`, etc.) exist.
3. **Playwright Visual Verification:** Headless browser rendering every chart in light and dark mode, measuring bounding boxes and checking for zero SVG path errors.
4. **Git Commit Save Points:** Mandatory local git commits after every single phase.
