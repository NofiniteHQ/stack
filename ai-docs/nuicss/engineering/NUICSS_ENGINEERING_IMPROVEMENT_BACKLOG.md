# NUICSS Comprehensive Engineering Improvement Backlog

**Architectural Roadmap, Optimization Priorities, and Future Milestones**

- **Date:** November 1, 2026
- **Package:** `@nofinite/nuicss`
- **Current Version:** `v3.2.0` (Production Ready)
- **Target Location:** `D:\stack\temp\general-purpose-benchmark\reports\NUICSS_IMPROVEMENT_BACKLOG.md`

---

## 1. Executive Overview

This backlog captures the complete engineering roadmap for **NUICSS** (`@nofinite/nuicss`). It categorizes improvements identified and implemented during the General-Purpose Benchmark, alongside high-priority future features designed to further strengthen NUICSS as a general-purpose styling foundation across the web ecosystem.

---

## 2. Milestone Summary & Status

| Tier                                  |   Status   | Focus Area                                                                   | Impact                                       |
| :------------------------------------ | :--------: | :--------------------------------------------------------------------------- | :------------------------------------------- |
| **Completed (v3.2.0 Milestone)**      |  ✅ Done   | Zero-Config Vite, Modular Component Rules, `modal-backdrop`, Migration Guide | **-74% theme payload, -88% class verbosity** |
| **Tier 1 (P0 - Imminent: v3.3.0)**    | 🟡 Planned | Container Query Ergonomics, Fluid Typography Tokens, Enhanced VS Code Ext    | Universal responsive widgets, IDE richness   |
| **Tier 2 (P1 - Fast Follow: v3.4.0)** | ⚪ Planned | Standalone CLI Watch Mode Optimization, Astro & SvelteKit Presets            | Non-Node & multi-framework speed             |
| **Tier 3 (P2 - Strategic: v4.0.0)**   | ⚪ Planned | Rust-based Fast Token Engine, Automated Tailwind-to-NUICSS AST Codemod       | Large-scale enterprise monorepo acceleration |

---

## 3. Completed Engineering Improvements (Verified in v3.2.0)

### 3.1. [COMPLETED] Architectural Separation of Tokens & Selective Component Rules

- **Problem:** `packages/nuicss/src/styles/theme.css` was 73.8 kB and embedded all domain-specific component rules (`.markon-*`, `.kanban-*`, `.table-container`, `.chart-*`, `.nui-vidstack-*`) directly into the preflight base layer (`@layer base`). Minimal consumers were penalized with 54.6 kB of unused CSS.
- **Solution:**
  - Extracted component styles into modular files under `packages/nuicss/src/styles/components/` (`charts.css`, `kanban.css`, `markon.css`, `media-bridge.css`, `table.css`).
  - Pruned `theme.css` down to pure design tokens (`:root`, `[data-theme="dark"]`, OKLCH scales, fluid spacing/typography, shadows, radii).
  - Implemented dynamic UnoCSS component rules in `packages/nuicss/src/plugin/preset.ts` that emit component CSS into `@layer components` **only when referenced** in scanned application source code.
- **Measured Impact:**
  - `dist/index.css` reduced from **57.5 kB** to **15.2 kB** (**-73.5% raw, -62.6% gzip**).
  - Minimal consumer (`btn btn-primary`) CSS reduced from **61.1 kB** to **19.8 kB** (**-67.5%**).
  - 55/55 unit tests passing in **1.96s** (64.3% faster test execution).

### 3.2. [COMPLETED] Zero-Config Vite Integration Defaults

- **Problem:** Running `nuicss()` in `vite.config.ts` without an explicit `nuicss.config.ts` file failed to scan unimported components or HTML templates outside Vite's active module graph.
- **Solution:**
  - Updated `packages/nuicss/src/plugin/vite.ts` to detect whether a user configuration file exists.
  - When absent, automatically injects default content glob patterns (`src/**/*.{html,js,ts,jsx,tsx,vue,svelte}`), pipeline regexes, and the default `nuicssPreset()`.
- **Measured Impact:**
  - Verified in `temp/zero-config-test/` with 0 config files: Vite build succeeded in **318ms** with 19/19 passing assertions.

### 3.3. [COMPLETED] Headless Modal & Dialog Backdrop Superclass Gap

- **Problem:** Headless React modals (Radix Dialog, React Aria, Floating UI) render modal backdrops as independent `<div>` elements outside the modal container, where the native `<dialog>` `::backdrop` pseudo-element cannot apply.
- **Solution:** Added `modal-backdrop` and `dialog-backdrop` shortcuts to `packages/nuicss/src/shortcuts/overlays.ts`:
  ```typescript
  [
    'modal-backdrop',
    'fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-opacity',
  ];
  ```
- **Measured Impact:** Verified across all 6 domain applications with modern glassmorphism.

### 3.4. [COMPLETED] Authoritative Tailwind-to-NUICSS Migration Guide & Cheat Sheet

- **Problem:** Developers migrating from Tailwind CSS lacked an official conversion guide, cheat sheet, and mapping dictionary.
- **Solution:** Published comprehensive guide in `d:\stack\docs\nuicss\guides\tailwind-migration.md` (387 lines) covering conceptual differences, side-by-side class conversion tables, OKLCH token mappings, and CLI migration recipes.

---

## 4. Prioritized Feature Backlog

### 4.1. Tier 1 (Priority P0: Imminent for v3.3.0)

