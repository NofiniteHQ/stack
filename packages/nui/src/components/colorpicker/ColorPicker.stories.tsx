import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6');
    return (
      <div className="flex gap-4 items-center">
        <ColorPicker value={color} onChange={setColor} />
        <span className="text-sm text-muted">{color}</span>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '#ef4444',
  },
};

export const CustomPresets: Story = {
  render: () => {
    const [color, setColor] = useState('#000000');
    return (
      <div className="flex gap-4 items-center">
        <ColorPicker 
          value={color} 
          onChange={setColor} 
          presets={['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']}
        />
      </div>
    );
  },
};
