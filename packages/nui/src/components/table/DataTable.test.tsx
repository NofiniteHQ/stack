import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from './DataTable';

describe('DataTable', () => {
 it('renders columns and rows correctly', () => {
 const columns = [
 { key: 'name', header: 'Name' },
 { key: 'age', header: 'Age' },
 ];
 const data = [
 { name: 'Alice', age: 30 },
 { name: 'Bob', age: 25 },
 ];

 render(<DataTable columns={columns} data={data} />);

 expect(screen.getByText('Name')).toBeInTheDocument();
 expect(screen.getByText('Age')).toBeInTheDocument();
 expect(screen.getByText('Alice')).toBeInTheDocument();
 expect(screen.getByText('30')).toBeInTheDocument();
 expect(screen.getByText('Bob')).toBeInTheDocument();
 expect(screen.getByText('25')).toBeInTheDocument();
 });
});
