# Kanban Imperative API (`KanbanBoardInstance` & `KanbanHandle`)

While **Nofinite Kanban** provides declarative bindings, complex platforms frequently require **imperative programmatic control** (e.g. automated websocket updates, global command palettes, shortcut keys, or batch database operations).

Every method available through the React `KanbanHandle` is exposed directly by the **Framework-Agnostic Core instance**.

```ts
// Framework-Agnostic Core
import { createKanbanBoard, type KanbanBoardInstance } from '@nofinite/kanban';

// React Adapter
import { Kanban, type KanbanHandle } from '@nofinite/kanban/react';
```

---

## 1. Framework-Agnostic Core Imperative Control

When instantiating the board via `createKanbanBoard()`, you receive a `KanbanBoardInstance` object exposing 12 programmatic control methods:

```ts
import { createKanbanBoard } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const board = createKanbanBoard(document.getElementById('board'), {
  columns: initialColumns,
});

// 1. Add a card programmatically
board.addCard('backlog', {
  id: 'task-101',
  title: 'Automated CI Pipeline Failure',
  badge: { text: 'Critical', variant: 'danger' },
});

// 2. Move a card between columns
board.moveCard({
  cardId: 'task-101',
  sourceColumnId: 'backlog',
  targetColumnId: 'in-progress',
  sourceIndex: 0,
  targetIndex: 0,
});

// 3. Update task metadata
board.updateCard('in-progress', 'task-101', {
  title: 'CI Pipeline (Resolved)',
});

// 4. Focus card for keyboard accessibility
board.focusCard('task-101');

// 5. Update filter search
board.setFilter({ query: 'Pipeline' });

// 6. Clean up board
board.destroy();
```

---

## 2. React Adapter Imperative Control (`KanbanHandle`)

In React, attach a React `useRef` typed as `KanbanHandle`:

```tsx
import React, { useRef } from 'react';
import {
  Kanban,
  type KanbanHandle,
  type KanbanColumnProps,
} from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

export function ControlledKanban() {
  const kanbanRef = useRef<KanbanHandle>(null);

  const handleExternalAction = () => {
    kanbanRef.current?.addCard('backlog', {
      id: `task-${Date.now()}`,
      title: 'New Automated Story',
    });
  };

  return (
    <div>
      <button onClick={handleExternalAction} className="btn btn-primary mb-4">
        Create Task
      </button>
      <Kanban ref={kanbanRef} columns={columns} onChange={setColumns} />
    </div>
  );
}
```

---

## Method Reference

| Method         | Signature                                                                  | Description                                                        |
| :------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `addCard`      | `(columnId: string, item: KanbanItem) => void`                             | Appends a new task card to the specified column                    |
| `updateCard`   | `(columnId: string, cardId: string, partial: Partial<KanbanItem>) => void` | Updates specific properties (title, assignee, badge) on a card     |
| `removeCard`   | `(columnId: string, cardId: string) => void`                               | Deletes a task card from the specified column                      |
| `moveCard`     | `(event: CardMoveEvent) => boolean`                                        | Programmatically moves a card between or within columns            |
| `focusCard`    | `(cardId: string) => void`                                                 | Scrolls to and focuses a specific card for keyboard navigation     |
| `addColumn`    | `(column: KanbanColumn) => void`                                           | Appends a new column to the board                                  |
| `removeColumn` | `(columnId: string) => void`                                               | Removes a column and all its child cards                           |
| `clearColumn`  | `(columnId: string) => void`                                               | Removes all cards from a column while preserving the column itself |
| `setFilter`    | `(filter: KanbanFilterOptions) => void`                                    | Programmatically updates the active search query or filter tags    |
| `getFilter`    | `() => KanbanFilterOptions`                                                | Returns the current active filter object                           |
| `getColumns`   | `() => KanbanColumn[]`                                                     | Returns a deep snapshot of current column and card data            |
| `setColumns`   | `(columns: KanbanColumn[]) => void`                                        | Replaces the entire board column dataset                           |
| `destroy`      | `() => void`                                                               | Unbinds all Pragmatic Drag-and-Drop listeners and cleans DOM       |
