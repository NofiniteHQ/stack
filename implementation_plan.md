# Implementation Plan: `@nofinite/markon` Enterprise-Grade Remediation & True Decoupling

## 1. Objective

Remediate all architectural, visual, and functional defects in `@nofinite/markon` discovered during the forensic audit. Decouple the framework-agnostic core from React dependencies so `@nofinite/markon` is truly 100% universal, restore full `@nofinite/nuicss` design system and token harmony, fix broken floating geometries (slash command and bubble menus), harden block reordering physics, eliminate React controlled-state cursor jumping, upgrade draft auto-saving from quota-limited `localStorage` to `IndexedDB`, and restore missing production features from the original React era.

Work will proceed strictly phase-by-phase. **Execution of each phase will pause until explicit user confirmation (`"next"`) is received.**

---

## 2. Current Behavior & Forensic Audit Summary

1. **The React Dependency Leak (Critical Architectural Defect):**

   - In `packages/markon/src/index.ts`, the root entry point re-exports `ReactMarkonEditor` and `useMarkon` from `./react`.
   - Rollup/Vite compiles `src/index.ts` and `src/react/index.ts` into a single shared chunk (`chunks/useMarkon-[hash].js`) that imports `react` and `react/jsx-runtime`.
   - `dist/index.js` imports this chunk. In any pure Vanilla JS, HTMX, Svelte, Vue, or native browser ESM context, importing `@nofinite/markon` crashes with:
     `Failed to resolve module specifier "react/jsx-runtime". Relative references must start with either "/", "./", or "../".`

2. **Design System & Token Violations (`@nofinite/nuicss`):**

   - Hardcoded hex literal `#1d4ed8` in `toolbarMenus.ts` (`TEXT_COLOR_PRESETS`).
   - Hardcoded numeric OKLCH literals (`oklch(0.96 0.08 95)`) in `HIGHLIGHT_PRESETS`.
   - Massive duplicate inline style strings in `fileAttachment.ts` bypassing NUICSS superclasses.
   - Missing `.hidden` utility in NUICSS caused file inputs to visibly render as `Choose File No file chosen` in the toolbar.
   - Plain text crammed table buttons (`+Row -Row +Col -Col Del Table`) in the toolbar.

3. **Floating Geometry & Popover Failures:**

   - In `slashCommand.ts`, `props.clientRect()` returns null or zero-rect at the beginning of lines, dumping the slash command menu unstyled at the very bottom of the document (`markon_v5_slash_command.png`).
   - In `bubbleMenu.ts`, the menu only supports text and opens over images/videos/tables, showing bold/italic controls on non-text nodes.
   - Module-level closure variables in `slashCommand.ts` cause collisions between multiple editor instances on the same page.

4. **Block Reordering Fragility (`dragHandle.ts`):**

   - Dragging a block uses `tr.delete(fromPos)` and `tr.insert(mappedToPos)`. If dropped inside an incompatible parent node (table, details summary), ProseMirror throws schema violation errors.
   - Drag handles only resolve at `depth = 1`, ignoring list items and nested blocks.

5. **React Controlled Wrapper Cursor Jumps (`MarkonEditor.tsx`):**

   - Naive string comparison `currentHTML !== value` compares normalized TipTap HTML with parent state strings, resetting the cursor to position 0 and wiping undo history on keystrokes.

6. **Missing Production Features from the React Era:**
   - **Link Preview Card** (`LinkPreview.ts`) was completely lost during the initial decoupling.
   - **Optimistic File/Media Uploads** with spinner placeholders are missing.
   - **IndexedDB Draft Persistence** with offline reconnect sync was replaced with quota-limited (5MB) `localStorage`.

---

## 3. Proposed Phased Remediation Roadmap

```
Phase 1: Pure Framework-Agnostic Core Decoupling & Clean ESM Exports
    ↓ (Wait for user approval / "next")
Phase 2: NUICSS Design System Alignment, Token Hygiene & Toolbar Polish
    ↓ (Wait for user approval / "next")
Phase 3: Context-Aware Multi-Mode Bubble Menu & Slash Command Geometry Fix
    ↓ (Wait for user approval / "next")
Phase 4: Schema-Safe Block Drag-and-Drop Reordering Engine
    ↓ (Wait for user approval / "next")
Phase 5: React Controlled Wrapper Hardening & IndexedDB Draft Engine
    ↓ (Wait for user approval / "next")
Phase 6: Production Feature Parity, Storybook Rebuild & Playwright Visual Audit
```

---

### Phase 1: Pure Framework-Agnostic Core Decoupling & Clean ESM Exports

**Goal:** Ensure `@nofinite/markon` root export is 100% free of React, allowing seamless consumption in Vanilla JS, HTMX, Svelte, Vue, or native ESM script tags without bundling or resolving React.

