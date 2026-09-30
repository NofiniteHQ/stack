# Implementation Plan - Markon Deep Audit & Complete Feature Parity Restoration

## Objective

Restore 100% functional reliability, styling integrity, and complete feature parity between the original editor (`@nofinite/nui/src/components/editor`) and `@nofinite/markon` v2.0.0. Resolve all bugs where formatting commands fail, text does not display formatted on the UI, highlights are unstyled or ineffective, toolbar buttons blur editor selections, and extensions present in the TipTap schema lack toolbar controls.

---

## Current Behavior & Root-Cause Diagnosis

### 1. Heading Formatting Not Applied When Selected & Typed

- **Current Behavior:** Selecting H1 or H2 on an empty line or block and typing text often results in plain unstyled paragraph text or lost typing.
- **Root Cause:**
  1. `typographyMenu.ts` chained `.lift('blockquote').setHeading(...)`. When the selection is not inside a blockquote, `can().lift('blockquote')` returns `false`, causing the entire TipTap command chain to abort without executing `setHeading()`.
  2. When the typography menu closes, the menu button is removed from the DOM, causing the browser to reset active DOM focus to `document.body`. Because the editor is blurred, keystrokes are lost or caret position is disrupted.
  3. Safe chaining requires using TipTap's standard `clearNodes()` (or checking `editor.isActive('blockquote')` before lifting) and explicitly refocusing the editor with `editor.commands.focus()` upon menu selection.

### 2. Highlights Option Not Working Properly

- **Current Behavior:** Clicking the Highlight button either does nothing, blurs the selection, or creates `<mark>` tags in JSON that render invisibly or with harsh unstyled browser default `#ffff00` in the UI.
- **Root Cause:**
  1. `@nofinite/nuicss` (`theme.css`) contains **zero CSS rules** for `mark`. Under CSS resets, `<mark>` has `background-color: transparent; color: inherit;`.
  2. The toolbar only calls `toggleHighlight()` with no color option. The original editor had a dedicated popover with 6 pastel presets (`#fef08a` yellow, `#bbf7d0` green, `#bae6fd` blue, `#fbcfe8` pink, `#fed7aa` orange, `#e9d5ff` purple) plus `transparent` (clear highlight).
  3. Clicking the highlight button fires `mousedown` without `e.preventDefault()`, blurring ProseMirror and collapsing the text selection before the highlight command executes.

### 3. Missing Buttons & "In JSON but Not on UI" Discrepancy

- **Current Behavior:** Multiple features exist in TipTap schemas or were present in the original NUI Editor, but have disappeared from Markon:
  1. **Text Color Picker (`Color` / `TextStyle`):** Extension is active in `extensions.ts`, generating `color` in JSON, but there is no Text Color button on the toolbar.
  2. **Font Size (`FontSize`):** Removed during migration. Users cannot choose font sizes (12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px).
  3. **Font Family (`FontFamily`):** Removed during migration (Inter, Arial, Georgia, Times New Roman, Monospace).
  4. **Subscript & Superscript:** Extensions are active in `extensions.ts`, generating JSON attributes, but have no buttons on the toolbar.
  5. **Clear Formatting (`RemoveFormatting`):** Missing from toolbar (`editor.chain().focus().clearNodes().unsetAllMarks().run()`).
  6. **Align Justify:** Only Left, Center, and Right buttons exist; Justify was omitted.
  7. **YouTube Video Embed:** Extension and toolbar button were removed.
  8. **Image Upload:** Original editor supported both URL input and local file upload; Markon only has a URL modal.

### 4. Interactive Deficiencies in Menus & Slash Commands

- **Slash Commands (`slashCommand.ts`):** The slash menu renders buttons with `mousedown` prevention but **lacks a `click` event listener**. Clicking with a mouse does nothing; only keyboard `Enter` worked.
- **Bubble Menu (`bubbleMenu.ts`):** Link button used native `window.prompt` instead of the centered modal; lacked highlight and text color shortcuts.

---

## Proposed Solution

### Area 1: Upstream Design System Styling (`@nofinite/nuicss`)

Add semantic NUICSS token-backed styling for text formatting marks in `packages/nuicss/src/styles/theme.css`:

- **`mark`:**
  ```css
  .editor-content mark,
  .markon-editor mark,
  .tiptap-wrapper .tiptap mark {
    background-color: var(--color-warning-subtle, #fef08a);
    color: var(--fg-default);
    padding: 0.125rem 0.25rem;
    border-radius: var(--radius-xs, 0.25rem);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
  .editor-content mark[data-color],
  .markon-editor mark[data-color],
  .tiptap-wrapper .tiptap mark[data-color] {
    background-color: var(
      --highlight-color,
      var(--color-warning-subtle, #fef08a)
    );
  }
  ```
- **`sub` & `sup`:**
  ```css
  .editor-content sub,
  .markon-editor sub {
    vertical-align: sub;
    font-size: 0.75em;
  }
  .editor-content sup,
  .markon-editor sup {
    vertical-align: super;
    font-size: 0.75em;
  }
  ```

### Area 2: Core Extensions & Formatting Robustness (`@nofinite/markon`)

