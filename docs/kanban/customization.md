# Kanban Customization and Slots

**Nofinite Kanban** provides a flexible slot-based architecture allowing teams to customize card presentation, column headers, metadata badges, user avatars, and subtask progress indicators.

By default, cards render an accessible, high-density layout styled with **NUICSS** tokens. With `renderCard` and `renderHeader`, you can replace or enrich default elements with custom UI components without breaking drag-and-drop mechanics or keyboard navigation.

---

## Custom Card Rendering (`renderCard`)

The `renderCard` prop allows you to override the internal card body while retaining built-in drag handles, drop target hitboxes, focus rings, and edge detection.

### Prop Signature

```ts
renderCard?: (item: KanbanItem, columnId: string) => React.ReactNode;
```

### Complete Implementation Example

```tsx
import React, { useState } from 'react';
import {
  Kanban,
  type KanbanColumnProps,
  type KanbanItem,
} from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

interface SprintTask extends KanbanItem {
  storyPoints?: number;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

const initialColumns: KanbanColumnProps[] = [
  {
    id: 'in-progress',
    title: 'In Progress',
    wipLimit: 3,
    items: [
      {
        id: 'task-101',
        title: 'Optimize Database Connection Pool',
        description:
          'Tune PgBouncer pool sizing for multi-region read replicas.',
        storyPoints: 5,
        priority: 'high',
        assignee: {
          name: 'Marcus Vance',
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        },
        subtasks: { total: 4, completed: 3 },
        dueDate: 'Tomorrow',
        isOverdue: false,
      },
    ],
  },
];

export function CustomCardBoard() {
  const [columns, setColumns] = useState(initialColumns);

  return (
    <div className="w-full h-[650px] p-6 bg-surface">
      <Kanban
        columns={columns}
        onChange={setColumns}
        renderCard={(item: SprintTask, columnId: string) => (
          <div className="p-3.5 space-y-2.5">
            {/* Header: Priority & Story Points */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  item.priority === 'high'
                    ? 'bg-danger/10 text-danger border border-danger/20'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                {item.priority}
              </span>
              {item.storyPoints && (
                <span className="text-xs font-mono font-semibold text-muted bg-surface-active px-1.5 py-0.5 rounded">
                  {item.storyPoints} pts
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h4 className="text-sm font-semibold text-default leading-snug">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            {/* Subtasks Progress Bar */}
            {item.subtasks && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted font-mono">
                  <span>Subtasks</span>
                  <span>
                    {item.subtasks.completed}/{item.subtasks.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-active rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (item.subtasks.completed / item.subtasks.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Footer: Due Date & Assignee */}
            <div className="flex items-center justify-between pt-1 border-t border-default/30">
              <span
                className={`text-[11px] ${
                  item.isOverdue ? 'text-danger font-semibold' : 'text-muted'
                }`}
              >
                📅 {item.dueDate}
              </span>
              {item.assignee && (
                <div className="flex items-center gap-1.5">
                  <img
                    src={item.assignee.avatar}
                    alt={item.assignee.name}
                    className="w-5 h-5 rounded-full object-cover border border-default"
                  />
                  <span className="text-xs text-muted truncate max-w-[90px]">
                    {item.assignee.name.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
```

---

## Custom Column Headers (`renderHeader`)

The `renderHeader` prop enables total control over the column header bar, allowing you to embed custom actions, sorting menus, progress dials, and WIP limit badges.

### Prop Signature

```ts
renderHeader?: (column: KanbanColumnProps) => React.ReactNode;
```

### Column Header Example

```tsx
<Kanban
  columns={columns}
  onChange={setColumns}
  renderHeader={(column) => {
    const isOverWip = column.wipLimit && column.items.length > column.wipLimit;

    return (
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-default bg-surface/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <h3 className="font-semibold text-sm text-default">{column.title}</h3>
        </div>

        {/* Dynamic WIP Counter */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full transition-colors ${
              isOverWip
                ? 'bg-danger text-white animate-pulse'
                : 'bg-surface-active text-muted'
            }`}
          >
            {column.items.length}
            {column.wipLimit ? ` / ${column.wipLimit}` : ''}
          </span>
          <button
            onClick={() => console.log('Column settings clicked', column.id)}
            className="p-1 text-muted hover:text-default rounded hover:bg-surface-active transition-colors"
            aria-label="Column options"
          >
            ⋮
          </button>
        </div>
      </div>
    );
  }}
/>
```

---

## Default Metadata Subcomponents

If you prefer using the default card structure with enhanced metadata, populate the standard `KanbanItem` properties:

### 1. Priority Badges (`badge`)

```ts
badge: {
  label: 'Critical Vulnerability',
  variant: 'danger', // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'subtle'
}
```

### 2. User Assignees (`assignee`)

```ts
assignee: {
  name: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  initials: 'SC',
}
```

### 3. Subtask Counters (`subtasks`)

```ts
subtasks: {
  total: 5,
  completed: 4,
}
```

When provided, the default card layout renders an accessible subtask progress bar with screen reader announcements.

---

## Column Footers (`footer`)

Each column can also specify a static or interactive `footer` slot, ideal for persistent "+ Add Task" inputs or batch action buttons:

```tsx
const columnsWithFooter: KanbanColumnProps[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    items: [],
    footer: (
      <button
        onClick={() => openCreateModal('backlog')}
        className="w-full py-2 px-3 text-xs font-medium text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-dashed border-default"
      >
        + Add New Story
      </button>
    ),
  },
];
```
