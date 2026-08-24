import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, fireEvent, expect, waitFor, fn } from '@storybook/test';
// 1. Import VirtualListProps and VirtualListHandle
import { VirtualList, VirtualListProps, VirtualListHandle } from './VirtualList'; 

/* ----------------------------------------------------
 Define the Mock Data Type
---------------------------------------------------- */
interface MockItem {
 id: string;
 label: string;
}

const meta: Meta<typeof VirtualList> = {
 title: 'Components/Enterprise/VirtualList',
 component: VirtualList,
 tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'High-performance scrolling for massive datasets. Uses GPU-accelerated transforms and windowing logic.',
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description: 'Array of data items to render. (Control disabled to prevent UI lag)',
    },
  },
};

export default meta;

// 2. Explicitly type the StoryObj with our generic MockItem!
type Story = StoryObj<VirtualListProps<MockItem>>;

export const MillionItemStressTest: Story = {
 args: { 
 items: Array.from({ length: 100000 }, (_, i) => ({
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
 * Demonstrates the ResizeObserver auto-sizing capability.
 * Notice that the `height` prop is OMITTED. The list automatically expands to fill its parent container!
 */
export const AutoSizingContainer: Story = {
  render: (args) => (
    <div className="flex flex-col h-[600px] w-full max-w-2xl border border-default rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0a0a0b] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Auto-Sizing List</h3>
        <p className="text-sm text-muted">Resize the window and the list will automatically adjust its internal height math!</p>
      </div>
      <div className="flex-1 min-h-0 border border-default rounded-md">
        <VirtualList 
          {...args}
          // Intentionally omitting 'height' to trigger the ResizeObserver
          height={undefined}
        />
      </div>
    </div>
  ),
  args: {
    ...MillionItemStressTest.args,
  }
};

/**
 * Demonstrates the programmatic scrollToIndex API using the forwarded VirtualListHandle.
 */
export const ScrollToIndexApi: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const listRef = React.useRef<VirtualListHandle>(null);

    return (
      <div className="flex flex-col h-[700px] w-full max-w-2xl border border-default rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0a0a0b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Programmatic Scrolling</h3>
            <p className="text-sm text-muted">Click the buttons to jump to specific rows instantly.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => listRef.current?.scrollToIndex(0)}
              className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 border border-default rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Top (0)
            </button>
            <button 
              onClick={() => listRef.current?.scrollToIndex(50000)}
              className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Jump to 50k
            </button>
            <button 
              onClick={() => listRef.current?.scrollToIndex(99999)}
              className="px-3 py-1.5 text-sm font-medium bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors"
            >
              Bottom
            </button>
          </div>
        </div>
        <VirtualList 
          {...args}
          ref={listRef}
        />
      </div>
    );
  },
  args: {
    ...MillionItemStressTest.args,
    height: 550,
  }
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
 listContainer.scrollTop = 4000;
 fireEvent.scroll(listContainer);

 // Verify Row 0 has been unmounted from the DOM and Row 100 is visible
 await waitFor(() => {
 expect(canvas.queryByText('Automated Row 0')).not.toBeInTheDocument();
 expect(canvas.getByText('Automated Row 100')).toBeInTheDocument();
 });
 }
};