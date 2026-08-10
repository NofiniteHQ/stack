import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import React, { useState } from 'react';
import { Pagination, PaginationProps } from './Pagination';

const meta: Meta<typeof Pagination> = {
 title: 'Components/Navigation/Pagination',
 component: Pagination,
 tags: ['autodocs'],
 args: {
 page: 1,
 total: 10,
 siblings: 1,
 },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationControlled = (args: Partial<PaginationProps>) => {
 const [page, setPage] = useState(args.page || 1);
 return (
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
 <Pagination {...args} page={page} onChange={setPage} total={args.total || 10} />
 <p style={{ fontFamily: 'sans-serif', color: '#64748b' }}>
 Currently viewing page <strong>{page}</strong> of {args.total || 10}
 </p>
 </div>
 );
};

export const Default: Story = {
 render: PaginationControlled,
};

export const LargeTotal: Story = {
 render: PaginationControlled,
 args: {
 page: 50,
 total: 100,
 }
};

export const WithManySiblings: Story = {
 render: PaginationControlled,
 args: {
 page: 10,
 total: 30,
 siblings: 2,
 }
};

export const Disabled: Story = {
 args: {
 page: 3,
 total: 10,
 disabled: true,
 },
};

/**
 * Automated Interaction Test
 * Verifies that the pagination controls correctly update the state and boundaries.
 */
export const InteractiveTest: Story = {
 render: PaginationControlled,
 args: {
 page: 1,
 total: 5,
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);

 // 1. Verify Next Button Interaction
 const nextBtn = canvas.getByRole('button', { name: 'Next Page' });
 await userEvent.click(nextBtn);

 // Active page should now be 2
 let activePage = await canvas.findByRole('button', { name: 'Page 2' });
 await expect(activePage).toBeInTheDocument();
 await expect(activePage).toHaveAttribute('aria-current', 'page');

 // 2. Verify Direct Page Click
 const page5Btn = canvas.getByRole('button', { name: 'Go to page 5' });
 await userEvent.click(page5Btn);

 // Active page should now be 5
 activePage = await canvas.findByRole('button', { name: 'Page 5' });
 await expect(activePage).toBeInTheDocument();
 
 // 3. Verify Next Button is Disabled on Last Page
 await expect(nextBtn).toBeDisabled();
 },
};