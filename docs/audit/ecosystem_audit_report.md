# Nofinite Ecosystem Comprehensive Engineering Audit Report

**Date:** October 30, 2026  
**Status:** Canonical Reference Document (Tracked in Git)  
**Governing Standard:** AI Engineering Constitution & Zero Downstream CSS Invariant

---

## 1. Ecosystem Classification & Topology

The Nofinite ecosystem is strictly partitioned into three distinct tiers:

### Tier 1: Public Open-Source Nofinite Stack (`d:\stack`)

Maintained under the Apache-2.0 license as a unified open-source ecosystem published to npm:

- **NUICSS (`@nofinite/nuicss` v3.2.0):** Single source of truth styling & OKLCH token engine, CSS resets, layout primitives, and semantic superclasses.
- **NUICSS CLI (`nuicss` v0.1.0):** Standalone compiler, project scaffolding, and IntelliSense generator.
- **NUI (`@nofinite/nui` v3.2.0):** Polymorphic, headless React component library (`Slot` / `asChild`).
- **Nofinite Markon (`@nofinite/markon` v2.0.0):** Dual-layer TipTap/ProseMirror markdown authoring editor and publication renderer (`MarkonRender`).
- **Nofinite Charts (`@nofinite/charts` v1.0.0):** Modular D3-powered mathematical SVG charting library with OKLCH theme bindings.
- **Nofinite Kanban (`@nofinite/kanban` v1.0.0):** Accessible workflow boards powered by Atlassian's Pragmatic Drag-and-Drop.
- **Nofinite Media (`@nofinite/media` v1.0.0):** Modern Vidstack audio/video player wrappers and media token bridges.
- **Nofinite Locale (`@nofinite/locale` v2.0.0):** Native internationalization, ISO country metadata, and timezone formatting.
- **Nofinite Utils (`@nofinite/utils` v2.0.1):** Shared runtime utilities, OTP, JWT, and server-side authentication primitives.

### Tier 2: Proprietary Internal Technology — NUIX (`d:\nuix`)

- **NUIX (`@nofinite/nuix` v0.1.0):** Completely internal, proprietary zero-framework component and hypermedia interaction engine.
- **Role:** Powers Nofinite Cloud and SaaS products (HTMX, Turbo, Go Templ, Laravel Blade, Django, Rails, static HTML).
- **Security & Distribution Policy:** **NOT an open-source library.** Must NEVER be published to public npm, and its source code must remain confidential to Nofinite internal infrastructure.

### Tier 3: Ecosystem Consumers

- **`nofinite.com` (`d:\nofinite.com`):** Official corporate web portal built with Astro 5 and React.
- **`oss-docs` (`d:\oss-docs`):** Public Next.js 16 documentation portal, interactive preview registry, and Theme Studio.
- **Nofinite Cloud and SaaS Products:** Internal enterprise applications consuming NUIX and Stack packages.

---

## 2. In-Depth Technical Audit Findings

### 2.1 Security & Data Integrity

#### [SEC-01] Stored Cross-Site Scripting (XSS) in Markon Markdown Parser & Renderer

- **Severity:** 🚨 **CRITICAL**
- **Location:** `d:\stack\packages\markon\src\core\markdown.ts#L396-L397`, `d:\stack\packages\markon\src\core\renderer.ts#L912-L916`, `d:\stack\packages\markon\src\react\MarkonRender.tsx#L149`
- **Verified Fact:** Link replacement regex replaces `[text](url)` with `<a href="url">` without protocol validation. Markdown containing `[Click](javascript:alert(1))` produces executable anchor tags. `renderer.ts` runs `escapeHtml()` on `attrs.href`, which only escapes quotes/angles, allowing `javascript:` schemes through. `<MarkonRender />` renders final HTML via `dangerouslySetInnerHTML` without sanitization.
- **Impact:** Any user-generated markdown rendered through `MarkonRender` can execute arbitrary JavaScript in the user's session.
- **Remediation:** Introduce a strict URL sanitizer (`sanitizeUrl`) allowing only `http:`, `https:`, `mailto:`, `tel:`, `#`, and relative `/` paths. Provide an integrated HTML sanitization pipeline.

#### [SEC-02] DOM XSS via Unescaped `.innerHTML` Interpolation in NUIX

