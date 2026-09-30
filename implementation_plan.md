# Implementation Plan

## Status

**Status:** Approved by User (Proceeding to Implementation)

User Feedback Incorporated:

1. Modal: Strictly consume `@nofinite/nuicss` and `@nofinite/nuix` native `<dialog class="modal">` with `modal-box`, `backdrop:bg-overlay`, `backdrop:backdrop-blur-sm`, and `showModal()`.
2. Draggable Handle: Implement drag handle for blocks aligned with modern DOM drag patterns.
3. Typography Selector: Replace native `<select>` with custom icon button and floating popover.
4. Focus Outline: Eliminate black border around text canvas upstream in NUICSS and Markon.
5. Table Controls: Tighten spacing, removing `ml-auto` disconnection.

---

## 1. Objective

Upgrade `@nofinite/markon` and upstream `@nofinite/nuicss` to eliminate UI flaws, replace native browser popups with professional glassmorphic NUICSS dialogs, eliminate unwanted browser focus outlines, redesign the toolbar typography selector with custom icons and popovers, relocate table controls closer to content, restore draggable block handles, and propose high-value content authoring capabilities.

---

## 2. Current State

1. **Native `window.prompt` Dialogs:**

   - Link creation in `MarkonEditor.ts` uses `window.prompt('Enter link URL:', prevUrl || 'https://')`.
   - MathBlock formula editing in `extensions.ts` uses `window.prompt('Edit LaTeX math formula:', current)`.
   - This creates an unstyled, browser-native pop-up that clashes with the NUICSS design system and lacks validation, cancel styling, or glassmorphic backdrops.

2. **Black Focus Outline / Border on Editor Canvas:**

   - In Chromium/WebKit browsers, TipTap's `.tiptap.ProseMirror` container has `contenteditable="true"` and `tabindex="0"`, causing the browser to render a harsh default black 1px focus ring or border when clicked.
   - `.editor-content .tiptap:focus` lacks explicit `outline: none; border: none;` reset rules in `@nofinite/nuicss`.

3. **Table Toolbar Disconnection:**

   - The table action group (`.editor-table-tools`) is placed in the top toolbar with `ml-auto`, causing table buttons (`+Row`, `-Row`, `+Col`, `-Col`, `Del Table`) to stretch across wide viewports or wrap awkwardly, far removed from the actual table being edited.

4. **Missing Draggable Content:**

   - The editor lacks draggable block handles (`GripVertical`), preventing intuitive block-level reordering and selection.

5. **Unstyled Typography Selector:**
   - The toolbar uses a raw native HTML `<select>` element (`.editor-select`) with basic browser styling that does not match the icon-button aesthetic of the rest of the toolbar (`btn btn-ghost btn-sm btn-icon`).

---

## 3. Problem

1. **UX and Aesthetic Inconsistency:** Native `window.prompt` and native `<select>` disrupt the cohesive, modern design system of Nofinite products.
2. **Visual Blemish:** The black focus outline around the text canvas creates an unpolished appearance and conflicts with the outer `.markon-editor` focus ring.
3. **Ergonomic Distance:** Locating table manipulation controls far away from the table on wide screens harms usability.
4. **Authoring Agility:** Users cannot drag, rearrange, or easily grab blocks of content.

---

## 4. Proposed Solution

### 4.1 Custom NUICSS Glassmorphic Modal Box (`openMarkonModal`)

