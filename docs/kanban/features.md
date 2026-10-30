# WIP Limits, Filtering & Keyboard Accessibility

Deep-dive into advanced productivity features in **Nofinite Kanban**, available across both the framework-agnostic DOM core and the React adapter.

```ts
// Framework-Agnostic Core
import { createKanbanBoard } from '@nofinite/kanban';

// React Adapter
import { Kanban } from '@nofinite/kanban/react';
```

---

## 1. Framework-Agnostic Core Features

### Enforceable WIP Limits

Enforce column capacity constraints and hard reject invalid drag drops:

```ts
import { createKanbanBoard } from '@nofinite/kanban';

const board = createKanbanBoard(document.getElementById('board'), {
  columns: [
    {
      id: 'in-review',
      title: 'In Review',
      wipLimit: 3, // Capacity limit of 3 cards
      items: [
        /* ... */
      ],
    },
  ],
  enforceWipLimit: true, // Rejects drop and animates card back to source if target column exceeds capacity
});
```

### Real-Time Filtering (`setFilter`)

Filter tasks programmatically without losing drag-and-drop hitboxes or reordering state:

```ts
// Filter by search query, assignee, or tag
board.setFilter({
  query: 'Authentication',
  assignee: 'Sarah Connor',
  badge: 'Critical',
});

// Clear filters
board.setFilter({});
```

### Keyboard Navigation & WAI-ARIA

The board includes built-in keyboard navigation conforming to W3C standards:

- <kbd>Tab</kbd>: Navigate through columns and cards.
- <kbd>Space</kbd> / <kbd>Enter</kbd>: Grab or drop active card.
- <kbd>Arrow Left</kbd> / <kbd>Arrow Right</kbd>: Move grabbed card between columns.
- <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd>: Reorder grabbed card within column.
- <kbd>Escape</kbd>: Cancel active drag and restore original position.

---

## 2. React Adapter Usage

In React applications, bind filtering and WIP bounds via component props:

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';

export function ManagedBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>(/* ... */);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter cards..."
        className="input"
      />
      <Kanban
        columns={columns}
        onChange={setColumns}
        enforceWipLimit={true}
        filterQuery={search}
      />
    </div>
  );
}
```
