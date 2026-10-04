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

### Phase 4: Enforceable WIP Limits & Validation Hooks

- **Files Affected:**
  - `packages/kanban/src/core/types.ts`
  - `packages/kanban/src/core/store.ts`
  - `packages/kanban/src/core/reorder.ts`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/react/Kanban.tsx`
- **Actions:**
  1. Add `enforceWipLimit?: boolean` option to both Core store options and React `KanbanProps`.
  2. Add `canMoveCard?: (event: CardMoveEvent) => boolean` custom validation callback.
  3. In `store.moveCard()` and `moveCardBetweenColumns()`:
     - If `enforceWipLimit` is true and target column is already at capacity, or if `canMoveCard(event)` returns false, abort the move and leave state intact.
  4. In DnD drop targets (`dropTargetForElements`):
     - Check `canDrop` against WIP limits to prevent dropping onto an over-capacity column and display a blocked cursor.
- **Verification:**
  - Unit tests verifying that dropping a card into an over-capacity column with `enforceWipLimit: true` is strictly blocked.

---

### Phase 5: React Imperative Handle (forwardRef) & Add Column Management

- **Files Affected:**
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/react/index.ts`
  - `packages/kanban/src/core/types.ts`
- **Actions:**
  1. Wrap `Kanban` in `React.forwardRef<KanbanBoardInstance, KanbanProps>()`.
  2. Expose `useImperativeHandle` with:
     - `addCard(columnId, item)`
     - `removeCard(columnId, cardId)`
     - `updateCard(columnId, cardId, partial)`
     - `moveCard(event)`
     - `moveColumn(event)`
     - `getColumns()`
     - `focusCard(cardId)`
  3. Add "+ Add Column" feature:
     - Add `allowAddColumn?: boolean` and `onColumnAdd?: () => void`.
     - Render a dashed, interactive "+ Add Column" button at the end of the horizontal board.
  4. Add built-in column header actions popover/menu with default actions (Add Card, Clear All Cards).
- **Verification:**
  - Unit test verifying imperative ref methods (`ref.current.addCard`, etc.) and Add Column click handler.

---

### Phase 6: Search & Filter Suite, Test Suite Expansion & Package Verification

- **Files Affected:**
  - `packages/kanban/src/core/store.ts`
  - `packages/kanban/src/core/board.ts`
  - `packages/kanban/src/react/Kanban.tsx`
  - `packages/kanban/src/kanban.test.ts`
  - `packages/kanban/src/react/Kanban.stories.tsx`
  - `packages/kanban/README.md`
- **Actions:**
  1. Add search and filter capability:
     - `filterQuery?: string` (matches card title and description).
     - `filterAssignee?: string` (filters by assignee name).
     - `filterBadge?: string` (filters by badge label).
  2. Expand `src/kanban.test.ts` with test suites covering:
     - Cross-column keyboard reordering (`Alt+ArrowLeft/Right`).
     - WIP limit enforcement and `canMoveCard` validator.
     - React imperative ref handle methods.
     - Search/filter filtering logic.
  3. Run full verification:
     - `pnpm nx run kanban:test` (100% green tests).
     - `pnpm nx run kanban:build` (ESM, CJS, DTS).
     - `npm pack --dry-run` to verify package contents and clean `.d.ts` output.
  4. Visual Playwright screenshots captured to `temp/screenshots/` verifying final visual excellence.
  5. Update `README.md` with full API reference.
- **Verification:**
  - Full test suite passing + verified visual screenshots + clean build.

---

## 4. Rollback & Safety Considerations

- All changes are strictly localized to `packages/kanban/`.
- Compulsory local git commit after each phase.
- Backward compatibility preserved: all existing prop names and interfaces remain intact.
