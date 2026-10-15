# Kanban Imperative API (`KanbanHandle`)

While **Nofinite Kanban** follows standard declarative React state patterns, complex dashboards frequently require **imperative programmatic control** (e.g., automated websocket task updates, global search bars, keyboard shortcuts, or batch operations).

By passing a React `ref` to `<Kanban />`, you obtain a `KanbanHandle` instance exposing 12 programmatic methods.

---

## Obtaining the Handle

Attach a React `ref` typed as `KanbanHandle`:

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
    // Access methods directly on the ref
    kanbanRef.current?.addCard('backlog', {
      id: `task-${Date.now()}`,
      title: 'New Automated Story',
    });
  };

  return (
    <div>
      <button onClick={handleExternalAction}>Create Task</button>
      <Kanban ref={kanbanRef} columns={/* ... */} />
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
| `removeColumn` | `(columnId: string) => void`                                               | Removes a column and its items                                     |
| `clearColumn`  | `(columnId: string) => void`                                               | Removes all cards from a column while preserving the column itself |
| `setFilter`    | `(filter: KanbanFilterOptions) => void`                                    | Programmatically updates the active search query or filter tags    |
| `getFilter`    | `() => KanbanFilterOptions`                                                | Returns the current active filter object                           |
| `getColumns`   | `() => KanbanColumn[]`                                                     | Returns a deep snapshot of current column and card data            |
| `setColumns`   | `(columns: KanbanColumn[]) => void`                                        | Replaces the entire board column dataset                           |

---

## Practical Use Cases

### 1. Real-Time Websocket Updates

Synchronize external task updates from team members without re-rendering the entire board:

```tsx
useEffect(() => {
  const socket = new WebSocket('wss://api.example.com/kanban-sync');

  socket.onmessage = (message) => {
    const event = JSON.parse(message.data);

    switch (event.type) {
      case 'TASK_CREATED':
        kanbanRef.current?.addCard(event.columnId, event.item);
        break;

      case 'TASK_UPDATED':
        kanbanRef.current?.updateCard(
          event.columnId,
          event.cardId,
          event.changes
        );
        break;

      case 'TASK_MOVED':
        kanbanRef.current?.moveCard({
          cardId: event.cardId,
          sourceColumnId: event.sourceColumnId,
          targetColumnId: event.targetColumnId,
          sourceIndex: event.sourceIndex,
          targetIndex: event.targetIndex,
        });
        break;

      case 'TASK_DELETED':
        kanbanRef.current?.removeCard(event.columnId, event.cardId);
        break;
    }
  };

  return () => socket.close();
}, []);
```

---

### 2. Global Quick Search & Filtering

Connect an external search input to the board's internal filter engine:

```tsx
export function SearchableKanbanToolbar({
  kanbanRef,
}: {
  kanbanRef: React.RefObject<KanbanHandle>;
}) {
  const handleSearchChange = (query: string) => {
    kanbanRef.current?.setFilter({
      filterQuery: query,
    });
  };

  const handleAssigneeFilter = (assigneeName: string) => {
    kanbanRef.current?.setFilter({
      filterAssignee: assigneeName,
    });
  };

  const handleClearFilters = () => {
    kanbanRef.current?.setFilter({
      filterQuery: '',
      filterAssignee: undefined,
      filterBadge: undefined,
    });
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-surface border-b border-default">
      <input
        type="search"
        placeholder="Filter tasks across columns..."
        onChange={(e) => handleSearchChange(e.target.value)}
        className="px-3 py-1.5 text-xs bg-surface-active border border-default rounded-lg text-default"
      />
      <button
        onClick={() => handleAssigneeFilter('Sarah Chen')}
        className="text-xs text-muted hover:text-default"
      >
        Sarah's Tasks
      </button>
      <button
        onClick={handleClearFilters}
        className="text-xs text-muted hover:text-danger"
      >
        Clear Filters
      </button>
    </div>
  );
}
```

---

### 3. Programmatic Focus & Deep-Linking

When navigating to a task from a notification or URL hash (`#task-928`), scroll to and highlight the card:

```tsx
const focusNotificationTask = (taskId: string) => {
  kanbanRef.current?.focusCard(taskId);
};
```