- Create a lightweight, framework-agnostic modal utility in `packages/markon/src/core/dialog.ts`.
- Implements accessible dialog mechanics using semantic NUICSS classes:
  - Backdrop: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-in fade-in duration-150`
  - Dialog Box: `card bg-surface border border-default shadow-xl rounded-xl p-5 max-w-md w-full animate-in zoom-in-95 duration-150`
  - Form controls: `input w-full text-sm` and buttons: `btn btn-ghost btn-sm` (Cancel) + `btn btn-primary btn-sm` (Confirm).
  - Traps `Escape` key to cancel and `Enter` key to submit; autofocuses input; auto-destroys on close.
- Connect both **Link Insertion** and **LaTeX Math Editing** (and image insertion) to this modal dialog.

### 4.2 Eliminate Annoying Black Border

- In upstream `packages/nuicss/src/styles/theme.css`:
  - Add explicit rules resetting `.editor-content .tiptap`, `.editor-content .ProseMirror`, and `.tiptap.ProseMirror` focus outlines to `outline: none !important; border: none !important; box-shadow: none !important;`.
- Rebuild `@nofinite/nuicss` to update `dist/styles.css`.
- In `packages/markon/src/core/MarkonEditor.ts`, add `.tiptap:focus { outline: none; }` safety assurance.

### 4.3 Redesign Table Toolbar Controls & Spacing

- Remove `ml-auto` which forces table tools to the far right edge of the header.
- Place table tools in a cohesive, compact inline toolbar group with a divider and clear table iconography/badges.
- In addition, provide contextual inline action styling so controls sit naturally in context without awkward gaps.

### 4.4 Framework-Agnostic Block Drag Handle

- Implement `createDragHandleExtension()` in `packages/markon/src/core/dragHandle.ts` using ProseMirror view and DOM positioning:
  - Observes hover over top-level blocks in the editor (`p`, `h1-h3`, `blockquote`, `pre`, `table`, `ul`, `ol`).
  - Renders a floating grip button (`btn btn-ghost btn-sm btn-icon w-5 h-6 text-muted hover:text-default cursor-grab`) with a 6-dot `GripVertical` SVG icon positioned in the editor gutter.
  - Enables dragging to move the selected block node cleanly within the document.

### 4.5 Redesign Paragraph / Heading Selector to Matching Icon Button & Popover

- Replace native `<select>` with a unified icon button:
  - Trigger: `btn btn-ghost btn-sm px-2 gap-1.5 text-xs font-medium` featuring a dynamic icon (e.g. Pilcrow `¶` for Paragraph, `H1`, `H2`, `H3`, `"` for Quote, `</>` for Code) and a chevron indicator.
  - Dropdown Popover: A floating menu (`card rounded-lg shadow-lg border border-default bg-surface p-1 min-w-[160px] z-30`) positioned with `@floating-ui/dom`.
  - Item options styled consistently with `btn btn-ghost btn-sm w-full justify-start text-xs gap-2`.
  - Fully accessible with keyboard navigation, outside click listener, and active state indicators.

### 4.6 Suggested Additional Upgrades for Markon

1. **Callout / Admonition Blocks:** Support `callout` block type (Info, Warning, Tip, Danger) with customizable icon and NUICSS alert tokens.
2. **Custom Image Modal Inserter:** Dedicated modal dialog to insert images with URL, alt text, and title.
3. **Code Block Language Picker & One-Click Copy:** Sleek floating header inside code blocks showing the language and a copy-to-clipboard button.
4. **Table Cell Selection & Context Menu:** Contextual cell operations (Merge cells, Split cells, Toggle header).
5. **Markdown Export & Clean Paste Sanitization:** Support pasting markdown content or copying clean markdown out of the editor.

---

## 5. Affected Areas

### Applications

- Monorepo Storybook (`packages/nui/.storybook`) - Visual verification stories for Markon.

### Libraries

- `packages/nuicss`:
  - `src/styles/theme.css`: Add ProseMirror focus outline reset rules.
  - Compiled output: Rebuild `packages/nuicss/dist/styles.css`.
- `packages/markon`:
  - `src/core/dialog.ts`: New custom modal box utility (`openMarkonModal`).
  - `src/core/dragHandle.ts`: New block drag handle extension.
  - `src/core/typographyMenu.ts`: Custom typography selector dropdown popover replacing `<select>`.
  - `src/core/extensions.ts`: Update `MathBlock` to trigger `openMarkonModal`.
  - `src/core/MarkonEditor.ts`: Update link command to use `openMarkonModal`, integrate typography popover, fix table toolbar spacing and focus outlines.
  - `src/core/index.ts`: Export new utilities.

### APIs

- No breaking public API changes. All options and methods remain backwards-compatible.

### Database

- None.

### Configuration

- None.

### Infrastructure

- None.

---

## 6. Implementation Steps

1. **Upstream CSS Fix in `@nofinite/nuicss`:**
   - Update `packages/nuicss/src/styles/theme.css` with focus outline resets for `.tiptap` and `.ProseMirror`.
   - Run `pnpm run build` in `packages/nuicss` to regenerate `dist/styles.css`.
