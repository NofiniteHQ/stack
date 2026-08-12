import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Table, TableColumn } from './Table';

interface Product {
 id: string;
 name: string;
 price: number;
 status: 'active' | 'out_of_stock';
}

const meta: Meta<typeof Table> = {
 title: 'Components/Data Display/Table',
 component: Table,
 parameters: { layout: 'padded' },
 tags: ['autodocs'],
};

export default meta;

const productColumns: TableColumn<Product>[] = [
 { key: 'name', label: 'Product Name', sortable: true },
 {
 key: 'price',
 label: 'Price',
 sortable: true,
 align: 'right',
 render: (p) => `$${p.price.toFixed(2)}`,
 },
 {
 key: 'status',
 label: 'Status',
 render: (p) => (
 <span
 style={{
 color: p.status === 'active' ? '#10b981' : '#ef4444',
 fontSize: '0.75rem',
 textTransform: 'uppercase',
 fontWeight: 600,
 }}
 >
 {p.status.replace('_', ' ')}
 </span>
 ),
 },
];

const products: Product[] = [
 { id: '1', name: 'Mechanical Keyboard', price: 120, status: 'active' },
 { id: '2', name: 'Wireless Mouse', price: 45, status: 'active' },
 { id: '3', name: 'Ultrawide Monitor', price: 450, status: 'out_of_stock' },
];

export const ProductsTable: StoryObj<typeof Table<Product>> = {
 args: {
 columns: productColumns,
 data: products,
 rowKey: 'id',
 },
};

export const EmptyState: StoryObj<typeof Table<Product>> = {
 args: {
 columns: productColumns,
 data: [],
 rowKey: 'id',
 emptyText: "No products found in inventory."
 },
};

export const PrimitiveTable: StoryObj = {
 render: () => (
  <Table>
   <Table.Header>
    <Table.Row>
     <Table.Head>Name</Table.Head>
     <Table.Head>Role</Table.Head>
    </Table.Row>
   </Table.Header>
   <Table.Body>
    <Table.Row>
     <Table.Cell>Alice</Table.Cell>
     <Table.Cell>Admin</Table.Cell>
    </Table.Row>
    <Table.Row>
     <Table.Cell>Bob</Table.Cell>
     <Table.Cell>User</Table.Cell>
    </Table.Row>
   </Table.Body>
  </Table>
 )
};

/**
 * Automated Interaction Test
 * Verifies that the table header sorts rows accurately.
 */
export const AutomatedSortingTest: StoryObj<typeof Table<Product>> = {
 args: {
 columns: productColumns,
 data: products,
 rowKey: 'id',
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);

 // Initial state: Array order (Mechanical Keyboard is first)
 let rows = canvas.getAllByRole('row');
 await expect(rows[1]).toHaveTextContent('Mechanical Keyboard');

 // Sort by Price Ascending (Wireless Mouse $45 should be first)
 const priceHeader = canvas.getByRole('button', { name: /Price/i });
 await userEvent.click(priceHeader);

 rows = canvas.getAllByRole('row');
 await expect(rows[1]).toHaveTextContent('Wireless Mouse');
 await expect(priceHeader.parentElement).toHaveAttribute('aria-sort', 'ascending');

 // Sort by Price Descending (Ultrawide Monitor $450 should be first)
 await userEvent.click(priceHeader);

 rows = canvas.getAllByRole('row');
 await expect(rows[1]).toHaveTextContent('Ultrawide Monitor');
 await expect(priceHeader.parentElement).toHaveAttribute('aria-sort', 'descending');
 },
};