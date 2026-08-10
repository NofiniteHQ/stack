import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DataGrid, DataGridColumn } from './DataGrid';

type User = {
 id: number;
 name: string;
 age: number;
};

const rows: User[] = [
 { id: 1, name: 'John', age: 30 },
 { id: 2, name: 'Alice', age: 25 },
 { id: 3, name: 'Bob', age: 35 },
];

const columns: DataGridColumn<User>[] = [
 { key: 'name', title: 'Name', sortable: true },
 { key: 'age', title: 'Age', sortable: true },
];

describe('DataGrid Component', () => {
 describe('Rendering', () => {
 it('renders rows accurately', () => {
 render(<DataGrid columns={columns} rows={rows} disablePagination />);

 expect(screen.getByText('John')).toBeInTheDocument();
 expect(screen.getByText('Alice')).toBeInTheDocument();
 });

 it('renders empty state when rows array is empty', () => {
 render(<DataGrid columns={columns} rows={[]} />);

 expect(screen.getByText('No data available')).toBeInTheDocument();
 });

 it('supports custom render column function', () => {
 const customColumns: DataGridColumn<User>[] = [
 {
 key: 'name',
 title: 'Name',
 render: (r) => <span data-testid="custom">{r.name}</span>,
 },
 ];

 render(<DataGrid columns={customColumns} rows={rows} disablePagination />);

 expect(screen.getAllByTestId('custom')).toHaveLength(3);
 });
 });

 describe('Sorting Engine', () => {
 it('sorts ascending on header click', async () => {
 const user = userEvent.setup();
 render(<DataGrid columns={columns} rows={rows} disablePagination />);

 await user.click(screen.getByText('Age'));

 // The first cell in the Age column should now be 25
 const cells = screen.getAllByRole('gridcell');
 // Index 1 because cell 0 is the Name column of the first row
 expect(cells[1]).toHaveTextContent('25'); 
 });

 it('toggles sorting direction from asc to desc', async () => {
 const user = userEvent.setup();
 render(<DataGrid columns={columns} rows={rows} disablePagination />);

 const header = screen.getByText('Age');

 await user.click(header); // ASC
 await user.click(header); // DESC

 const cells = screen.getAllByRole('gridcell');
 expect(cells[1]).toHaveTextContent('35');
 });
 });

 describe('Interactions & Selection', () => {
 it('handles row click', async () => {
 const user = userEvent.setup();
 const onRowClickSpy = vi.fn();

 render(
 <DataGrid
 columns={columns}
 rows={rows}
 onRowClick={onRowClickSpy}
 disablePagination
 />
 );

 await user.click(screen.getByText('John'));

 expect(onRowClickSpy).toHaveBeenCalledWith(rows[0]);
 });

 it('supports single row selection via checkbox', async () => {
 const user = userEvent.setup();

 render(
 <DataGrid columns={columns} rows={rows} selectable disablePagination />
 );

 // Index 0 is "Select All", Index 1 is the first row
 const checkbox = screen.getAllByRole('checkbox')[1];

 await user.click(checkbox);
 expect(checkbox).toBeChecked();
 });

 it('selects all rows on page via header checkbox', async () => {
 const user = userEvent.setup();

 render(
 <DataGrid columns={columns} rows={rows} selectable disablePagination />
 );

 const selectAll = screen.getAllByRole('checkbox')[0];

 await user.click(selectAll);

 const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
 rowCheckboxes.forEach((cb) => expect(cb).toBeChecked());
 });
 });

 describe('Pagination', () => {
 it('handles pagination next/prev navigation natively', async () => {
 const user = userEvent.setup();

 render(<DataGrid columns={columns} rows={rows} pageSize={1} />);

 expect(screen.getByText('John')).toBeInTheDocument();

 await user.click(screen.getByLabelText('Next Page'));

 expect(screen.getByText('Alice')).toBeInTheDocument();
 });

 it('calls onPageChange when controlled', async () => {
 const user = userEvent.setup();
 const onPageChangeSpy = vi.fn();

 render(
 <DataGrid
 columns={columns}
 rows={rows}
 page={1}
 pageSize={1}
 onPageChange={onPageChangeSpy}
 />
 );

 await user.click(screen.getByLabelText('Next Page'));

 expect(onPageChangeSpy).toHaveBeenCalledWith(2);
 });
 });

 describe('Keyboard Navigation', () => {
 it('supports keyboard navigation and selection via Enter', () => {
 render(
 <DataGrid columns={columns} rows={rows} selectable disablePagination />
 );

 const table = screen.getByRole('grid');
 const wrapper = table.parentElement;

 if (!wrapper) {
 throw new Error('Table wrapper element not found in the DOM');
 }

 wrapper.focus();

 fireEvent.keyDown(wrapper, { key: 'ArrowDown' });
 fireEvent.keyDown(wrapper, { key: 'Enter' });

 const checkbox = screen.getAllByRole('checkbox')[1];
 expect(checkbox).toBeChecked();
 });
 });

 describe('Accessibility', () => {
 it('has no accessibility violations', async () => {
 const { container } = render(
 <DataGrid columns={columns} rows={rows} />
 );
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});