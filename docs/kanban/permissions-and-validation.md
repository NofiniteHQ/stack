# Permissions and Move Validation

Enterprise project management requires strict workflow enforcement. **Nofinite Kanban** provides two complementary layers of movement validation:

1. **WIP (Work-in-Progress) Limit Enforcement (`enforceWipLimit`):** Hard blocks capacity overflows to prevent engineering bottlenecks.
2. **Business Rule Move Validation (`canMoveCard`):** Intercepts drag-and-drop operations and executes business logic (state machines, role-based access control, transition validation) before committing state changes.

---

## Enforcing Work-In-Progress (WIP) Limits

In Lean and Agile methodologies, WIP limits constrain the maximum number of items allowed in active columns (e.g., _In Progress_, _In Review_).

### Configuration

1. Set `wipLimit: number` on the targeted column definition.
2. Set `enforceWipLimit={true}` on the `<Kanban />` component.

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

const columns: KanbanColumnProps[] = [
  {
    id: 'in-review',
    title: 'Code Review',
    wipLimit: 2, // Hard limit of 2 items
    items: [
      { id: 'pr-1', title: 'Refactor Auth Middleware' },
      { id: 'pr-2', title: 'Migrate DB to Postgres 16' },
    ],
  },
  {
    id: 'backlog',
    title: 'Backlog',
    items: [{ id: 'task-3', title: 'Update Documentation' }],
  },
];

export function WipRestrictedBoard() {
  const [boardColumns, setBoardColumns] = useState(columns);

  return (
    <div className="w-full h-[600px] p-6 bg-surface">
      <Kanban
        columns={boardColumns}
        onChange={setBoardColumns}
        enforceWipLimit={true} // Hard drop rejection when capacity reached
      />
    </div>
  );
}
```

### Drop Rejection Mechanics

When an author attempts to drag a 3rd item into the _Code Review_ column:

- The drop target evaluates `targetColumn.items.length >= targetColumn.wipLimit`.
- The drop action is **rejected**.
- The card smoothly springs back to its original position in the source column.
- Screen readers receive an ARIA live region announcement: `"Cannot move card. Target column has reached its maximum capacity of 2."`

---

## Business Logic Move Validation (`canMoveCard`)

The `canMoveCard` prop intercepts drag-and-drop movements right before state is committed. It receives a `CardMoveEvent` and must return a boolean indicating whether the move is permitted.

### Event Interface

```ts
export interface CardMoveEvent {
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  sourceIndex: number;
  targetIndex: number;
  edge?: 'top' | 'right' | 'bottom' | 'left' | null;
}
```

### State Machine Transition Validation

Enforce that tasks must follow an orderly development lifecycle (e.g., `Backlog` → `In Progress` → `Review` → `Done`), preventing illegal skips from `Backlog` directly to `Done`:

```tsx
import React, { useState } from 'react';
import {
  Kanban,
  type CardMoveEvent,
  type KanbanColumnProps,
} from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

// Permitted transition map
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  backlog: ['in-progress'],
  'in-progress': ['backlog', 'review'],
  review: ['in-progress', 'done'],
  done: ['review'],
};

export function StateMachineBoard() {
  const [columns, setColumns] = useState<KanbanColumnProps[]>(/* ... */);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateCardMove = (event: CardMoveEvent): boolean => {
    const { sourceColumnId, targetColumnId } = event;

    // Moving within the same column is always allowed (reordering)
    if (sourceColumnId === targetColumnId) {
      return true;
    }

    const permittedTargets = ALLOWED_TRANSITIONS[sourceColumnId] || [];
    const isAllowed = permittedTargets.includes(targetColumnId);

    if (!isAllowed) {
      setErrorMessage(
        `Transition forbidden: Cannot move tasks directly from "${sourceColumnId}" to "${targetColumnId}".`
      );
      setTimeout(() => setErrorMessage(null), 3500);
      return false; // Rejects the drop
    }

    return true; // Authorizes the drop
  };

  return (
    <div className="space-y-4 p-6 bg-surface">
      {errorMessage && (
        <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger font-medium flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>✕</button>
        </div>
      )}

      <Kanban
        columns={columns}
        onChange={setColumns}
        canMoveCard={validateCardMove}
      />
    </div>
  );
}
```

---

## Role-Based Access Control (RBAC)

You can inspect the current authenticated user's permissions before permitting movements into sensitive columns:

```tsx
interface UserSession {
  role: 'developer' | 'qa' | 'release_manager';
}

export function ProtectedBoard({ user }: { user: UserSession }) {
  const validatePermissions = (event: CardMoveEvent): boolean => {
    // Only Release Managers can move cards into the Production Deployment column
    if (
      event.targetColumnId === 'production' &&
      user.role !== 'release_manager'
    ) {
      alert('Only Release Managers have authorization to stage deployments.');
      return false;
    }

    // Only QA engineers or Release Managers can verify reviews
    if (event.targetColumnId === 'done' && user.role === 'developer') {
      alert('Tasks must be verified by QA before marking Done.');
      return false;
    }

    return true;
  };

  return (
    <Kanban
      columns={columns}
      onChange={setColumns}
      canMoveCard={validatePermissions}
    />
  );
}
```

---

## Keyboard Reorder Validation

Validation rules apply equally when users navigate and reorder tasks using keyboard accessibility shortcuts (<kbd>Space</kbd> to pick up, <kbd>Arrow Keys</kbd> to move, <kbd>Space</kbd> to commit).

If the keyboard movement violates either `enforceWipLimit` or `canMoveCard`, the transaction is rolled back, the card returns to its initial slot, and the screen reader announces the rejection reason.
