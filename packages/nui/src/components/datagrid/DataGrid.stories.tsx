import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { DataGrid, DataGridColumn } from './DataGrid';
import { Button } from '../button/Button';

type User = {
 id: number;
 name: string;
 age: number;
};

const rows: User[] = [
 { id: 1, name: 'John', age: 30 },
 { id: 2, name: 'Alice', age: 25 },
 { id: 3, name: 'Bob', age: 35 },
 { id: 4, name: 'Emma', age: 28 },
 { id: 5, name: 'Ryan', age: 32 },
];

const columns: DataGridColumn<User>[] = [
 { key: 'name', title: 'Components/Data Display/DataGrid', sortable: true },
 { key: 'age', title: 'Age', sortable: true, align: 'right' },
];

const meta: Meta<typeof DataGrid<User>> = {
 title: 'Data Display/DataGrid',
 component: DataGrid,
 parameters: { layout: 'fullscreen' },
 decorators: [
 (Story) => (
 <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
 <Story />
 </div>
 ),
 ],
 args: {
 columns,
 rows,
 onRowClick: fn(),
 onPageChange: fn(),
 },
};

export default meta;
type Story = StoryObj<typeof DataGrid<User>>;

export const Default: Story = {};

export const Selectable: Story = {
 args: { selectable: true },
};

export const Pagination: Story = {
 args: { pageSize: 2 },
};

export const CustomRender: Story = {
 args: {
 columns: [
 {
 key: 'name',
 title: 'User',
 render: (r: User) => <b>{r.name}</b>,
 },
 { key: 'age', title: 'Age' },
 ],
 },
};

export const RowActions: Story = {
 args: {
 renderRowActions: (row: User) => (
 <Button variant="outline" size="sm">Edit {row.id}</Button>
 ),
 },
};

export const Empty: Story = {
 args: { rows: [] },
};

/**
 * Automated Interaction Test
 * Verifies that the table can be sorted by clicking a header.
 */
export const InteractiveSortTest: Story = {
 args: { disablePagination: true },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const ageHeader = canvas.getByText('Age');
 
 // Initial state: John (30) should be first
 let firstCell = canvas.getAllByRole('gridcell')[1]; // Cell 1 is the first age cell
 await expect(firstCell).toHaveTextContent('30');
 
 // Sort Ascending: Alice (25) should be first
 await userEvent.click(ageHeader);
 firstCell = canvas.getAllByRole('gridcell')[1]; 
 await expect(firstCell).toHaveTextContent('25');
 },
};