import React, { useState, useEffect } from 'react';
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
  args: {
    value: '#3b82f6',
  },
  render: (args) => {
    const [color, setColor] = useState(args.value as string);
    
    useEffect(() => {
      setColor(args.value as string);
    }, [args.value]);

    return (
      <div className="flex gap-4 items-center">
        <ColorPicker {...args} value={color} onChange={(v) => { setColor(v); args.onChange?.(v); }} />
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

export const IconVariant: Story = {
  args: {
    variant: 'icon',
    value: '#10b981',
  },
  render: (args) => {
    const [color, setColor] = useState(args.value as string);
    
    useEffect(() => {
      setColor(args.value as string);
    }, [args.value]);

    return (
      <div className="flex gap-4 items-center p-4 bg-subtle rounded-md">
        <ColorPicker {...args} value={color} onChange={(v) => { setColor(v); args.onChange?.(v); }} />
        <span className="text-sm font-medium">Toolbar Picker</span>
      </div>
    );
  },
};

export const CustomDefaultVariant: Story = {
  args: {
    variant: 'default',
    showText: false,
    showIcon: true,
    showSwatch: true,
    value: '#8b5cf6',
  },
  render: (args) => {
    const [color, setColor] = useState(args.value as string);
    useEffect(() => setColor(args.value as string), [args.value]);
    return <ColorPicker {...args} value={color} onChange={(v) => { setColor(v); args.onChange?.(v); }} />;
  },
};
