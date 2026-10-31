# NUICSS Improvement Backlog & Engineering Roadmap

**Document Version:** 1.0.0  
**Date:** November 1, 2026  
**Origin:** Post-Tailwind Visual & Developer Experience Benchmark  
**Scope:** `@nofinite/nuicss` and `@nofinite/nuicss-cli`

---

## 1. Overview & Prioritization Matrix

Based on the empirical findings of the **NUICSS vs. Tailwind CSS Benchmark**, NUICSS is certified as an enterprise-grade styling engine capable of matching and exceeding Tailwind's visual aesthetics and authoring DX.

This backlog prioritizes concrete, high-impact improvements to further optimize compilation size, zero-config onboarding, and cross-framework developer ergonomics.

| Priority |     ID     | Initiative                                       | Category          | Target Release | Expected Impact                                                  |
| :------: | :--------: | :----------------------------------------------- | :---------------- | :------------: | :--------------------------------------------------------------- |
|  **P0**  | **IMP-01** | Zero-Config Vite Integration Defaults            | DX Ergonomics     |     v1.1.0     | Eliminates mandatory `nuicss.config.ts`; enables 1-line setup.   |
|  **P0**  | **IMP-02** | Superclass Selective Tree-Shaking                | Bundle Size       |     v1.1.0     | Reduces base CSS bundle by ~15-20 kB (~25% reduction).           |
|  **P1**  | **IMP-03** | Tailwind-to-NUICSS Migration Guide & Cheat Sheet | Documentation     |     v1.1.0     | Lowers cognitive barrier for developers switching from Tailwind. |
|  **P1**  | **IMP-04** | Dual CJS/ESM Export Hardening                    | Build Integration |     v1.1.0     | Guarantees seamless interop across older CommonJS build tools.   |
|  **P2**  | **IMP-05** | Native CLI Watch Mode Performance Calibration    | CLI Tooling       |     v1.2.0     | Enhances file-watching speed in standalone `nuicss.exe` binary.  |
|  **P2**  | **IMP-06** | Interactive Theme Studio Palette Generator       | Ecosystem DX      |     v1.2.0     | Enables visual creation and export of custom OKLCH color themes. |

---

## 2. Detailed Improvement Specifications

### IMP-01: Zero-Config Vite Integration Defaults

- **Problem:** Currently, consumers must create `nuicss.config.ts` exporting `defineConfig({ preset: nuicssPreset() })` even when using 100% standard defaults.
- **Proposed Solution:** In `packages/nuicss/src/plugin/vite.ts`, if no user configuration file is detected at the project root, automatically initialize `nuicssPreset()` with sensible defaults (content scanning for `src/**/*.{html,js,ts,jsx,tsx,vue,svelte}`).
- **Files Affected:**
  - `packages/nuicss/src/plugin/vite.ts`
  - `packages/nuicss/src/plugin/config.ts`
- **Verification Strategy:** Create a fresh Vite app without `nuicss.config.ts`, import `nuicss()` in `vite.config.ts`, verify that utility classes and superclasses compile correctly.

---

### IMP-02: Superclass Selective Tree-Shaking

- **Problem:** NUICSS CSS output is 85.99 kB vs Tailwind's 63.33 kB. The extra size comes from embedding all superclass definitions (`table-container`, `modal-backdrop`, `modal-box`, `kanban-board`, `markon-editor`, etc.) in the preflight layer regardless of whether they are referenced in the app.
- **Proposed Solution:** Refactor `packages/nuicss/src/preset/superclasses/` into dynamic UnoCSS rules matching component identifiers (e.g., regex `^btn(-.*)?$`, `^card(-.*)?$`, `^modal(-.*)?$`). Only when a class name is encountered in source code will its corresponding CSS rules be generated and placed in `@layer components`.
- **Files Affected:**
  - `packages/nuicss/src/preset/rules.ts`
  - `packages/nuicss/src/preset/superclasses/index.ts`
- **Expected Outcome:** CSS bundle for typical dashboard applications drops from ~86 kB to ~65 kB, matching Tailwind CSS in raw output size.

---

### IMP-03: Tailwind-to-NUICSS Migration Guide & Cheat Sheet

- **Problem:** Developers accustomed to Tailwind frequently search for equivalents to verbose Tailwind clusters or DaisyUI classes.
- **Proposed Solution:** Author an authoritative, searchable reference guide in `docs/nuicss/guides/tailwind-migration.md`. Include a side-by-side mapping table:
  - `px-4 py-2 font-semibold bg-blue-600 rounded-lg text-white` $\rightarrow$ `btn btn-primary`
  - `border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm` $\rightarrow$ `card card-bordered p-6 shadow-sm`
  - `fixed inset-0 bg-black/50 backdrop-blur-sm z-50` $\rightarrow$ `modal-backdrop fixed inset-0 z-50 bg-overlay backdrop-blur-sm`
- **Files Affected:**
  - `docs/nuicss/guides/tailwind-migration.md`
  - `packages/nuicss/README.md`

---

### IMP-04: Dual CJS/ESM Export Hardening

- **Problem:** UnoCSS plugins and downstream PostCSS configurations can exhibit subtle differences when bundled as CommonJS (`.default` property resolution).
- **Proposed Solution:** Provide strict export maps in `packages/nuicss/package.json` with explicit `types`, `import`, and `require` fields for all entrypoints (`.`, `./vite`, `./postcss`, `./preset`), accompanied by automated Vitest interop tests.
- **Files Affected:**
  - `packages/nuicss/package.json`
  - `packages/nuicss/tsup.config.ts`

---

### IMP-05: Native CLI Watch Mode Performance Calibration

- **Problem:** The standalone Bun binary (`nuicss-windows-amd64.exe`) runs build tasks in 71ms. However, watching large directories with polling can consume additional CPU cycles on Windows.
- **Proposed Solution:** Integrate native Windows `ReadDirectoryChangesW` filesystem events in the CLI runner to achieve instant (<10ms) rebuilds upon file changes with zero CPU idle overhead.
- **Files Affected:**
  - `packages/nuicss-cli/src/cli.ts`
  - `packages/nuicss-cli/src/watch.ts`

---

### IMP-06: Interactive Theme Studio Palette Generator

- **Problem:** Creating custom OKLCH color themes currently requires manually writing CSS variables.
- **Proposed Solution:** Build an interactive visual color picker in `oss-docs` allowing users to select brand hues, visualize contrast compliance (WCAG AAA), and export ready-to-use `@layer base` CSS tokens or `nuicss.config.ts` themes.
- **Files Affected:**
  - `d:\oss-docs\src\app\theme-studio\`
