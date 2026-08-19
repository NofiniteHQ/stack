import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Layout/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-md h-32 flex flex-col justify-center">
      <div className="text-sm text-muted mb-4">Content Above</div>
      <Divider {...args} />
      <div className="text-sm text-muted mt-4">Content Below</div>
    </div>
  )
};

export const WithText: Story = {
  args: {
    children: 'OR CONTINUE WITH',
  },
  render: (args) => (
    <div className="w-full max-w-md h-32 flex flex-col justify-center">
      <Divider {...args} />
    </div>
  )
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="h-32 flex items-center justify-center gap-4">
      <div className="text-sm text-muted">Left Side</div>
      <Divider {...args} />
      <div className="text-sm text-muted">Right Side</div>
    </div>
  )
};

export const VerticalWithText: Story = {
  args: {
    orientation: 'vertical',
    children: 'AND',
  },
  render: (args) => (
    <div className="h-48 flex items-center justify-center gap-4">
      <div className="text-sm text-muted">Item 1</div>
      <Divider {...args} />
      <div className="text-sm text-muted">Item 2</div>
    </div>
  )
};
