# @nofinite/kanban

Universal, framework-agnostic task board and Kanban suite powered by Pragmatic Drag and Drop and styled with `@nofinite/nuicss` design tokens.

## Features

- **Universal & Framework-Agnostic:** Built on W3C DOM standards and Pragmatic Drag and Drop, works in vanilla HTML/JS, React, Vue, Svelte, and Solid.
- **Featherweight Footprint:** Built on native browser drag and drop (~4.5 kB) instead of bloated 40 kB virtual DOM drag wrappers.
- **Bi-directional Reordering:** Full support for card reordering within columns, card movement across columns, and column reordering.
- **Glassmorphic Theming:** Native integration with `@nofinite/nuicss` tokens (`var(--bg-surface)`, `backdrop-blur-sm`, `var(--color-primary)`).

## Installation

```bash
pnpm add @nofinite/kanban
```

## Usage

### React

```tsx
import { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';

export function ProjectBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'task-1', content: 'Research competitors' },
        { id: 'task-2', content: 'Design wireframes' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      items: [{ id: 'task-3', content: 'Build API endpoints' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: 'task-4', content: 'Initial project setup' }],
    },
  ]);

  return <Kanban columns={columns} onChange={setColumns} />;
}
```
