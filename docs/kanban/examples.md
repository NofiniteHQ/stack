# Kanban Production Examples

Below are production-ready, copy-paste implementations of **Nofinite Kanban** showcasing advanced customization, WIP limits, validation rules, and search filtering.

---

## Example 1: Agile Engineering Sprint Board

A complete engineering board featuring strict Work-in-Progress (WIP) limits, priority badges, story point counters, assignee avatars, and interactive subtasks.

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
        description:
          'Verify glibc compatibility and security vulnerability scan.',
        badge: { label: 'DevOps', variant: 'info' },
        assignee: {
          name: 'Alex Rivera',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        },
        subtasks: { total: 3, completed: 0 },
        dueDate: 'Oct 20',
      },
      {
        id: 'eng-102',
        title: 'Implement PKCE flow for mobile OAuth authorization',
        badge: { label: 'Security', variant: 'danger' },
        subtasks: { total: 5, completed: 2 },
        dueDate: 'Oct 22',
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
        title: 'Optimize D3 SVG path calculation for multi-series charts',
        description:
          'Transition path generation to curveMonotoneX with downsampling.',
        badge: { label: 'Performance', variant: 'warning' },
        assignee: {
          name: 'Marcus Vance',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
        subtasks: { total: 4, completed: 3 },
        dueDate: 'Tomorrow',
      },
    ],
  },
  {
    id: 'in-review',
    title: 'Code Review',
    wipLimit: 2, // Hard limit of 2 items
    items: [
      {
        id: 'eng-104',
        title: 'PR #492: Single-engine NUICSS superclass migration',
        badge: { label: 'Architecture', variant: 'primary' },
        assignee: {
          name: 'Elena Rostova',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
        },
        subtasks: { total: 2, completed: 2 },
        dueDate: 'Today',
      },
    ],
  },
  {
    id: 'done',
    title: 'Completed (Sprint 42)',
    items: [
      {
        id: 'eng-105',
        title: 'Migrate central documentation from legacy HTML to Markdown',
        badge: { label: 'Docs', variant: 'success' },
        subtasks: { total: 6, completed: 6 },
        dueDate: 'Yesterday',
      },
    ],
  },
];

export function AgileSprintBoard() {
  const [columns, setColumns] = useState(sprintColumns);

  return (
    <div className="w-full h-[700px] p-6 bg-surface">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-default">
        <div>
          <h1 className="text-lg font-bold text-default">
            Sprint 42 — Core Infrastructure
          </h1>
          <p className="text-xs text-muted">
            Oct 14 – Oct 28 • 14 Story Points Remaining
          </p>
        </div>
      </div>

      <Kanban
        columns={columns}
        onChange={setColumns}
        enforceWipLimit={true}
        allowAdd={true}
        allowAddColumn={false}
      />
    </div>
  );
}
```

---

## Example 2: Customer Support Ticket Triage

Demonstrates state transition enforcement using `canMoveCard`. Tickets cannot be escalated to "Investigating" unless an engineer is assigned, and cannot skip directly from "New" to "Resolved".

```tsx
import React, { useState } from 'react';
import {
  Kanban,
  type CardMoveEvent,
  type KanbanColumnProps,
} from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

const supportColumns: KanbanColumnProps[] = [
  {
    id: 'triage',
    title: 'New Tickets (Triage)',
    items: [
      {
        id: 'ticket-901',
        title: 'Payment Gateway Webhook Timeout (HTTP 504)',
        badge: { label: 'P0 Urgent', variant: 'danger' },
        dueDate: 'SLA: 2 hours',
        isOverdue: true,
      },
    ],
  },
  {
    id: 'investigating',
    title: 'Under Investigation',
    items: [],
  },
  {
    id: 'resolved',
    title: 'Resolved',
    items: [],
  },
];

export function SupportTriageBoard() {
  const [columns, setColumns] = useState(supportColumns);
  const [alertText, setAlertText] = useState<string | null>(null);

  const validateTicketMove = (event: CardMoveEvent): boolean => {
    // Rule: Cannot jump directly from Triage to Resolved
    if (
      event.sourceColumnId === 'triage' &&
      event.targetColumnId === 'resolved'
    ) {
      setAlertText(
        'Compliance Error: Tickets must be investigated before resolution.'
      );
      setTimeout(() => setAlertText(null), 3500);
      return false; // Drop rejected
    }

    // Rule: Must be assigned before moving to Investigating
    const sourceCol = columns.find((c) => c.id === event.sourceColumnId);
    const card = sourceCol?.items.find((i) => i.id === event.cardId);

    if (event.targetColumnId === 'investigating' && !card?.assignee) {
      setAlertText(
        'Assignment Error: Assign a support engineer before moving to Investigation.'
      );
      setTimeout(() => setAlertText(null), 3500);
      return false; // Drop rejected
    }

    return true;
  };

  return (
    <div className="p-6 bg-surface space-y-4">
      {alertText && (
        <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-xs text-danger font-semibold flex items-center justify-between">
          <span>⛔ {alertText}</span>
          <button onClick={() => setAlertText(null)}>✕</button>
        </div>
      )}

      <Kanban
        columns={columns}
        onChange={setColumns}
        canMoveCard={validateTicketMove}
      />
    </div>
  );
}
```

---

## Example 3: Live Search & Multi-Filter Board

Integrates top search and filter bars with the board's internal filtering engine.

```tsx
import React, { useState } from 'react';
import { Kanban, type KanbanColumnProps } from '@nofinite/kanban/react';
import '@nofinite/nuicss/styles.css';

export function SearchableFilterBoard({
  initialColumns,
}: {
  initialColumns: KanbanColumnProps[];
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('');

  return (
    <div className="w-full p-6 bg-surface space-y-4">
      {/* Search & Tag Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-active rounded-xl border border-default">
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="px-3 py-1.5 text-xs bg-surface border border-default rounded-lg text-default w-64"
          />

          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-default rounded-lg text-default"
          >
            <option value="">All Categories</option>
            <option value="Security">Security</option>
            <option value="DevOps">DevOps</option>
            <option value="Performance">Performance</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedBadge('');
          }}
          className="text-xs text-muted hover:text-default"
        >
          Reset Filters
        </button>
      </div>

      <Kanban
        columns={columns}
        onChange={setColumns}
        filterQuery={searchQuery}
        filterBadge={selectedBadge || undefined}
      />
    </div>
  );
}
```
