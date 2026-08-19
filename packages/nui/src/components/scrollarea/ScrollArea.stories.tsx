import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Layout/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'The scroll orientation of the area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ScrollArea {...args} className="h-64 w-64 border border-default rounded-lg bg-surface">
      <div className="p-4">
        <h4 className="text-lg font-bold mb-4">Terms of Service</h4>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="mb-4 text-sm text-muted">
            Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </ScrollArea>
  )
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ScrollArea {...args} className="w-96 border border-default rounded-lg bg-surface p-4 whitespace-nowrap">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="inline-flex w-32 h-32 bg-subtle rounded-md mr-4 last:mr-0 items-center justify-center text-muted">
          Item {i + 1}
        </div>
      ))}
    </ScrollArea>
  )
};
