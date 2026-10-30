# Nofinite Stack — Continuous Engineering & Quality Improvement Roadmap

**Document:** `d:\stack\implementation_plan.md`  
**Current Phase:** PHASE 1 COMPLETE — AWAITING EXPLICIT USER APPROVAL FOR PHASE 2  
**Ecosystem Invariant:** UNDERSTAND → PLAN → STOP → APPROVAL → IMPLEMENT → VERIFY → DOCUMENT & VERSION → REVIEW → COMMIT

---

## 1. Objective & Ecosystem Classification

Maintain, harden, and elevate the **Nofinite Stack** as a production-grade engineering ecosystem by remediating confirmed security vulnerabilities, packaging defects, architectural violations, and documentation drift.

### Ecosystem Taxonomy:

- **Public Open-Source Stack (`d:\stack`):** `@nofinite/nuicss`, `nuicss` (CLI), `@nofinite/nui`, `@nofinite/markon`, `@nofinite/charts`, `@nofinite/kanban`, `@nofinite/media`, `@nofinite/locale`, and `@nofinite/utils`.
- **Proprietary Internal Technology (`d:\nuix`):** `@nofinite/nuix` — Proprietary component engine powering Nofinite Cloud and SaaS products. Strictly non-NPM and internally deployed.
- **Ecosystem Consumers:** `nofinite.com` (Astro 5 web portal), `oss-docs` (interactive Next.js 16 documentation portal), and internal Cloud/SaaS products.

---

## 2. Three-Phase Execution Roadmap

```
PHASE 1: Discovery, Ecosystem Mapping & Engineering Audit [COMPLETED]
   ├── Comprehensive technical audit across all 10 libraries/packages
   ├── Identification and verification of critical security, build, and styling defects
   ├── Resolution of architectural decisions (Locale, Utils, NUICSS, NUIX)
   └── Canonical documentation establishment (WORKING.md, implementation_plan.md, audit report)
         ↓ [APPROVAL GATE]
PHASE 2: Implementation, Enhancement & Verification [PENDING APPROVAL]
   ├── Batch A: Security & Functional Correctness (XSS, safe DOM rendering, URL validation)
   ├── Batch B: Package & Build Reliability (Exports, CLI binaries, build scripts, task errors)
   ├── Batch C: Architecture & Performance (Zero Downstream CSS, native Intl, browser/server split)
   ├── Batch D: Accessibility & Reliability (Focus management, compound modal, dialog cleanup)
   └── Batch E: Testing, CI/CD & Documentation (Tarball checks, docs sync, website compatibility)
         ↓
PHASE 3: Release Readiness & Product Adoption [UPCOMING]
   ├── Public Stack npm publishing (Changeset version cuts)
   ├── NUIX internal Cloud/SaaS deployment & verification
   ├── nofinite.com migration to Stack v3.2.0 (Astro 5 integration)
   └── oss-docs automated synchronization and interactive sandbox registry update
```

---

## 3. Phase 2 Continuous Implementation Batches

_Execution note: The 5 batches below are continuous implementation groups within Phase 2. The Main Agent executes continuously through the approved roadmap without requiring separate approval gates between batches, unless a breaking API change or material scope expansion arises._

### Batch A: Security & Functional Correctness (Priority: P0)

Focus: Remediate all confirmed injection and execution vulnerabilities.

| Task ID | Package  | Target File(s)                                                                                                                                                                                         | Description                                                                                                                                             | Acceptance Criteria                                                                                                                      |
| :------ | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **A.1** | `markon` | `packages/markon/src/core/markdown.ts`<br>`packages/markon/src/core/renderer.ts`<br>`packages/markon/src/react/MarkonRender.tsx`                                                                       | Implement strict URL protocol validation (`sanitizeUrl`) disallowing `javascript:`, `data:`, `vbscript:`. Add HTML sanitization pass in `MarkonRender`. | Markdown links with `javascript:` are neutralized to `#`. `<MarkonRender />` safely sanitizes raw HTML inputs. Automated XSS tests pass. |
| **A.2** | `nuix`   | `d:\nuix\src\components\dialog\dialog.ts`<br>`d:\nuix\src\components\command-palette\command-palette.ts`<br>`d:\nuix\src\components\datagrid\datagrid.ts`<br>`d:\nuix\src\components\kanban\kanban.ts` | Enforce central `escapeHtml` or safe DOM node generation (`textContent`) across dialogs, alerts, prompts, command palettes, and datagrid cells.         | Passing HTML strings (`<img src=x onerror=...>`) as title/message/cell values renders escaped text, not executed DOM.                    |
| **A.3** | `kanban` | `packages/kanban/src/core/board.ts`                                                                                                                                                                    | Wrap fallback `item.content` in `escapeHtml(String(item.content))` in vanilla DOM card renderer.                                                        | Card content strings containing HTML tags are escaped and rendered as text.                                                              |