2. **Build Custom Glassmorphic Modal Utility (`packages/markon/src/core/dialog.ts`):**
   - Implement `openMarkonModal({ title, label, initialValue, placeholder, confirmText, onConfirm })`.
   - Mount modal dynamically in document body with `bg-overlay`, `backdrop-blur-sm`, `card`, `input`, and `btn` classes.
3. **Upgrade MathBlock & Link Inserter:**
   - Wire `MathBlock` click handler in `packages/markon/src/core/extensions.ts` to `openMarkonModal`.
   - Wire toolbar `insertMath` and `createLink` commands in `packages/markon/src/core/MarkonEditor.ts` to `openMarkonModal`.
4. **Redesign Paragraph / Typography Selector (`packages/markon/src/core/typographyMenu.ts`):**
   - Create icon button trigger with dynamic active icon/label.
   - Build `@floating-ui/dom` popover dropdown with semantic option buttons.
   - Update `MarkonEditor.ts` to replace `<select>` with the new typography trigger.
5. **Fix Table Toolbar Layout & Spacing:**
   - Remove `ml-auto` from `.editor-table-tools` in `MarkonEditor.ts`.
   - Group table controls neatly beside the table insert button with compact icon/text styling.
6. **Implement Block Drag Handle Extension (`packages/markon/src/core/dragHandle.ts`):**
   - Create TipTap extension with ProseMirror plugin to position a drag handle gutter button on block hover.
   - Implement drag-and-drop node movement.
7. **Verify & Test:**
   - Run Vitest tests (`pnpm test`) across `packages/markon`.
   - Run Playwright visual tests in `temp/` capturing screenshots in light and dark mode.
   - Validate modal dialog, typography popover, table layout, and drag handle visually.
8. **Review & Git Commit:**
   - Review final diff.
   - Create local git commit in `d:\stack`.

---

## 7. Dependencies / Tools

- No new external npm packages required.
- Reuse existing dependencies:
  - `@floating-ui/dom` (already in `packages/markon` dependencies).
  - `@tiptap/pm` (already in `packages/markon` dependencies).
  - `@nofinite/nuicss` (local workspace design token system).

---

## 8. Alternatives Considered

### Option A: Use Third-Party Modal and Select Packages

- Description: Install external dialog and select libraries (e.g. Radix UI, Headless UI).
- Trade-offs: Bloats the framework-agnostic vanilla DOM engine, creates external peer dependencies, violates the zero-bloat standalone principle of Markon.

### Option B: Native HTML `<dialog>` or Pure NUICSS DOM Modal (Selected)

- Description: Pure vanilla DOM modal and popovers constructed with semantic `@nofinite/nuicss` superclasses (`modal`, `card`, `btn`, `input`, `backdrop-blur-sm`).
- Trade-offs: Zero extra bundle weight, 100% design system alignment, works seamlessly in Vanilla JS, React, Vue, Svelte, or HTMX.

---

## 9. Risks

- **Focus Loss on Modal Open:** TipTap editor might lose selection when the modal input is focused.
  - _Mitigation:_ Store the ProseMirror selection/range before opening the modal, and restore selection prior to dispatching node transactions upon confirmation.
- **Draggable Handle Positioning:** Editor margins or scroll containers might clip the drag handle.
  - _Mitigation:_ Position drag handle within the editor content's padded container using relative coordinates.

---

## 10. Breaking Changes

- None. Existing public APIs, options, and event signatures remain intact.

---

## 11. Security Considerations

- Modal input values for URLs and math equations are validated and sanitized before inserting into the ProseMirror document.
- LaTeX formula rendering through KaTeX uses safe display mode with HTML escaping.

---

## 12. Verification Plan

- [ ] Vitest unit tests in `packages/markon/src/markon.test.ts`.
- [ ] TypeScript type checks via `tsc --noEmit`.
- [ ] Build verification for `@nofinite/nuicss` and `@nofinite/markon`.
- [ ] Playwright visual tests in `temp/` capturing:
  - [ ] Custom NUICSS modal dialog opened (Formula and Link).
  - [ ] Typography selector dropdown popover open and closed.
  - [ ] Table toolbar layout with proximity to table.
  - [ ] Draggable block handle appearance.
  - [ ] Canvas focus state verifying absence of black border.
- [ ] Visual verification of screenshots before committing.

---

## 13. Rollback

- Revert local git commit using `git revert` or `git reset --hard HEAD~1`.

---

## 14. Approval

**Awaiting explicit user approval before implementation.**
