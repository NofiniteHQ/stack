# Implementation Plan: Upstream NUICSS Chart Unification & Precision UX Hardening

## 1. Objective

1. **Upstream Architecture Alignment:** Enforce `@nofinite/nuicss` as the sole source of truth for design tokens, typography, and component superclasses. Migrate all chart styling upstream into `packages/nuicss` (`src/shortcuts/widgets.ts` and `src/styles/theme.css`), and completely delete local `packages/charts/src/styles/charts.css`.
2. **Scatter Dot Jitter Eradication:** Replace vulnerable single-circle hover scaling with a stable dual-circle architecture (generous transparent hit-target + visual indicator), eliminating 60 FPS vibration loops.
3. **Dynamic Multi-Device Responsiveness:** Implement debounced `ResizeObserver` lifecycle management in vanilla `Chart.ts` and React (`useChartDimensions`), dynamically adjusting D3 coordinate spaces, margins, and tick densities for viewports from 320px mobile to 4K desktop without squashing or vertical overflow.
4. **Glassmorphic Tooltip Upstream System:** Fix the React positioning race condition via deferred DOM measurement, bind tooltip styles directly to NUICSS glassmorphic tokens (`backdrop-blur-md`, subtle border, `tabular-nums`), and prevent container boundary clipping.
5. **Adaptive Bar Layouts & Touch Scrubbing:** Automatically calculate dynamic left margins for horizontal bar charts based on category label lengths, introduce narrow-screen label collision safeguards, and enable `touch-action: none` for mobile dragging.

---

## 2. Current Behavior & Identified Problems

| Area                      | Current Behavior                                                                                                                                 | Problem                                                                                                                                                                                                               |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CSS Architecture**      | `packages/charts` ships its own local `charts.css` defining `:root` variables, duplicate `--chart-*` tokens, and ad-hoc classes.                 | Violates ecosystem constitution; duplicates design tokens; causes style desynchronization across apps and documentation.                                                                                              |
| **Upstream `nuicss`**     | `chart-container` in `packages/nuicss/src/shortcuts/widgets.ts` has `overflow-hidden`. Other chart superclasses are missing.                     | Breaks tooltips and axis labels by clipping them off at container boundaries.                                                                                                                                         |
| **Scatter Chart Hover**   | Hover scales `<circle>` via CSS `scale(1.3)` without `transform-box: fill-box`, while React dynamically mutates `r={activePoint === d ? 6 : 4}`. | Circle jumps radially toward SVG canvas `(0, 0)`, leaves the mouse cursor, snaps back, and repeats infinitely, vibrating at 60 FPS.                                                                                   |
| **Responsiveness**        | `width` hardcoded to `500` or `600` across all charts; zero `ResizeObserver`. `charts.css` lacks SVG sizing rules.                               | On desktop (1200px), SVG overflows vertically to 488px (chopping off bottom axes). On mobile (375px/320px), SVG collapses to 133px (creating 127px blank dead space) and text compresses into tiny unreadable specks. |
| **Tooltip Positioning**   | In `useChartTooltip.ts`, `positionTooltip` is called synchronously before React re-renders the new DOM content.                                  | Floating UI measures stale/empty dimensions; tooltips appear displaced, misaligned, or jump unexpectedly.                                                                                                             |
| **Horizontal Bar Labels** | Left margin hardcoded to 40px regardless of layout.                                                                                              | Long category labels ("United States & Canada") draw outside the viewBox and are completely invisible.                                                                                                                |
| **Mobile Scrubbing**      | Interactive overlay lacks `touch-action: none`.                                                                                                  | Dragging finger across chart scrolls the browser window vertically instead of scrubbing the crosshair.                                                                                                                |

---

## 3. Proposed Solution

### Step 1: Upstream NUICSS Superclasses & Styles (`packages/nuicss`)

