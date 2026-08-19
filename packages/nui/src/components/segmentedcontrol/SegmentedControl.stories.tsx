import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { SegmentedControl, SegmentedControlProps } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/Forms/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const defaultOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const InteractiveWrapper = (args: Partial<SegmentedControlProps>) => {
  const [value, setValue] = useState(args.value || 'daily');
  return (
    <div className="flex flex-col items-center gap-4">
      <SegmentedControl
        {...args}
        options={args.options || defaultOptions}
        value={value}
        onChange={(v) => {
          setValue(v);
          args.onChange?.(v);
        }}
        name={args.name || "interactive-story"}
      />
      <div className="text-sm text-muted mt-4">
        Selected: <strong data-testid="selected-value" className="text-default">{value}</strong>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    options: defaultOptions,
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check initial state
    const selectedText = canvas.getByTestId('selected-value');
    await expect(selectedText.textContent).toBe('daily');

    // Click Weekly
    const weeklyBtn = canvas.getByRole('radio', { name: 'Weekly' });
    await userEvent.click(weeklyBtn);
    await expect(selectedText.textContent).toBe('weekly');
    await expect(weeklyBtn).toHaveAttribute('aria-checked', 'true');

    // Focus active radio button and test keyboard navigation
    const activeRadio = canvas.getByRole('radio', { checked: true });
    await activeRadio.focus();
    
    await userEvent.keyboard('{ArrowRight}');
    await expect(selectedText.textContent).toBe('monthly');
    
    await userEvent.keyboard('{ArrowLeft}');
    await expect(selectedText.textContent).toBe('weekly');
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <SegmentedControl options={defaultOptions} size="sm" name="sizes-sm" />
      <SegmentedControl options={defaultOptions} size="md" name="sizes-md" />
      <SegmentedControl options={defaultOptions} size="lg" name="sizes-lg" />
    </div>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <InteractiveWrapper {...args} />
    </div>
  ),
  args: {
    options: defaultOptions,
    fullWidth: true,
  }
};

export const WithDisabledOptions: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana', disabled: true },
      { value: 'cherry', label: 'Cherry' },
    ],
  }
};
