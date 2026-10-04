# @nofinite/kanban Deep Production Architecture & Refactoring Plan

**Target Package:** `@nofinite/kanban` (`packages/kanban`)  
**Workspace:** `d:\stack`  
**Unique Plan File:** `kanban_implementation_plan.md`  
**Execution Strategy:** Strict phase-by-phase execution. Stop after every phase and wait for explicit `"next"` instruction from the user.

---

## 1. Executive Summary & Objective

A forensic code audit and live Playwright visual inspection of `@nofinite/kanban` revealed 13 critical flaws across both the Vanilla DOM engine (`src/core/`) and the React adapter (`src/react/`):

1. **300px Monster SVG Blowout:** Cards are visually obliterated in production because SVG icons lack explicit dimensions and rely on missing Tailwind utilities (`w-3`, `h-3`), causing them to render at 300px width.
2. **Missing Self-Contained Styles:** `src/styles.css` is only 44 lines and omits all inner layout rules, causing card footers to collapse into vertically stacked text without Tailwind.
3. **Drop Indicators Invisible:** Indicator bars use unstyled `.bg-primary` instead of `var(--color-primary)`, leaving users with zero visual feedback during drag.
4. **Hardcoded Hex in Focus Ring:** `outline: 2px solid var(--color-primary, #6366f1);` violates `@nofinite/nuicss` token purity.
5. **WIP Limit Badge Missing in Core DOM:** `renderKanbanHTML` completely omits `col.wipLimit`, breaking parity with React.
6. **Spacing Asymmetries:** Different padding models between `board.ts` and `Kanban.tsx`.
7. **Vanilla DOM Focus & Scroll Destruction:** `container.innerHTML = ...` wipes the entire board on every card move, resetting scroll position and blowing away active focus.
8. **Keyboard Accessibility Trap:** React keyboard navigation supports `Alt+ArrowUp/Down`, but completely lacks `Alt+ArrowLeft/Right` (trapping users in the column). Vanilla DOM has zero keyboard navigation.
9. **Zero ARIA Live Announcements:** Moves are silent to screen readers.
10. **WIP Limits Unenforceable:** No option to disallow drops into over-capacity columns.
11. **No Imperative Handle on React Component:** `<Kanban />` lacks `forwardRef` / `useImperativeHandle`.
12. **No "+ Add Column" or Column Management Menu:** Users cannot add new columns or access default column actions.
13. **Search & Filter Absent:** No built-in filtering by assignee, badge, or text query.

This plan resolves every root cause, bringing `@nofinite/kanban` to enterprise-grade production quality adhering strictly to `@nofinite/nuicss` and our engineering constitution.

---

## 2. Phased Implementation Roadmap

```
Phase 1: Self-Contained Stylesheet & 300px Monster SVG Fix
    ↓ (Wait for user approval / "next")
Phase 2: Full Keyboard A11y (Cross-Column Reordering) & ARIA Live Region
    ↓ (Wait for user approval / "next")
Phase 3: Vanilla DOM Scroll & Focus Preservation (Targeted DOM Reconciliation)
    ↓ (Wait for user approval / "next")
Phase 4: Enforceable WIP Limits & Validation Hooks
    ↓ (Wait for user approval / "next")
Phase 5: React Imperative Handle (forwardRef) & Add Column Management
    ↓ (Wait for user approval / "next")
Phase 6: Search & Filter Suite, Test Suite Expansion & Package Verification
```

---

## 3. Detailed Phase Breakdown

#### Phase 1: Self-Contained Stylesheet & 300px Monster SVG Fix [COMPLETED & COMMITTED: 98c69a2]

- **Status:** Complete & verified with Playwright snapshots (`temp/screenshots/kanban-audit-light.png`, `temp/screenshots/kanban-audit-dark.png`).

---

### Phase 2: Full Keyboard A11y (Cross-Column Reordering) & ARIA Live Region [COMPLETED & VERIFIED]