---

### Batch B: Package & Build Reliability (Priority: P0)

Focus: Resolve broken subpath exports, binary collisions, and failing workspace build/test scripts.

| Task ID | Package          | Target File(s)                                                                                          | Description                                                                                                       | Acceptance Criteria                                                                                                        |
| :------ | :--------------- | :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **B.1** | `nui`            | `packages/nui/package.json`<br>`packages/nui/src/index.ts`<br>`packages/nui/vite.config.ts`             | Realign subpath exports map with compiled module directories; ensure component barrel files are compiled.         | `import { Button } from '@nofinite/nui/components/button'` resolves and executes in Node/bundler without resolution error. |
| **B.2** | `nuicss` / `cli` | `packages/nuicss/package.json`<br>`packages/nuicss/bin/nuicss.js`<br>`packages/nuicss-cli/package.json` | Resolve binary name collision; unify command dispatch so `npx nuicss compile` routes cleanly to the compiler CLI. | `npx nuicss compile -i in.css -o out.css` compiles stylesheets without "Unknown command" errors.                           |
| **B.3** | `nuicss-cli`     | `packages/nuicss-cli/src/commands/add.ts`<br>`packages/nuicss-cli/src/commands/list.ts`                 | Synchronize starter markup with canonical NUICSS superclasses (`modal-box`, `tab-list`, `dropdown-menu`, etc.).   | Every class emitted by `nuicss add` matches an active superclass in `@nofinite/nuicss`.                                    |
| **B.4** | `utils`          | `packages/utils/package.json`                                                                           | Map `./email` and `./zeptomail` exports to `./dist/zeptomail/index.js`.                                           | `import { sendMail } from '@nofinite/utils/email'` resolves correctly in TypeScript.                                       |
| **B.5** | `kanban`         | `packages/kanban/package.json`                                                                          | Add `"scripts": { "build": "vite build", "test": "vitest run" }`.                                                 | `pnpm --filter @nofinite/kanban build` and `test` execute successfully.                                                    |
| **B.6** | `stack` root     | `d:\stack\package.json`                                                                                 | Correct Nx test script targets (`test:utils` → `nx run utils:test`, `test:locale` → `nx run locale:test`).        | `pnpm run test:utils` and `pnpm run test:locale` pass cleanly without task configuration errors.                           |
| **B.7** | `nuix`           | `d:\nuix\package.json`<br>`d:\nuix\vite.config.ts`                                                      | Align component exports or configure dynamic Vite entries to emit `./dist/components/*`.                          | Documented NUIX component subpath imports resolve without 404 errors.                                                      |

---

### Batch C: Architecture & Performance (Priority: P1)

Focus: Enforce the Zero Downstream CSS Invariant, isolate server-only binaries, and implement native localization.

