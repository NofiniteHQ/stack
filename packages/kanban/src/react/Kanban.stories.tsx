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
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-primary font-mono">
              AUTH-102
            </div>
            <div className="text-sm font-semibold text-default leading-snug">
              Implement Passkey WebAuthn registration
            </div>
            <div className="text-xs text-muted leading-relaxed">
              Research browser compatibility & FIDO2
            </div>
          </div>
        ),
      },
      {
        id: 'task-2',
        content: (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-muted font-mono">
              UI-88
            </div>
            <div className="text-sm font-semibold text-default leading-snug">
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
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-primary font-mono">
              CORE-404
            </div>
            <div className="text-sm font-semibold text-default leading-snug">
              Unified Storybook Monorepo Architecture
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-primary badge-subtle text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                Vite
              </span>
              <span className="badge badge-subtle text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
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
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-success font-mono">
              SEC-12
            </div>
            <div className="text-sm font-semibold text-default leading-snug">
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
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-muted font-mono line-through">
              PKG-01
            </div>
            <div className="text-sm font-semibold text-muted line-through opacity-70 leading-snug">
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
            <span className="font-bold text-sm tracking-wide text-primary">
              💡 Feature Proposals
            </span>
            <span className="badge badge-primary badge-subtle text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
              2
            </span>
          </div>
        ),
        footer: (
          <button
            type="button"
            className="w-full py-1.5 text-xs text-center font-medium text-muted hover:text-default hover:bg-subtle/50 rounded-lg transition-colors cursor-pointer"
          >
            + Add Proposal
          </button>
        ),
        items: [
          {
            id: 'prop-1',
            content: (
              <div className="text-sm font-medium text-default leading-snug">
                Real-time canvas whiteboard collaboration with CRDT sync
              </div>
            ),
          },
          {
            id: 'prop-2',
            content: (
              <div className="text-sm font-medium text-default leading-snug">
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
            <span className="font-bold text-sm tracking-wide text-success">
              Approved for Q3
            </span>
            <span className="badge badge-success badge-subtle text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
              1
            </span>
          </div>
        ),
        items: [
          {
            id: 'app-1',
            content: (
              <div className="text-sm font-medium text-default leading-snug">
                Pragmatic Drag-and-Drop Kanban Component Library
              </div>
            ),
          },
        ],
      },
    ],
  },
};

export const ProductionSprintBoard: Story = {
  args: {
    allowAdd: true,
    headerActions: true,
    columns: [
      {
        id: 'backlog',
        title: 'Backlog',
        wipLimit: 5,
        items: [
          {
            id: 'task-auth',
            title: 'Implement WebAuthn passkey authentication flow',
            description:
              'Evaluate FIDO2 client assertions and integrate biometric credentials for zero-trust login.',
            badge: { label: 'Security', variant: 'primary' },
            assignee: { name: 'Elena Rostova', initials: 'ER' },
            dueDate: 'Nov 12',
            subtasks: { completed: 3, total: 5 },
          },
          {
            id: 'task-perf',
            title: 'Optimize UnoCSS bundle tree-shaking',
            description:
              'Audit dynamic color-mix runtime evaluation to eliminate unused OKLCH palette lookups.',
            badge: { label: 'Performance', variant: 'warning' },
            assignee: { name: 'Marcus Chen', initials: 'MC' },
            dueDate: 'Oct 28',
            isOverdue: true,
            subtasks: { completed: 1, total: 4 },
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        wipLimit: 2,
        items: [
          {
            id: 'task-dnd',
            title: 'Pragmatic DnD Hitbox Closest-Edge integration',
            description:
              'Calculate relative Euclidean pointer distance for directional drop indicators.',
            badge: { label: 'Architecture', variant: 'info' },
            assignee: { name: 'Devin Vance', initials: 'DV' },
            dueDate: 'Oct 04',
            subtasks: { completed: 4, total: 4 },
          },
        ],
      },
      {
        id: 'review',
        title: 'Code Review',
        wipLimit: 3,
        items: [
          {
            id: 'task-a11y',
            title: 'Screen reader accessibility & keyboard reordering',
            description:
              'Ensure ARIA live regions announce card movement across columns and drop zones.',
            badge: { label: 'A11y', variant: 'subtle' },
            assignee: { name: 'Sophia Miller', initials: 'SM' },
            dueDate: 'Nov 01',
            subtasks: { completed: 2, total: 2 },
          },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        items: [
          {
            id: 'task-tokens',
            title: 'NUICSS Semantic Token System migration',
            description:
              'Replace arbitrary bracket utility clusters with semantic superclasses.',
            badge: { label: 'Design System', variant: 'success' },
            assignee: { name: 'Devin Vance', initials: 'DV' },
            dueDate: 'Sep 29',
            subtasks: { completed: 6, total: 6 },
          },
        ],
      },
    ],
  },
};