- **Status:** Complete & verified.
- **Files Affected:**
  - `packages/kanban/src/styles.css`
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/kanban.test.ts`
- **Actions Completed:**
  1. In `src/styles.css`: Added self-contained `.sr-only` utility for visually hidden ARIA live regions.
  2. In `src/react/Kanban.tsx`:
     - Added `Alt+ArrowLeft` and `Alt+ArrowRight` cross-column card reordering with clamped index positioning.
     - Added `Alt+Home` and `Alt+End` to jump to column boundaries.
     - Added `focusCard` helper and active focus retention across DOM re-renders.
     - Added `<div className="sr-only" aria-live="polite" aria-atomic="true">` announcer.
     - Added `role="button"`, `tabindex="0"`, `aria-roledescription="Kanban card"`, `aria-label`, and `data-item-id`.
  3. In `src/core/board.ts`:
     - Rendered `<div class="sr-only kanban-live-region" aria-live="polite" aria-atomic="true"></div>`.
     - Added `role="button"`, `tabindex="0"`, `aria-roledescription="Kanban card"`, `aria-label`, and `data-column-index` to cards.
     - Attached `handleKeyDown` on board container supporting `Enter`, `Space`, `Alt+ArrowUp`, `Alt+ArrowDown`, `Alt+ArrowLeft`, `Alt+ArrowRight`, `Alt+Home`, and `Alt+End`.
     - Implemented `restoreCardFocus` with `requestAnimationFrame` and screen reader announcements.
  4. Expanded test suite in `src/kanban.test.ts` verifying accessible roles, keyboard cross-column moves, intra-column reordering, and card click activation (100% green).
  5. Playwright verified via `temp/verify-phase2.cjs` capturing:
     - `temp/screenshots/phase2-focused-task-a.png` (crisp `var(--color-primary)` focus ring)
     - `temp/screenshots/phase2-moved-to-progress.png` (cross-column move + retained focus)
     - `temp/screenshots/phase2-moved-to-completed.png` (move to empty column + retained focus + ARIA live announcement text verified).

---

### Phase 3: Vanilla DOM Scroll & Focus Preservation (Targeted DOM Reconciliation) [COMPLETED & VERIFIED]

- **Status:** Complete & verified (16/16 tests green, build passing).
- **Files Affected:**
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/kanban.test.ts`
- **Actions Completed:**
  1. Extracted `renderCardHTML` to eliminate duplicate markup between initial board render and card creation.
  2. Updated drag-and-drop bindings to dynamically read card/column attributes (`data-item-id`, `data-column-id`, `data-index`) from elements so moved nodes report accurate drag data without rebound closures.
  3. Added `bindCard(cardEl)` and `bindColumn(colEl)` with `data-dnd-bound="true"` guard against duplicate listeners.
  4. Implemented `reconcileDOM(newColumns)` in place of blunt `container.innerHTML = ...`:
     - Captures column list `scrollTop` values before reconciliation.
     - Moves existing card elements across columns with native DOM `insertBefore`, preserving DOM node references and state.
     - Updates attributes in-place, dynamically creates new cards, and removes deleted cards.
     - Toggles empty state placeholders dynamically.
     - Updates header counters and `Max {wipLimit}` badges.
     - Restores scroll positions and active card focus.
  5. Expanded test suite in `src/kanban.test.ts` verifying node reference equality across column moves, scroll offset retention across card insertions, and dynamic toggling of `Max {wipLimit}` header badge (16/16 tests passing).

---

### Phase 4: Enforceable WIP Limits & Validation Hooks [COMPLETED & VERIFIED]