- **Key Deliverables:**
  1. **Clean Root Entry Point (`packages/markon/src/index.ts`):**
     - Change `src/index.ts` to `export * from './core';` exclusively.
     - Remove re-exports of `ReactMarkonEditor` and `useMarkon` from root `src/index.ts`.
  2. **Isolate React Subpath (`packages/markon/src/react/index.ts`):**
     - React components and hooks remain in `src/react/index.ts` and are exported only via `@nofinite/markon/react`.
  3. **Vite / Rollup Multi-Entry Decoupling (`vite.config.ts`):**
     - Configure Rollup outputs so the `index` entry chunk does NOT share modules with `react/index`.
     - Ensure `dist/index.js` contains zero imports of `react` or `react/jsx-runtime`.
  4. **Browser ESM Playwright Test (`temp/test-vanilla-esm.cjs`):**
     - Verify that a headless Chromium browser loads `/packages/markon/dist/index.js` in a native `<script type="module">` with zero module resolution errors and instantiates `new MarkonEditor()`.

---

### Phase 2: NUICSS Design System Alignment, Token Hygiene & Toolbar Polish

**Goal:** Enforce 100% `@nofinite/nuicss` compliance, eliminate hardcoded hex and raw OKLCH literals, remove redundant inline styles, and polish the toolbar layout.

- **Key Deliverables:**
  1. **Purge Hardcoded Hex & Numeric Literals:**
     - In `toolbarMenus.ts`: Replace `#1d4ed8` in `TEXT_COLOR_PRESETS` with `var(--color-primary)` or `var(--color-info)`.
     - In `toolbarMenus.ts`: Replace raw `oklch(...)` literals in `HIGHLIGHT_PRESETS` with semantic tokens (`var(--color-warning-subtle)`, `var(--color-success-subtle)`, etc.).
  2. **Clean Up `fileAttachment.ts`:**
     - Replace repetitive inline style strings with clean semantic NUICSS classes (`card`, `attachment`).
  3. **Normalize `dialog.ts` Modal Architecture:**
     - Remove redundant utility clusters on `.modal-box` (which are already provided by NUICSS).
     - Ensure strict modal contract: explicit Cancel/Confirm buttons, no ambiguous duplicate corner 'X', and glassmorphic backdrop.
  4. **File Input Display Isolation:**
     - Ensure file inputs in the toolbar have explicit `hidden` attributes and inline `display: none;` so they never render as raw file pickers.
  5. **Toolbar Overflow & Table Tools Polish:**
     - Replace plain text buttons (`+Row -Row +Col -Col Del Table`) with clean icon buttons or move them to contextual table menus.
     - Group controls logically so the toolbar maintains visual hierarchy without awkward line wrapping.

---

### Phase 3: Context-Aware Multi-Mode Bubble Menu & Slash Command Geometry Fix

**Goal:** Fix the slash command popup positioning defect and restore multi-mode context awareness to the floating bubble menu.

- **Key Deliverables:**
  1. **Fix Slash Command Coordinate Fallback (`slashCommand.ts`):**
     - When `props.clientRect()` is null or zero (e.g. typing `/` at start of line), calculate coordinates from `view.coordsAtPos(editor.state.selection.from)`.
     - Prevent unpositioned popup DOM appending to body that dumped text at the bottom of the page.
     - Encapsulate popup state per editor instance to avoid cross-editor collisions.
     - Style popup menu with semantic NUICSS `.card` and `.btn` classes.
  2. **Multi-Mode Bubble Menu (`bubbleMenu.ts`):**
     - Inspect active ProseMirror selection type:
       - **Text Selection**: Show formatting tools (bold, italic, underline, strike, highlight, code, link).
       - **Image Selection (`NodeSelection`)**: Show Image Bubble Menu (align left, center, right, width presets, remove).
       - **Video Selection**: Show Video Bubble Menu (service options, align, remove).
       - **Table Selection**: Show Table Bubble Menu (insert row, insert column, delete).
     - Suppress text bubble menu when an image or video is clicked.

---

### Phase 4: Schema-Safe Block Drag-and-Drop Reordering Engine

**Goal:** Harden the block drag handle and drop target physics against ProseMirror schema violations and expand drag handle capabilities.

- **Key Deliverables:**
  1. **Safe Node Insertion (`dragHandle.ts`):**
     - Validate that the target destination is a valid insertion position for `sourceNode.type` before dispatching `tr.insert()`.
     - If dropping adjacent to specialized parent blocks (tables, code blocks, details), resolve to valid sibling boundary rather than corrupting inner nodes.
  2. **Nested Block & List Support:**
     - Allow dragging list items and task items within their lists in addition to top-level blocks.
  3. **Visual Drop Line Precision:**
     - Align drop indicator line with exact block boundaries and container scroll offsets.

---

### Phase 5: React Controlled Wrapper Hardening & IndexedDB Draft Engine

**Goal:** Eliminate caret jumping in React controlled mode and upgrade auto-saving from quota-limited `localStorage` to robust `IndexedDB`.

