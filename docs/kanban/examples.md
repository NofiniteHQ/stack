# Kanban Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Kanban** showcasing both **Framework-Agnostic Core** and **React** integrations.

---

## Example 1: Vanilla TypeScript Real-Time Kanban Board

Direct DOM mounting with real-time external card additions, search filtering, and state event handling without React:

```ts
import {
  createKanbanBoard,
  type KanbanColumn,
  type CardMoveEvent,
} from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

// 1. Initial sprint column data
const sprintColumns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Sprint Backlog',
    items: [
      {
        id: 'eng-101',
        title: 'Upgrade Node.js to v22 LTS in Docker base image',
        badge: { text: 'DevOps', variant: 'primary' },
        assignee: { name: 'Alex Rivera' },
        subtasks: { total: 3, completed: 0 },
        dueDate: 'Oct 20',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    wipLimit: 2, // Hard limit of 2 active cards
    items: [
      {
        id: 'eng-103',
        title: 'Optimize SVG path calculation for multi-series charts',
        badge: { text: 'Performance', variant: 'warning' },
        assignee: { name: 'Marcus Vance' },
        subtasks: { total: 4, completed: 3 },
        dueDate: 'Tomorrow',
      },
    ],
  },
  {
    id: 'done',
    title: 'Completed',
    items: [],
  },
];

// 2. Mount board directly into container
const container = document.getElementById('kanban-app')!;
const board = createKanbanBoard(container, {
  columns: sprintColumns,
  enforceWipLimit: true,
  onCardMove: (event: CardMoveEvent) => {
    console.log(
      `[Telemetry] Moved card ${event.cardId} to column ${event.targetColumnId}`
    );
    // Sync with backend API:
    // fetch('/api/tasks/move', { method: 'POST', body: JSON.stringify(event) });
  },
});

// 3. Connect external search input
document.getElementById('task-search')?.addEventListener('input', (e) => {
  const query = (e.target as HTMLInputElement).value;
  board.setFilter({ query });
});

// 4. Connect external Quick Add button
document.getElementById('quick-add-btn')?.addEventListener('click', () => {
  board.addCard('backlog', {
    id: `eng-${Date.now()}`,
    title: 'New Incoming Ticket',
    badge: { text: 'Triage', variant: 'default' },
  });
});
```

---

## Example 2: React Agile Engineering Sprint Board

Features strict Work-in-Progress (WIP) limits, priority badges, story point counters, assignee avatars, and interactive subtasks:

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

const sprintColumns: KanbanColumnProps[] = [
  {
    id: 'backlog',
    title: 'Sprint Backlog',
    items: [
      {
        id: 'eng-101',
        title: 'Upgrade Node.js to v22 LTS in Docker base image',
        badge: { text: 'DevOps', variant: 'primary' },
        assignee: {
          name: 'Alex Rivera',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        },
        subtasks: { total: 3, completed: 0 },
        dueDate: 'Oct 20',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    wipLimit: 2, // Hard limit of 2 active cards
    items: [
      {
        id: 'eng-103',
        title: 'Optimize SVG path calculation for multi-series charts',
        badge: { text: 'Performance', variant: 'warning' },
        assignee: {
          name: 'Marcus Vance',
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
        subtasks: { total: 4, completed: 3 },
        dueDate: 'Tomorrow',
      },
    ],
  },
  {
    id: 'done',
    title: 'Completed',
    items: [],
  },
];

export function AgileSprintBoard() {
  const [columns, setColumns] = useState(sprintColumns);

  return (
    <div className="w-full h-[650px] p-6 bg-surface">
      <Kanban
        columns={columns}
        onChange={setColumns}
        enforceWipLimit={true}
        onCardMove={(e) => console.log('Card moved in React:', e)}
      />
    </div>
  );
}
```
