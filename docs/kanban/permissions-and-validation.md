# Permissions & Move Validation

**Nofinite Kanban** provides robust validation hooks allowing teams to intercept drag-and-drop actions, enforce state machine transitions, and apply role-based permission checks before any state update commits.

When a validation hook returns `false`, the dragged card snaps smoothly back to its origin without DOM mutation or data corruption.

```ts
// Framework-Agnostic Core
import { createKanbanBoard, type CardMoveEvent } from '@nofinite/kanban';

// React Adapter
import { Kanban } from '@nofinite/kanban/react';
```

---

## 1. Framework-Agnostic Core Validation

Pass `canMoveCard` to `createKanbanBoard()` to validate card transitions:

```ts
import { createKanbanBoard, type CardMoveEvent } from '@nofinite/kanban';
import '@nofinite/nuicss/styles.css';

const board = createKanbanBoard(document.getElementById('board'), {
  columns: initialColumns,
  enforceWipLimit: true,

  // Intercept and evaluate card move legality
  canMoveCard: (event: CardMoveEvent): boolean => {
    const { cardId, sourceColumnId, targetColumnId } = event;

    // Rule 1: Cannot skip from 'Backlog' directly to 'Done'
    if (sourceColumnId === 'backlog' && targetColumnId === 'done') {
      console.warn(
        'Forbidden transition: tasks must pass through In Progress.'
      );
      return false; // Automatically triggers smooth snap-back animation
    }

    // Rule 2: Role-based permissions
    const currentUserRole = 'engineer'; // From session
    if (targetColumnId === 'production' && currentUserRole !== 'admin') {
      alert('Only administrators can promote tasks to Production.');
      return false;
    }

    return true; // Move permitted
  },
});
```

---

## 2. React Adapter Validation

In React applications, provide `canMoveCard` and `canMoveColumn` as declarative component props:

```tsx
import React, { useState } from 'react';
import {
  Kanban,
  type KanbanColumnProps,
  type CardMoveEvent,
} from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

export function ValidatedWorkflowBoard({ userRole }: { userRole: string }) {
  const [columns, setColumns] = useState<KanbanColumnProps[]>(/* ... */);

  const validateCardMove = (event: CardMoveEvent): boolean => {
    // Prevent non-QA members from moving cards to 'Verified'
    if (event.targetColumnId === 'verified' && userRole !== 'qa') {
      return false;
    }
    return true;
  };

  return (
    <Kanban
      columns={columns}
      onChange={setColumns}
      canMoveCard={validateCardMove}
      enforceWipLimit={true}
    />
  );
}
```