- **Severity:** 🚨 **CRITICAL**
- **Location:** `d:\nuix\src\components\dialog\dialog.ts#L75-L84,L146-L156,L212-L222`, `d:\nuix\src\components\command-palette\command-palette.ts#L50-L75`, `d:\nuix\src\components\datagrid\datagrid.ts#L206`
- **Verified Fact:** Dialog, prompt, command palette, and datagrid templates interpolate title, message, and cell variables directly into `.innerHTML` without character escaping.
- **Impact:** Error modals or search lists displaying API errors or database values in Nofinite Cloud/SaaS products are vulnerable to DOM-based XSS.
- **Remediation:** Implement and enforce a shared `escapeHtml` utility or construct DOM nodes using `document.createElement()` and `textContent`.

#### [SEC-03] Unescaped Content in Vanilla Kanban DOM Card Renderer

- **Severity:** ⚠️ **HIGH**
- **Location:** `d:\stack\packages\kanban\src\core\board.ts#L59-L61`
- **Verified Fact:** While `item.title` is escaped via `escapeHtml()`, fallback `item.content` executes `String(item.content)` with no escaping before inserting into `innerHTML`.
- **Remediation:** Enforce `escapeHtml(String(item.content))` across all vanilla DOM rendering methods.

---

### 2.2 Package Packaging & Export Reliability

#### [PKG-01] 100% Broken Subpath Exports in `@nofinite/nui`

- **Severity:** 🚨 **CRITICAL**
- **Location:** `d:\stack\packages\nui\package.json#L22-L33`
- **Verified Fact:** `package.json` maps `"./components/*": "./dist/components/*.js"`. However, Rollup with `preserveModules: true` emits nested PascalCase files: `./dist/components/button/Button.js`. There is no flat `./dist/components/button.js`. Furthermore, `src/index.ts` re-exports directly from `Button.tsx`, skipping `src/components/button/index.ts`.
- **Impact:** Modular imports (`import { Button } from '@nofinite/nui/components/button'`) fail immediately with `ERR_MODULE_NOT_FOUND`.
- **Remediation:** Align `package.json` subpath exports with actual emitted directory structures (`./dist/components/*/index.js` or `./dist/components/*/*`), and ensure build entries compile component barrel files.

#### [PKG-02] Binary Name Collision in NUICSS & NUICSS CLI

- **Severity:** 🚨 **CRITICAL**
- **Location:** `packages/nuicss/package.json#L100` vs `packages/nuicss-cli/package.json#L6`
- **Verified Fact:** `@nofinite/nuicss` registers `"bin": { "nuicss": "./bin/nuicss.js" }`. This file is a hardcoded stub that only understands `init` and `migrate`. Installing `@nofinite/nuicss` shadows the full CLI in `nuicss-cli`. Running `npx nuicss compile` executes the stub and crashes with `Unknown command: compile`.
- **Remediation:** Unify the binary dispatch. Either delegate from `packages/nuicss/bin/nuicss.js` to `nuicss-cli` when present, or reserve `nuicss` exclusively for the standalone compiler package.

#### [PKG-03] Broken Subpath Export in `@nofinite/utils/email`

- **Severity:** 🚨 **CRITICAL**
- **Location:** `packages/utils/package.json#L49-L53`
- **Verified Fact:** Manifest exports `"./email"` pointing to `./dist/email/index.js`. The source folder is `src/zeptomail/` and compiles to `./dist/zeptomail/`. Directory `dist/email/` does not exist.
- **Remediation:** Update `package.json` to map `"./email"` and `"./zeptomail"` to `./dist/zeptomail/index.js`.

#### [PKG-04] Missing `"scripts"` Block in `@nofinite/kanban/package.json`

- **Severity:** 🚨 **CRITICAL**
- **Location:** `packages/kanban/package.json#L1-L76`
- **Verified Fact:** The package manifest contains zero `"scripts"` field. Monorepo commands like `pnpm --filter @nofinite/kanban build` exit silently without invoking Vite.
- **Remediation:** Add `"scripts": { "build": "vite build", "test": "vitest run" }`.

#### [PKG-05] Fatal Task Crash in Root Test Scripts

