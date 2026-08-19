import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Clipboard } from './Clipboard';

const meta: Meta<typeof Clipboard> = {
  title: 'Components/Data Display/Clipboard',
  component: Clipboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Default: Story = {
  args: {
    value: 'npm install @nofinite/nui',
  },
  render: (args) => (
    <div className="w-80">
      <Clipboard {...args} />
    </div>
  )
};

export const CustomContent: Story = {
  args: {
    value: 'sk_live_123456789',
  },
  render: (args) => (
    <div className="w-80">
      <Clipboard {...args}>
        <span className="text-muted">API Key:</span> <span className="text-default font-mono">sk_live_123456789</span>
      </Clipboard>
    </div>
  )
};