- **Status:** Complete & verified (23/23 unit tests green, clean build, visual Playwright verification verified).
- **Files Affected:**
  - `packages/kanban/src/core/types.ts`
  - `packages/kanban/src/core/store.ts`
  - `packages/kanban/src/core/reorder.ts`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/kanban.test.ts`
- **Actions Completed:**
  1. Added `enforceWipLimit?: boolean` and `canMoveCard?: (event: CardMoveEvent) => boolean` to `MoveCardOptions`, `KanbanStoreOptions`, `KanbanBoardOptions`, and React `KanbanProps`.
  2. Implemented WIP limit enforcement and `canMoveCard` validation inside pure `moveCardBetweenColumns`:
     - Cross-column moves into full columns are strictly aborted when `enforceWipLimit: true`.
     - Intra-column reordering remains permitted within full columns without count inflation.
     - Custom validator `canMoveCard` is checked before moving and aborts the move when returning false.
  3. Integrated validation with `store.moveCard` (returning boolean) and `store.addCard` (preventing capacity overflow).
  4. Wired `canDrop` guards on DnD drop targets in both Vanilla DOM (`bindCardDropTarget`, `bindColumnDropTarget`, `.kanban-card-list`) and React (`KanbanCardItem`, `KanbanColumnComponent`), preventing hover indicators and drop events onto full columns.
  5. Implemented keyboard accessibility guards (`Alt+ArrowLeft/Right`, `Alt+ArrowUp/Down`, `Alt+Home/End`) announcing refusal messages to screen reader live regions (`Cannot move card: column "..." has reached its limit of ... cards.` or `Cannot move card: move is not permitted.`).
  6. Added 7 unit tests covering all WIP and validation scenarios (23/23 tests green).
  7. Visual validation captured via Playwright in `temp/screenshots/` verifying live announcement banner and blocked state.

---

### Phase 5: React Imperative Handle (forwardRef) & Add Column Management

- **Status:** Complete & verified (27/27 unit tests green, clean build, visual Playwright validation in screenshots 01 to 04).
- **Files Affected:**
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/react/index.ts`
  - `packages/kanban/src/core/types.ts`
  - `packages/kanban/src/core/store.ts`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/styles.css`
  - `packages/kanban/src/kanban.test.ts`
- **Actions Completed:**
  1. Wrapped React `Kanban` in `React.forwardRef<KanbanBoardInstance, KanbanProps>()`.
  2. Exposed full imperative API via `useImperativeHandle`: `getColumns()`, `setColumns()`, `update()`, `destroy()`, `moveCard(event)`, `moveColumn(event)`, `addCard(columnId, item)`, `removeCard(columnId, cardId)`, `updateCard(columnId, cardId, partial)`, `addColumn(column)`, `removeColumn(columnId)`, `clearColumn(columnId)`, `focusCard(cardId)`.
  3. Added interactive dashed `+ Add Column` CTA at the end of the board with `allowAddColumn?: boolean` and `addColumnLabel?: string`, plus click delegation dispatching `onColumnAdd` and `kanban:column-add`.
  4. Added built-in column options popover dropdown with `Add Card` and `Clear Cards` (danger) actions and outside-click/escape key dismissal.
  5. Updated `reconcileDOM()` in `board.ts` to update card content in-place without unmounting outer node references.
  6. Added dedicated CSS rules in `packages/kanban/src/styles.css` for `.kanban-add-column-container`, `.kanban-add-column-btn`, `.kanban-column-header`, and `.kanban-column-menu` with explicit 14px icon constraints.
  7. Added 4 unit tests covering store column management, board DOM updates, Add Column click events, and React imperative ref handle methods (27/27 tests green).
  8. Verified visually using Playwright in `temp/screenshots/phase5-*.png` confirming layout alignment, popover styling, and CTA appearance.

---

### Phase 6: Search & Filter Suite, Test Suite Expansion & Package Verification [COMPLETED & VERIFIED]

- **Status:** Complete & verified (31/31 tests green, clean build, visual Playwright validation, npm pack verified).
- **Files Affected:**
  - `packages/kanban/src/core/filter.ts`
  - `packages/kanban/src/core/index.ts`
  - `packages/kanban/src/core/types.ts`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/index.ts`
  - `packages/kanban/src/kanban.test.ts`
  - `packages/kanban/README.md`
- **Actions Completed:**
  1. Created `src/core/filter.ts` with `matchCardFilter()` and `hasActiveFilter()` supporting:
     - `filterQuery?: string` (case-insensitive substring match on card title and description).
     - `filterAssignee?: string` (matches assignee name or initials).
     - `filterBadge?: string` (matches badge label).
     - `filterCard?: (item, col) => boolean` (custom predicate).
  2. Integrated filter engine across core and React:
     - Updated `renderKanbanHTML`: filters cards in columns, computes dynamic badge fraction (e.g., `1/2`), and renders friendly "No matching cards" empty placeholder.
     - Updated `createKanbanBoard`: maintains filter state, exposes `setFilter()` and `getFilter()`, and applies targeted visibility updates during `reconcileDOM`.
     - Updated `Kanban.tsx`: `KanbanProps` extends `KanbanFilterOptions`, renders visible items, and exposes `setFilter()` and `getFilter()` on `useImperativeHandle`.
  3. Expanded test suite in `src/kanban.test.ts` to 31 tests covering title, description, assignee, badge, custom predicate, HTML rendering, board dynamic filtering, and React imperative ref filtering (all 31/31 passed).
  4. Executed full validation:
     - `pnpm nx run kanban:test` (31/31 tests passing).
     - `pnpm nx run kanban:build` (Vite + DTS build with 0 errors).
     - `npm pack --dry-run` in `packages/kanban` verifying 35 tarball files including types, ESM, CJS, CSS, and README.
  5. Captured Playwright visual screenshots in `temp/screenshots/` verifying dynamic filtering, counter ratios, empty states, and cleared states (`phase6-filter-*.png`).
  6. Updated `packages/kanban/README.md` with full API reference for Vanilla and React, keyboard navigation, and filtering.

---

## 4. Rollback & Safety Considerations

- All changes are strictly localized to `packages/kanban/`.
- Compulsory local git commit after each phase.
- Backward compatibility preserved: all existing prop names and interfaces remain intact.
