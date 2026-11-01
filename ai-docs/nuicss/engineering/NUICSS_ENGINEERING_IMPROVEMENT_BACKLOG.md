# NUICSS Comprehensive Engineering Improvement Backlog

**Architectural Roadmap, Optimization Priorities, and Future Milestones**

- **Date:** November 1, 2026
- **Package:** `@nofinite/nuicss`
- **Current Version:** `v3.2.0` (Production Hardened)
- **Status:** Active Governance Backlog

---

## 1. Executive Overview

This backlog captures the complete engineering roadmap for **NUICSS** (`@nofinite/nuicss`) and its CLI tooling (`@nofinite/nuicss-cli`). It records the completed hardening initiatives delivered during the Engineering Standards & Quality Hardening milestone and prioritizes upcoming features from P0 (Deployment Blockers) to P3 (Strategic Innovations).

---

## 2. Milestone Summary & Status

| Priority Tier                               |     Status     | Focus Area                                                                                                                                                                    | Impact                                                                                               |
| :------------------------------------------ | :------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Completed (Quality Hardening Milestone)** |  ✅ **Done**   | Standalone CLI CSS-aware minifier, 77-test correctness suite, multi-browser engine testing, organization-wide documentation standardization, 5 consumer integration fixtures. | **100% portable CLI minifier, zero DLL extraction, sibling doc architecture across 5 repositories.** |
| **Completed (v3.2.0 Baseline Milestone)**   |  ✅ **Done**   | Zero-Config Vite, Modular Component Rules, `modal-backdrop`, Tailwind Migration Guide.                                                                                        | **-74% theme payload, -88% class verbosity.**                                                        |
| **P0: Deployment Blockers**                 |  🟢 **None**   | _Zero production deployment blockers currently identified._ All high-priority issues closed and verified.                                                                     | Production ready for ecosystem adoption.                                                             |
| **P1: High-Priority Ergonomics**            | 🟡 **Planned** | Astro & SvelteKit Presets, Dedicated VS Code Extension, Standalone CLI Watch Mode.                                                                                            | Broad developer onboarding and non-Node.js CLI speed.                                                |
| **P2: Medium-Priority Enhancements**        | ⚪ **Planned** | Native Container Queries (`cq-*`), Fluid Typography Presets, Automated Theme Contrast Linter (WCAG AAA).                                                                      | Universal responsive widgets and automated compliance.                                               |
| **P3: Strategic Innovations**               | ⚪ **Planned** | AST-Based Tailwind-to-NUICSS Codemod, Rust-Powered Core Scanner (`nuicss-oxide`).                                                                                             | Enterprise monorepo acceleration and frictionless migration.                                         |

---

## 3. Completed Hardening Initiatives (November 2026 Milestone)

### 3.1. [COMPLETED] Standalone CLI CSS-Aware Minifier Engine

- **Objective:** Eliminate the `Cannot find module 'lightningcss-win32-x64-msvc'` runtime crash when invoking `nuicss compile --minify` in single-binary Bun executables (`bin/nuicss-windows-amd64.exe`).
- **Implementation:** Implemented a two-tier architecture in `packages/nuicss-cli/src/utils/minifier.ts` (695 lines). Tier 1 opportunistically delegates to host `lightningcss` if available; Tier 2 provides a zero-dependency, in-memory, state-machine CSS tokenizer and AST validator based on W3C CSS Syntax Level 3.
- **Verification:** Evaluated native addon extraction and rejected it due to `noexec` partitions, Windows AppLocker/WDAC blocks, and EDR false positives. Verified the embedded minifier across all 5 compiled standalone platform binaries (`windows-amd64`, `linux-amd64`, `linux-arm64`, `darwin-arm64`, `darwin-amd64`).
- **Affected Packages:** `@nofinite/nuicss-cli`.

### 3.2. [COMPLETED] Comprehensive Vitest Minifier Correctness Test Suite

- **Objective:** Guarantee that minification preserves strings, quotes, data URIs, custom properties, at-rules, keyframes, comments inside strings, and mandatory whitespace around math operators (`calc()`, `min()`, `max()`, `clamp()`).
- **Implementation:** Created `packages/nuicss-cli/src/utils/minifier.test.ts` with 73 targeted unit tests across 16 CSS syntax categories, plus 4 standalone CLI invocation tests.
- **Verification:** 77/77 tests passing in 4.57 seconds with 100% assertion success.
- **Affected Packages:** `@nofinite/nuicss-cli`.