| Task ID | Package  | Target File(s)                                                                                                       | Description                                                                                                                                                                     | Acceptance Criteria                                                                                                    |
| :------ | :------- | :------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| **C.1** | `nuicss` | `packages/nuicss/src/styles/theme.css`<br>`packages/nuicss/build-cdn.js`<br>`packages/nuicss/package.json`           | Upstream Markon publication classes, add Section 15.d Vidstack player tokens to `dist/media.css`, generate and export dedicated `dist/charts.css`.                              | `dist/media.css` contains Vidstack tokens; `dist/charts.css` exists; Markon publication classes reside in `theme.css`. |
| **C.2** | `nui`    | `packages/nui/vite.config.ts`<br>`packages/nui/src/index.build.ts`                                                   | Remove UnoCSS compilation from NUI; replace 173 kB `dist/styles.css` with a 300-byte `@import '@nofinite/nuicss/styles.css'` shim.                                              | Zero duplicate CSS emitted by NUI; total CSS bundle size reduced from 173 kB to < 300 bytes.                           |
| **C.3** | `markon` | `packages/markon/src/core/styleInjector.ts`<br>`packages/markon/src/core/renderer.ts`                                | Remove in-JS runtime `<style>` injections (`MARKON_CORE_CSS` and `MARKON_RENDERER_CSS`) in favor of upstreamed NUICSS styles.                                                   | Zero runtime `<style>` tags injected into `<head>` or HTML output.                                                     |
| **C.4** | `locale` | `packages/locale/src/core.ts`<br>`packages/locale/src/react/LocaleProvider.tsx`<br>`packages/locale/src/styles/`     | Implement zero-dependency native `Intl` engine (`formatDate`, `formatCurrency`, `formatRelativeTime`, `<LocaleProvider>`). Port flag sprites to `nuicss` and remove SCSS build. | All documented localization APIs implemented and passing unit tests. Zero SCSS authored in `locale`.                   |
| **C.5** | `utils`  | `packages/utils/src/index.ts`<br>`packages/utils/src/server/index.ts`<br>`packages/utils/package.json`               | Isolate native C++ `argon2` into `@nofinite/utils/server`. Ensure root `@nofinite/utils` is universal and browser-safe.                                                         | Importing `@nofinite/utils` in a client-side Vite/browser environment causes zero native module bundler errors.        |
| **C.6** | `nuix`   | `d:\nuix\src\index.ts`<br>`d:\nuix\src\components\editor\index.ts`<br>`d:\nuix\src\components\video-player\index.ts` | Modularize heavy dependencies (Tiptap, Vidstack) so core NUIX hypermedia bundle is lightweight for Cloud/SaaS dashboards.                                                       | Core NUIX global bundle trimmed; heavy features dynamically imported or isolated to dedicated subpaths.                |

---

### Batch D: Accessibility & Runtime Reliability (Priority: P1)

Focus: Fix focus management, compound modal hierarchy, and DOM lifecycle cleanup.

| Task ID | Package  | Target File(s)                                                                                                                                                                           | Description                                                                                                                                                  | Acceptance Criteria                                                                                                      |
| :------ | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **D.1** | `nui`    | `packages/nui/src/components/dropdown/Dropdown.tsx`<br>`packages/nui/src/components/datepicker/DatePicker.tsx`<br>`packages/nui/src/components/select/Select.tsx`<br>and 5 other pickers | Remove unconditional `restoreFocus` on mount. Guard focus restoration strictly to transitions where `open` flips from `true` to `false`.                     | Mounting pickers on a page does not steal user focus upon initial page load.                                             |
| **D.2** | `nui`    | `packages/nui/src/components/modal/Modal.tsx`                                                                                                                                            | Introduce `ModalContext` carrying `titleId`, `descId`, and `onClose`. Dock compound header, body, and footer properly outside the scrollable body wrapper.   | Compound `<Modal>` renders with docked footer and valid `aria-labelledby` attributes.                                    |
| **D.3** | `nui`    | `packages/nui/src/utils/trapfocus/trapFocus.ts`                                                                                                                                          | Query focusable elements dynamically on keydown; add `:not([disabled])` filter for all form elements.                                                        | Focus trap accommodates dynamically inserted form fields and ignores disabled elements.                                  |
| **D.4** | `nuix`   | `d:\nuix\src\core\delegation.ts`<br>`d:\nuix\src\utils\scroll-lock.ts`                                                                                                                   | Listen to native `'close'` and `'cancel'` events on `<dialog>` to guarantee `scrollLock.unlock()` and focus trap cleanup on Escape or native dialog closure. | Native Escape or `<form method="dialog">` closes dialog and fully restores page scrolling.                               |
| **D.5** | `nuix`   | `d:\nuix\src\core\delegation.ts`<br>`d:\nuix\src\core\state.ts`                                                                                                                          | Add `isInitialized` guard to `initDelegation()`. Prevent `setState` from adding `aria-hidden="true"` to interactive buttons.                                 | Re-calling `NUIX.init()` does not duplicate event listeners. Screen readers correctly discover closed accordion buttons. |
| **D.6** | `charts` | `packages/charts/src/core/export.ts`<br>`packages/charts/src/core/tooltip.ts`                                                                                                            | Inline computed OKLCH/sRGB styles before SVG canvas PNG serialization. Fix tooltip swatch box-shadow invalid syntax.                                         | Calling `exportToPNG()` produces a PNG visually matching rendered chart colors. Tooltip CSS is valid.                    |

