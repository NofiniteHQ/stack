# Implementation Plan: `@nofinite/markon` Enterprise-Grade Polish & Deep Refactor

## 1. Objective

Elevate `@nofinite/markon` into an enterprise-grade, world-class rich text and content authoring engine. Address all forensic audit findings, user requirements, and UX enhancements:

1. **Custom Color Picker & Rich Palette:** Build a bespoke, glassmorphic color picker UI component (eliminating native `<input type="color">`), featuring 12+ curated OKLCH pastel highlights, 12+ chromatic text colors, live hex `#RRGGBB` input with validation, and direct access inside the floating bubble menu.
2. **Markdown Round-Trip Parity:** Fix highlight serialization (`==highlight==` <-> `<mark>`), subscript/superscript (`~sub~`, `^sup^`), tables, callouts, and code blocks.
3. **Interactive Table Suite:** Move table operations out of the top toolbar into a contextual floating table bubble menu with full row/col insertion, deletion, merging, splitting, and header toggling.
4. **Code Block Tab Indentation & Link Hover Popover:** Intercept `Tab`/`Shift+Tab` inside code blocks; build interactive link action popovers (visit, copy, edit, unlink).
5. **Optimistic Uploads & Interaction Hardening:** Add animated placeholder cards during async file/image uploads, dynamically sync Undo/Redo disabled states, and ensure mobile/touch accessibility.
6. **Token Purity & Visual Verification:** Purge hardcoded sRGB/hex literals, ensure seamless integration with `@nofinite/nuicss` (UnoCSS / Preset-Wind4 and superclasses), and verify 100% via unit tests and Playwright visual screenshots.

_Execution Rule: Work proceeds strictly phase-by-phase. Each phase requires review, automated test passes, visual captures, local git commits, and explicit user approval ("next" / "proceed") before starting the subsequent phase._

---

## 2. Technical Decisions & Architectural Alignments

- **Custom Color Picker over Native System Inputs:** Native `<input type="color">` displays an OS-dependent modal that clashes with custom dark/light themes, lacks OKLCH support, and cannot be styled to match NUICSS glassmorphism. We will build a custom Vanilla DOM `MarkonColorPicker` with an interactive gradient/hue slider, hex input with live preview, and curated preset swatches.
- **NUICSS & UnoCSS Engine Alignment:** `@nofinite/nuicss` uses the UnoCSS engine with `@unocss/preset-wind4`. We will leverage NUICSS semantic tokens (`var(--color-primary)`, `var(--bg-surface)`, `var(--border-default)`) and superclasses (`btn`, `card`, `input`, `dropdown-menu`), while ensuring styles are self-contained and resilient across all consumption modes.
- **Contextual Floating Interactions:** Floating menus (Bubble Menu, Link Popover, Table Menu, Color Popovers) will be positioned using `@floating-ui/dom` (`flip()`, `shift()`, `offset()`, `autoUpdate()`) and coordinated through `popoverManager.ts` to prevent collisions.

---

## 3. Phased Implementation Roadmap

```
Phase 1: Custom Color Picker Component & Expanded OKLCH Palettes
    ↓ (Wait for user approval / "next")
Phase 2: Markdown Engine Round-Trip Parity (Highlights, Sub/Sup, Callouts)
    ↓ (Wait for user approval / "next")
Phase 3: Interactive Table Suite & Contextual Floating Table Menu
    ↓ (Wait for user approval / "next")
Phase 4: Code Block Tab Indentation & Interactive Link Popover
    ↓ (Wait for user approval / "next")
Phase 5: Optimistic Upload Placeholders, History Sync & Touch Support
    ↓ (Wait for user approval / "next")
Phase 6: Token Purity, Comprehensive Unit Tests & Playwright Visual Audit
```

---

### Phase 1: Custom Color Picker Component & Expanded OKLCH Palettes [COMPLETED - commit `260dd09`]

**Goal:** Provide an enterprise-grade color selection experience for both highlights and text colors, accessible from both the main toolbar and the floating bubble menu.

