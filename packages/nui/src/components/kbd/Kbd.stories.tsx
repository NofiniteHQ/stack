import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '⌘K',
  },
};

export const InText: Story = {
  render: () => (
    <span className="text-sm text-default">
      Press <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> to save your document.
    </span>
  ),
};
