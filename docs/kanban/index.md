# Nofinite Kanban

> Accessible, 60fps drag-and-drop workflow management boards and column cards powered by NUICSS.

---

## Overview

**Nofinite Kanban** (`@nofinite/kanban`) is an enterprise-grade workflow management suite engineered for agile sprint boards, project management, customer support triage, and high-density task pipelines.

### Architectural Invariants

- **Powered by Pragmatic Drag-and-Drop:** Built on modern pointer events and Atlassian's Pragmatic Drag-and-Drop primitives rather than legacy virtual DOM drag libraries. Offers zero rendering lag, silky 60fps animations, and a tiny bundle footprint.
- **Unified NUICSS Engine (Zero Separate CSS):** All board flex containers, card drop indicators, and dragging states are bundled directly into **NUICSS**. You only ever need a single stylesheet import (`import '@nofinite/nuicss/styles.css'`).
- **Framework-Agnostic Core:** Powered by a zero-React core (`KanbanBoard`) that mounts directly into vanilla DOM, Vue, Svelte, or Angular applications while sharing identical React component semantics.

---

## Key Capabilities

- **Slot-Based Customization:** Completely customize card UI with `renderCard(item, columnId)` and column headers with `renderHeader(column)`.
- **Enforceable WIP Limits:** Set column capacity constraints (`wipLimit: 4`). When `enforceWipLimit={true}`, overflows are hard rejected with smooth snap-back animations.
- **Business Logic Move Validation:** Intercept drag-and-drop actions with `canMoveCard={(event) => boolean}` to enforce state machines and role permissions.
- **Imperative Handle (`KanbanHandle`):** 12 programmatic methods via React `ref` for websocket updates, quick search, and task focus.
- **Built-in Search & Filter Engine:** Filter cards across all columns by text query (`filterQuery`), assignee (`filterAssignee`), or priority tag (`filterBadge`).
- **WAI-ARIA Keyboard Accessibility:** Full keyboard reordering via <kbd>Space</kbd> and <kbd>Arrow Keys</kbd> with live status announcements.

---

## Quickstart

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

const initialColumns: KanbanColumnProps[] = [
  {
    id: 'todo',
    title: 'To Do',
    wipLimit: 5,
    items: [
      {
        id: '1',
        title: 'Design System Audit',
        badge: { label: 'Design', variant: 'info' },
      },
      {
        id: '2',
        title: 'Write Documentation',
        badge: { label: 'Docs', variant: 'success' },
      },
    ],
  },
  {
    id: 'doing',
    title: 'In Progress',
    wipLimit: 2,
    items: [
      {
        id: '3',
        title: 'Next.js 16 Upgrade',
        badge: { label: 'Core', variant: 'warning' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [],
  },
];

export function ProjectBoard() {
  const [columns, setColumns] = useState(initialColumns);

  return (
    <div className="w-full h-[600px] p-6 rounded-2xl border border-default bg-surface">
      <Kanban columns={columns} onChange={setColumns} enforceWipLimit={true} />
    </div>
  );
}
```

---

## Documentation Directory

### Advanced Capabilities & Architecture

- **[Card & Header Customization](./customization.md)** — Custom card rendering slots (`renderCard`), column header slots (`renderHeader`), badges, assignees, and subtasks.
- **[Permissions & Move Validation](./permissions-and-validation.md)** — WIP limits enforcement, state machine validation via `canMoveCard`, and role-based permissions.
- **[Imperative API (`KanbanHandle`)](./imperative-api.md)** — Programmatic board control (`moveCard`, `addCard`, `updateCard`, `focusCard`, `setFilter`).
- **[Vanilla Core (`KanbanBoard`)](./vanilla-core.md)** — Using the framework-agnostic core in vanilla JavaScript, Vue, Svelte, or Angular without React.
- **[Production Examples](./examples.md)** — Complete copy-paste examples: Agile Sprint Board, Support Ticket Triage, and Multi-Filter Search Board.

### Setup & Primitives

- **[Installation & Setup](./installation.md)** — Package installation, peer dependencies, and stylesheet configuration.
- **[Board Architecture & Events](./board.md)** — Column & card data model and drag event listeners.
- **[WIP Limits & Filters](./features.md)** — Capacity bounds, search filters, and keyboard navigation.
