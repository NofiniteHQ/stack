# NUICSS Engineering Changelog

**Record of Architectural Enhancements, Performance Optimizations, and Bug Fixes**

- **Date:** November 1, 2026
- **Release Version:** `v3.2.0`
- **Scope:** `@nofinite/nuicss`, `@nofinite/nuicss-cli`, and Canonical Documentation
- **Target Location:** `D:\stack\temp\general-purpose-benchmark\reports\NUICSS_ENGINEERING_CHANGELOG.md`

---

## 1. Summary of Changes

This changelog records the specific engineering improvements implemented in `@nofinite/nuicss` during the General-Purpose Benchmark assignment. All modifications adhere strictly to the **Zero Downstream CSS Invariant**, the **Single Source of Truth for Design Tokens**, and framework-independent public integration contracts.

---

## 2. Compiler & Bundle Size Optimizations

### 2.1. Architectural Separation of Design Tokens from Component Preflights

- **Affected Files:**
  - `packages/nuicss/src/styles/theme.css`
  - `packages/nuicss/src/styles/components/charts.css` (new)
  - `packages/nuicss/src/styles/components/kanban.css` (new)
  - `packages/nuicss/src/styles/components/markon.css` (new)
  - `packages/nuicss/src/styles/components/media-bridge.css` (new)
  - `packages/nuicss/src/styles/components/table.css` (new)
  - `packages/nuicss/src/plugin/preset.ts`
- **Problem:**
  - `theme.css` was previously 73,796 bytes (2,071 lines) and bundled complex domain styles (`.markon-*`, `.kanban-*`, `.table-container`, `.chart-*`, `.nui-vidstack-*`) directly into the base preflight layer (`@layer base`). Every consumer paid an unavoidable ~54.6 kB penalty, even for a minimal single-button page.
- **Solution:**
  - Pruned `theme.css` down to pure design tokens (`:root`, `[data-theme="dark"]`, OKLCH primitive scales, fluid typography, fluid spacing, shadow systems, transitions, and accessibility resets).
  - Reduced `theme.css` from **73.8 kB** down to **19.2 kB** (**-74.0% raw, -62.7% gzip**).
  - Extracted domain component styles into dedicated files under `src/styles/components/`.
  - Added dynamic UnoCSS rules in `src/plugin/preset.ts` returning raw CSS strings into `@layer components` **only when referenced**:
    ```typescript
    [/^__table-styles$|^(?:nui-)?table-container$/, () => tableCss, { layer: 'components' }],
    [/^(?:nui-)?kanban(?:-[a-z0-9-]+)?$/, () => kanbanCss, { layer: 'components' }],
    [/^(?:nui-)?markon(?:-[a-z0-9-]+)?$|^tiptap-wrapper$|^editor-content$|^prose-markon$/, () => markonCss, { layer: 'components' }],
    [/^(?:nui-)?chart(?:-[a-z0-9-]+)?$|^(?:nui-)?charts?$/, () => chartsCss, { layer: 'components' }],
    [/^(?:nui-)?(?:vidstack-player|vidstack-audio-player|media-container|media-player)$/, () => mediaBridgeCss, { layer: 'components' }],
    ```
- **Verification:**
  - Unreferenced component styles emit **0 bytes**.
  - `dist/index.css` reduced from **57.5 kB** to **15.2 kB** (**-73.5% raw, -62.6% gzip**).
  - Minimal consumer (`btn btn-primary`) CSS reduced from **61.1 kB** to **19.8 kB** (**-67.5%**).

---

## 3. Bundler & Developer Experience Enhancements

### 3.1. Zero-Config Vite Integration Defaults

- **Affected File:** `packages/nuicss/src/plugin/vite.ts`
- **Problem:**
  - Omitting a `nuicss.config.ts` or `nuicss.config.js` file caused Vite to run UnoCSS with empty filesystem glob patterns, preventing utility generation from unimported components and HTML templates.
- **Solution:**
  - Updated `nuicss()` plugin in `packages/nuicss/src/plugin/vite.ts` to detect whether a user configuration file exists.
  - When no config file is detected:
    - Automatically injects default content glob patterns (`src/**/*.{html,js,ts,jsx,tsx,vue,svelte}`).
    - Configures default pipeline regexes covering JSX, TSX, Svelte, Vue, Astro, and `@nofinite/nui` node_modules.
    - Injects default `nuicssPreset()`.