- **Completed Deliverables:**
  1. Built `MarkonColorPicker` (`packages/markon/src/core/colorPicker.ts`):
     - Interactive Hue slider bar with continuous gradient preview (`linear-gradient(to right, ...)`).
     - Live Hex input field (`#RRGGBB`) with real-time swatch preview badge, validation, and Apply action.
     - Zero reliance on native OS `<input type="color">`.
     - Standardized popover coordination via `popoverManager.ts` with `zIndex: 10001` and Floating UI collision avoidance.
  2. Expanded **Highlight Palette (12 OKLCH Pastel Tones)**:
     - Yellow, Amber, Coral, Rose, Lavender, Violet, Sky, Teal, Mint, Emerald, Slate, Brown.
     - "Remove Highlight" action button.
  3. Expanded **Text Color Palette (12 OKLCH Chromatic Hues)**:
     - Default (clear slash icon), Muted, Dark, Amber, Orange, Red, Rose, Purple, Brand, Blue, Teal, Green.
     - "Reset to Default" action button.
  4. Bubble Menu Color Integration (`bubbleMenu.ts`):
     - Added dedicated `Text Color` button beside `Highlight`.
     - Live swatch and color bar indicator previews directly on bubble buttons.
     - Context retention: Popover interaction prevents bubble menu dismissal while picking colors.
     - Selection preservation: Caches and restores `{ from, to }` range when colors are selected or cleared.
  5. Updated `toolbarMenus.ts` to delegate to `MarkonColorPicker`.
  6. **Verification Passed:**
     - 40/40 unit tests passing (`npx vitest run packages/markon`).
     - `npm pack --dry-run` tarball verified (all types and bundles present).
     - Visual audit verified in Chromium (`/temp/markon_toolbar_highlight_picker.png`, `/temp/markon_toolbar_textcolor_picker.png`, `/temp/markon_bubble_menu_with_colors.png`, `/temp/markon_bubble_highlight_picker_open.png`, `/temp/markon_highlight_applied.png`, `/temp/markon_bubble_textcolor_picker_open.png`).

---

### Phase 2: Markdown Engine Round-Trip Parity [COMPLETED]

**Goal:** Ensure 100% lossless conversion between Markdown and HTML/TipTap documents.

- **Completed Deliverables:**
  1. Highlight Round-Trip:
     - `htmlToMarkdown`: parse `<mark>` tags and output `==highlighted text==` in both DOM and SSR modes.
     - `markdownToHtml`: parse `==text==` into semantic `<mark>` elements via `inlineFormatting`.
  2. Subscript & Superscript:
     - `htmlToMarkdown`: support `<sub>` -> `~text~` and `<sup>` -> `^text^`.
     - `markdownToHtml`: support single-tilde `(?<!~)~([^~\s][^~]*?)~(?!~)` -> `<sub>` and `\^([^^]+)\^` -> `<sup>`.
  3. Markdown Fidelity Hardening:
     - Formatted table cells: mapping table cells via `processNode` preserves inline bold, italic, code, links, highlights, and subscripts.
     - GitHub Callouts: multi-paragraph note/warning/tip/caution callouts convert to clean paragraphs inside `.alert-content` and round-trip cleanly without extra blank lines.
     - LaTeX Math Blocks: supports both single-line `$$...$$` and multi-line `$$\n...\n$$` blocks.
     - Details / Accordions: guarantees wrapping into TipTap-compatible `<div data-details-content="">`.
  4. **Verification Passed:**
     - 44/44 unit tests passing (`npx vitest run packages/markon`).
     - Visual audit verified in Chromium (`/temp/markon_markdown_roundtrip_rendered.png`).
     - Lossless markdown extraction verified in runtime browser environment.

---

### Phase 3: Interactive Table Suite & Contextual Floating Table Menu [COMPLETED]

**Goal:** Remove table clutter from the static toolbar and provide a modern Notion/Google Docs style contextual table experience.

