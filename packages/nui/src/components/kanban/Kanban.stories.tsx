import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kanban, KanbanColumnProps } from './Kanban';
import { Plus, MoreHorizontal } from 'lucide-react';

const meta = {
  title: 'Components/Enterprise/Kanban',
  component: Kanban,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Kanban>;

export default meta;
type Story = StoryObj<typeof meta>;

const INITIAL_DATA: KanbanColumnProps[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      { id: 't1', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-primary">DESIGN</span></div><strong>Design System Audit</strong><p className="text-muted mt-1 text-xs">Review all semantic colors</p></div> },
      { id: 't2', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">FEATURE</span></div><strong>Create Kanban</strong><p className="text-muted mt-1 text-xs">Implement drag and drop</p></div> },
      { id: 't3', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">DOCS</span></div><strong>Write documentation</strong></div> },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      { id: 't4', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">TECH DEBT</span></div><strong>Update dependencies</strong></div> },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      { id: 't5', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">INFRA</span></div><strong>Setup repository</strong></div> },
      { id: 't6', content: <div><div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-primary">DESIGN</span></div><strong>Initial styling pass</strong></div> },
    ],
  },
];

// Helper to inject the custom header and footer into our raw data
const enrichWithSlots = (columns: KanbanColumnProps[]) => {
  return columns.map(col => ({
    ...col,
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{col.title}</span>
          <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold text-muted bg-slate-200/60 dark:bg-slate-800 rounded-full">
            {col.items.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={() => alert("Options clicked!")} className="p-1 text-muted hover:text-default bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 border-none outline-none shadow-none rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    ),
    footer: (
      <button onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={() => alert("Add Task clicked!")} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-muted hover:text-default bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/30 border-none outline-none shadow-none rounded-md transition-colors group opacity-70 hover:opacity-100">
        <Plus className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        New
      </button>
    )
  }));
};

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [columns, setColumns] = useState(INITIAL_DATA);
    
    return (
      <div className="h-[700px] flex flex-col font-sans antialiased bg-slate-50 dark:bg-[#0a0a0b] p-6 rounded-xl border border-glassBorder">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-default">Sprint Board</h2>
            <p className="text-muted text-sm mt-1">Manage your team's active tasks and progress.</p>
          </div>
          <div className="flex -space-x-2">
            {/* Mock avatars */}
            {[1,2,3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0b] bg-primary/${i*30} flex items-center justify-center text-[10px] font-bold text-primary-foreground z-${30-i*10}`}>
                U{i}
              </div>
            ))}
          </div>
        </div>
        <Kanban columns={enrichWithSlots(columns)} onChange={setColumns} className="flex-1 min-h-0" />
      </div>
    );
  }
};



