# Kanban Customization and Slots

**Nofinite Kanban** provides a flexible customization architecture allowing teams to customize card presentation, column headers, metadata badges, user avatars, and subtask progress indicators.

By default, cards render an accessible, high-density layout styled with **NUICSS** superclasses. You can replace default card bodies or column headers without breaking Pragmatic Drag-and-Drop hitboxes or keyboard navigation.

```ts
// Framework-Agnostic Core
import { createKanbanBoard, renderCardHTML } from '@nofinite/kanban';

// React Adapter
import { Kanban } from '@nofinite/kanban/react';
```

---

## 1. Framework-Agnostic Core Customization

In Vanilla JavaScript, TypeScript, or non-React web components, pass a custom `renderCardHTML` callback when creating the board:

```ts
import { createKanbanBoard } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const board = createKanbanBoard(document.getElementById('board'), {
  columns: myColumns,
  // Custom HTML template for each task card
  renderCardHTML: (item, col, itemIndex, colIndex) => {
    return `
      <div class="p-3.5 space-y-2 bg-surface border border-default rounded-xl shadow-xs">
        <div class="flex items-center justify-between text-xs">
          <span class="badge badge-primary font-mono text-[10px]">${
            item.badge?.text || 'Task'
          }</span>
          <span class="text-muted font-mono text-[11px]">${
            item.dueDate || ''
          }</span>
        </div>
        <h4 class="text-sm font-semibold text-default">${item.title}</h4>
        ${
          item.description
            ? `<p class="text-xs text-muted line-clamp-2">${item.description}</p>`
            : ''
        }
      </div>
    `.trim();
  },
});
```

---

## 2. React Slot-Based Customization

### Custom Card Slot (`renderCard`)

In React, use `renderCard` to render any custom JSX component inside the draggable card container:

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

export function CustomCardBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>(/* ... */);

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
                <span className="text-xs font-mono font-semibold text-muted bg-subtle px-1.5 py-0.5 rounded">
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
                <p className="text-xs text-muted mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
```

### Custom Column Header Slot (`renderHeader`)

Customize column headers to add custom metrics or quick action buttons:

```tsx
<Kanban
  columns={columns}
  renderHeader={(col) => (
    <div className="flex items-center justify-between w-full py-2 px-3 border-b border-default">
      <span className="font-bold text-sm text-default">{col.title}</span>
      <span className="text-xs font-mono text-muted bg-subtle px-2 py-0.5 rounded">
        {col.items.length} / {col.wipLimit || '∞'}
      </span>
    </div>
  )}
/>
```
