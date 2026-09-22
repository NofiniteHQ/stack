import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kanban, type KanbanColumnProps } from './Kanban';

const meta: Meta<typeof Kanban> = {
  title: 'Kanban',
  component: Kanban,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Kanban>;

const initialSprintColumns: KanbanColumnProps[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    items: [
      {
        id: 'task-1',
        content: (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--color-primary)]">
              AUTH-102
            </div>
            <div className="text-sm font-medium">
              Implement Passkey WebAuthn registration
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Research browser compatibility & FIDO2
            </div>
          </div>
        ),
      },
      {
        id: 'task-2',
        content: (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)]">
              UI-88
            </div>
            <div className="text-sm font-medium">
              Audit glassmorphic contrast ratios in dark mode
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      {
        id: 'task-3',
        content: (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--color-primary)]">
              CORE-404
            </div>
            <div className="text-sm font-medium">
              Unified Storybook Monorepo Architecture
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                Vite
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)]">
                P1
              </span>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'review',
    title: 'In Review',
    items: [
      {
        id: 'task-4',
        content: (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--color-success)]">
              SEC-12
            </div>
            <div className="text-sm font-medium">
              CSRF double-submit cookie validation middleware
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      {
        id: 'task-5',
        content: (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] line-through">
              PKG-01
            </div>
            <div className="text-sm font-medium line-through opacity-70">
              Monorepo React 19.3.0 Upgrade
            </div>
          </div>
        ),
      },
    ],
  },
];

export const Default: Story = {
  args: {
    columns: initialSprintColumns,
  },
};

export const CustomColumns: Story = {
  args: {
    columns: [
      {
        id: 'ideas',
        header: (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-sm tracking-wide text-[var(--color-primary)]">
              💡 Feature Proposals
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              2
            </span>
          </div>
        ),
        footer: (
          <button
            type="button"
            className="w-full py-1 text-xs text-center font-medium text-[var(--text-muted)] hover:text-[var(--text-default)] transition-colors"
          >
            + Add Proposal
          </button>
        ),
        items: [
          {
            id: 'prop-1',
            content: (
              <div className="text-sm">
                Real-time canvas whiteboard collaboration with CRDT sync
              </div>
            ),
          },
          {
            id: 'prop-2',
            content: (
              <div className="text-sm">
                Embedded KaTeX formula autocomplete in Markon editor
              </div>
            ),
          },
        ],
      },
      {
        id: 'approved',
        header: (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-sm tracking-wide text-[var(--color-success)]">
              Approved for Q3
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
              1
            </span>
          </div>
        ),
        items: [
          {
            id: 'app-1',
            content: (
              <div className="text-sm font-medium">
                Pragmatic Drag-and-Drop Kanban Component Library
              </div>
            ),
          },
        ],
      },
    ],
  },
};
