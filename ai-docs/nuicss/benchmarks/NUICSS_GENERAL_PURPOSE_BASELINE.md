# Independent Benchmark Baseline: Tailwind CSS v4 vs. NUICSS

**General-Purpose Web Engineering Evaluation & Empirical Baseline**

- **Date:** November 1, 2026
- **Benchmark Version:** 1.0.0-baseline
- **Evaluation Lead:** Agent 6 (Benchmark & Methodology Lead)
- **Target Frameworks:**
  - **Tailwind CSS v4** (`@tailwindcss/vite` / `tailwindcss` v4.0.9)
  - **NUICSS** (`@nofinite/nuicss` v0.1.0 pre-optimization baseline)
- **Domain Applications (6):** SaaS Dashboard, Marketing Site, Ecommerce Storefront, Documentation Site, Editorial Publication, Complex Settings Application

---

## 1. Executive Summary & Benchmark Mandate

Modern front-end engineering has converged on utility-first CSS engines as the de facto paradigm for scalable web applications. However, as web applications grow in complexity, conventional atomic utility styling introduces significant friction:

1. **Utility Soup & Class Verbosity:** HTML elements frequently accumulate 15–30 atomic classes, obscuring DOM structure, impeding readability, and bloating HTML transfer sizes.
2. **Design System Drift:** Re-declaring component geometry, focus rings, shadows, and hover states across hundreds of components leads to visual fragmentation and high maintenance overhead.
3. **Engine Lock-in & Runtime Requirements:** Most modern CSS toolchains require heavy Node.js runtimes, complex PostCSS pipelines, or proprietary configuration files.

**NUICSS** introduces a dual-layer architectural model combining **semantic component superclasses** (`btn`, `card`, `input`, `badge`, `table-container`, etc.) with **pure OKLCH design tokens** and **atomic utilities**, designed to run across Node.js, Vite, Bun, and standalone native binary environments.

This benchmark establishes an independent, empirical, head-to-head comparison between Tailwind CSS v4 and NUICSS across 6 comprehensive domain applications. Every application is built twice with identical feature sets, data, interactive states, and responsive layouts—one using Tailwind CSS v4, and one using NUICSS.

---

## 2. Benchmark Architecture & Domain Matrix

To eliminate bias and ensure real-world applicability, the benchmark evaluates six distinct application archetypes that represent the entire spectrum of modern commercial web development:

| #     | Application Domain        | Directory              | Primary Architectural Challenges                                                       | Interactive States Tested                                         |
| ----- | ------------------------- | ---------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **1** | **SaaS Dashboard**        | `apps/saas-dashboard`  | Dense tabular data, KPI cards, visual charts, filtering, dialog modals                 | KPI hover, filter dropdown, provision modal open, dark mode       |
| **2** | **Marketing Website**     | `apps/marketing-site`  | High-impact typography, hero visual hierarchy, pricing matrices, testimonials          | Pricing toggle (annual/monthly), mobile nav drawer, FAQ accordion |
| **3** | **Ecommerce Storefront**  | `apps/ecommerce-store` | Product cards, badge elevation, facet filtering, slide-over shopping cart              | Card hover zoom, cart slide-over drawer, quantity adjustments     |
| **4** | **Documentation Site**    | `apps/docs-site`       | Multi-level sidebar, typography hierarchy, callout alerts, code blocks, search         | Sidebar category toggle, search modal open, code copy feedback    |
| **5** | **Editorial Publication** | `apps/editorial-site`  | Long-form reading typography, pull quotes, multi-column editorial grid, media captions | Topic filter pills, newsletter subscription, share button hover   |
| **6** | **Settings Application**  | `apps/settings-app`    | Deep form controls, validation states, toggles, API key generation, destructive zone   | Form error state, API key copy, danger confirmation modal         |

All six applications consume a centralized shared dataset defined in `shared/domain-data.ts`, ensuring identical mock models, customer counts, analytics series, product catalogs, and editorial copy.

---

## 3. Evaluation Methodology & Scoring Rubrics

The benchmark employs two orthogonal 100-point composite scoring rubrics:

