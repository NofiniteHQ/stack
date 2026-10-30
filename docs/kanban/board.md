# Board & Columns Architecture

Understand the underlying data model, event flows, and spatial drag mechanics of **Nofinite Kanban**.

```ts
// Framework-Agnostic Core
import {
  createKanbanBoard,
  type KanbanColumn,
  type KanbanItem,
  type CardMoveEvent,
  type ColumnMoveEvent,
} from '@nofinite/kanban';

// React Adapter
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
```

---

## Data Model

The data structures are pure, framework-agnostic TypeScript interfaces shared across Vanilla JS, Vue, Svelte, and React:

### `KanbanColumn`

Represents a workflow column / stage:

```typescript
export interface KanbanColumn {
  id: string; // Unique column identifier
  title?: string; // Human-readable header title
  wipLimit?: number; // Maximum recommended card capacity
  items: KanbanItem[]; // Array of card items in this column
  allowAdd?: boolean; // Renders "+ Add Task" button
  headerActions?: boolean; // Renders column action ellipsis menu
}
```

### `KanbanItem`

Represents a task card:

```typescript
export interface KanbanItem {
  id: string; // Unique card identifier
  title?: string; // Primary card title
  description?: string; // Secondary card summary
  badge?: {
    // Priority or status badge
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  };
  assignee?: {
    // Assigned team member
    name: string;
    avatarUrl?: string;
    initials?: string;
  };
  dueDate?: string; // Target deadline date string
  isOverdue?: boolean; // Overdue visual state flag
  subtasks?: {
    // Subtask count progress
    completed: number;
    total: number;
  };
}
```

---

## 1. Framework-Agnostic Core Event Flow

When using the core DOM engine, pass callbacks to intercept lifecycle and drag actions:

```ts
import { createKanbanBoard } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const board = createKanbanBoard(document.getElementById('board'), {
  columns: initialColumns,
  enforceWipLimit: true,
  onCardMove: (event: CardMoveEvent) => {
    console.log(
      `Card ${event.cardId} moved from ${event.sourceColumnId} (index ${event.sourceIndex}) to ${event.targetColumnId} (index ${event.targetIndex})`
    );
  },
  onColumnMove: (event: ColumnMoveEvent) => {
    console.log(
      `Column ${event.columnId} moved from index ${event.sourceIndex} to ${event.targetIndex}`
    );
  },
  onCardClick: (item, columnId) => {
    console.log('Opened task detail drawer:', item.id);
  },
});
```

---

## 2. React Adapter Integration

In React applications, bind standard React state to `<Kanban />`:

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

export function SprintBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>(initialColumns);

  return (
    <Kanban
      columns={columns}
      onChange={setColumns}
      onCardMove={(event) => console.log('Card moved:', event)}
      onColumnMove={(event) => console.log('Column moved:', event)}
      enforceWipLimit={true}
    />
  );
}
```