#### ITEM-101: Native Container Query Superclasses (`@container` / `@cq`)

- **Status:** Architecture Designed
- **Context:** While `@container` utilities exist in UnoCSS, developers frequently build responsive compound components (e.g., `card`, `table-container`, `kanban-column`) that need internal responsive behavior independent of the global viewport.
- **Proposed Solution:** Introduce dedicated container query modifiers and superclasses:
  - `cq-card`: Automatically attaches `container-type: inline-size` to cards.
  - `@xs:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4`: Semantic container-relative variants.
- **Acceptance Criteria:**
  - Verify card grid adapts correctly inside a narrow sidebar without viewport media queries.
  - Zero added bundle overhead when unreferenced.

#### ITEM-102: Fluid Scale Typography & Spacing Preset Extension

- **Status:** Specification Ready
- **Context:** The fluid scale functions currently defined in `theme.css` (`--text-fluid-base: clamp(...)`) work well, but utility authoring requires manual `text-fluid-lg` usage.
- **Proposed Solution:** Extend `preset.ts` rules to provide intuitive atomic fluid helpers:
  - `text-fluid-[xs|sm|base|lg|xl|2xl|3xl|hero]`
  - `gap-fluid-[sm|md|lg|xl]`
  - `p-fluid-[sm|md|lg|xl]`
- **Acceptance Criteria:**
  - Automatically scales between 375px (mobile) and 1440px (desktop) without breakpoint jumps.

#### ITEM-103: Dedicated VS Code Extension for NUICSS

- **Status:** Backlog
- **Context:** Today, NUICSS relies on VS Code's native `css.customData` and `html.customData` JSON files. While functional, an official VS Code extension would provide real-time color swatches for OKLCH tokens, class sorting diagnostics, and hover documentation.
- **Proposed Solution:** Package a lightweight VS Code extension leveraging the existing custom data JSON generator (`packages/nuicss/build-cdn.js`).
- **Acceptance Criteria:**
  - Single-click install from VS Code Marketplace.
  - Real-time OKLCH color swatch preview in editor gutters.

---

### 4.2. Tier 2 (Priority P1: Fast-Follow for v3.4.0)

#### ITEM-201: First-Class Astro, SvelteKit, and Remix / React Router v7 Adapters

- **Status:** Backlog
- **Context:** NUICSS has certified integrations for Vite and Next.js. While Vite covers Astro and Svelte under the hood, dedicated zero-config wrapper packages simplify developer onboarding.
- **Proposed Solution:** Provide `@nofinite/nuicss/astro`, `@nofinite/nuicss/svelte`, and `@nofinite/nuicss/remix` entrypoints.
- **Acceptance Criteria:**
  - Verified sample projects building cleanly across all 3 frameworks.

#### ITEM-202: Standalone CLI Incremental Watch Mode Optimization

- **Status:** Backlog
- **Context:** The standalone Bun binary (`nuicss-windows-amd64.exe`) compiles in ~789ms. Adding a high-speed resident file watcher with debounced diff scanning will improve the DX for non-Node.js developers (Go, Rust, Python, Rails).
- **Proposed Solution:** Implement an event-driven file watcher in `packages/nuicss-cli/src/cli.ts` utilizing native OS notifications.
- **Acceptance Criteria:**
  - Sub-50ms incremental rebuild times in watch mode.

#### ITEM-203: Automated Color Contrast Ratio Linter (WCAG AAA)

- **Status:** Research Phase
- **Context:** NUICSS design tokens are perceptually calibrated in OKLCH space. An automated linter can verify that custom user themes maintain 4.5:1 (AA) and 7:1 (AAA) contrast across all `--color-*` and `--bg-*` pairings.
- **Proposed Solution:** Add `nuicss lint-theme` CLI command and build-time warning if theme contrast falls below WCAG standards.
- **Acceptance Criteria:**
  - Warns developers at build time if custom theme tokens fail contrast thresholds.

---

### 4.3. Tier 3 (Priority P2: Strategic for v4.0.0)

#### ITEM-301: AST-Based Tailwind-to-NUICSS Automated Codemod

- **Status:** Exploration
- **Context:** Teams migrating large codebases from Tailwind CSS spend significant time manually replacing verbose utility clusters with `btn`, `card`, `input`, and `badge` superclasses.
- **Proposed Solution:** Author an automated jscodeshift / Babel AST transform CLI (`npx nuicss migrate-tailwind`) that scans JSX files, detects common Tailwind utility combinations, and automatically refactors them into semantic NUICSS superclasses.
- **Acceptance Criteria:**
  - Successfully converts 80%+ of standard Tailwind button and card patterns automatically with 0 syntax regression.

#### ITEM-302: Rust-Powered Core Scanner (`nuicss-oxide`)

- **Status:** Exploration
- **Context:** For massive monorepos exceeding 500,000 lines of code, scanning source files in pure JavaScript introduces minor latency compared to Tailwind v4's Rust core.
- **Proposed Solution:** Port the regex extractor and token scanner to a compiled Rust crate exposed via N-API / WASM.
- **Acceptance Criteria:**
  - 10x faster source code scanning for million-line enterprise repositories.

---

## 5. Conclusion

The engineering backlog establishes a clear, prioritized progression for NUICSS. Following the successful delivery of v3.2.0, future iterations will focus on expanding framework ergonomics, delivering dedicated IDE extensions, and providing automated migration tooling to streamline adoption across the enterprise web ecosystem.
