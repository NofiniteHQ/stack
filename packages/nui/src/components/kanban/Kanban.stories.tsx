import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kanban, KanbanColumnProps } from './Kanban';

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
 { id: 't1', content: <div><strong>Design System Audit</strong><p className="text-muted mt-1">Review all semantic colors</p></div> },
 { id: 't2', content: <div><strong>Create Kanban</strong><p className="text-muted mt-1">Implement drag and drop</p></div> },
 { id: 't3', content: 'Write documentation' },
 ],
 },
 {
 id: 'in-progress',
 title: 'In Progress',
 items: [
 { id: 't4', content: 'Update dependencies' },
 ],
 },
 {
 id: 'done',
 title: 'Done',
 items: [
 { id: 't5', content: 'Setup repository' },
 { id: 't6', content: 'Initial styling pass' },
 ],
 },
];

export const Default: Story = {
 render: () => {
 // eslint-disable-next-line react-hooks/rules-of-hooks
 const [columns, setColumns] = useState(INITIAL_DATA);
 
 return (
 <div className="h-[600px] bg-subtle p-6 rounded-xl border border-default">
 <h2 className="text-2xl font-bold mb-6 text-default">Project Tasks</h2>
 <Kanban columns={columns} onChange={setColumns} />
 </div>
 );
 }
};
