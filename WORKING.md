# WORKING.md — Nofinite Stack Ecosystem Operational Context

**Last Updated:** 2026-10-30  
**Current Phase:** PHASE 1 — Discovery, Ecosystem Mapping & Engineering Audit  
**Phase Status:** PHASE 1 COMPLETE — Audit Synthesized & Implementation Plan Prepared for User Approval Gate  
**Integration Owner:** Antigravity Main Agent

---

## 1. Mission & Objectives

Initiate a comprehensive engineering audit, quality baseline, and improvement roadmap across **Nofinite Stack** to establish an enterprise-grade foundation for production adoption, official web integration (`nofinite.com`), and documentation fidelity (`oss-docs`).

### Core Ecosystem Targets:

- **NUICSS (`@nofinite/nuicss` v3.2.0):** Single source of truth styling & OKLCH token engine, CSS resets, and component superclasses.
- **NUICSS CLI (`nuicss` v0.1.0):** Project setup and scaffolding utility.
- **NUI (`@nofinite/nui` v3.2.0):** Headless & polymorphic React component library (`Slot` / `asChild`).
- **Nofinite Markon (`@nofinite/markon` v2.0.0):** Dual-layer TipTap/ProseMirror markdown editor and publication renderer (`MarkonRender`).
- **Nofinite Charts (`@nofinite/charts` v1.0.0):** Responsive mathematical SVG charting library.
- **Nofinite Kanban (`@nofinite/kanban` v1.0.0):** Accessible workflow boards and drag-and-drop state machines.
- **Nofinite Media (`@nofinite/media` v1.0.0):** Modern media player primitives and token bridges.
- **Nofinite Locale (`@nofinite/locale` v2.0.0):** Internationalization, timezone formatting, and ISO country metadata.
- **Nofinite Utils (`@nofinite/utils` v2.0.1):** Pure TypeScript utilities, runtime guards, and crypto helpers.
- **NUIX (`@nofinite/nuix` v0.1.0):** Zero-framework / HTML-first / HTMX-native component engine (`d:\nuix`).
- **Nofinite Documentation (`oss-docs`):** Next.js 16 interactive docs portal (`d:\oss-docs`).
- **Nofinite Official Website (`nofinite.com`):** Astro 5 production consumer app (`d:\nofinite.com`).

---

## 2. Discovered Repository Topology & Boundaries

| Repository Directory | Remote URL                                       | Project Type / Framework                        | Current Status                 |
| :------------------- | :----------------------------------------------- | :---------------------------------------------- | :----------------------------- |
| `d:\stack`           | `https://github.com/NofiniteHQ/stack.git`        | Nx Monorepo (pnpm@10.24.0) hosting 9 packages   | Active / Core Monorepo         |
| `d:\nuix`            | `https://github.com/NofiniteHQ/nuix.git`         | Standalone Vanilla/HTMX Library (Vite + UnoCSS) | Active / Zero-Framework Engine |
| `d:\oss-docs`        | `https://github.com/NofiniteHQ/oss-docs.git`     | Next.js 16 App Router Docs Portal               | Active / Ecosystem Consumer    |
| `d:\nofinite.com`    | `https://github.com/NofiniteHQ/nofinite.com.git` | Astro 5 Official Marketing & Web Portal         | Downstream Production Consumer |

---

## 3. Important Discoveries & Architectural Invariants

1. **The Zero Downstream CSS Invariant:**
   - NUICSS (`@nofinite/nuicss`) is the sole and absolute styling engine for all packages.
   - Downstream packages must NEVER author or bundle independent CSS.
   - Initial inspection identified that `packages/locale` contains independent SCSS (`src/styles/*.scss`) generating `dist/style.css`. Needs architectural consolidation check.
2. **Docs Sync Contract:**
   - Canonical markdown ground truth resides in `d:\stack\docs/`.
   - `oss-docs` consumes this markdown and enriches it with interactive Next.js components (`<ComponentPreview />`) and the Theme Studio.
3. **Consumer App Alignment:**
   - `nofinite.com` currently specifies `@nofinite/nui: ^3.0.7` and `@nofinite/nuicss: ^3.0.6`, whereas the active Stack release is `v3.2.0`. A migration path must be established in Phase 3.
4. **Git Ownership Invariant:**
   - Main Agent retains exclusive authority over `git add` and `git commit`. Subagents operate strictly in read-only research mode.

---

## 4. Active Tasks & Ownership

