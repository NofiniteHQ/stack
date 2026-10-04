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

### Phase 1: Custom Color Picker Component & Expanded OKLCH Palettes

**Goal:** Provide an enterprise-grade color selection experience for both highlights and text colors, accessible from both the main toolbar and the floating bubble menu.

- **Tasks:**
  1. Build `MarkonColorPicker` (`packages/markon/src/core/colorPicker.ts`):
     - Interactive Hue slider bar + Saturation/Lightness picker area (or interactive 2D gradient selector).
     - Hex input field (`#RRGGBB`) with real-time swatch preview, validation, and paste support.
     - Zero reliance on native `<input type="color">`.
  2. Expanded **Highlight Palette (12+ OKLCH Pastel Tones)**:
     - Yellow, Amber/Orange, Coral/Red, Rose/Pink, Purple/Lavender, Violet, Blue/Sky, Cyan/Teal, Emerald/Green, Lime/Mint, Slate/Gray, Warm Brown.
     - "Remove Highlight" clear action button.
  3. Expanded **Text Color Palette (12+ OKLCH Chromatic Hues)**:
     - Default (inherit with clear icon), Slate/Muted, Amber, Orange, Red, Rose, Purple, Indigo, Blue, Teal, Green, Dark Neutral.
     - "Reset to Default" action button.
  4. Bubble Menu Color Integration:
     - Update `bubbleMenu.ts` so clicking "Highlight" or "Text Color" opens the custom color picker popover directly over the user's selected text.
  5. Update `toolbarMenus.ts` to consume the new `MarkonColorPicker`.

---

### Phase 2: Markdown Engine Round-Trip Parity

**Goal:** Ensure 100% lossless conversion between Markdown and HTML/TipTap documents.

- **Tasks:**
  1. Highlight Round-Trip:
     - `htmlToMarkdown`: parse `<mark>` tags and output `==highlighted text==` (preserving colors when relevant).
     - `markdownToHtml`: parse `==text==` into `<mark>` elements.
  2. Subscript & Superscript:
     - `htmlToMarkdown`: support `<sub>` -> `~text~` and `<sup>` -> `^text^`.
     - `markdownToHtml`: support `~sub~` -> `<sub>sub</sub>` and `^sup^` -> `<sup>sup</sup>`.
  3. Markdown Fidelity Hardening:
     - Ensure task lists (`- [x]`), details/accordions (`<details>`), LaTeX math (`$$ ... $$`), tables, and callouts round-trip cleanly without dropping content or tags.

---

### Phase 3: Interactive Table Suite & Contextual Floating Table Menu

**Goal:** Remove table clutter from the static toolbar and provide a modern Notion/Google Docs style contextual table experience.

- **Tasks:**
  1. Contextual Table Bubble Menu (`tableBubbleMenu.ts`):
     - Floating toolbar that automatically appears when the caret or selection enters a table cell.
     - Clean icon buttons with tooltips for:
       - Row: Add Above (`addRowBefore`), Add Below (`addRowAfter`), Delete Row (`deleteRow`).
       - Column: Add Left (`addColumnBefore`), Add Right (`addColumnAfter`), Delete Column (`deleteColumn`).
       - Cells: Merge Cells (`mergeCells`), Split Cell (`splitCell`).
       - Headers: Toggle Header Row (`toggleHeaderRow`), Toggle Header Column (`toggleHeaderColumn`).
       - Danger: Delete Entire Table (`deleteTable`).
  2. Toolbar Cleanup:
     - Remove the static `+Row`, `-Row`, `+Col`, `-Col`, `Del Table` text buttons from the top toolbar in `MarkonEditor.ts`.
     - Retain only the initial "Insert Table" dimension grid trigger in the main toolbar.

---

### Phase 4: Code Block Tab Indentation & Interactive Link Popover

**Goal:** Provide developer-grade code editing and effortless link management.

- **Tasks:**
  1. Code Block Tab Indentation (`codeBlock.ts`):
     - Intercept `Tab` key inside `MarkonCodeBlock` to insert 2 spaces (`'  '`) rather than losing focus to the browser window.
     - Intercept `Shift+Tab` to unindent by 2 spaces.
  2. Interactive Link Popover (`linkPopover.ts`):
     - When the caret enters an existing link or clicks on it:
       - Display a floating action card:
         - Destination URL with external link icon (opens link in new tab).
         - "Copy URL" button with brief "Copied!" feedback checkmark.
         - "Edit Link" button opening URL modal.
         - "Unlink" button to remove the hyperlink.

---

### Phase 5: Optimistic Upload Placeholders, History Sync & Touch Support

**Goal:** Eliminate silent UI freezes during file uploads and improve history/mobile UX.

- **Tasks:**
  1. Optimistic Upload Placeholders (`MarkonEditor.ts`):
     - When `onUploadFile(file)` begins, insert a temporary placeholder node (`<div class="markon-uploading-card">`) displaying the file name, animated NUICSS spinner, and upload status.
     - Upon promise resolution, replace the placeholder atomically with the final image or file attachment node.
     - On error, display clear error badge and remove placeholder.
  2. Dynamic Undo / Redo State Sync:
     - In `updateToolbarState()`, check `this.tiptap.can().undo()` and `this.tiptap.can().redo()`.
     - Dynamically set/remove `disabled` attribute and `opacity-50` class on history buttons.
  3. Mobile & Touch Drag Handle Fallback:
     - On touch devices or viewports where drag-and-drop is unsupported, provide a tap-to-select / block action menu so blocks can still be moved or deleted cleanly.

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
