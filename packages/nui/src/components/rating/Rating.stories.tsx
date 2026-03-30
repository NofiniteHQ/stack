import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import React, { useState } from 'react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    max: { control: 'number' },
    value: { control: 'number' },
    allowHalf: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const HalfStars: Story = {
  args: {
    allowHalf: true,
    defaultValue: 3.5,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Rating size="sm" defaultValue={2} />
      <Rating size="md" defaultValue={3} />
      <Rating size="lg" defaultValue={4} />
    </div>
  ),
};

export const ReadOnlyFractional: Story = {
  args: {
    readOnly: true,
    value: 4.7, // Visualizes the CSS fractional clipping logic perfectly
    max: 5,
    size: 'lg'
  },
};

export const CustomIcons: Story = {
  args: {
    icon: <span>○</span>,
    iconFilled: <span>●</span>,
    defaultValue: 2,
    size: 'lg',
  },
};

export const Controlled: Story = {
  render: function ControlledRating() {
    const [val, setVal] = useState(2);
    return (
      <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ marginBottom: '1rem', fontWeight: 500 }}>Current Score: {val}</p>
        <Rating value={val} onChange={setVal} allowHalf size="lg" />
      </div>
    );
  },
};

/**
 * Automated Interaction Test
 * Verifies that WAI-ARIA slider keyboard navigation functions correctly.
 */
export const InteractiveTest: Story = {
  args: {
    defaultValue: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Locate slider
    const slider = canvas.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuenow', '2');

    // 2. Focus and use keyboard to increase
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '3');

    // 3. Jump to max bound
    await userEvent.keyboard('{End}');
    await expect(slider).toHaveAttribute('aria-valuenow', '5');

    // 4. Jump to min bound
    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveAttribute('aria-valuenow', '0');
  },
};