### 3.3. [COMPLETED] Organization-Wide Repository Documentation Architecture Standard

- **Objective:** Establish a consistent documentation architecture across all Nofinite engineering repositories with strict sibling separation: public `docs/` and internal engineering `ai-docs/`, with temporary files strictly confined to gitignored `temp/`.
- **Implementation:** Authored `D:\stack\ai-docs\architecture\REPOSITORY_DOCUMENTATION_STANDARD.md`. Audited and standardized all 5 repositories (`D:\stack`, `D:\ui-quality-lab`, `D:\nuix`, `D:\oss-docs`, `D:\nofinite.com`). Relocated nested `docs/ai-docs/` in UI Quality Lab to the root level. Updated `AGENTS.md` across all 5 repositories to enshrine documentation ownership rules while preserving project rules.
- **Verification:** Verified clean sibling directory structure and valid README navigation hubs across all repositories.
- **Affected Packages:** Entire Nofinite engineering ecosystem.

### 3.4. [COMPLETED] Multi-Browser Engine & Calibrated Accessibility Verification

- **Objective:** Validate NUICSS across Chromium, Firefox, and WebKit on all 6 domain applications, calibrating touch-target measurements to distinguish mobile viewports (44x44px minimum per WCAG 2.5.5) from desktop compact controls (24x24px minimum per WCAG 2.5.8), and waiting for client hydration.
- **Implementation:** Executed automated multi-browser test harness across 8 viewports and 3 browser engines, capturing raw Axe violations by severity (critical, serious, moderate, minor).
- **Verification:** Complete rendering parity verified across Chromium, Firefox, and WebKit with zero visual layout breaks.
- **Affected Packages:** `@nofinite/nuicss`, `@nofinite/nuix`.

### 3.5. [COMPLETED] Consumer Integration Test Fixtures

- **Objective:** Verify dynamic utility generation, tree-shaking, and design token customization across all primary consumer pathways.
- **Implementation:** Built isolated test fixtures in `D:\stack\temp\fixtures/` for Vite zero-config, Next.js App Router, PostCSS 8, Standalone CLI, and CDN runtime/static delivery.
- **Verification:** Verified compilation, tree-shaking (eliminating unreferenced superclasses like `.kanban-board`), and scoped token overrides (`--color-primary`) in all 5 fixtures. Authored `CONSUMER_INTEGRATION_VERIFICATION.md`.
- **Affected Packages:** `@nofinite/nuicss`, `@nofinite/nuicss-cli`.

---

## 4. Prioritized Feature Backlog

### 4.1. Priority P0: Deployment Blockers

- **Status:** **NONE IDENTIFIED**
- All critical blockers (CLI minifier crashes, missing modal backdrops, cross-engine rendering discrepancies, documentation structural violations) have been resolved, verified, and documented.

---

### 4.2. Priority P1: High-Priority Developer Ergonomics

#### ITEM-P1-01: First-Class Astro, SvelteKit, and Remix / React Router v7 Presets

- **Objective:** Provide zero-config framework adapters for popular non-Vite/non-Next.js modern web frameworks to accelerate adoption.
- **Proposed Approach:** Create dedicated entrypoints `@nofinite/nuicss/astro`, `@nofinite/nuicss/svelte`, and `@nofinite/nuicss/remix` that preconfigure template scanning, content paths, and server-side rendering preflights.
- **Effort Estimate:** 3–5 engineering days.
- **Affected Packages:** `@nofinite/nuicss`.

#### ITEM-P1-02: Dedicated NUICSS VS Code Extension

- **Objective:** Improve developer ergonomics with real-time OKLCH color previews, superclass auto-completion, and live syntax validation directly in VS Code.
- **Proposed Approach:** Package a lightweight VS Code language extension consuming generated `nuicss.css-data.json` and `nuicss.html-data.json`, adding interactive OKLCH color pickers in the editor gutter.
- **Effort Estimate:** 4–6 engineering days.
- **Affected Packages:** `packages/nuicss-vscode` (new package).