- **Completed Deliverables:**
  1. Contextual Table Bubble Menu (`bubbleMenu.ts`):
     - Floating toolbar that automatically appears anchored directly above the active cell when the caret enters a table cell.
     - Clean SVG icon buttons with tooltips for:
       - Row: Add Above (`addRowBefore`), Add Below (`addRowAfter`), Delete Row (`deleteRow`).
       - Column: Add Left (`addColumnBefore`), Add Right (`addColumnAfter`), Delete Column (`deleteColumn`).
       - Headers: Toggle Header Row (`toggleHeaderRow`), Toggle Header Column (`toggleHeaderColumn`).
       - Cells: Merge Cells (`mergeCells`), Split Cell (`splitCell`) with active capability detection (`can().mergeCells()`, `can().splitCell()`).
       - Danger: Delete Entire Table (`deleteTable`).
     - Automatic seamless switching: when text is selected within a table cell, smoothly switches to the text formatting bubble menu; when selection collapses, returns to table controls.
  2. Toolbar Cleanup:
     - Removed static `.editor-table-tools` text buttons (`+Row`, `-Row`, `+Col`, `-Col`, `Del Table`) from the main editor toolbar, preserving a clean and uncluttered header.
     - Maintained programmatic table commands in `execCommand` and dimension picker in `MarkonTableMenu`.
  3. Cell Selection Highlight:
     - Styled `.selectedCell:after` with OKLCH primary mix token in `styleInjector.ts`.
  4. **Verification Passed:**
     - 45/45 unit tests passing (`npx vitest run packages/markon`).
     - Clean compilation with Vite (`npx vite build --config packages/markon/vite.config.ts`) and zero declaration errors.
     - Verified `npm pack --dry-run` contains all 74 expected assets and types.
     - Visual audit verified in Chromium via Playwright:
       - `/temp/markon_table_bubble_menu_open.png`
       - `/temp/markon_table_row_added.png`
       - `/temp/markon_table_cell_text_selected.png`

---

### Phase 4: Code Block Tab Indentation & Interactive Link Popover [COMPLETED]

**Goal:** Provide developer-grade code editing and effortless link management.

- **Completed Deliverables:**
  1. Code Block Tab Indentation (`codeBlock.ts`):
     - Added `addKeyboardShortcuts()` to `MarkonCodeBlock`:
       - `Tab` inside code block inserts 2 spaces without losing editor focus or blurring to browser window.
       - `Shift-Tab` deletes up to 2 leading spaces before cursor to unindent cleanly.
       - Supports both single-line and multiline indentation and unindentation with safe empty text node handling.
  2. Interactive Link Popover (`linkPopover.ts` & `bubbleMenu.ts`):
     - Automatically displays floating action card when caret enters an existing hyperlink or user clicks on it:
       - Truncated display URL with external link icon opening in new tab (`target="_blank"`).
       - "Copy URL" button with clipboard integration and checkmark feedback.
       - "Edit Link" button opening URL modal.
       - "Unlink" button immediately removing the link mark.
     - Exported `formatDisplayUrl` and `renderLinkPopoverHtml` in core exports.
  3. **Verification Passed:**
     - 48/48 unit tests passing (`npx vitest run packages/markon`).
     - Clean compilation with Vite (`npx vite build --config packages/markon/vite.config.ts`) and zero TypeScript declaration errors.
     - Verified `npm pack --dry-run` contains all 76 expected files, bundles, and type definitions.
     - Visual audit verified in Chromium via Playwright:
       - `/temp/markon_link_popover_open.png`
       - `/temp/markon_code_block_tab_indented.png`

---

### Phase 5: Optimistic Upload Placeholders, History Sync & Touch Support [COMPLETED]

**Goal:** Eliminate silent UI freezes during file uploads and improve history/mobile UX.