- **Verification:**
  - Tested in an isolated minimal directory (`temp/zero-config-test/`) with zero config files. Built in **318ms** with all 19/19 assertions passing.

### 3.2. Headless Modal Backdrop & Dialog Backdrop Shortcuts

- **Affected File:** `packages/nuicss/src/shortcuts/overlays.ts`
- **Problem:**
  - Modern headless modal libraries (Radix Dialog, React Aria, floating overlays) render modal backdrops as independent `<div>` elements outside the dialog container, where native `<dialog>::backdrop` pseudo-styles do not apply.
- **Solution:**
  - Added `modal-backdrop` and `dialog-backdrop` shortcuts:
    ```typescript
    ['modal-backdrop', 'fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-opacity'],
    ['dialog-backdrop', 'fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-opacity'],
    ```
- **Verification:**
  - Tested across all modal workflows in SaaS Dashboard, Ecommerce Store, and Settings Application with consistent glassmorphism.

### 3.3. Table Container Shortcut Enhancement

- **Affected File:** `packages/nuicss/src/shortcuts/widgets.ts`
- **Problem:**
  - `table-container` required an internal marker to ensure dynamic UnoCSS component rules triggered table border and zebra stripe descendant rules.
- **Solution:**
  - Linked `table-container` shortcut to trigger internal marker `__table-styles` without preflight overhead.

---

## 4. Build Tooling & Standalone Artifacts

### 4.1. Standalone & CDN Distribution Pipeline Updates

- **Affected File:** `packages/nuicss/build-cdn.js`
- **Problem:**
  - Standalone CSS bundles needed to continue emitting modular subpaths (`./kanban.css`, `./markon.css`, `./charts.css`, `./media.css`, `./styles.css`) after `theme.css` was modularized.
- **Solution:**
  - Updated `build-cdn.js` to read modular component files and bundle them cleanly into their respective standalone distributions.
  - Updated the in-browser CDN runtime bundle (`dist/index.global.js`), reducing its size from **399.9 kB** to **358.0 kB** (**-41.8 kB / -10.5%**).

---

## 5. Documentation & Ecosystem Alignment

### 5.1. Authoritative Tailwind-to-NUICSS Migration Guide

- **Affected File:** `docs/nuicss/guides/tailwind-migration.md` (new)
- **Scope:**
  - 387-line comprehensive migration guide covering architectural differences, side-by-side class conversion tables, OKLCH token mapping, and automated migration strategies.

### 5.2. Installation & Quickstart Guide

- **Affected File:** `docs/nuicss/installation.md` (new)
- **Scope:**
  - Clear, copy-paste setup recipes for Vite, Next.js App Router, PostCSS, Standalone Bun CLI, and Browser CDN.

### 5.3. Documentation Encoding & Content Remediation

- **Affected Files:**
  - `docs/nuicss/theming.md`
  - `docs/nuicss/superclasses.md`
  - `docs/nuicss/migration.md`
  - `docs/nuicss/index.md`
  - `docs/nuicss/ide-setup.md`
- **Scope:**
  - Remediated UTF-8 mojibake characters.
  - Aligned all documentation with official brand names (**NUICSS**, **NUI**, **Nofinite Charts**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Media**, **Nofinite Locale**, **Nofinite Utils**).

---

## 6. Test Suite & Verification Matrix

| Test Suite                       |     Files     |     Tests      | Execution Time |      Status      |
| :------------------------------- | :-----------: | :------------: | :------------: | :--------------: |
| `@nofinite/nuicss` Vitest Core   |    6 files    |    55 tests    |     1.96s      | ✅ Passed (100%) |
| `@nofinite/nuicss-cli` CLI Tests |    2 files    |    8 tests     |     8.94s      | ✅ Passed (100%) |
| Zero-Config Standalone Suite     |    1 file     | 19 assertions  |     318ms      | ✅ Passed (100%) |
| Playwright Multi-Viewport & Axe  |   6 domains   |   96 audits    |      4.2m      | ✅ Passed (100%) |
| **TOTAL VERIFICATION**           | **15 suites** | **178 checks** |       —        |  **100% GREEN**  |
