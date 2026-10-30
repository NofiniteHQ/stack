# Installation & Setup

Get started with `@nofinite/kanban`.

**Nofinite Kanban** is engineered as a **universal, framework-agnostic** drag-and-drop system. The core engine (`@nofinite/kanban`) mounts directly into any DOM element across Vanilla TypeScript, Vue, Svelte, or Angular with zero framework overhead. The React adapter (`@nofinite/kanban/react`) provides declarative JSX components for React 18 & 19.

---

## 1. Package Installation

Install `@nofinite/kanban` alongside `@nofinite/nuicss` using your preferred package manager:

```bash
# pnpm
pnpm add @nofinite/kanban @nofinite/nuicss

# npm
npm install @nofinite/kanban @nofinite/nuicss

# yarn
yarn add @nofinite/kanban @nofinite/nuicss
```

> **Optional Peer Dependency:** `react` and `react-dom` are strictly **optional** peer dependencies (`peerDependenciesMeta.react.optional: true`). If building with Vanilla JS, Svelte, or Vue, you do not need to install React.

---

## 2. Stylesheet Configuration

Board flex geometry, card dragging states, drop hitboxes, and WIP limit badges are bundled directly into **NUICSS**.

Import the single unified stylesheet at the root of your application (`globals.css` or `main.ts`):

```css
/* In your CSS */
@import '@nofinite/nuicss';
```

Or in your JavaScript/TypeScript entry point:

```ts
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Invariant:** Do **not** import `@nofinite/kanban/styles.css`. NUICSS provides all necessary semantic superclasses (`.kanban-board`, `.kanban-column`, `.kanban-card`) automatically.

---

## 3. Verification

### Option A: Framework-Agnostic Core Verification (Vanilla JS / TS / DOM)

Verify that the board mounts directly into a raw HTML container:

```html
<div id="board" style="width: 100%; height: 600px;"></div>

<script type="module">
  import { createKanbanBoard } from '@nofinite/kanban';
  import '@nofinite/nuicss/styles.css';

  const board = createKanbanBoard(document.getElementById('board'), {
    columns: [
      { id: 'todo', title: 'To Do', items: [{ id: '1', title: 'First Task' }] },
      { id: 'done', title: 'Done', items: [] },
    ],
    onCardMove: (event) => console.log('Card moved:', event),
  });
</script>
```

### Option B: React Verification (`@nofinite/kanban/react`)

If developing in React or Next.js, verify the declarative component:

```tsx
'use client';

import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

export default function TestBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>([
    { id: 'todo', title: 'To Do', items: [{ id: '1', title: 'First Task' }] },
    { id: 'done', title: 'Done', items: [] },
  ]);

  return (
    <div className="w-full h-[500px] p-4 rounded-xl border border-default bg-surface">
      <Kanban columns={columns} onChange={setColumns} />
    </div>
  );
}
```