#### ITEM-P1-03: Standalone CLI Event-Driven Incremental Watch Mode

- **Objective:** Provide sub-50ms rebuild speeds during local development for non-Node.js developers (Go, Python, Rust, Ruby).
- **Proposed Approach:** Integrate a cross-platform filesystem watcher in `packages/nuicss-cli/src/commands/compile.ts` utilizing native OS notifications (`ReadDirectoryChangesW` / `inotify` / `FSEvents` via Bun's file watcher API) with debounced AST diffing.
- **Effort Estimate:** 2–3 engineering days.
- **Affected Packages:** `@nofinite/nuicss-cli`.

---

### 4.3. Priority P2: Medium-Priority Enhancements

#### ITEM-P2-01: Native Container Query Superclasses (`@container` / `cq-*`)

- **Objective:** Enable responsive compound component authoring (cards, data tables, kanban boards) relative to parent container width rather than the global viewport.
- **Proposed Approach:** Extend `packages/nuicss/src/shortcuts/layout.ts` with `cq-container` shortcuts (`container-type: inline-size`) and container variants (`@xs:`, `@sm:`, `@md:`, `@lg:`).
- **Effort Estimate:** 3–4 engineering days.
- **Affected Packages:** `@nofinite/nuicss`.

#### ITEM-P2-02: Fluid Scale Typography & Spacing Preset Extension

- **Objective:** Provide atomic fluid typography and spacing utilities that scale smoothly between mobile (375px) and desktop (1440px) without discrete breakpoint steps.
- **Proposed Approach:** Define dynamic rules in `packages/nuicss/src/plugin/preset.ts` supporting `text-fluid-[sm|base|lg|xl|2xl|hero]` and `p-fluid-[sm|md|lg|xl]` using CSS `clamp()` tokens.
- **Effort Estimate:** 2–3 engineering days.
- **Affected Packages:** `@nofinite/nuicss`.

#### ITEM-P2-03: Automated Color Contrast Ratio Linter (WCAG AA / AAA)

- **Objective:** Automatically validate that custom user themes and token overrides maintain required contrast ratios (4.5:1 for AA, 7:1 for AAA) at build time.
- **Proposed Approach:** Add a `nuicss lint-theme` CLI command and build-time plugin warning that calculates OKLCH-to-relative-luminance pairings between `--color-*` foregrounds and `--bg-*` backgrounds.
- **Effort Estimate:** 3–4 engineering days.
- **Affected Packages:** `@nofinite/nuicss`, `@nofinite/nuicss-cli`.

---

### 4.4. Priority P3: Strategic & Long-Term Innovations

#### ITEM-P3-01: AST-Based Tailwind-to-NUICSS Automated Codemod

- **Objective:** Streamline enterprise migrations by automatically refactoring verbose Tailwind utility clusters into semantic NUICSS superclasses.
- **Proposed Approach:** Author a jscodeshift / Babel AST transform script (`npx nuicss migrate-tailwind`) that scans JSX/TSX/HTML, identifies cluster patterns (e.g., `inline-flex items-center justify-center font-medium transition-colors rounded-lg bg-blue-600 text-white hover:bg-blue-700`), and replaces them with `btn btn-primary`.
- **Effort Estimate:** 8–10 engineering days.
- **Affected Packages:** `@nofinite/nuicss-cli`.

#### ITEM-P3-02: Rust-Powered Core Scanner (`nuicss-oxide`)

- **Objective:** Maximize compilation throughput in enterprise monorepos exceeding 500,000 lines of code.
- **Proposed Approach:** Port the template regex tokenizer and class scanner to a standalone Rust crate compiled to native binaries and WASM for Node.js/Bun bindings.
- **Effort Estimate:** 12–15 engineering days.
- **Affected Packages:** `@nofinite/nuicss` core.

---

## 5. Governance & Review Protocol

This backlog is reviewed at the conclusion of each engineering milestone. Items transition from Planned to In Progress only after:

1. Completion of an implementation plan in `temp/<project>_implementation_plan.md`.
2. Formal architecture review and approval.
3. Verification across all active monorepo packages.
