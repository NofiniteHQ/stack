# WIP Limits, Filtering & Imperative Handle

Explore advanced workflow management capabilities in **Nofinite Kanban**.

---

## 1. Work-In-Progress (WIP) Limits

Enforce capacity limits and agile bottlenecks by providing a `wipLimit` number on any column:

```tsx
const columns: KanbanColumnProps[] = [
  {
    id: 'in-review',
    title: 'Code Review',
    wipLimit: 3, // Highlights warning if more than 3 tasks exist here
    items: [
      /* ... */
    ],
  },
];
```

### Visual Behavior:

- When the column item count exceeds `wipLimit`, the column header badge automatically switches to a warning/danger pill (`badge-danger`).
- The column container receives visual boundary emphasis to alert engineers to workflow bottlenecks.

---

## 2. Card Filtering & Search Engine

Filter cards dynamically across all columns without writing custom array manipulation logic:

```tsx
import React, { useState } from 'react';
import { Kanban } from '@nofinite/kanban';

export function SearchableBoard({ columns }) {
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('');

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          className="input max-w-xs"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Kanban
        columns={columns}
        filterQuery={query} // Searches card titles and descriptions
        filterAssignee={assignee} // Filters cards assigned to this person
        filterPriority="urgent" // Filters by badge priority variant
      />
    </div>
  );
}
```

Cards that do not match the filter criteria are hidden without collapsing column layouts or disrupting drag-and-drop drop-target calculations.

---

## 3. Imperative Control (`KanbanHandle`)

Control board state programmatically using a React `ref`:

```tsx
import React, { useRef } from 'react';
import { Kanban, type KanbanHandle } from '@nofinite/kanban';

export function ProgrammaticBoard({ columns }) {
  const kanbanRef = useRef<KanbanHandle>(null);

  const handleAddNewColumn = () => {
    kanbanRef.current?.addColumn({
      id: 'qa-testing',
      title: 'QA Testing',
      items: [],
    });
  };

  const handlePromoteCard = (cardId: string) => {
    kanbanRef.current?.moveCard(cardId, 'todo', 'doing', 0);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={handleAddNewColumn}>
          Add QA Column
        </button>
      </div>

      <Kanban ref={kanbanRef} columns={columns} />
    </div>
  );
}
```

### `KanbanHandle` Methods

| Method                                    | Parameters                                                                                 | Description                                        |
| :---------------------------------------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------- |
| `addColumn(column)`                       | `(column: KanbanColumnProps) => void`                                                      | Appends a new column to the board.                 |
| `removeColumn(columnId)`                  | `(columnId: string) => void`                                                               | Removes an existing column by its unique ID.       |
| `moveCard(cardId, fromCol, toCol, index)` | `(cardId: string, sourceColId: string, targetColId: string, targetIndex?: number) => void` | Programmatically transfers a card between columns. |
| `getColumns()`                            | `() => KanbanColumnProps[]`                                                                | Returns the current state of all columns.          |

---

## 4. WAI-ARIA Keyboard Navigation

Nofinite Kanban adheres to accessibility standards for drag-and-drop patterns:

- **Focus:** Press `Tab` to navigate between column headers and cards.
- **Pick Up:** Press `Space` or `Enter` to pick up the active focused card.
- **Move Columns:** Press `Left Arrow` (`←`) and `Right Arrow` (`→`) to transfer the card to adjacent columns.
- **Reorder Position:** Press `Up Arrow` (`↑`) and `Down Arrow` (`↓`) to adjust the card's vertical index within the column.
- **Drop Card:** Press `Space` or `Enter` again to confirm placement.
- **Cancel:** Press `Escape` to cancel the drag operation and restore the card to its original position.
- **Screen Reader Announcements:** Built-in ARIA live region automatically announces: _"Moved card Design System Audit to In Progress, position 2 of 4."_

---

## 5. Complete Props Reference

| Prop             | Type                                     | Default     | Description                                             |
| :--------------- | :--------------------------------------- | :---------- | :------------------------------------------------------ |
| `columns`        | `KanbanColumnProps[]`                    | Required    | Array of columns and nested cards.                      |
| `onChange`       | `(columns: KanbanColumnProps[]) => void` | `undefined` | Callback fired on any card or column reordering.        |
| `onCardMove`     | `(details: CardMoveDetails) => void`     | `undefined` | Callback fired when a card transitions between columns. |
| `onColumnMove`   | `(details: ColumnMoveDetails) => void`   | `undefined` | Callback fired when a column changes order.             |
| `filterQuery`    | `string`                                 | `undefined` | Search term matching card titles and descriptions.      |
| `filterAssignee` | `string`                                 | `undefined` | Filter cards by assignee name.                          |
| `filterPriority` | `string`                                 | `undefined` | Filter cards by badge status or priority.               |
| `className`      | `string`                                 | `undefined` | Additional CSS class for the board container.           |
| `readOnly`       | `boolean`                                | `false`     | Disables drag-and-drop interaction across the board.    |
