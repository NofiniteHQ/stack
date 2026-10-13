# Nofinite Kanban

> Accessible, high-performance drag-and-drop kanban boards and workflow cards powered by NUICSS.

---

## Overview

**Nofinite Kanban** (`@nofinite/kanban`) is a modern React drag-and-drop workflow management component. It offers:

- **Zero Style Setup:** Board layout, column scroll containers, and drop indicator geometry are bundled directly in **NUICSS**.
- **Smooth Drag-and-Drop:** Built on modern pointer events and programmatic drag-and-drop APIs with zero lag.
- **Accessible by Default:** Keyboard navigation support for moving cards between columns and reordering.
- **Polymorphic Card Slots:** Customize card templates, WIP limit indicators, and column headers effortlessly.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/kanban @nofinite/nuicss
# or
pnpm add @nofinite/kanban @nofinite/nuicss
```

### 2. Stylesheet Import

Import the unified NUICSS stylesheet (no secondary package CSS required):

```tsx
import '@nofinite/nuicss/styles.css';
```

_(Optional: For modular tree-shaking, you can import `@nofinite/nuicss/dist/kanban.css` instead)._

### 3. Usage Example

```tsx
import React, { useState } from 'react';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  type KanbanColumnData,
} from '@nofinite/kanban';

const INITIAL_DATA: KanbanColumnData[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'task-1', title: 'Implement NUICSS Token Bridge' },
      { id: 'task-2', title: 'Design Glassmorphic Modal' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [{ id: 'task-3', title: 'Consolidate Ecosystem Styles' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'task-4', title: 'Architecture Audit' }],
  },
];

export function ProjectBoard() {
  const [columns, setColumns] = useState(INITIAL_DATA);

  return (
    <KanbanProvider columns={columns} onColumnsChange={setColumns}>
      <KanbanBoard>
        {columns.map((column) => (
          <KanbanColumn key={column.id} id={column.id} title={column.title}>
            {column.cards.map((card) => (
              <KanbanCard key={card.id} id={card.id}>
                <h4 className="font-semibold text-sm">{card.title}</h4>
              </KanbanCard>
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </KanbanProvider>
  );
}
```

---

## API Reference

### `<KanbanProvider>`

Root state provider managing drag operations, active dragging item, and column reordering.

- `columns`: `KanbanColumnData[]` — Array of column structures with nested cards.
- `onColumnsChange`: `(columns: KanbanColumnData[]) => void` — Callback fired when cards or columns are dropped.

### `<KanbanBoard>`

Top-level flex container applying the `.kanban-board` superclass with responsive horizontal scrolling.

### `<KanbanColumn>`

Container for cards inside a workflow stage.

- `id`: `string` — Unique column identifier.
- `title`: `string` — Header title for the column.
- `wipLimit`: `number` _(optional)_ — Maximum allowed cards in column before visual warning pill.

### `<KanbanCard>`

Interactive card item with draggable handles and drop-zone indicators.

- `id`: `string` — Unique card identifier.
- `asChild`: `boolean` _(optional)_ — Polymorphic slot rendering.