- **Severity:** 🚨 **CRITICAL**
- **Location:** `d:\stack\package.json#L13,L17`
- **Verified Fact:** Root scripts call `nx run utils:vite:test` and `nx run locale:vite:test`. The task `vite:test` does not exist; Nx registers `utils:test` and `locale:test`.
- **Remediation:** Correct script targets to `nx run utils:test` and `nx run locale:test`.

#### [PKG-06] Hallucinated Starter Superclasses in `nuicss-cli` (`add` / `list`)

- **Severity:** 🚨 **CRITICAL**
- **Location:** `packages/nuicss-cli/src/commands/add.ts#L4-L17`, `src/commands/list.ts#L10-L91`
- **Verified Fact:** Emits non-existent classes: `modal-dialog`, `modal-backdrop`, `tabs-list`, `tabs-trigger`, `menu-dropdown`, `markon-toolbar`.
- **Remediation:** Update templates to verified superclasses: `modal`, `modal-box`, `tab-list`, `tab`, `dropdown-menu`, `dropdown-item`, `editor-toolbar`.

---

### 2.3 Architecture & Single-Engine Styling Invariants

#### [ARCH-01] Zero Downstream CSS: Duplicate 173 kB CSS in NUI

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/nui/vite.config.ts#L26-L28,L57-L85`, `dist/styles.css`
- **Verified Fact:** NUI runs UnoCSS during build and concatenates the entire 2000-line `theme.css`, emitting a 173.6 kB standalone stylesheet. This directly violates the Zero Downstream CSS Invariant and ADR 001.
- **Remediation:** Remove UnoCSS from NUI build; replace `dist/styles.css` with a 300-byte `@import '@nofinite/nuicss/styles.css'` shim.

#### [ARCH-02] Zero Downstream CSS: In-JS Runtime `<style>` Injection in Markon

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/markon/src/core/styleInjector.ts#L7-L597`, `renderer.ts#L104-L772`
- **Verified Fact:** Injects 1,260 lines of raw CSS via JavaScript strings (`MARKON_CORE_CSS` and `MARKON_RENDERER_CSS`) on every editor instantiation and HTML render. Crucial publication classes (`.markon-render`, `.markon-article`, etc.) do not exist in `@nofinite/nuicss`.
- **Remediation:** Upstream all publication layout and editor classes into `@nofinite/nuicss/src/styles/theme.css`; eliminate runtime string injections.