| Workstream                                  | Owner / Subagent        | Conversation ID                        | Focus Area                                                               | Status                          |
| :------------------------------------------ | :---------------------- | :------------------------------------- | :----------------------------------------------------------------------- | :------------------------------ |
| **NUICSS & CLI**                            | Subagent 1 (`research`) | `8f78ac32-d4a3-49a1-a57a-6a9e3c98b1da` | OKLCH tokens, superclasses, subpaths, CLI commands                       | **Completed** (Findings logged) |
| **NUI React**                               | Subagent 2 (`research`) | `00af0716-d435-46c7-ab3f-d31c2bd0660a` | Polymorphic Slot/asChild, WAI-ARIA, compound modal contracts, Rollup     | **Completed** (Findings logged) |
| **Markon & Kanban**                         | Subagent 3 (`research`) | `565e352e-5e30-4999-8165-ba9503a41e8c` | Markon publication engine, TipTap extensions, DnD bus, NUICSS compliance | **Completed** (Findings logged) |
| **Charts, Media, Locale, Utils**            | Subagent 4 (`research`) | `1e5c5e6c-c200-41ff-902f-18285e8dfd44` | SVG rendering, media player tokens, i18n formatting, tree-shaking        | **Completed** (Findings logged) |
| **NUIX Zero-Framework**                     | Subagent 5 (`research`) | `94d4fa79-66fe-4e29-944d-3c1128143267` | Document delegation, HTMX triggers, native `<dialog>`, bundle size       | **Completed** (Findings logged) |
| **CI/CD, Workflows & Consumer Integration** | Subagent 6 (`research`) | `48d50bde-6df7-4d94-bab1-f7de3f2d5237` | Changeset protocol, dynamic tag release, docs sync scripts, nofinite.com | **Completed** (Findings logged) |

### 4.1 NUIX (`@nofinite/nuix`) Verified Audit Summary

- **Status:** Staged / Pre-release (v0.1.0) — **NOT PRODUCTION READY**.
- **Critical Issues Identified:**
  - `SEC-01`: DOM XSS in `dialog.ts`, `command-palette.ts`, `datagrid.ts`, `kanban.ts`, `chart.ts`, `multiselect.ts` via unsanitized `.innerHTML`.
  - `BLD-01`: Broken package export `./components/*` (`dist/components` does not exist, triggering `ERR_MODULE_NOT_FOUND`).
  - `HTMX-01`: `HX-Trigger` listener desynchronization (`htmx.ts` listens for `toast`, `modal:close` instead of documented `nuix:toast`, `nuix:modal:close`, `nuix:drawer:close`).
- **High Severity Issues Identified:**
  - `PERF-01`: 1.05MB monolithic CDN bundle caused by static imports of Tiptap/ProseMirror and Vidstack in `src/index.ts`.
  - `ARCH-01`: Non-idempotent `NUIX.init()` duplicates 25+ global event listeners on document.
  - `DOM-01`: Native `<dialog>` close leaks scroll lock (`overflow: hidden`) and focus traps.
  - `A11Y-01`: `state.ts` erroneously attaches `aria-hidden="true"` to interactive buttons.
  - `CSS-01`: Independent 224KB `nuix.css` violating the Zero Downstream CSS Invariant.

### 4.2 NUICSS (`@nofinite/nuicss`) & CLI (`nuicss`) Verified Audit Summary

- **Status:** Staged / Pre-Release Blocked.
- **Critical Issues Identified:**
  - `CRIT-01`: Binary Collision between `packages/nuicss` and `packages/nuicss-cli` (`nuicss/bin/nuicss.js` hardcoded stub masks full CLI, crashing on `compile`, `build`, etc.).
  - `CRIT-02`: Hallucinated Superclasses in `nuicss add` and `list` (`modal-dialog`, `modal-backdrop`, `tabs-list`, `tabs-trigger`, `menu-dropdown` do not exist in `@nofinite/nuicss`).
- **High Severity Issues Identified:**
  - `HIGH-01`: Conflicting and duplicate shortcuts in `primitives.ts` and `widgets.ts` (`press-scale`, `glow-brand`, `skeleton-shimmer`, `sparkline-container`).
  - `HIGH-02`: Vidstack player tokens (Section 15.d in `theme.css`) omitted from `dist/media.css`.
  - `HIGH-03`: Dirty NPM output tarball containing 14 orphaned chunks, stale `.tgz` files, and `.tsbuildinfo` compiler cache.
  - `HIGH-04`: 0 test coverage in `packages/nuicss-cli`.