---

### Batch E: Testing, CI/CD & Documentation (Priority: P2)

Focus: Clean packaging tarballs, harden CI workflows, synchronize canonical docs, and prepare website adoption.

| Task ID | Package            | Target File(s)                                                                   | Description                                                                                                                                                | Acceptance Criteria                                                                                                |
| :------ | :----------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **E.1** | `nuicss` / `utils` | `packages/nuicss/vite.config.ts`<br>`packages/utils/package.json`                | Set `emptyOutDir: true`; exclude `.tsbuildinfo`, `dist/node_modules/`, and stale `.tgz` files from packaging whitelist.                                    | `npm pack --dry-run` produces clean tarballs with zero compiler cache or host OS scripts.                          |
| **E.2** | `nuicss-cli` / CI  | `packages/nuicss-cli/scripts/sync-assets.mjs`<br>`.github/workflows/release.yml` | Implement cross-platform asset synchronization and execute before Bun compiles standalone binaries in CI.                                                  | Standalone CLI binaries embed current CSS/token data matching `packages/nuicss/dist/styles.css`.                   |
| **E.3** | `stack` CI         | `.github/workflows/release.yml`<br>`.github/workflows/ci-all.yml`                | Add tarball verification loop for all 9 packages in `release.yml`. Add push/PR triggers to `ci-all.yml` on root config changes and remove `--exclude nui`. | CI validates all 9 packages before release and runs on root monorepo modifications.                                |
| **E.4** | `nuicss-cli`       | `packages/nuicss-cli/project.json`<br>`packages/nuicss-cli/src/**/*.test.ts`     | Add Vitest test target and comprehensive test suites for CLI compilation, AST parsing, and initialization.                                                 | `nx test nuicss-cli` executes and passes in CI.                                                                    |
| **E.5** | `stack` docs       | `d:\stack\docs/`                                                                 | Migrate 20 missing component docs into `d:\stack\docs\nui\components/`. Rewrite hallucinated APIs in Kanban, Markon, and Charts docs.                      | Canonical docs contain all 67 components; all documented code examples execute without error in strict TypeScript. |
| **E.6** | `nofinite.com`     | `d:\nofinite.com/package.json`                                                   | Prepare migration plan upgrading official website to `@nofinite/nui@^3.2.0`, updating Lucide React and migrating legacy CSS variables.                     | `nofinite.com` builds cleanly against Stack v3.2.0 without styling regressions.                                    |

---

## 4. Phase 3: Release Readiness & Product Adoption

Once Phase 2 implementation and verification are complete:

1. **Public Stack NPM Release Cut:**
   - Execute `npx changeset version` to consume pending changesets and compile `CHANGELOG.md` files.
   - Run full monorepo build and verify tarballs for all 9 public packages via `npm pack`.
   - Publish to public npm registry via GitHub Actions release workflow.
2. **NUIX Internal Deployment:**
   - Tag and release internal NUIX versions for Nofinite Cloud and SaaS repositories.
   - Verify HTMX server trigger bridges and hypermedia workflows in internal staging environments.
3. **Ecosystem Product Adoption:**
   - Execute dependency upgrade in `d:\nofinite.com` to adopt `@nofinite/nui@^3.2.0` and `@nofinite/nuicss@^3.2.0`.
   - Run automated documentation synchronization transferring canonical markdown from `d:\stack\docs/` to `d:\oss-docs`.
   - Validate live component previews and Theme Studio in `oss-docs`.

---

## 5. Verification & Safety Protocols

1. **Test Verification:** Every batch requires green unit test passes (`nx run-many -t test --all` and `vitest run` in `d:\nuix`).
2. **Visual Verification (Compulsory):** Per user constitution, visual inspection (Playwright screenshots in `/temp/`) is required for modal docking, dialog blur, tooltip swatches, and chart PNG exports.
3. **Packaging Verification:** `npm pack --dry-run` must be run and inspected for all modified packages before staging.
4. **Local Git Commit Protocol:** Local git commits are created after each completed working step to maintain rollback safety points.

---

## 6. Mandatory STOP Gate

**STOP.**  
Phase 1 audit review, architectural decisions, and roadmap preparation are complete.  
No library source code has been altered.

Awaiting explicit user approval (e.g. "Approved", "Go ahead", "Proceed") to begin Phase 2 implementation starting with **Batch A (Security & Functional Correctness)**.
