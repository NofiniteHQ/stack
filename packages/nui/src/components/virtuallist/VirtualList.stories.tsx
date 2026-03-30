import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, fireEvent, expect } from '@storybook/test';
// 1. Import VirtualListProps
import { VirtualList, VirtualListProps } from './VirtualList'; 

/* ----------------------------------------------------
   Define the Mock Data Type
---------------------------------------------------- */
interface MockItem {
  id: string;
  label: string;
}

const meta: Meta<typeof VirtualList> = {
  title: 'Enterprise/Data/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'High-performance scrolling for massive datasets. Uses GPU-accelerated transforms and windowing logic.',
      },
    },
  },
};

export default meta;

// 2. Explicitly type the StoryObj with our generic MockItem!
type Story = StoryObj<VirtualListProps<MockItem>>;

export const MillionItemStressTest: Story = {
  args: {
    items: Array.from({ length: 1000000 }, (_, i) => ({
      id: `uuid-${i}`,
      label: `Row ${i}`,
    })),
    height: 500,
    itemHeight: 50,
    overscan: 5,
    keyExtractor: (item: MockItem) => item.id,
    renderItem: (item: MockItem) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: '16px' }}>
        <span style={{ fontWeight: 500, color: '#2563eb' }}>{item.label}</span>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {item.id}</span>
      </div>
    ),
  },
};

export const CustomOverscan: Story = {
  args: {
    ...MillionItemStressTest.args,
    items: Array.from({ length: 100 }, (_, i) => ({
      id: `uuid-${i}`,
      label: `Smooth Row ${i}`,
    })),
    overscan: 20,
  },
};

/**
 * Automated Interaction Test
 * Verifies that simulating a scroll dynamically updates the DOM to render items previously out of bounds.
 */
export const AutomatedScrollTest: Story = {
  args: {
    ...MillionItemStressTest.args,
    items: Array.from({ length: 500 }, (_, i) => ({
      id: `uuid-${i}`,
      label: `Automated Row ${i}`,
    })),
    height: 400,
    itemHeight: 40,
    overscan: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listContainer = canvas.getByRole('list');

    // Initial state: Row 0 is visible, Row 100 is far out of bounds
    await expect(canvas.getByText('Automated Row 0')).toBeInTheDocument();
    await expect(canvas.queryByText('Automated Row 100')).not.toBeInTheDocument();

    // Scroll down 4000px (40px per item * 100 items = Row 100)
    fireEvent.scroll(listContainer, { target: { scrollTop: 4000 } });

    // Verify Row 0 has been unmounted from the DOM
    await expect(canvas.queryByText('Automated Row 0')).not.toBeInTheDocument();
    
    // Verify Row 100 is now mounted and visible
    await expect(canvas.getByText('Automated Row 100')).toBeInTheDocument();
  }
};