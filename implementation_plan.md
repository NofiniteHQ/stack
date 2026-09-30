# Implementation Plan

## Status

**Status:** Approved by User (Proceeding to Implementation)

---

## 1. Objective

Resolve user-reported regressions and polish `@nofinite/markon`:

1. Make the Paragraph / Typography toolbar button **icon-only** (`btn-icon`, 32x32px) so it never resizes or jiggles the toolbar.
2. Ensure the custom modal is strictly collision-proof and 100% vertically & horizontally centered across all viewports using NUIX / NUICSS `<dialog class="modal">` standards.
3. Fix typography menu options (`H1`, `H2`, `H3`, `Quote`, `Code Block`, `Paragraph`) by preventing focus loss on click, handling clean block conversions (avoiding invalid nesting), and fixing raw HTML escaping of `</>`.

---

## 2. Current State

1. **Toolbar Resizing Bug:**
   - The typography trigger currently renders `<span class="editor-typography-label">Paragraph</span>`, expanding and shrinking dynamically whenever different headings are selected, disrupting toolbar alignment.
2. **Modal Centering & Collision Issues:**
   - `<dialog class="modal">` in `dialog.ts` was missing explicit `h-fit` and viewport constraint rules, causing vertical positioning drift when the editor or document is scrolled.
3. **Typography Commands Failing:**
   - Clicking options in the typography dropdown currently causes the ProseMirror editor to blur because menu buttons lack `mousedown` `e.preventDefault()`, which drops text selection in browsers.
   - Block conversions used `toggleHeading` and `toggleBlockquote` without lifting parent nodes, causing nested structures (`<blockquote><h3><pre>...`).
   - The icon string `'</>'` was injected into `innerHTML` unescaped, causing the browser to swallow it as an invalid HTML tag.

---

## 3. Problem

- User experience is degraded when toolbar buttons shift in width.
- Modal dialogs appear off-center and risk clipping or collision on varied viewports.
- Typography formatting commands fail or behave unpredictably for users authoring content.

---

## 4. Proposed Solution

### 4.1 Icon-Only Typography Trigger (`btn-icon`)

- Update `MarkonEditor.ts`:
  ```html
  <button
    type="button"
    class="editor-typography-trigger editor-btn btn btn-ghost btn-sm btn-icon"
    title="Text Style"
    aria-haspopup="true"
    aria-expanded="false"
  >
    <span
      class="editor-typography-icon font-mono font-bold text-xs text-primary shrink-0"
      >¶</span
    >
  </button>
  ```
- Remove text labels entirely from the trigger. The button retains a fixed square size (`32px x 32px`) at all times.
- Update `typographyMenu.ts` so `updateTriggerState()` only updates the centered icon (`¶`, `H1`, `H2`, `H3`, `“`, `</>`).

### 4.2 100% Centered & Collision-Proof Modal (`openMarkonModal`)

- Refactor `packages/markon/src/core/dialog.ts` to strictly mirror the `@nofinite/nuix` dialog contract:
  - Add explicit centering and collision constraints to `<dialog class="modal">`:
    ```css
    position: fixed;
    inset: 0px;
    margin: auto;
    height: fit-content;
    max-height: 90vh;
    max-width: 28rem;
    width: calc(100% - 2rem);
    z-index: 50;
    ```
  - Use `modal-box w-full max-w-md bg-surface border border-default rounded-2xl shadow-2xl p-6 overflow-y-auto` with native `::backdrop` blur.
  - Implement outside-click backdrop dismissal checking `if (e.target === dialog) closeDialog();`.

### 4.3 Robust Typography Command Execution

- In `packages/markon/src/core/typographyMenu.ts`:
  - Add `btn.addEventListener('mousedown', (e) => e.preventDefault())` so clicking menu items **never** causes the editor to lose focus or drop selection.
  - Clean block conversions:
    - **Paragraph:** `editor.chain().focus().lift('blockquote').setParagraph().run()`
    - **Heading 1:** `editor.chain().focus().lift('blockquote').setHeading({ level: 1 }).run()`
    - **Heading 2:** `editor.chain().focus().lift('blockquote').setHeading({ level: 2 }).run()`
    - **Heading 3:** `editor.chain().focus().lift('blockquote').setHeading({ level: 3 }).run()`
    - **Quote:** `editor.chain().focus().toggleBlockquote().run()`
    - **Code Block:** `editor.chain().focus().lift('blockquote').toggleCodeBlock().run()`
  - Properly escape icon characters: replace unescaped `'</>'` with `&lt;/&gt;` so the browser renders `</>` cleanly.
  - Equip Floating UI with `autoUpdate` and `shift({ padding: 8 })` to ensure the dropdown menu is collision-proof.

---

## 5. Affected Areas

### Libraries

- `packages/markon`:
  - `src/core/MarkonEditor.ts`: Update typography trigger markup to icon-only `btn-icon`.
  - `src/core/typographyMenu.ts`: Fix `mousedown` focus retention, block lifting, HTML escaping, and autoUpdate.
  - `src/core/dialog.ts`: Fix dialog viewport centering and collision constraints.

---

## 6. Implementation Steps

1. **Update Typography Trigger in `MarkonEditor.ts`:**
   - Remove `<span class="editor-typography-label">` and chevron SVG.
   - Apply `btn-icon` so the button is a fixed 32x32px square.
2. **Refactor `typographyMenu.ts`:**
   - Fix block command chains with proper `lift()` calls.
   - Add `mousedown` `preventDefault` on each dropdown button.
   - Escape icon HTML in options.
   - Implement `autoUpdate` from `@floating-ui/dom`.
3. **Refactor `dialog.ts`:**
   - Ensure `<dialog class="modal">` has `h-fit`, `margin: auto`, `inset: 0`, and collision limits.
   - Verify backdrop click dismissal.
4. **Verify:**
   - Run Vitest tests (`pnpm vitest run packages/markon/src/markon.test.ts`).
   - Run Playwright visual test script verifying:
     - Button width remains invariant when switching between Paragraph, H1, H2, H3.
     - Modal opens at dead-center of the viewport on all viewports.
     - All 6 typography options successfully convert the active block.
   - Inspect resulting Playwright screenshots in `/temp/screenshots/`.
5. **Review & Git Commit:**
   - Review diff and create local commit.

---

## 7. Dependencies / Tools

- None. Uses existing `@tiptap/core`, `@floating-ui/dom`, and `@nofinite/nuicss`.

---

## 8. Alternatives Considered

- **Keep dropdown with text:** Rejected because variable-width text causes toolbar layout shifts whenever formatting changes.
- **Floating inline toolbar instead of top toolbar:** Outside current scope; icon-only trigger solves the problem cleanly within the existing toolbar architecture.

---

## 9. Risks

- Text selection loss during menu interaction: mitigated by `e.preventDefault()` on `mousedown`.

---

## 10. Breaking Changes

- None.

---

## 11. Security Considerations

- Proper HTML escaping in menu item rendering prevents any XSS injection.

---

## 12. Verification Plan

- [ ] Vitest unit tests pass.
- [ ] Playwright test confirms:
  - [ ] Typography button size is fixed (`32px x 32px`) across all styles.
  - [ ] Modal dialog is centered horizontally and vertically (`y ≈ 50%`).
  - [ ] Conversion to Paragraph, H1, H2, H3, Blockquote, and Code Block succeeds without failures or invalid nesting.
- [ ] Review screenshots in `temp/screenshots/`.

---

## 13. Rollback

- `git revert HEAD`.

---

## 14. Approval

**Awaiting explicit user approval before implementation.**