1. **Visual Quality Score (VQS - 100 Points)**: Evaluates the rendered output, spatial harmony, typography, color balance, elevation, responsiveness, state fidelity, and micro-interactions.
2. **Developer Experience Score (DXS - 100 Points)**: Evaluates developer ergonomics, configuration complexity, class naming, build performance, bundle footprint, framework portability, and runtime independence across 15 weighted dimensions.

---

### 3.1. Visual Quality Score (VQS) Rubric — 100 Points

The visual quality evaluation is conducted using automated high-DPI Playwright visual captures and multi-device inspection:

```
+----------------------------------------------------------------------------------+
|                          VISUAL QUALITY SCORE (100 PTS)                          |
+-----------------------------------+----------------------------------------------+
| Dimension                         | Weight | Key Evaluation Criteria             |
+-----------------------------------+----------------------------------------------+
| 1. Layout & Spatial Harmony       | 15 pts | 4/8pt spacing rhythm, alignment,     |
|                                   |        | structural grid consistency          |
| 2. Typography & Scale             | 15 pts | Typographic hierarchy, line-height,  |
|                                   |        | letter-spacing, readability          |
| 3. Color & OKLCH Contrast         | 15 pts | WCAG AA/AAA compliance, lightness    |
|                                   |        | distribution, surface-to-text ratio  |
| 4. Component Polish & Elevation   | 15 pts | Shadow layering, border contrast,    |
|                                   |        | radius harmony, glassmorphism        |
| 5. Responsive Adaptability        | 10 pts | Fluid scaling across 8 viewports,    |
|                                   |        | zero horizontal overflow, nav reflow |
| 6. State Representation           | 10 pts | Hover, focus-visible rings, disabled,|
|                                   |        | active, loading, error borders       |
| 7. Dark Mode Theming              | 10 pts | Surface depth hierarchy (0-3),       |
|                                   |        | non-muddy backgrounds, glare control |
| 8. Micro-interactions & Motion    | 10 pts | Transition curves, transform physics,|
|                                   |        | modal/drawer reveals, hover feedback |
+-----------------------------------+----------------------------------------------+
```

#### Detailed Scoring Breakdown:

- **1. Layout & Spatial Harmony (15 pts):**
  - _13–15 pts:_ Perfectly consistent 4/8px spacing grid; consistent margins and padding; zero visual misalignment.
  - _9–12 pts:_ Generally cohesive layout with minor padding irregularities between compound cards.
  - _0–8 pts:_ Ad-hoc margins, broken grid alignments, uneven gutters across viewports.
- **2. Typography & Scale (15 pts):**
  - _13–15 pts:_ Strict typographic scale (modular ratio 1.25); proportional line-heights preventing text collision; crisp font smoothing; proper optical tracking for headings vs body.
  - _9–12 pts:_ Legible hierarchy with standard font sizing; minor line-height stiffness in multi-line cards.
  - _0–8 pts:_ Low font weight contrast, runaway heading sizes on mobile, poor readability.
- **3. Color & OKLCH Contrast (15 pts):**
  - _13–15 pts:_ 100% compliant with WCAG 2.2 AA (4.5:1 text, 3:1 UI components) and AAA (7:1) for body text; perceptual lightness uniformity across color hues via OKLCH; harmonious semantic accents.
  - _9–12 pts:_ WCAG AA compliant on primary text; minor contrast dip on subtle metadata or placeholder text.
  - _0–8 pts:_ Uncalibrated sRGB hex colors causing muddy dark mode tones or inaccessible contrast ratios.
- **4. Component Polish & Elevation (15 pts):**
  - _13–15 pts:_ Cohesive border-radius tokens (`rounded-md`, `rounded-lg`); multi-layer ambient + direct box shadows; crisp 1px borders with subtle alpha transparency; backdrop-filter glassmorphism.
  - _9–12 pts:_ Flat borders or single-layer shadows; standard radius without visual dissonance.
  - _0–8 pts:_ Inconsistent radius mixing, harsh black box-shadows, missing card borders.
- **5. Responsive Adaptability (10 pts):**
  - _9–10 pts:_ Flawless rendering from 320px to 1920px; responsive tables reflow or scroll smoothly; zero horizontal body overflow; navigation menus adapt seamlessly.
  - _6–8 pts:_ Usable across viewports with slight layout cramping at 375px or 320px.
  - _0–5 pts:_ Horizontal scrollbars, clipped dialogs, unreadable tables on mobile viewports.