- **Medium/Low Severity Issues Identified:**
  - `MED-01`: Missing framework detection in `nuicss init`.
  - `MED-02`: Ineffective CSS minification in `build-cdn.js` (7 byte delta).
  - `MED-03`: Missing dedicated `./charts.css` subpath export.
  - `LOW-01` to `LOW-03`: Border radius documentation discrepancy, `@nuicss` directive mismatch, CLI command syntax inconsistency.

### 4.3 Nofinite Markon (`@nofinite/markon`) & Nofinite Kanban (`@nofinite/kanban`) Verified Audit Summary

- **Status:** Conditional / Pre-Release Blocked.
- **Critical Issues Identified:**
  - `C1`: Stored XSS in Markon Markdown Parser & Publication Renderer (`javascript:` schemes in links, unescaped raw HTML rendered via `dangerouslySetInnerHTML`).
  - `C2`: Missing `"scripts"` block in `packages/kanban/package.json` (no `"build"` or `"test"` scripts defined).
- **High Severity Issues Identified:**
  - `H1`: Architectural violation of Zero Downstream CSS: 1,260 lines of raw CSS embedded inside Markon's TS source (`styleInjector.ts` and `renderer.ts`) injected via runtime `<style>` tags rather than being authored in `@nofinite/nuicss`.
  - `H2`: Documentation hallucination in `docs/kanban/README.md` (documents fictional `<KanbanProvider>`, `<KanbanBoard>`, `<KanbanColumn>`, `<KanbanCard>` compound components; real component is `<Kanban />`).
  - `H3`: TipTap/ProseMirror inlining (1.65MB bundle in `dist/chunks/`) alongside duplicated `@tiptap/*` npm dependencies.
- **Medium/Low Severity Issues Identified:**
  - `M1`: Unescaped `item.content` in vanilla Kanban DOM renderer (`board.ts:59-61`).
  - `M2`: Markon docs import paths drift (`@nofinite/markon` vs `@nofinite/markon/react`) and fictional props.
  - `M3`: Duplicate `dist/package.json` included in Kanban npm tarball.
  - `L1`: Headless KaTeX quirks mode console warning in Vitest.

### 4.4 NUI (`@nofinite/nui`) Verified Audit Summary

- **Status:** Not Ready for Production (Targeted Architectural Hardening Required).
- **Critical Issues Identified:**
  - `CRIT-01`: 100% Broken subpath exports (`./components/*` and `./utils/*` fail due to nested PascalCase structure emitted by Rollup `preserveModules: true` vs flat paths in `package.json`).
  - `CRIT-02`: Unconditional focus stealing on initial mount across 8 components (`Dropdown`, `Popover`, `DatePicker`, `DateRangePicker`, `MultiSelect`, `Select`, `TimePicker`, `TimeRangePicker` execute `restoreFocus()` on initial mount when `open === false`).
- **High Severity Issues Identified:**
  - `HIGH-01`: Zero Downstream CSS violation (builds duplicate 173 kB `styles.css` with UnoCSS and 2000-line copied `theme.css`).
  - `HIGH-02`: Broken compound component hierarchy in `Modal` (subcomponents wrapped in `modal-body p-0`, docking footers inside body, missing `ModalContext` and `aria-labelledby`).
  - `HIGH-03`: `trapFocus` static evaluation ignores dynamically inserted fields, lacks `:not([disabled])` on inputs/textareas, and crashes on empty containers.
  - `HIGH-04`: SSR crashes (`document is not defined`) in `CommandPalette` and `ContextMenu` due to unguarded `Portal`.
  - `HIGH-05`: Outdated/hallucinated `--nui-*` design tokens documented in `docs/nui/`.
- **Medium/Low Severity Issues Identified:**
  - `MED-01`: 21 components lack `React.forwardRef`.
  - `MED-02`: Global `layoutId="activeTab"` collisions across multiple `Tabs` instances.
  - `MED-03`: `TreeView` page-scroll bug on Space key (`''` instead of `' '`).
  - `MED-04`: Checkbox ref assignment delayed inside passive `useEffect`.
  - `MED-05`: `applyInertToSiblings` disables global toasts and portals.
  - `LOW-01` to `LOW-02`: Missing WAI-ARIA arrow navigation in Accordion, hardcoded hex colors in Storybook stories.

### 4.5 Nofinite Charts, Media, Locale & Utils Verified Audit Summary