1. **Restore `FontSize` Extension:**
   - Create `packages/markon/src/core/fontSize.ts` providing `setFontSize` and `unsetFontSize` commands on `textStyle`.
   - Register `FontSize` and `FontFamily` in `getMarkonExtensions()`.
2. **Typography Menu Chaining & Focus Preservation:**
   - Update `packages/markon/src/core/typographyMenu.ts` to use `clearNodes()` before setting block types:
     ```ts
     command: (editor) =>
       editor.chain().focus().clearNodes().setHeading({ level }).run();
     ```
   - In `btn.addEventListener('click')`, call `this.close()` and ensure `this.editor.commands.focus()` is called immediately so typing continues seamlessly in the new block.
3. **Preserve Selection on Toolbar Mousedown:**
   - In `MarkonEditor.ts`, attach `toolbar.addEventListener('mousedown', (e) => { e.preventDefault(); })`. This guarantees the browser never steals focus or blurs the text selection when clicking any toolbar control.

### Area 3: Full Toolbar Controls & Color Pickers

1. **Highlight Color Popover:**
   - Replace the plain toggle with a sleek NUICSS popover menu offering:
     - 6 pastel color presets: `#fef08a` (Yellow), `#bbf7d0` (Green), `#bae6fd` (Blue), `#fbcfe8` (Pink), `#fed7aa` (Orange), `#e9d5ff` (Purple).
     - Clear Highlight (`unsetHighlight()`).
2. **Text Color Popover:**
   - Add Text Color button (`Palette` icon) with palette presets and clear color (`unsetColor()`).
3. **Font Size & Font Family Dropdowns:**
   - Add Font Size trigger (`12px` to `36px`) and Font Family trigger (Inter, Arial, Georgia, Times New Roman, Monospace).
4. **Restore Subscript, Superscript, Clear Formatting & Justify:**
   - Add `subscript` (`X₂`), `superscript` (`X²`), `clearFormatting` (`Tx`), and `justify` buttons to the toolbar with active states.
5. **Image URL & File Upload Support:**
   - Add file upload trigger to Image dialog so users can either paste a URL or pick a local image file.
6. **YouTube Embed Support:**
   - Add YouTube embed node/dialog support.

### Area 4: Slash Commands & Bubble Menu Fixes

1. **Slash Commands:**
   - Attach `click` handler to each item in `slashCommand.ts` so mouse clicking immediately executes the command and closes the menu.
   - Add Highlight and Text Color commands to the slash list.
2. **Bubble Menu:**
   - Integrate custom modal dialog for links instead of `window.prompt`.
   - Add Highlight and Text Color buttons to the floating bubble menu.

---

## Affected Files & Modules

- `packages/nuicss/src/styles/theme.css`: Add styles for `mark`, `sub`, and `sup`.
- `packages/markon/src/core/fontSize.ts`: New framework-agnostic font size extension.
- `packages/markon/src/core/extensions.ts`: Register `FontSize`, `FontFamily`, `Color`, `TextStyle`.
- `packages/markon/src/core/typographyMenu.ts`: Robust block switching with `clearNodes()` and post-selection focus restoration.
- `packages/markon/src/core/MarkonEditor.ts`: Toolbar markup, color popovers, font size/family, subscript, superscript, clear formatting, justify, image upload, toolbar mousedown prevention.
- `packages/markon/src/core/slashCommand.ts`: Mouse click event listener and additional formatting items.
- `packages/markon/src/core/bubbleMenu.ts`: Modern link modal integration and highlight button.

---

## Dependencies & Tools

- No new external dependencies needed (TipTap core extensions and `@floating-ui/dom` already present).
- `@nofinite/nuicss` compiled styles.

---

## Alternatives Considered

- _Alternative:_ Keep toolbar minimal and relegate extra features to extensions only.
  _Rejected:_ The user explicitly noted that features show in JSON but do not display on the UI, and highlighted the loss of functionality from the pre-migration baseline. Full parity ensures Markon is a premier universal rich text engine.

---

## Risks & Mitigations

- **Risk:** Toolbar clutter from additional buttons.
  _Mitigation:_ Organize into logical semantic groups with vertical dividers (`Separators`) and responsive wrapping, exactly matching the clean layout of the original editor.
- **Risk:** Selection loss during color picker or dropdown interaction.
  _Mitigation:_ Enforce `mousedown` `preventDefault()` across all toolbar buttons and dropdown items.

---

## Verification Strategy

1. **Unit & Integration Tests:** Run `pnpm nx run-many -t test -p markon nuicss` with Vitest.
2. **Automated Playwright Reproduction & Visual Audit:**
   - Test H1/H2 selection on empty line and typing verification (confirm DOM tag is `H1` and computed font size is `30px`/`700`).
   - Test Highlight with presets and verify `<mark>` background color and contrast in light and dark mode.
   - Test Font Size, Font Family, Subscript, Superscript, and Clear Formatting.
   - Test Slash Commands mouse click execution.
   - Capture visual screenshots in `temp/screenshots/` and inspect them.
3. **Build & Tarball Verification:** Run `pnpm nx run markon:build` and `npm pack --dry-run` to ensure clean distribution.

---

## Rollback Plan

All changes can be reverted cleanly via `git checkout dev` or by reverting specific commits if needed.
