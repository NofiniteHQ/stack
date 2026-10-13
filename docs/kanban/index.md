# Nofinite Kanban

> Accessible, 60fps drag-and-drop workflow management boards and column cards powered by NUICSS.

---

## Overview

**Nofinite Kanban** (`@nofinite/kanban`) is a modern React workflow management component engineered for enterprise task management, agile sprint boards, and project tracking.

### Key Architectural Highlights

- **Powered by Pragmatic Drag-and-Drop:** Built on modern pointer events and Atlassian's Pragmatic Drag-and-Drop primitives rather than legacy heavyweight libraries. Offers zero virtual DOM lag, silky 60fps animations, and a tiny bundle footprint.
- **Unified NUICSS Engine (Zero Separate CSS):** All board flex containers, card drop indicators, and dragging states are bundled directly into **NUICSS**. You only ever need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`).
- **Enforceable WIP Limits:** Set column capacity constraints (`wipLimit: 4`). When exceeded, column header badges automatically signal warning or danger states based on active OKLCH theme tokens.
- **Built-in Search & Filter Engine:** Filter cards across all columns by text query (`filterQuery`), assignee (`filterAssignee`), or priority tag without complex external state management.
- **Imperative Handle (`KanbanHandle`):** Control the board programmatically via React `forwardRef` using methods like `moveCard()`, `addColumn()`, and `removeColumn()`.
- **WAI-ARIA Keyboard Navigation:** Full keyboard accessibility for reordering cards and columns using arrow keys, with ARIA live region status announcements.

---

## Quick Example

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

export default function ProjectBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>([
    {
      id: 'todo',
      title: 'To Do',
      wipLimit: 5,
      items: [
        {
          id: '1',
          title: 'Design System Audit',
          description: 'Check color contrast and tokens',
        },
        {
          id: '2',
          title: 'Write Documentation',
          description: 'Document all open-source packages',
        },
      ],
    },
    {
      id: 'doing',
      title: 'In Progress',
      wipLimit: 3,
      items: [
        {
          id: '3',
          title: 'Next.js 16 Upgrade',
          description: 'Migrate to React 19 compiler',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      items: [
        {
          id: '4',
          title: 'Release v3.1.0',
          description: 'Publish to public NPM registry',
        },
      ],
    },
  ]);

  return (
    <div className="w-full h-[600px] p-4 rounded-xl border border-default bg-surface">
      <Kanban
        columns={columns}
        onChange={setColumns}
        onCardMove={({
          sourceColumnId,
          targetColumnId,
          itemId,
          targetIndex,
        }) => {
          console.log(
            `Moved card ${itemId} from ${sourceColumnId} to ${targetColumnId} at index ${targetIndex}`
          );
        }}
      />
    </div>
  );
}
```

---

## Navigation & Guides

- [Installation & Setup](./installation.md) — Package installation, peer dependencies, and stylesheet configuration.
- [Board Architecture & Events](./board.md) — Detailed column & card data model and drag event listeners.
- [WIP Limits, Filters & Imperative Handle](./features.md) — Capacity bounds, search filters, imperative ref methods, and keyboard shortcuts.
