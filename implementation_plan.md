# Phased Implementation Plan: 100% Production Excellence for `@nofinite/charts`

## Progress Tracking

- [x] **Phase 1: Modular Architecture & Big-Data Engine (LTTB)** — _Completed & Committed (`b08b295`)_
- [x] **Phase 2: Zero-Dependency Fluid Entrance Animations** — _Completed & Committed (`ebfa9bb`)_
- [x] **Phase 3: Strict Types & Zero-Warning Linting** — _Completed & Committed (`41694aa`)_
- [x] **Phase 4: Comprehensive React Unit Test Suite & Packaging Verification** — _Completed & Verified (31/31 tests passing, npm pack verified, no publish)_

```mermaid
graph LR
    P1["Phase 1: Sparkline & LTTB (DONE)"] --> P2["Phase 2: Fluid Animations (DONE)"]
    P2 --> P3["Phase 3: Strict Types & 0-Warnings (DONE)"]
    P3 --> P4["Phase 4: Test Suite & Packaging Verification (DONE)"]
```

---

## Phase 3: Strict Types & Zero-Warning Linting (Target: 89 warnings -> 0)

### 1. Objective

Achieve zero ESLint warnings and strict TypeScript type integrity across the entire `@nofinite/charts` codebase.
Currently, `npx eslint packages/charts` reports **89 warnings** across 9 files:

1. `packages/charts/src/core/axis.ts` (4 warnings: `no-explicit-any`)
2. `packages/charts/src/core/math.ts` (39 warnings: 20 `no-non-null-assertion`, 19 `no-explicit-any`)
3. `packages/charts/src/core/normalize.ts` (9 warnings: `no-explicit-any`)
4. `packages/charts/src/react/AreaChart.tsx` (7 warnings: `no-explicit-any`)
5. `packages/charts/src/react/BarChart.tsx` (4 warnings: `no-explicit-any`)
6. `packages/charts/src/react/LineChart.tsx` (7 warnings: `no-explicit-any`)
7. `packages/charts/src/react/PieChart.tsx` (3 warnings: `no-explicit-any`)
8. `packages/charts/src/react/ScatterChart.tsx` (8 warnings: `no-explicit-any`)
9. `packages/charts/vite.config.ts` (1 warning: `no-explicit-any`)

### 2. Proposed Changes Per File

#### A. `packages/charts/src/core/axis.ts`

- Replace `any` in `formatTemporalTick(val: number | Date | string | unknown)` with safe type checking.
- Replace `any` in tick format function signatures (`(val: number | Date | string) => string`).

#### B. `packages/charts/src/core/math.ts`

- Replace all 20 non-null assertions (`!`) in stacking and normalization logic with safe optional chaining or fallback defaults (`?? 0`, `?? []`).
- Refine generic accessor functions: `xAccessor?: (d: T) => number | Date | string`, `yAccessor?: (d: T) => number`.
- Type series data items as generic `T` rather than `any`.
- Replace `any` in downsampling and multi-series transforms with strict generic records and `DataPoint` constraints.

#### C. `packages/charts/src/core/normalize.ts`

- Replace `any` parameters in `normalizeDataPoint` with `unknown` or `Record<string, unknown>`.
- Use type guards (`typeof`, `instanceof Date`) to validate fields safely without casting through `any`.

#### D. React Chart Components (`AreaChart`, `BarChart`, `LineChart`, `PieChart`, `ScatterChart`)

- Replace `xTickFormat?: (val: any) => string` with `xTickFormat?: (val: number | Date | string) => string`.
- In `ScatterChart`, refine `ScatterChartProps<T = DataPoint>` instead of `<T = any>`.
- In a11y table calls, pass properly typed series arrays without casting `as any`.
- In scale mapping, handle `number | Date | string` domain values strictly.

#### E. `packages/charts/vite.config.ts`

- Replace `chunkInfo: any` with the Rollup `PreRenderedChunk` type from `rollup`.

### 3. Verification Strategy

1. Run `npx eslint packages/charts` to verify 0 warnings and 0 errors.
2. Run `pnpm nx build charts` to verify strict TypeScript compilation and DTS generation.
3. Run `pnpm nx test charts` to ensure 100% test passes.
4. Run Playwright visual audit `node temp/charts-centralized-audit-unique.mjs` to ensure zero runtime regressions.
5. Create Git commit for Phase 3.

---

## Phase 4: Comprehensive React Unit Test Suite & Packaging Verification [COMPLETED]

### 1. Objective

Ensure bulletproof runtime resilience and clean package artifacts for `@nofinite/charts` via comprehensive React unit testing under Happy-DOM and strict verification of compiled package distribution.

### 2. Implementation Summary

- Created `packages/charts/src/react/charts.react.test.tsx` testing:
  - `<LineChart />`: Rendering, entrance animation toggle (`.chart-animate-line`), multi-series legend, empty dataset handling.
  - `<AreaChart />`: SVG paths, gradient definitions (`url(#...)`), stroke lines, empty states.
  - `<BarChart />`: SVG rectangles (`.chart-bar`), multi-series grouping/stacking, empty dataset safety.
  - `<PieChart />`: Path wedges (`.chart-pie-wedge`), tooltip triggers on mousemove/mouseenter, empty states.
  - `<ScatterChart />`: SVG circles (`circle.chart-point`), empty states.
  - `<Sparkline />`: Compact inline rendering, polyline vectors, role/aria-label contracts, empty dataset fallback.
  - `<ChartLegend />`: Swatch rendering and interactive `onToggle` click handlers.
- Refined `ChartScale` in `packages/charts/src/core/axis.ts` to satisfy ESLint without any warnings.

### 3. Verification & Packaging Certification

- **Test Suite Pass:** 31/31 unit tests passing across core math and React suites (`src/charts.test.ts`, `src/react/charts.react.test.tsx`).
- **Zero Lint Issues:** `npx eslint packages/charts` reports 0 errors, 0 warnings.
- **Production Build:** `pnpm nx build charts` compiled all ESM, CJS, CSS, and `.d.ts` declaration bundles in 4.25s.
- **Packaging Dry-Run:** `npm pack --dry-run` confirmed 67 packaged distribution files without empty folders or missing artifacts.
- **Publish Status:** Strictly retained local; `npm publish` intentionally omitted per user constraint.