- **Completed Deliverables:**
  1. Optimistic Upload Placeholders (`uploadPlaceholder.ts` & `MarkonEditor.ts`):
     - Created `UploadPlaceholder` TipTap Node extension with `uploadId`, `name`, `size`, `type`, `previewUrl`, `status`, and `errorMessage` attributes.
     - Interactive NodeView featuring live animated spinner, file icon / image thumbnail, file size metadata, in-progress badge, and error dismissal.
     - When `handleUploadedFile(file)` is called, immediately inserts optimistic placeholder card into the document.
     - Atomically swaps placeholder with final `image` or `fileAttachment` node when promise resolves, or transitions to red warning error card on network failure.
     - Lossless markdown serializer cleanly ignores transient upload placeholder cards.
  2. Dynamic Undo / Redo State Sync (`MarkonEditor.ts`):
     - In `updateToolbarState()`, inspects `this.tiptap.can().undo()` and `this.tiptap.can().redo()`.
     - Dynamically applies `disabled`, `aria-disabled="true"`, and `opacity-40 cursor-not-allowed` to `button[data-command="undo"]` and `button[data-command="redo"]`.
     - Toolbar click listener defensively ignores clicks on disabled history buttons.
  3. Mobile & Touch Drag Handle Fallback (`dragHandle.ts`):
     - Added `touchstart` gesture detection on editor blocks so tapping on mobile/touch screens reveals the drag handle without needing desktop mouse hover.
     - Enlarged touch hit target (`28x28px`) on touch viewports (`@media (pointer: coarse)`).
     - Added floating **Block Actions Menu** anchored to drag handle with Floating UI (`computePosition`, `flip`, `shift`, `offset`, `autoUpdate`) offering 1-tap block actions:
       - Move Up (automatically disabled for top block)
       - Move Down (automatically disabled for bottom block)
       - Duplicate
       - Select Block
       - Delete Block
     - Suppressed text bubble menu when block `NodeSelection` is active to eliminate UI clash.
  4. **Verification Passed:**
     - 52/52 unit tests passing (`npx vitest run packages/markon`).
     - TypeScript compiler check passing with zero errors (`npx tsc -p packages/markon/tsconfig.lib.json --noEmit`).
     - Clean compilation with Vite (`npx vite build --config packages/markon/vite.config.ts`) and zero declaration errors.
     - Verified `npm pack --dry-run` contains all 78 expected assets and types.
     - Visual audit verified in Chromium via Playwright:
       - `/temp/markon_phase5_initial_history_and_uploads.png` (disabled undo/redo buttons + optimistic upload & error cards)
       - `/temp/markon_phase5_undo_button_enabled.png` (undo button becomes active upon content edit)
       - `/temp/markon_phase5_block_actions_menu_open.png` (contextual block actions popover menu open)
       - `/temp/markon_phase5_mobile_touch_view.png` (mobile 390px viewport touch layout)

---

### Phase 6: Token Purity, Comprehensive Unit Tests & Playwright Visual Audit

**Goal:** Finalize design system compliance, ensure 100% test coverage, and visually verify every state.

- **Tasks:**
  1. Design Token Purge:
     - Replace all hardcoded `rgba(29, 78, 216, ...)` and hex literals in `styleInjector.ts` and `markon.css` with NUICSS semantic tokens (`var(--color-primary-subtle)`, `var(--bg-inset)`, `var(--fg-muted)`).
     - Standardize OKLCH color-mix in `callout.ts`.
  2. Unit Testing:
     - Add tests in `markon.test.ts` covering:
       - Custom Color Picker functions and hex validation.
       - Markdown round-trip for highlights, subscript, and superscript.
       - Table commands (add/delete row/col, merge/split).
       - Code block Tab key handling.
  3. Playwright Visual Verification:
     - Capture high-resolution screenshots in `/temp/screenshots/` verifying:
       - Custom color picker open in toolbar and bubble menu.
       - Floating contextual table menu.
       - Link action popover.
       - Code block with highlighted code.
       - Optimistic upload card.
       - Light and dark themes.
  4. Verify package build via `npx nx build markon` and `npm pack --dry-run`.

---

## 4. Dependencies & Verification Strategy

- No new external runtime dependencies required.
- Everything built using vanilla DOM, TipTap/ProseMirror core APIs, `@floating-ui/dom`, and `@nofinite/nuicss`.
- Verification relies on automated Vitest tests, Playwright visual screenshots, and `npm pack --dry-run`.
