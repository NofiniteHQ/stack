# Implementation Plan: Glassmorphic Popover Card & Enterprise UI Layout Perfection for `@nofinite/charts`

## 1. Objective

Elevate `@nofinite/charts` to true **Tier-1 enterprise grade quality** (matching Apple visionOS/macOS, Linear, and Vercel standards) by resolving all 3 visual/layout defects identified during Playwright audits and redesigning the tooltip card into a modern, frosted glass popover with pristine micro-typography.

---

## 2. Current Behavior & Identified Problems

### A. Flat & Clipping Popover Card (User Reported & Verified)

- **Current Behavior:** The tooltip renders as a flat, opaque rectangle (`bg-surface/90`) with a basic border and abrupt appearance.
- **Problems:**
  1. **Aesthetic Deficiency:** Lacks modern frosted glass translucency (`backdrop-blur-xl`, saturation boost, specular hairline reflections).
  2. **Boundary Clipping:** Near top borders (e.g. data points with values near the top scale), Floating-UI pushes the tooltip past the container boundary, slicing off the title header (measured in [`tooltip-dark.png`](file:///d:/stack/temp/tooltip-dark.png) and [`tooltip-light.png`](file:///d:/stack/temp/tooltip-light.png)).
  3. **Visual Hierarchy:** Header is cramped with no dividing separator; dots lack glowing depth; value metrics lack mono-space tabular alignment.

### B. Defect 1: Legend Overflowing Container & Card Borders

- **Current Behavior:** `<div style={{ height }}>` contains `<svg className="w-full h-full">` followed by `<ChartLegend />`.
- **Problem:** The SVG consumes 100% of the allocated height (`height: 260px`), forcing `<ChartLegend />` to overflow past the bottom of the container by 28px and cross over the parent card's padded border (`overflowPixels: 7px`).

### C. Defect 2: Horizontal Bar Chart Long-Label Clipping

- **Current Behavior:** Horizontal bar chart category labels longer than 25 characters are clipped off on the left canvas edge.
- **Problem:** Left margin formula does not scale high enough for realistic enterprise KPI labels (e.g., `"Enterprise Cloud Platform Architecture"` measured `rectLeft: 7.59px, parentLeft: 61px`).

### D. Defect 3: Axis Origin Collision at $(0, 0)$

- **Current Behavior:** The bottom Y-axis tick (`"0"`) and first X-axis tick (`"0"` or `"Jan"`) are positioned almost identically at the bottom-left vertex.
- **Problem:** Text elements collide and create a visual smudge at the corner.

---

## 3. Proposed Solution

### Step 1: Upstream Frosted Glass Design Superclass in `@nofinite/nuicss`

1. In [`packages/nuicss/src/shortcuts/widgets.ts`](file:///d:/stack/packages/nuicss/src/shortcuts/widgets.ts):
   - Upgrade `.chart-tooltip`:
     ```ts
     [
       'chart-tooltip',
       'absolute pointer-events-none bg-surface/75 backdrop-blur-xl saturate-150 border border-white/10 dark:border-white/10 rounded-xl shadow-2xl px-3.5 py-2.5 text-xs text-default z-50 whitespace-nowrap transition-all duration-150 ease-out',
     ];
     ```
   - Upgrade `.chart-tooltip-title`:
     ```ts
     [
       'chart-tooltip-title',
       'text-[11px] font-semibold text-muted tracking-wider uppercase pb-1.5 mb-1.5 border-b border-default/20 opacity-80',
     ];
     ```
   - Upgrade `.chart-tooltip-swatch`:
     ```ts
     [
       'chart-tooltip-swatch',
       'w-2 h-2 rounded-full ring-2 ring-current/25 shrink-0',
     ];
     ```
   - Upgrade `.chart-tooltip-value`:
     ```ts
     [
       'chart-tooltip-value',
       'font-semibold font-mono text-default tabular-nums ml-auto',
     ];
     ```
2. In [`packages/nuicss/src/styles/theme.css`](file:///d:/stack/packages/nuicss/src/styles/theme.css):
   - Add specular hairline reflection and layered ambient shadow:
     ```css
     .chart-tooltip {
       box-shadow: 0 16px 36px -6px oklch(0 0 0 / 0.35), inset 0 1px 0 0 oklch(1
               0 0 / 0.15);
     }
     [data-theme='light'] .chart-tooltip,
     .light .chart-tooltip {
       box-shadow: 0 12px 30px -4px oklch(0 0 0 / 0.12), inset 0 1px 0 0 oklch(1
               0 0 / 0.6);
     }
     ```
3. Rebuild `nuicss` via `pnpm nx run nuicss:build` so changes compile into distribution bundles.

### Step 2: Tooltip Smart Collision & Boundary Guard in `@nofinite/charts`

1. In [`packages/charts/src/core/tooltip.ts`](file:///d:/stack/packages/charts/src/core/tooltip.ts):
   - In `positionTooltip`, configure Floating-UI to prioritize `'bottom'` fallback placement or smart offset if point Y coordinate is within 65px of the container's top boundary.
   - Add padding boundaries to `shift({ padding: 12, limiter: limitShift() })` to prevent overflowing outside the chart canvas.
2. In [`packages/charts/src/react/useChartTooltip.ts`](file:///d:/stack/packages/charts/src/react/useChartTooltip.ts):
   - Ensure `positionTooltip` receives the container reference so boundary calculations are pinned to the chart widget.

### Step 3: Zero-Overflow Flex Column Layout for Legends

1. In [`AreaChart.tsx`](file:///d:/stack/packages/charts/src/react/AreaChart.tsx), [`LineChart.tsx`](file:///d:/stack/packages/charts/src/react/LineChart.tsx), [`BarChart.tsx`](file:///d:/stack/packages/charts/src/react/BarChart.tsx), [`ScatterChart.tsx`](file:///d:/stack/packages/charts/src/react/ScatterChart.tsx):
   - Add `legendPosition?: 'top' | 'bottom'` prop (default `'bottom'`).
   - Wrap chart container in `flex flex-col`:
     ```tsx
     <div className="chart-container nui-chart-container relative w-full flex flex-col select-none ..." style={{ height }}>
       {showLegend && legendPosition === 'top' && <ChartLegend ... />}
       <div className="chart-plot-wrapper relative w-full flex-1 min-h-0">
         <svg viewBox={`0 0 ${width} ${plotHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
           ...
         </svg>
       </div>
       {showLegend && legendPosition === 'bottom' && <ChartLegend ... />}
     </div>
     ```
   - Dynamically calculate SVG `plotHeight` in `useChartDimensions` (or subtract legend height `~36px` when `showLegend` is active), ensuring the total height matches `props.height` with **zero bottom-border overflow**.

### Step 4: Horizontal Bar Adaptive Left Margin & Ellipsis

1. In [`packages/charts/src/core/math.ts`](file:///d:/stack/packages/charts/src/core/math.ts):
   - In `calculateHorizontalBarLayout` and category margin calculation:
     - Measure max category label length (`maxLabelLength = Math.max(...data.map(d => String(d.label || '').length))`).
     - Adaptively scale `margin.left = Math.max(margin.left, Math.min(innerWidth * 0.42, maxLabelLength * 7.5 + 24))`.
     - For labels exceeding available width, cleanly truncate with ellipsis (`…`) and attach SVG `<title>` or tooltip for hover accessibility.

### Step 5: Axis Origin Collision Elimination

1. In [`packages/charts/src/core/axis.ts`](file:///d:/stack/packages/charts/src/core/axis.ts) and React chart axis generators:
   - When mapping X-axis ticks, check proximity to the origin coordinate:
     ```ts
     // Suppress or offset the first tick if within 12px of the Y-axis zero tick
     if (Math.abs(x - 0) < 12 && showAxes) {
       // Offset textAnchor or suppress to avoid smudge
     }
     ```

---

## 4. Affected Files & Modules

| File                                                                                                                  | Purpose of Change                                                  |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| [`packages/nuicss/src/shortcuts/widgets.ts`](file:///d:/stack/packages/nuicss/src/shortcuts/widgets.ts)               | Upstream glassmorphism superclasses (`chart-tooltip*`)             |
| [`packages/nuicss/src/styles/theme.css`](file:///d:/stack/packages/nuicss/src/styles/theme.css)                       | Specular hairline glass reflection and ambient shadow tokens       |
| [`packages/charts/src/core/tooltip.ts`](file:///d:/stack/packages/charts/src/core/tooltip.ts)                         | Floating-UI boundary, auto-flip near top edge, markup enhancements |
| [`packages/charts/src/react/useChartTooltip.ts`](file:///d:/stack/packages/charts/src/react/useChartTooltip.ts)       | Connect container boundary to positionTooltip                      |
| [`packages/charts/src/react/AreaChart.tsx`](file:///d:/stack/packages/charts/src/react/AreaChart.tsx)                 | Flex column layout, `legendPosition` prop, zero overflow           |
| [`packages/charts/src/react/LineChart.tsx`](file:///d:/stack/packages/charts/src/react/LineChart.tsx)                 | Flex column layout, `legendPosition` prop, zero overflow           |
| [`packages/charts/src/react/BarChart.tsx`](file:///d:/stack/packages/charts/src/react/BarChart.tsx)                   | Flex column layout, `legendPosition` prop, zero overflow           |
| [`packages/charts/src/react/ScatterChart.tsx`](file:///d:/stack/packages/charts/src/react/ScatterChart.tsx)           | Flex column layout, `legendPosition` prop, zero overflow           |
| [`packages/charts/src/core/math.ts`](file:///d:/stack/packages/charts/src/core/math.ts)                               | Horizontal bar adaptive left margin & label clipping fix           |
| [`packages/charts/src/core/axis.ts`](file:///d:/stack/packages/charts/src/core/axis.ts)                               | Origin $(0, 0)$ tick collision suppression                         |
| [`packages/charts/src/react/charts.react.test.tsx`](file:///d:/stack/packages/charts/src/react/charts.react.test.tsx) | Update unit tests to verify `legendPosition` and flex plot wrapper |

---

## 5. Dependencies & Alternatives Considered

- **Dependencies:** Zero new external dependencies. Utilizes existing `@floating-ui/dom`, `@nofinite/nuicss`, and standard SVG/CSS primitives.
- **Alternatives Considered:**
  - _Hardcoding CSS directly in React components:_ Rejected per constitutional rule **The Zero Downstream CSS Invariant** and **Root-Cause Upstream Fix Rule**. Styling belongs in `@nofinite/nuicss`.
  - _Rendering Tooltip in `document.body` Portal:_ Floating-UI inside the relative chart container keeps self-contained isolation without z-index collisions in complex dashboard layouts. With smart boundary flipping, portal is unnecessary.

---

## 6. Risks & Security Considerations

- **Risks:** Modifying `useChartDimensions` and plot layout must preserve exact coordinate synchronization with active point hover detection (`handlePointerMove`). Verified via existing unit tests and Playwright touch/hover scripts.
- **Security:** Tooltip HTML sanitization remains intact; all values are metric numbers or sanitized strings. Zero XSS surface.

---

## 7. Verification Strategy

1. **Build Verification:**
   - Run `pnpm nx build nuicss` to compile CSS and CDN assets.
   - Run `pnpm nx build charts` to compile ESM, CJS, and `.d.ts` declarations.
2. **Lint & Unit Tests:**
   - Run `npx eslint packages/charts` (must maintain 0 errors, 0 warnings).
   - Run `npx vitest run packages/charts` (all tests passing).
3. **Visual & DOM Ground Truth Verification (Playwright):**
   - Run Playwright test script (`temp/verify-glass-and-layout.mjs`).
   - Capture high-resolution screenshots in `temp/` of:
     - Active tooltip in Dark Mode (confirm frosted glass, specular highlight, no clipped header).
     - Active tooltip in Light Mode (confirm frosted glass, specular highlight, no clipped header).
     - Card container with Legend (confirm 0px overflow past bottom card border).
     - Horizontal Bar Chart (confirm long labels up to 40 chars are completely readable and unclipped).
     - Origin $(0, 0)$ corner (confirm zero tick collision).
4. **Git Commit Safety Checkpoint:**
   - Commit changes to `dev` branch once fully verified.
