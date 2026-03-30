import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default: StoryObj<typeof Slider> = {
  args: {
    defaultValue: 50,
    style: { width: '256px' }
  },
};

export const CustomStep: StoryObj<typeof Slider> = {
  args: {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0.5,
    style: { width: '256px' }
  },
};

export const LargeRange: StoryObj<typeof Slider> = {
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 250,
    style: { width: '256px' }
  },
};

export const Controlled: StoryObj<typeof Slider> = {
  render: function ControlledSlider() {
    const [val, setVal] = useState(30);
    return (
      <div style={{ width: '256px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '14px' }}>
          <span>Value:</span>
          <span>{val}%</span>
        </div>
        <Slider value={val} onChange={setVal} />
      </div>
    );
  },
};

/**
 * Automated Interaction Test
 * Verifies keyboard navigation correctly increments values according to the step property.
 */
export const InteractiveTest: StoryObj<typeof Slider> = {
  args: {
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 20,
    style: { width: '256px' }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');
    
    // Initial state
    await expect(thumb).toHaveAttribute('aria-valuenow', '20');
    
    // Keyboard Interaction
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    
    // Should step by 10
    await expect(thumb).toHaveAttribute('aria-valuenow', '30');

    // Test Max Bound shortcut
    await userEvent.keyboard('{End}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '100');
  },
};