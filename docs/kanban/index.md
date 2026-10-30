# Nofinite Kanban

> Enterprise-grade drag-and-drop task management board built on native DOM mechanics and NUICSS tokens.

---

## Interactive Preview

<Preview
name="kanban"
vanillaCode={`import { createKanbanBoard } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('kanban-container');

// Mount responsive drag-and-drop board directly to DOM
const board = createKanbanBoard(container, {
columns: [
{
id: 'todo',
title: 'To Do',
wipLimit: 5,
items: [
{ id: '1', title: 'Design Token Refactor', description: 'Ensure pure OKLCH color token conformance' },
{ id: '2', title: 'Performance Audit', description: 'Run Lighthouse metrics and bundle analysis' }
]
},
{
id: 'in-progress',
title: 'In Progress',
wipLimit: 3,
items: [
{ id: '3', title: 'Kanban Reordering Math', description: 'Implement spatial drag edge snapping' }
]
},
{
id: 'done',
title: 'Done',
items: [
{ id: '4', title: 'TypeScript Core Migration', description: 'Decouple core algorithms from React' }
]
}
],
onCardMove: (event) => console.log('Card moved:', event)
});`}
/>

---

## Quickstart

### 1. Framework-Agnostic Core (`@nofinite/kanban`)

Mount an interactive drag-and-drop Kanban board directly into any HTML DOM element. Works in **Vanilla JavaScript**, **TypeScript**, **Vue 3**, **Svelte 5**, **SolidJS**, or **Angular**:

```ts
import { createKanbanBoard, type KanbanColumn } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const container = document.getElementById('board')!;

const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    wipLimit: 5,
    items: [
      {
        id: '1',
        title: 'Design System Audit',
        badge: { text: 'Design', variant: 'primary' },
      },
      {
        id: '2',
        title: 'Write Playwright Tests',
        badge: { text: 'QA', variant: 'success' },
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
        title: 'Turbopack Optimization',
        badge: { text: 'Core', variant: 'warning' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [],
  },
];

// Mount stateful board instance
const board = createKanbanBoard(container, {
  columns: initialColumns,
  enforceWipLimit: true,
  onCardMove: (event) => console.log('Card moved:', event),
  onColumnMove: (event) => console.log('Column reordered:', event),
});

// Imperative methods on the board instance:
// board.addCard('todo', { id: '4', title: 'New Task' });
// board.setFilter({ query: 'Audit' });
// board.destroy();
```

### 2. React Adapter (`@nofinite/kanban/react`)

Declarative React JSX component for React 18 & 19:

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
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
          badge: { text: 'Design', variant: 'primary' },
        },
        {
          id: '2',
          title: 'Write Documentation',
          badge: { text: 'Docs', variant: 'success' },
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
          title: 'Turbopack Upgrade',
          badge: { text: 'Core', variant: 'warning' },
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      items: [],
    },
  ]);

  return (
    <div className="w-full h-[600px] p-6 rounded-2xl border border-default bg-surface">
      <Kanban columns={columns} onChange={setColumns} enforceWipLimit={true} />
    </div>
  );
}
```

---

## Core Architectural Invariants

- **Universal Framework-Agnostic Core:** Zero React dependency required. The root export (`@nofinite/kanban`) provides `createKanbanBoard()`, `KanbanStore`, and drag hitboxes for vanilla DOM, Vue, and Svelte applications. React (`@nofinite/kanban/react`) is an optional adapter.
- **Powered by Pragmatic Drag-and-Drop:** Built on pointer events and Atlassian's Pragmatic Drag-and-Drop primitives rather than legacy virtual DOM drag libraries. Offers zero rendering lag, silky 60fps animations, and a tiny bundle footprint.
- **Unified NUICSS Engine (Zero Separate CSS):** All board flex containers, card drop indicators, and dragging states are bundled directly into **NUICSS**. You only ever need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`).

---

## Key Capabilities

- **Slot-Based Customization:** Completely customize card UI with `renderCard(item, columnId)` and column headers with `renderHeader(column)`.
- **Enforceable WIP Limits:** Set column capacity constraints (`wipLimit: 4`). When `enforceWipLimit={true}`, overflows are hard rejected with smooth snap-back animations.
- **Business Logic Move Validation:** Intercept drag-and-drop actions with `canMoveCard={(event) => boolean}` to enforce state machines and role permissions.
- **12 Imperative Methods:** Programmatic board control (`moveCard`, `addCard`, `updateCard`, `focusCard`, `setFilter`) available on both the Vanilla instance and React `ref`.
- **Built-in Search & Filter Engine:** Filter cards across all columns by text query (`query`), assignee (`assignee`), or tag (`badge`).
- **WAI-ARIA Keyboard Accessibility:** Full keyboard reordering via <kbd>Space</kbd> and <kbd>Arrow Keys</kbd> with live status announcements.

---

## Documentation Directory

### Advanced Architecture & Deep Guides

- [Vanilla Core (`createKanbanBoard`)](/kanban/vanilla-core) — Using the framework-agnostic core in vanilla JavaScript, Vue, Svelte, or Angular without React.
- [Card & Header Customization](/kanban/customization) — Custom card rendering slots (`renderCard`), column header slots (`renderHeader`), badges, assignees, and subtasks.
- [Permissions & Move Validation](/kanban/permissions-and-validation) — WIP limits enforcement, state machine validation via `canMoveCard`, and role-based permissions.
- [Imperative API (`KanbanHandle`)](/kanban/imperative-api) — Programmatic board control (`moveCard`, `addCard`, `updateCard`, `focusCard`, `setFilter`).
- [Production Examples](/kanban/examples) — Complete copy-paste examples: Agile Sprint Board, Support Ticket Triage, and Multi-Filter Search Board.

### Primitives & Setup

- [Installation & Setup](/kanban/installation) — Package installation, peer dependencies, and styling configuration.
- [Board Architecture & Events](/kanban/board) — Column & card data model and drag event listeners.
- [WIP Limits & Filters](/kanban/features) — Capacity bounds, search filters, and keyboard navigation.
