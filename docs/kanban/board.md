# Board & Columns Architecture

Learn about the data structures, column definitions, and drag events that power **Nofinite Kanban**.

---

## Data Model

```tsx
import {
  Kanban,
  type KanbanColumnProps,
  type ReactKanbanItem,
} from '@nofinite/kanban';
```

### 1. `KanbanColumnProps`

Each column represents an independent workflow stage (e.g., "To Do", "In Progress", "Code Review", "Done"):

```typescript
export interface KanbanColumnProps {
  id: string; // Unique column identifier
  title?: string; // Human-readable header title
  wipLimit?: number; // Maximum recommended card capacity
  items: ReactKanbanItem[]; // Array of card items in this column
  allowAdd?: boolean; // Displays an interactive "+ Add Task" button
  headerActions?: boolean; // Renders column action ellipsis dropdown menu
  header?: React.ReactNode; // Custom column header component override
  footer?: React.ReactNode; // Custom column footer component override
}
```

### 2. `ReactKanbanItem`

Each item represents a single task card inside a column:

```typescript
export interface ReactKanbanItem {
  id: string; // Unique card identifier
  title?: string; // Primary card headline
  description?: string; // Secondary card summary text
  badge?: {
    // Status or priority pill
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  };
  assignee?: {
    // Assigned team member avatar and name
    name: string;
    avatarUrl?: string;
  };
  dueDate?: string; // Target deadline date string
  isOverdue?: boolean; // Flags overdue visual state
  subtasks?: {
    // Subtask completion progress
    completed: number;
    total: number;
  };
  content?: React.ReactNode; // Custom JSX content overriding standard card layout
}
```

---

## Drag-and-Drop Event Flow

`@nofinite/kanban` fires granular callbacks when cards or columns are reordered:

```tsx
<Kanban
  columns={columns}
  onChange={(newColumns) => {
    // Fired whenever columns or items are dropped in a new order
    setColumns(newColumns);
  }}
  onCardMove={({ sourceColumnId, targetColumnId, itemId, targetIndex }) => {
    // Fired specifically when a card moves between or within columns
    console.log(
      `Task ${itemId} moved to column ${targetColumnId} at index ${targetIndex}`
    );
    // Sync with backend API:
    api.updateCardPosition({ itemId, targetColumnId, targetIndex });
  }}
  onColumnMove={({ columnId, sourceIndex, targetIndex }) => {
    // Fired when an entire column is dragged to a new position
    console.log(`Column ${columnId} moved to index ${targetIndex}`);
    api.updateColumnOrder({ columnId, targetIndex });
  }}
/>
```

### Event Payload Definitions

| Callback       | Arguments                                                           | Description                                                                   |
| :------------- | :------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| `onChange`     | `(columns: KanbanColumnProps[]) => void`                            | Primary state synchronization hook containing the complete new board layout.  |
| `onCardMove`   | `({ sourceColumnId, targetColumnId, itemId, targetIndex }) => void` | Detailed payload for synchronizing card reordering with persistence backends. |
| `onColumnMove` | `({ columnId, sourceIndex, targetIndex }) => void`                  | Detailed payload for persisting column arrangement changes.                   |
