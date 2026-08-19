import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { NumberInput, NumberInputProps } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/Forms/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  }
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

const InteractiveWrapper = (args: Partial<NumberInputProps>) => {
  const [value, setValue] = useState<number | ''>(args.value !== undefined ? args.value : 0);
  return (
    <div className="w-[300px] font-sans">
      <NumberInput
        {...args}
        value={value}
        onChange={setValue}
        label={args.label || "Amount"}
      />
      <div className="mt-4 text-sm text-muted">
        Current internal state: <strong data-testid="output-value" className="text-default">{value === '' ? "'' (empty string)" : value}</strong>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    const output = canvas.getByTestId('output-value');

    // Test Increment button
    const incBtn = canvas.getByLabelText('Increase value');
    await userEvent.click(incBtn);
    await expect(output.textContent).toBe('1');

    // Test Keyboard navigation
    await userEvent.type(input, '{ArrowUp}');
    await expect(output.textContent).toBe('2');

    // Test typing
    await userEvent.clear(input);
    await userEvent.type(input, '50');
    await expect(output.textContent).toBe('50');

    // Test clamping on blur (max is 100)
    await userEvent.clear(input);
    await userEvent.type(input, '150');
    await userEvent.click(canvasElement); // Reliably trigger blur
    await new Promise(r => setTimeout(r, 50)); // Allow React state to flush
    await expect(output.textContent).toBe('100');
  }
};

export const DecimalStep: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    label: 'Price',
    min: 0,
    step: 0.5,
    defaultValue: 10.5,
  }
};

export const Disabled: Story = {
  args: {
    label: 'Quantity (Disabled)',
    disabled: true,
    value: 5,
  }
};

export const WithError: Story = {
  args: {
    label: 'Age',
    error: 'Age must be 18 or older',
    value: 12,
  }
};