#### [ARCH-03] Zero Downstream CSS: Independent SCSS Build in Locale

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/locale/src/styles/*.scss`, `src/index.ts#L18`
- **Verified Fact:** Compiles custom SCSS flag sprites to `dist/style.css`, and `src/index.ts` imports the SCSS file directly, injecting CSS side-effects into pure JavaScript module consumers.
- **Remediation:** Move flag sprite classes into `@nofinite/nuicss` superclasses; delete SCSS build from `@nofinite/locale`; configure `sideEffects: false`.

#### [ARCH-04] Omission of Vidstack Player Tokens from `dist/media.css`

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/nuicss/build-cdn.js#L95` vs `src/styles/theme.css#L1882-L1998`
- **Verified Fact:** Section 15.d (Vidstack player custom properties) is excluded from `dist/media.css`. Consumers importing `@nofinite/nuicss/media.css` lose all video/audio player styling.
- **Remediation:** Append Section 15.d to `dist/media.css` and `dist/media.min.css`.

#### [ARCH-05] Native C++ Node Addon (`argon2`) Exported from Root `@nofinite/utils`

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/utils/package.json#L70`, `src/index.ts#L4`
- **Verified Fact:** Root `index.ts` re-exports `./password`, which requires `argon2` (a compiled Node-API binary). Client-side web bundlers (Vite, Next.js client components) crash immediately upon importing `@nofinite/utils`.
- **Remediation:** Keep root `@nofinite/utils` strictly browser-safe / isomorphic; isolate server-side Node.js utilities into `@nofinite/utils/server`.

---

### 2.4 Accessibility & Runtime Reliability

#### [A11Y-01] Unconditional Focus Stealing on Initial Mount Across 8 NUI Components

- **Severity:** 🚨 **CRITICAL**
- **Location:** `Dropdown.tsx#L300-L303`, `DatePicker.tsx#L126-L129`, `Select.tsx#L130`, `MultiSelect.tsx#L128`, `Popover.tsx#L65`, `DateRangePicker.tsx#L136`, `TimePicker.tsx#L152`, `TimeRangePicker.tsx#L155`
- **Verified Fact:** Focus restoration is triggered inside `useEffect` with `if (!open) restoreFocus(...)`. On initial mount, `open` is `false`, causing all 8 components to call `element.focus()` upon page load, stealing user focus.
- **Remediation:** Guard focus restoration with a ref tracking previous open state (`prevOpenRef.current && !open`), or invoke strictly in cleanup effects.

#### [A11Y-02] Broken Compound Modal Hierarchy and ARIA Contracts

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/nui/src/components/modal/Modal.tsx#L160,L169,L193-L200`
- **Verified Fact:** All `children` are wrapped in `<div className="modal-body">`, nesting compound headers and footers inside the scrollable body. No `ModalContext` exists, leaving `aria-labelledby` `undefined` in compound mode.
- **Remediation:** Introduce `ModalContext` carrying `titleId`, `descId`, and `onClose`; dock subcomponents outside the scrollable body.

#### [A11Y-03] Static Focus Candidate Evaluation Bug in `trapFocus`

- **Severity:** ⚠️ **HIGH**
- **Location:** `packages/nui/src/utils/trapfocus/trapFocus.ts#L13-L19`
- **Verified Fact:** Trapped elements are queried only once on mount. Dynamic form fields inserted later are ignored, and disabled inputs break keyboard tabbing loops.
- **Remediation:** Query focusable candidates dynamically inside the keydown listener and filter by `:not([disabled])`.

#### [DOM-01] Permanent Focus Trap & Scroll Lock Leak on Native `<dialog>` Close in NUIX

- **Severity:** ⚠️ **HIGH**
- **Location:** `d:\nuix\src\core\delegation.ts#L59-L86`, `src/utils/scroll-lock.ts#L9-L33`
- **Verified Fact:** `closeModal` unlocks scroll and cleans focus traps. When a dialog is closed natively via Escape, `<form method="dialog">`, or `dialog.close()`, `closeModal` is bypassed, permanently locking `document.body.style.overflow = 'hidden'`.
- **Remediation:** Listen to native `'close'` and `'cancel'` events on every opened `<dialog>`.

#### [DOM-02] Non-Idempotent Event Delegation in NUIX

- **Severity:** ⚠️ **HIGH**
- **Location:** `d:\nuix\src\core\delegation.ts#L88-L132`, `src/index.ts#L320`
- **Verified Fact:** `initDelegation()` registers 40 document listeners with no initialization guard. Re-calling `NUIX.init()` doubles all click and input handlers.
- **Remediation:** Add an `isInitialized` boolean guard.

---

### 2.5 Documentation & CI/CD Pipeline

#### [DOC-01] 20 Missing Component Documentation Files from Canonical `d:\stack\docs/`

- **Severity:** ⚠️ **HIGH**
- **Location:** `d:\stack\docs\nui\components/` (47 files) vs `d:\stack\packages\nui\docs\components/` (67 files)
- **Verified Fact:** 20 component documentation files exist only in legacy package folders and are absent from the central ground truth: `attachment`, `calendar`, `carousel`, `clipboard`, `codeblock`, `collapsible`, `colorpicker`, `divider`, `emptystate`, `form`, `image`, `kbd`, `multiselect`, `nuiprovider`, `numberinput`, `passwordinput`, `pininput`, `scrollarea`, `segmentedcontrol`, `statcard`, `timeline`, `transferlist`, `watermark`.
- **Remediation:** Migrate all 20 files into canonical `d:\stack\docs\nui\components/`; deprecate legacy directories.

#### [DOC-02] Documentation Hallucinations in Kanban, Markon, and Charts

- **Severity:** ⚠️ **HIGH**
- **Location:** `docs/kanban/README.md#L42-L89`, `docs/markon/README.md#L43`, `docs/charts/README.md#L40`
- **Verified Fact:** Kanban docs document non-existent compound components (`<KanbanProvider>`, `<KanbanBoard>`, etc.); Markon documents importing React component from root `@nofinite/markon`; Charts documents non-existent `ResponsiveContainer` and `RadarChart`.
- **Remediation:** Rewrite documentation snippets to match true runtime exports and TypeScript interfaces.

#### [CI-01] Standalone CLI Binaries Embed Stale Assets During CI Release

- **Severity:** 🚨 **CRITICAL**
- **Location:** `.github/workflows/release.yml#L56`, `packages/nuicss-cli/build.ps1`
- **Verified Fact:** Asset sync is Windows-only (`build.ps1`) and never executes on Ubuntu CI runners. Binaries compiled via Bun embed whatever stale CSS/token data was previously committed to git.
- **Remediation:** Replace `build.ps1` with a cross-platform Node.js script (`scripts/sync-assets.mjs`) and execute it before binary compilation in `release.yml`.

#### [CI-02] Tarball Verification Missing for 8 of 9 Packages in `release.yml`

- **Severity:** ⚠️ **HIGH**
- **Location:** `.github/workflows/release.yml#L41-L52`
- **Verified Fact:** Tarball dry-run verification only inspects `packages/nui`. The other 8 packages are unvalidated before publishing to npm.
- **Remediation:** Add a comprehensive `npm pack --dry-run` loop verifying `dist/` entry points across all 9 packages.

---

## 3. Evidence-Based Architectural Resolutions

### Resolution 1: Nofinite Locale (`@nofinite/locale`)

- **Decision:** **Preserve the documented native `Intl` engine.**
- **Rationale:** The canonical documentation (`docs/locale/README.md`) clearly promises a lightweight, zero-dependency localization engine (`formatDate`, `formatCurrency`, `formatRelativeTime`, `getDirection`, `<LocaleProvider>`). Introducing large third-party dependencies (`formatjs`, `i18next`, `moment`) would violate our zero-overhead design philosophy. Instead, we will implement native, browser/Node standard `Intl` abstractions that wrap standard browser primitives in sub-5kB of clean TypeScript.
- **Zero Downstream CSS Integration:** Flag sprite classes (`.nf-flag`, `.nf-flag-*`) will be moved upstream into `@nofinite/nuicss` as official superclasses. The custom SCSS pipeline and `dist/style.css` in `@nofinite/locale` will be permanently retired.

### Resolution 2: Nofinite Utils (`@nofinite/utils`)

- **Decision:** **Explicit Browser vs. Server Subpath Separation.**
- **Rationale:** Root `@nofinite/utils` must be universal and browser-safe (UUID v7, OTP generation, Jose JWT decoding, environment helpers, type guards). The native C++ Node-API dependency (`argon2`) will be isolated into a dedicated subpath: `@nofinite/utils/server` (or `@nofinite/utils/password`). Web applications and client components importing `@nofinite/utils` will never bundle native Node binaries.
- **Export Realignment:** Map `./email` and `./zeptomail` to `./dist/zeptomail/index.js`, and exclude `dist/node_modules/` from packaging.

### Resolution 3: Zero Downstream CSS Single-Engine Authority

- **Decision:** **Strict Enforcement of `@nofinite/nuicss` as the Sole Styling Engine.**
- **Rationale:** All component styling belongs upstream.
  1. Port Markon publication classes (`.markon-render`, `.markon-article`, `.markon-document`, `.markon-newsroom`, `.markon-toc-aside`) into `packages/nuicss/src/styles/theme.css` and export them via `dist/markon.css`.
  2. Append Section 15.d (Vidstack player tokens) into `dist/media.css`.
  3. Emit a dedicated `dist/charts.css` subpath export for chart consumers.
  4. Migrate country flag sprites from `locale` into `nuicss`.
  5. Replace downstream package `styles.css` bundles with 300-byte `@import '@nofinite/nuicss/styles.css'` shims for backwards compatibility.

### Resolution 4: NUIX Internal Infrastructure Governance

- **Decision:** **Proprietary Cloud & SaaS Engine (Non-NPM).**
- **Rationale:** NUIX is proprietary technology. It does not require public npm publishing, Changeset bump tracking, or public CDN distribution.
  1. Fix critical security defects (DOM XSS in dialog, datagrid, command palette).
  2. Fix native `<dialog>` scroll lock and focus trap memory leaks on Escape/cancel.
  3. Add an `isInitialized` guard to `initDelegation()` to ensure event listener idempotency across dynamic HTMX page swaps.
  4. For bundle efficiency: Provide modular internal entry points (`@nofinite/nuix/editor`, `@nofinite/nuix/video-player`) so core hypermedia dashboards in Nofinite Cloud do not incur the 1MB payload of ProseMirror and Vidstack.
