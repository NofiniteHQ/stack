import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Table, TableColumn } from './Table';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: TableColumn<User>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

const data: User[] = [
  { id: 2, name: 'Zelda', email: 'z@example.com' },
  { id: 1, name: 'Alice', email: 'a@example.com' },
];

describe('Table Component', () => {
  it('renders headers and data correctly', () => {
    render(<Table columns={columns} data={data} rowKey="id" />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Zelda')).toBeInTheDocument();
  });

  it('sorts data when a sortable header is clicked', async () => {
    const user = userEvent.setup();
    render(<Table columns={columns} data={data} rowKey="id" />);

    const nameHeader = screen.getByRole('button', { name: /Name/i });
    expect(nameHeader.parentElement).toHaveAttribute('aria-sort', 'none');

    // First click: ASC (Alice -> Zelda)
    await user.click(nameHeader);
    let rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0]).toHaveTextContent('Alice');
    expect(nameHeader.parentElement).toHaveAttribute('aria-sort', 'ascending');

    // Second click: DESC (Zelda -> Alice)
    await user.click(nameHeader);
    rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Zelda');
    expect(nameHeader.parentElement).toHaveAttribute('aria-sort', 'descending');
  });

  it('uses custom render function for cells', () => {
    const customCols: TableColumn<User>[] = [
      {
        key: 'name',
        label: 'Name',
        render: (user) => (
          <span data-testid="custom-cell">{user.name.toUpperCase()}</span>
        ),
      },
    ];

    render(<Table columns={customCols} data={data} rowKey="id" />);
    
    // Use getAllByTestId because the table renders multiple rows
    const customCells = screen.getAllByTestId('custom-cell');
    
    expect(customCells).toHaveLength(2);
    expect(customCells[0]).toHaveTextContent('ZELDA');
    expect(customCells[1]).toHaveTextContent('ALICE');
  });

  it('displays empty state when no data is provided', () => {
    render(
      <Table columns={columns} data={[]} rowKey="id" emptyText="Nothing here" />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});