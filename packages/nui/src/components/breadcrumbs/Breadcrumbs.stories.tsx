import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const items = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptops', href: '#' },
  { label: 'MacBook Pro' },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const Collapsed: Story = {
  args: {
    items,
    maxItems: 4,
  },
};

export const CustomSeparator: Story = {
  args: {
    items,
    separator: '/',
  },
};

export const Minimal: Story = {
  args: {
    items: [{ label: 'Home', href: '#' }, { label: 'Profile' }],
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Very Long Category Name Example', href: '#' },
      { label: 'Another Long Section Name', href: '#' },
      { label: 'Current Page With Long Title' },
    ],
  },
};

export const DarkBackground: Story = {
  args: {
    items,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#0f172a', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Automated Interaction Test
 * Verifies that onClick callbacks fire correctly on non-current items.
 */
export const InteractiveTest: Story = {
  args: {
    items: [
      { label: 'Dashboard', onClick: fn() },
      { label: 'Settings' },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // The first item should trigger the click
    const link = canvas.getByText('Dashboard');
    await userEvent.click(link);
    await expect(args.items[0].onClick).toHaveBeenCalled();
  },
};