- In `packages/nuicss/src/shortcuts/widgets.ts`:
  - Update `chart-container`: change from `'relative w-full overflow-hidden font-sans'` to `'relative w-full font-sans'` (remove destructive `overflow-hidden`).
  - Add `chart-container-circular`: `'flex items-center justify-center'`
  - Add `chart-grid`: `'stroke-default opacity-50'`
  - Add `chart-axes`: `'fill-muted text-xs select-none'`
  - Add `chart-point`: `'transition-all duration-150 transform-center'`
  - Add `chart-bar`: `'transition-opacity duration-150 cursor-pointer hover:opacity-85'`
  - Add `chart-segment`: `'transition-transform duration-150 cursor-pointer hover:scale-105'`
  - Add `chart-crosshair`: `'stroke-default opacity-60 pointer-events-none'`
  - Add `chart-tooltip`: `'absolute pointer-events-none bg-surface/90 text-default border border-default rounded-lg shadow-lg px-3 py-2 text-xs backdrop-blur-md z-50 whitespace-nowrap'`
  - Add `chart-tooltip-title`: `'text-[11px] font-medium text-muted mb-1 opacity-80'`
  - Add `chart-tooltip-item`: `'flex items-center justify-between gap-3 text-xs leading-tight'`
  - Add `chart-tooltip-swatch`: `'w-2 h-2 rounded-full shrink-0'`
  - Add `chart-tooltip-label`: `'text-muted truncate opacity-90'`
  - Add `chart-tooltip-value`: `'font-semibold text-default tabular-nums'`
  - Add `chart-legend`: `'flex flex-wrap items-center justify-center gap-4 mt-3 text-xs'`
  - Add `chart-legend-item`: `'inline-flex items-center gap-1.5 cursor-pointer select-none transition-opacity hover:opacity-80'`
  - Add `chart-legend-dot`: `'w-2.5 h-2.5 rounded-full shrink-0'`
  - Add `chart-legend-label`: `'font-medium text-muted'`
- In `packages/nuicss/src/styles/theme.css`:
  - Add SVG root styling under `.chart-container svg, .nui-chart-container svg { display: block; width: 100%; height: 100%; overflow: visible; }`
  - Add `.chart-point { transform-box: fill-box; transform-origin: center; }`
- Rebuild `nuicss` and verify CDN/dist outputs.

### Step 2: Purge Local `charts.css` from `@nofinite/charts`

- Delete `packages/charts/src/styles/charts.css`.
- Remove `packages/charts/src/styles.ts`.
- Update `packages/charts/vite.config.ts` to remove the separate CSS build output.
- Update `packages/charts/package.json`: remove `"./styles.css": "./dist/styles.css"`.
- `@nofinite/charts` will purely generate semantic SVG markup and consume NUICSS classes.

### Step 3: Scatter Stability & Jitter Fix

- In `ScatterChart.tsx` and `renderChart.ts`:
  - Render an invisible hit `<circle>` (`r={14}`, `fill="transparent"`, `pointer-events: all; cursor: pointer;`) for each data point.
  - Render the visible visual dot underneath with `pointer-events: none;`, retaining fixed geometry (`r={4}`, expanding to `r={5.5}` or subtle halo ring on active point).
  - The pointer target never shifts coordinates, completely preventing 60 FPS vibration.

### Step 4: Multi-Device Responsive Engine

- **Vanilla (`Chart.ts`):**
  - If `options.width` is not explicitly set, instantiate a debounced `ResizeObserver` on `this.element`.
  - On resize, dynamically set `this.options.width = Math.round(entry.contentRect.width)` and trigger RAF re-render.
  - Clean up observer in `chart.destroy()`.
- **React (`useChartDimensions.ts` hook):**
  - Implement a shared responsive hook that attaches a `ResizeObserver` to `containerRef`.
  - When `propWidth` is undefined, dynamically recompute D3 scales and layout based on the measured container width.
- **Adaptive Tick & Margin Sizing:**
  - For narrow viewports (`< 480px`), reduce X-axis tick counts (e.g. 3 ticks instead of 6) to avoid label collisions.
  - In `calculateMultiBarLayout`, automatically calculate dynamic left margin for horizontal bar charts based on category label lengths (`Math.max(40, maxLabelLength * 7.5 + 16)`).
  - For circular charts (`PieChart`, `DonutChart`), ensure square viewBox (`0 0 size size`) where `size = Math.min(width, height)` so circles are never clipped or distorted.

### Step 5: Glassmorphic Tooltip Race Condition Fix

- In `useChartTooltip.ts`:
  - Move `positionTooltip` call into a `useLayoutEffect` / `requestAnimationFrame` that fires **after** `tooltipHtml` is painted in the DOM.
  - Floating UI measures accurate bounding boxes, eliminating jumping/offset defects.
- Add `limiter: limitShift()` and container boundary padding (`padding: 8`).
- Add `touch-action: none` to all chart scrub overlays for seamless mobile touch tracking.

---

## 4. Affected Files & Modules