- **Status:**
  - Charts (`@nofinite/charts` v1.0.0): 85% Production Candidate (Minor SVG/Canvas & CSS fixes required).
  - Media (`@nofinite/media` v1.0.0): 90% Production Ready (Docs sync required).
  - Locale (`@nofinite/locale` v2.0.0): 20% Blocked (Architectural redesign required).
  - Utils (`@nofinite/utils` v2.0.1): 45% Unfit for Web/Browser (Server-only crypto, broken `./email` export).
- **Critical Issues Identified:**
  - `CRIT-01` (Locale): Architectural Schizophrenia — 0% i18n implementation (package contains only 43 lines of code for dial-codes and flag sprites; 0% translation, 0% ICU, 0% formatting).
  - `CRIT-02` (Locale): Violation of Zero Downstream CSS Invariant (authors SCSS in `src/styles/*.scss`, builds `dist/style.css`, and `src/index.ts` executes `import './styles/index.scss'`).
  - `CRIT-03` (Utils): Broken subpath export `./email` (`package.json` maps `./email` to `./dist/email/index.js`, which does not exist; actual folder is `./dist/zeptomail/`).
- **High Severity Issues Identified:**
  - `HIGH-01` (Utils): Root `src/index.ts` re-exports native C++ addon `argon2`, crashing web/browser bundlers.
  - `HIGH-02` (Utils): Published NPM tarball polluted with `dist/node_modules/.bin/uuid`, `uuid.CMD`, `uuid.ps1`, `dist/package.json`, and `tsconfig.lib.tsbuildinfo`.
  - `HIGH-03` (Charts): Canvas PNG export failure due to lack of computed style inlining on SVG elements consuming CSS variables (`var(--chart-1)`).
  - `HIGH-04` (Charts): Tooltip swatch box-shadow CSS syntax error (`var(...)55`).
- **Medium/Low Severity Issues Identified:**
  - `MED-01`: Documentation hallucinations across Charts (`ResponsiveContainer`, `RadarChart`), Media (`<Video>` from root `@nofinite/media`), and Locale syntax error (`const in = ...`).
  - `MED-02`: Charts `useChartDimensions` only measures width, not height.
  - `MED-03`: Missing `"test"` target in `locale/project.json` and `utils/project.json`.
  - `LOW-01` to `LOW-02`: Storybook typings in production charts package; redundant utility class strings in containers.

### 4.6 CI/CD, Release Workflows & Consumer Integration Verified Audit Summary

- **Status:** Not Ready for Release (Release pipeline bundles stale assets; 8/9 packages unverified in tarball).
- **Critical Issues Identified:**
  - `CRIT-01`: Standalone CLI binaries (`nuicss-windows-amd64.exe`, etc.) compiled during CI embed stale committed assets because asset sync is Windows-only (`build.ps1`) and not executed on Ubuntu runners in `release.yml`.
  - `CRIT-02`: Root `package.json` test scripts (`test:utils`, `test:locale`) fatally crash (`NX Cannot find configuration for task utils:vite / locale:vite`).
- **High Severity Issues Identified:**
  - `HIGH-01`: Central docs desynchronization — 20 component documentation files exist in legacy `packages/nui/docs/` but are completely missing from canonical `d:\stack\docs/`.
  - `HIGH-02`: Monorepo CI blind spot — `ci-all.yml` only runs on manual `workflow_dispatch` and excludes `nui`; root config changes trigger 0 CI runs.
  - `HIGH-03`: Tarball verification in `release.yml` only checks `packages/nui`, leaving 8 packages unvalidated before npm publish.
- **Medium/Low Severity Issues Identified:**
  - `MED-01`: Root `package.json` lacks standard workspace commands (`build`, `test`, `lint`, `typecheck`).
  - `MED-02`: Dead `release` block in `nx.json`.
  - `MED-03`: Missing output cache configuration for `nuicss-cli` in `project.json`.
  - `MED-04`: `nofinite.com` is 2 minor versions behind (`v3.0.7` vs `v3.2.0`), using legacy CSS variables and Lucide v0.x.
  - `LOW-01` to `LOW-02`: Redundant duplicate script execution in `oss-docs` CI; hardcoded version constant in `nuicss-cli/src/index.ts`.

---

## 5. Current Blockers

- Phase 2 execution is blocked awaiting explicit user approval of this implementation plan and prioritized backlog.

---

## 6. Next Concrete Actions

1. Present consolidated Phase 1 audit report to the user across all 6 target domains.
2. Await explicit user approval before entering Phase 2.
3. Upon approval, execute prioritized remediation starting with P0 Critical security (XSS), packaging (broken subpaths), and CLI binary defects.
