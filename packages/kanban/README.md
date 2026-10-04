# @nofinite/kanban

Universal, framework-agnostic task board and Kanban suite powered by Pragmatic Drag and Drop and styled strictly with `@nofinite/nuicss` tokens and superclasses.

## Features

- **Universal Architecture:** Pure TypeScript core (`createKanbanBoard`, `renderKanbanHTML`) with first-class React bindings (`<Kanban />`). Works seamlessly in vanilla HTML/JS, Next.js, React, Vue, or Svelte.
- **Self-Contained NUICSS Stylesheet:** Ships standalone CSS (`@nofinite/kanban/styles.css`) referencing `@nofinite/nuicss` tokens (`var(--bg-surface)`, `var(--color-primary)`, `var(--border-default)`) and modern glassmorphic surfaces (`backdrop-blur-sm`).
- **Complete Keyboard Accessibility:** Full W3C ARIA grid compliance. Navigate cards with `ArrowUp`/`ArrowDown`, reorder across columns with `Alt+ArrowLeft`/`Alt+ArrowRight`, jump with `Home`/`End`, and announce all movements via dynamic `aria-live="polite"` live regions.
- **Targeted DOM Reconciliation:** Preserves user scroll position, column focus, and active drag adapters across live data updates without blunt `innerHTML` re-renders.
- **Enforceable WIP Limits & Validation Hooks:** Define column `wipLimit`, enforce strict drag blocking via `enforceWipLimit`, and implement custom business rules with `canMoveCard`.
- **Column Management & Dashed CTAs:** Support dynamic column additions (`allowAddColumn`), options popover menus (`onColumnOptions`, `onColumnClear`), and custom column action delegates.
- **Imperative Handle API:** React `ref` exposure (`KanbanHandle`) and vanilla instance methods: `moveCard`, `addCard`, `removeCard`, `updateCard`, `addColumn`, `removeColumn`, `clearColumn`, `setFilter`, and `focusCard`.
- **Multi-Faceted Search & Filter Suite:** Real-time client-side search by title/description (`filterQuery`), assignee (`filterAssignee`), tag/badge (`filterBadge`), or custom predicate (`filterCard`). Features automatic column badge fraction calculation (`matching/total`) and graceful empty state handling.

---

## Installation

```bash
pnpm add @nofinite/kanban @nofinite/nuicss @atlaskit/pragmatic-drag-and-drop
```

Import the stylesheet in your application:

```css
/* In your global styles */
@import '@nofinite/kanban/styles.css';
```

---

## Quick Start

### React Component

```tsx
import { useState, useRef } from 'react';
import {
  Kanban,
  type KanbanColumnProps,
  type KanbanHandle,
} from '@nofinite/kanban';

export function ProjectBoard() {
  const kanbanRef = useRef<KanbanHandle>(null);
  const [columns, setColumns] = useState<KanbanColumnProps[]>([
    {
      id: 'todo',
      title: 'To Do',
      wipLimit: 5,
      items: [
        {
          id: 'task-1',
          title: 'Audit Hardware Key Isolation',
          description: 'Enforce hardware security module key generation.',
          badge: { label: 'Security', variant: 'primary' },
          assignee: { name: 'Elena Rostova', initials: 'ER' },
          dueDate: 'Nov 12',
          subtasks: { completed: 2, total: 4 },
        },
      ],
    },
    {
      id: 'doing',
      title: 'In Progress',
      wipLimit: 3,
      items: [],
    },
    {
      id: 'done',
      title: 'Done',
      items: [],
    },
  ]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search cards..."
        className="input"
        onChange={(e) =>
          kanbanRef.current?.setFilter({ filterQuery: e.target.value })
        }
      />

      {/* Kanban Board */}
      <Kanban
        ref={kanbanRef}
        columns={columns}
        onChange={setColumns}
        allowAddColumn={true}
        addColumnLabel="+ Add Column"
        enforceWipLimit={true}
        onCardClick={({ item }) => console.log('Card clicked:', item.id)}
        onColumnAdd={() => {
          kanbanRef.current?.addColumn({
            id: `col-${Date.now()}`,
            title: 'New Column',
            items: [],
          });
        }}
      />
    </div>
  );
}
```

---

### Vanilla JavaScript / TypeScript

```ts
import { createKanbanBoard } from '@nofinite/kanban';

const board = createKanbanBoard({
  container: document.getElementById('board-container')!,
  columns: [
    {
      id: 'col-todo',
      title: 'To Do',
      items: [
        { id: 'task-1', title: 'Setup database', badge: { label: 'Backend' } },
      ],
    },
    {
      id: 'col-done',
      title: 'Done',
      items: [],
    },
  ],
  allowAddColumn: true,
  enforceWipLimit: true,
  onCardMove: ({ itemId, sourceColumnId, targetColumnId, newIndex }) => {
    console.log(
      `Moved card ${itemId} to ${targetColumnId} at position ${newIndex}`
    );
  },
  canMoveCard: ({ targetColumnId, sourceColumnId }) => {
    // Custom workflow validation
    return true;
  },
});

// Imperative filtering
board.setFilter({ filterQuery: 'database' });

// Add new card dynamically
board.addCard('col-todo', { id: 'task-2', title: 'Write tests' });

// Clean up listeners on destroy
// board.destroy();
```

---

## Keyboard Accessibility

`@nofinite/kanban` adheres to W3C ARIA accessibility best practices:

| Shortcut           | Action                               |
| :----------------- | :----------------------------------- |
| `ArrowDown`        | Focus next card in column            |
| `ArrowUp`          | Focus previous card in column        |
| `Home`             | Focus first card in column           |
| `End`              | Focus last card in column            |
| `Alt + ArrowRight` | Move focused card to next column     |
| `Alt + ArrowLeft`  | Move focused card to previous column |
| `Alt + ArrowDown`  | Move focused card down within column |
| `Alt + ArrowUp`    | Move focused card up within column   |

All movements are announced in real-time to screen readers using an internal `aria-live="polite"` live region.

---

## Search & Filter API

Both React (`KanbanHandle`) and Vanilla (`KanbanBoardInstance`) expose filter controls:

```ts
interface KanbanFilterOptions {
  filterQuery?: string; // Substring search in title & description
  filterAssignee?: string; // Matches name or initials
  filterBadge?: string; // Matches badge label
  filterCard?: (item: KanbanItem, column: KanbanColumn) => boolean; // Custom predicate
}
```

When active, column counter badges automatically reflect matching item ratios (e.g. `2/5`), and columns with zero matching cards display a polite "No matching cards" placeholder without collapsing.

---

## License

MIT © [Nofinite](https://nofinite.com)