| File                                              | Change                                                                                    |
| :------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| `packages/nuicss/src/shortcuts/widgets.ts`        | Fix `chart-container` (remove `overflow-hidden`), add full suite of chart superclasses.   |
| `packages/nuicss/src/styles/theme.css`            | Add `.chart-container svg` base sizing and `.chart-point` `transform-box: fill-box`.      |
| `packages/charts/src/styles/charts.css`           | **DELETE** (purged in favor of upstream NUICSS).                                          |
| `packages/charts/src/styles.ts`                   | **DELETE**.                                                                               |
| `packages/charts/package.json`                    | Remove `./styles.css` export.                                                             |
| `packages/charts/vite.config.ts`                  | Clean up Vite config to build pure JS/TS bundle.                                          |
| `packages/charts/src/react/useChartDimensions.ts` | **NEW**: Responsive `ResizeObserver` hook for React charts.                               |
| `packages/charts/src/core/Chart.ts`               | Add debounced `ResizeObserver` lifecycle management for vanilla charts.                   |
| `packages/charts/src/react/ScatterChart.tsx`      | Implement dual-circle hit target; consume `useChartDimensions`.                           |
| `packages/charts/src/react/AreaChart.tsx`         | Consume `useChartDimensions`; add `touchAction: 'none'`.                                  |
| `packages/charts/src/react/LineChart.tsx`         | Consume `useChartDimensions`; add `touchAction: 'none'`.                                  |
| `packages/charts/src/react/BarChart.tsx`          | Consume `useChartDimensions`; adaptive horizontal margins; category collision prevention. |
| `packages/charts/src/react/PieChart.tsx`          | Consume `useChartDimensions`; square aspect ratio viewBox.                                |
| `packages/charts/src/react/useChartTooltip.ts`    | Defer `positionTooltip` to post-render RAF/layoutEffect; boundary shift limiter.          |
| `packages/charts/src/core/math.ts`                | Adaptive horizontal bar margins based on category label lengths.                          |
| `packages/charts/src/core/axis.ts`                | Mobile tick density reduction; category label collision prevention.                       |
| `packages/charts/src/core/renderChart.ts`         | Dual-circle hit targets for scatter; square aspect ratio for pie/donut; touchAction.      |

---

## 5. Alternatives Considered

- **Alternative A: Keep `charts.css` and just fix the rules inside it.**  
  _Rejected:_ Violates the strict ecosystem rule that `@nofinite/nuicss` is the sole source of truth. Having parallel stylesheets leads to drift and breaks when apps only import NUICSS.
- **Alternative B: CSS `transform: scale()` on hover without hit target.**  
  _Rejected:_ Changing geometry on the hover target itself is fundamentally prone to boundary jitter when mouse movements cross the border. The dual-circle hit-target pattern is the proven industry standard in D3/Observable Plot/Highcharts.

---

## 6. Risks & Mitigations

- **Risk:** Existing consumers importing `@nofinite/charts/styles.css` might experience import errors if the export is deleted.  
  _Mitigation:_ Keep a re-exporting alias in `package.json` or export `@nofinite/nuicss/dist/styles.css`, or verify ecosystem usage (only `oss-docs` and internal apps, which already import NUICSS).
- **Risk:** `ResizeObserver` loop errors (`ResizeObserver loop completed with undelivered notifications`).  
  _Mitigation:_ Debounce resize callbacks with `requestAnimationFrame` and check for matching integer bounds before triggering state updates.

---

## 7. Security Considerations

- All dynamic text values continue to be properly escaped or formatted.
- No user-controlled unescaped HTML injection.

---

## 8. Verification Strategy

1. **Unique-Named Playwright Audit:** Run test script `temp/charts-upstream-verification-unique.mjs` verifying:
   - Desktop (1200px): Zero vertical SVG overflow (height remains 260px).
   - Mobile (375px & 320px): Zero collapse (SVG fills container cleanly); tick text remains crisp and legible (> 9px computed font size); zero category label overlap.
   - Scatter Hover: Hover over dots with position tracking across 10 frames to prove zero vibration.
   - Tooltip: Verify glassmorphic backdrop filter, border contrast, and exact alignment after DOM paint.
   - Horizontal Bar: Verify long labels ("United States & Canada") are 100% visible inside the viewBox.
2. **Build & Unit Tests:**
   - `pnpm nx build nuicss`
   - `pnpm nx build charts`
   - `pnpm nx run charts:test`
3. **NPM Tarball Inspection:** Run `npm pack --dry-run` in `packages/charts` to ensure valid distribution.
4. **Git Commit:** Create atomic local git commits adhering strictly to the $\le 100$ character commit message limit.

---

## 9. Rollback Considerations

If anything breaks during the upstream migration, git commits provide immediate revert save points without leaving unstaged or dangling files.
