# Implementation Plan - Professional Overhaul of `@nofinite/markon`

## Objective

Transform `@nofinite/markon` into a professional-grade, framework-agnostic rich text authoring engine. The implementation strictly adheres to the `@nofinite/nuicss` design system, eliminates visual and functional bugs (content duplication, broken toolbar state, cursor jumping in React), removes duplicate CSS bundling in favor of a pure NUICSS peer-dependency, and delivers rich formatting (syntax-highlighted code blocks, LaTeX math, slash commands, floating bubble menu, and table management).

---

## Architecture Decisions

1. **Single Source of Truth (`@nofinite/nuicss`)**:
   - `@nofinite/markon` does **not** bundle or duplicate CSS.
   - Remove the phantom `"./styles.css"` export from `packages/markon/package.json`.
   - Consumers import `@nofinite/nuicss` (or its pre-compiled stylesheet).
   - All editor styling, tokens, and prose typography are defined upstream in `@nofinite/nuicss`.
2. **Semantic Superclasses**:
   - Outer container: `editor markon-editor`
   - Toolbar: `editor-toolbar`
   - Active toolbar button: `btn btn-ghost btn-sm btn-icon btn-active`
   - Select dropdown: `editor-select select`
   - Canvas: `editor-content` (with scoped typography rules for `h1`, `h2`, `h3`, `blockquote`, `ul`, `ol`, `table`, `pre code`, `task-list`)
3. **Headless Engine**:
   - TipTap serves purely as the headless document engine (state, schema, history, commands).
   - Zero vendor-specific styling classes (`.tiptap-wrapper .tiptap`).

---

## Detailed Implementation Steps

### Phase 1: Upstream Typography & Superclasses in `@nofinite/nuicss`

- Inspect and enhance `packages/nuicss/src/shortcuts/forms.ts` and `packages/nuicss/src/styles/` to ensure `.editor-content` has full typography styling:
  - Heading scale (`h1`: 1.875rem/bold, `h2`: 1.5rem/bold, `h3`: 1.25rem/semibold).
  - Elegant blockquotes (`border-left: 3px solid var(--color-primary)` with muted text and padding).
  - Code blocks (`pre`: dark mono surface, rounded-lg, padding) and inline `code`.
  - Tables: clean borders, subtle headers, resize handles.
  - Task lists: flex item alignment, custom checkbox styling.
  - Placeholder styling for empty editor paragraphs.
- Rebuild `@nofinite/nuicss`.

### Phase 2: Package Configuration & Dependency Cleanup

- In `packages/markon/package.json`:
  - Remove phantom `"./styles.css"` export.
  - Keep `@nofinite/nuicss` as a workspace dependency / peer dependency.

### Phase 3: Core Extensions & Engine Architecture (`packages/markon/src/core/`)

- **Extensions**:
  - `CodeBlockLowlight` with `lowlight` (js, ts, html, css, python, bash, json, markdown).
  - KaTeX math extension for inline and block formulas.
  - Bubble menu extension utilizing `@floating-ui/dom`.
  - Slash command suggestion extension for typing `/` on a new line.
  - Enhanced table support with column resizing.
- **`MarkonEditor.ts`**:
  - **Fix double rendering bug**: Render an empty canvas for TipTap to mount into, without pre-filling raw HTML that duplicates when TipTap attaches.
  - **Dynamic toolbar reactivity**: Listen to `selectionUpdate` and `transaction` events on TipTap to update button states (`btn-active`) and update the format block `<select>`.
  - **Full command toolkit**:
    - Undo/Redo, Bold, Italic, Underline, Strikethrough, Code, Highlight.
    - Headings (H1, H2, H3), Paragraph, Blockquote.
    - Alignment: Left, Center, Right, Justify.
    - Bullet list, Numbered list, Task list.
    - Tables: Insert table, add row above/below, add column left/right, delete row/col, delete table.
    - Code block insertion.
    - Math formula insertion.
    - Link toggle/prompt.
  - **Footer stats**: Word count, character count, and save indicator updates.

### Phase 4: React Adapter (`packages/markon/src/react/`)

- In `MarkonEditor.tsx`:
  - Handle controlled `value` updates cleanly using `{ emitUpdate: false }` and only updating when editor is not actively focused or if content actually changed, fixing cursor jumping.
  - Clean lifecycle teardown on unmount.
- In `useMarkon.ts`:
  - Expose reactive hook state (`editor`, `containerRef`, `wordCount`, `charCount`, `isEmpty`).

### Phase 5: Storybook & Documentation Stories

- Update `packages/markon/src/react/MarkonEditor.stories.tsx`:
  - `Default`: Document editor with headings, code block, blockquotes, and tables.
  - `EmptyWithPlaceholder`: Clean placeholder testing.
  - `ReadOnly`: Disabled toolbar and immutable canvas.
  - `RichFeatures`: Demonstrating math formulas, slash commands, and bubble menu.

### Phase 6: Automated Verification & Compulsory Visual Validation

- Run unit tests: `pnpm vitest run` in `packages/markon`.
- Run automated Playwright visual audit in `temp/audit-markon-visual.cjs`:
  - Verify zero content duplication.
  - Verify button active states highlight dynamically.
  - Verify typography scales and styling in Light & Dark modes.
  - Verify table actions, list actions, and typing.
  - Capture visual screenshots in `temp/screenshots/` and inspect.
- Run `npm pack` in `packages/markon` and verify the tarball contents.

### Phase 7: Git Commit

- Create logical git commit in `d:\stack`.