- **Key Deliverables:**
  1. **React Controlled State Synchronization (`src/react/MarkonEditor.tsx`):**
     - Replace naive `currentHTML !== value` check with a semantic or normalized content comparison to prevent resetting cursor and undo stack on minor HTML formatting differences.
  2. **IndexedDB Draft Engine (`src/core/draftManager.ts`):**
     - Implement `MarkonIndexedDB` storage for drafts using IndexedDB with `localStorage` fallback.
     - Prevents `QuotaExceededError` (5MB limit) when documents contain embedded images.
     - Add `window.addEventListener('online')` auto-sync to synchronize drafts when connectivity is restored.

---

### Phase 6: Production Feature Parity, Storybook Rebuild & Playwright Visual Audit

**Goal:** Restore missing production features (Link Preview cards, optimistic upload feedback), rebuild Storybook, and perform complete visual verification via Playwright.

- **Key Deliverables:**
  1. **Link Preview Card Extension (`src/core/linkPreview.ts`):**
     - Restore the Link Preview extension with OpenGraph metadata card preview, title, description, and loading state.
  2. **Optimistic Upload Progress Indicator:**
     - Show placeholder spinner block while async file upload is in progress.
  3. **Storybook Stories Update & Rebuild:**
     - Rebuild Storybook (`pnpm build:storybook`) with updated Markon stories covering:
       - Default Full Toolbar & Typography Menu
       - Controlled React Component
       - Image, Video & Link Preview Cards
       - Table Operations
       - Dark Mode OKLCH Harmony
  4. **Playwright Visual Verification:**
     - Run visual test script capturing screenshots of all states into `/temp/screenshots/`.
     - Verify zero console errors, zero layout shifts, and perfect design token compliance.
  5. **NPM Package Verification & Git Commit:**
     - Run `npm pack --dry-run` to ensure clean tarball.
     - Create a clean local git commit in `packages/markon`.

---

## 4. Affected Files & Modules

| File                                 | Repository / Path | Role                                        |
| :----------------------------------- | :---------------- | :------------------------------------------ |
| `src/index.ts`                       | `packages/markon` | Root entry point (pure Vanilla core export) |
| `src/core/index.ts`                  | `packages/markon` | Core module exports                         |
| `src/core/MarkonEditor.ts`           | `packages/markon` | Core editor class & toolbar layout          |
| `src/core/bubbleMenu.ts`             | `packages/markon` | Multi-mode contextual bubble menu           |
| `src/core/slashCommand.ts`           | `packages/markon` | Slash command popup & coordinate resolution |
| `src/core/dragHandle.ts`             | `packages/markon` | Schema-safe block drag & drop               |
| `src/core/draftManager.ts`           | `packages/markon` | IndexedDB draft auto-save engine            |
| `src/core/toolbarMenus.ts`           | `packages/markon` | NUICSS token hygiene (colors, fonts, sizes) |
| `src/core/dialog.ts`                 | `packages/markon` | Modal contract & superclass compliance      |
| `src/core/fileAttachment.ts`         | `packages/markon` | Purge inline styles, adopt NUICSS classes   |
| `src/core/linkPreview.ts` (New)      | `packages/markon` | Link preview card extension                 |
| `src/react/MarkonEditor.tsx`         | `packages/markon` | React controlled wrapper hardening          |
| `src/react/useMarkon.ts`             | `packages/markon` | React headless hook                         |
| `src/react/MarkonEditor.stories.tsx` | `packages/markon` | Storybook stories                           |
| `src/markon.test.ts`                 | `packages/markon` | Vitest test suite                           |
| `vite.config.ts`                     | `packages/markon` | Vite multi-entry decoupled bundling         |
| `package.json`                       | `packages/markon` | Package exports & dependencies              |

---

## 5. Alternatives Considered

1. **Keep React re-export in `src/index.ts` with optional chaining:**
   - _Rejected:_ Modern bundlers and browser ESM resolve static imports at load time. Externalized bare specifiers fail immediately in non-React runtimes.
2. **Continue using `localStorage` for drafts:**
   - _Rejected:_ Documents with embedded base64 images easily exceed the 5MB quota, causing fatal exceptions in production.

---

## 6. Risks & Mitigations

1. **Risk:** Decoupling `src/index.ts` might break existing code importing `ReactMarkonEditor` from `@nofinite/markon` directly instead of `@nofinite/markon/react`.
   - _Mitigation:_ In `src/react/index.ts`, provide clear re-exports. In documentation and migration guides, clarify that React components live in `@nofinite/markon/react`.
2. **Risk:** IndexedDB might not be available in private browsing or insecure contexts.
   - _Mitigation:_ Implement graceful degradation: if `window.indexedDB` is blocked or unavailable, fall back cleanly to `localStorage` or memory store.

---

## 7. Verification Strategy

1. **Unit Tests:** `npx vitest run packages/markon` ensuring all 20+ tests pass.
2. **ESM Browser Import Check:** Playwright script loading `dist/index.js` in plain HTML verifying zero React import errors.
3. **Build & Pack Verification:** `pnpm nx run markon:build` and `npm pack --dry-run` in `packages/markon`.
4. **Visual Playwright Audit:** Capture and inspect screenshots in `/temp/screenshots/` across light mode, dark mode, slash commands, bubble menu, and modals.