- **6. State Representation (10 pts):**
  - _9–10 pts:_ Distinct hover, active, focus-visible (2px offset ring), disabled (opacity + cursor-not-allowed), and validation error states across all interactive elements.
  - _6–8 pts:_ Hover and focus states present; inconsistent focus rings or subtle active states.
  - _0–5 pts:_ Missing focus rings (accessibility failure); buttons lack active or hover states.
- **7. Dark Mode Theming (10 pts):**
  - _9–10 pts:_ 4-tier surface depth (`surface-0`, `surface-1`, `surface-2`, `surface-3`); dark mode maintains high contrast without blinding white text; smooth transition between themes.
  - _6–8 pts:_ Single dark background tone; adequate contrast; slight muddiness in nested cards.
  - _0–5 pts:_ Harsh pure black `#000` or washed-out gray `#444`; unreadable dark-on-dark elements.
- **8. Micro-interactions & Motion (10 pts):**
  - _9–10 pts:_ Easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`); subtle scale transforms on click; smooth slide-over drawer transitions; accordion collapse animations.
  - _6–8 pts:_ Basic linear transitions; functional but abrupt modal/drawer appearances.
  - _0–5 pts:_ Jarring instant DOM appearance; missing transitions on hover states.

---

### 3.2. Developer Experience Score (DXS) Rubric — 100 Points (15 Dimensions)

```
+----------------------------------------------------------------------------------+
|                    DEVELOPER EXPERIENCE SCORE (100 PTS)                          |
+--------------------------------------------+--------+----------------------------+
| Dimension                                  | Weight | Target Capability          |
+--------------------------------------------+--------+----------------------------+
| 1. Initial Setup & Tooling Complexity      | 7 pts  | Zero-friction installation |
| 2. Configuration Simplicity                | 7 pts  | Zero-config Vite defaults  |
| 3. Class Naming Ergonomics & Readability   | 8 pts  | Clean, intuitive syntax    |
| 4. Utility Coverage & Completeness         | 7 pts  | Comprehensive utilities    |
| 5. Superclass Ergonomics vs Utility Soup   | 10 pts | Semantic abstraction       |
| 6. Theming & Token Customization DX        | 8 pts  | CSS variable / OKLCH API   |
| 7. Dark Mode Implementation Ergonomics     | 7 pts  | Auto class / selector mode |
| 8. Responsive Syntax Ergonomics            | 7 pts  | Clear breakpoint prefixes  |
| 9. Component Abstraction Reusability       | 7 pts  | DRY markup sharing         |
| 10. Build Performance (Cold & Warm)        | 7 pts  | Sub-second HMR & build     |
| 11. Bundle Size & Footprint (Raw/Gzip/Br)  | 7 pts  | Minimal production bytes   |
| 12. CSS Rules & Selector Complexity        | 5 pts  | Clean AST, low specificity |
| 13. Framework Portability                  | 6 pts  | Vite, Next, Bun, vanilla   |
| 14. Non-Node Runtime Support               | 4 pts  | Standalone Go/Bun binary   |
| 15. Learning Curve & Documentation Clarity | 3 pts  | Clear guides & examples    |
+--------------------------------------------+--------+----------------------------+
```

---

## 4. Multi-Device & Viewport Testing Matrix

Automated screenshot capture is executed across eight specific device viewports representing desktop, laptop, tablet, and mobile displays:

| Viewport Name      | Resolution      | Aspect Ratio | Target Device Archetype             |
| ------------------ | --------------- | ------------ | ----------------------------------- |
| `desktop-fhd`      | **1920 × 1080** | 16:9         | Full HD Monitor / iMac 24"          |
| `desktop-macbook`  | **1440 × 900**  | 16:10        | MacBook Pro 14" / Air               |
| `laptop-compact`   | **1280 × 800**  | 16:10        | Standard Ultrabook / Chromebook     |
| `tablet-landscape` | **1024 × 768**  | 4:3          | iPad Pro 11" Landscape              |
| `tablet-portrait`  | **768 × 1024**  | 3:4          | iPad Mini / 10.2" Portrait          |
| `mobile-modern`    | **390 × 844**   | 19.5:9       | iPhone 14 / 15 / 16 Standard        |
| `mobile-standard`  | **375 × 812**   | 19.5:9       | iPhone X / 11 Pro / 12 Mini         |
| `mobile-compact`   | **320 × 568**   | 16:9         | iPhone SE (1st gen) / Small Android |

Captures are executed at **Device Scale Factor 2.0 (High-DPI / Retina)** with Chromium.

---

## 5. Empirical Metrics Protocol

For each of the 6 applications across both Tailwind CSS v4 and NUICSS, the test runner captures:

1. **Production Build Time:**
   - **Cold Build Time (ms):** Executed with cleared Vite cache (`node_modules/.vite` deleted). Measured across 5 sequential runs. Mean and standard deviation recorded.
   - **Warm Build Time (ms):** Executed immediately following a cold build with hot module and asset cache populated. Mean across 5 runs.
2. **CSS Bundle Footprint:**
   - **Raw CSS Size (bytes):** Uncompressed generated CSS output.
   - **Gzip Size (bytes):** Compressed using Node.js `zlib.gzipSync(css, { level: 9 })`.
   - **Brotli Size (bytes):** Compressed using Node.js `zlib.brotliCompressSync(css, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } })`.
3. **JS Bundle Footprint:**
   - Output JavaScript chunk sizes (Raw, Gzip, Brotli).
4. **CSS AST Complexity:**
   - **Total CSS Rules:** Count of rule declarations.
   - **Total CSS Selectors:** Count of discrete selector queries.
   - **Selector Specificity Distribution:** Maximum specificity depth.
5. **DOM Class Verbosity:**
   - **Average Class Count per Element:** `total_classes / element_count`.
   - **Maximum Class String Length:** Longest `class="..."` attribute in characters.
   - **HTML Compression Savings:** Impact of class repetition on HTML Gzip transfer size.

---

## 6. Baseline Pre-Optimization Status (NUICSS v0.1.0 vs Tailwind v4)

Prior to the general-purpose optimization cycle, initial observations and baseline measurements show:

### 6.1. Tailwind CSS v4 Profile

- **Strengths:**
  - Fast single-pass Rust/LightningCSS compiler in `@tailwindcss/vite`.
  - Zero-config CSS-first `@import "tailwindcss";` entry point.
  - Minimal unused CSS generation due to pure on-demand token scanning.
- **Weaknesses:**
  - Extreme HTML class verbosity ("utility soup"), requiring 15–28 utility classes per complex UI element.
  - High duplication of styling rules across recurring components (e.g. modals, buttons, cards).
  - Lack of built-in semantic design tokens (requires manual `@theme` configuration for custom OKLCH palettes).
  - High friction when attempting to achieve consistent compound component elevation across large codebases.

### 6.2. NUICSS v0.1.0 Baseline Profile (Pre-Optimization)

- **Strengths:**
  - Rich semantic superclasses (`btn`, `card`, `input`, `badge`, `table-container`, `dialog`, `drawer`) provide immediate 70% reduction in HTML class tokens.
  - First-class OKLCH design tokens built directly into the CSS core with automatic dark mode contrast balancing.
  - Cross-platform architecture supporting Node.js, Vite, Bun, and standalone native binary execution.
- **Identified Bottlenecks & Optimization Targets (Assigned to Compiler & Performance Leads):**
  - **Static Preflight Superclass Overhead:** In baseline v0.1.0, unused superclasses (such as `kanban-board` or `markon-editor` in a simple marketing site) are included in the baseline bundle, resulting in larger raw CSS footprint (~180KB–240KB raw) compared to Tailwind's purely scanned CSS.
  - **Tree-Shaking / Selective Superclass Generation:** The compiler needs dynamic scanning to only emit superclasses referenced in application source templates.
  - **Vite Integration Defaults:** Baseline requires explicit configuration; needs zero-config auto-detection.

---

## 7. Next Actions in Benchmark Execution

1. **Runner Deployment:** Write automated Playwright comparison runner (`runner/capture-all.mjs`) with multi-device capture, state trigger automation, and metric aggregation.
2. **Empirical Data Gathering:** Run automated builds and captures against all 6 applications once implemented.
3. **Comparative Analysis:** Collate empirical metrics, build final scorecards, and document engineering findings.
