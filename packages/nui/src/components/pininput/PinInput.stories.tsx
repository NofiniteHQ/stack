import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { PinInput, PinInputProps } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Components/Forms/PinInput',
  component: PinInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    length: { control: { type: 'number', min: 2, max: 10 } },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: { 
      control: 'select', 
      options: ['numeric', 'alphanumeric', 'alphabetic'] 
    },
    otp: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<typeof PinInput>;

const InteractiveWrapper = (args: Partial<PinInputProps>) => {
  const [value, setValue] = useState(args.value || '');
  const [completed, setCompleted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 font-sans">
      <PinInput
        {...args}
        value={value}
        onChange={(v) => {
          setValue(v);
          setCompleted(false);
          args.onChange?.(v);
        }}
        onComplete={(v) => {
          setCompleted(true);
          args.onComplete?.(v);
        }}
      />
      <div className="text-sm text-muted text-center mt-2">
        <p>Current Value: <strong data-testid="pin-value" className="text-default">{value || "''"}</strong></p>
        <p>Status: <strong data-testid="pin-status" className={completed ? "text-success" : "text-muted"}>
          {completed ? "Completed" : "Incomplete"}
        </strong></p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    length: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');
    
    expect(inputs).toHaveLength(4);

    // Type first char
    await userEvent.type(inputs[0], '1');
    await expect(inputs[1]).toHaveFocus();

    // Type rest
    await userEvent.type(inputs[1], '234');
    
    const output = canvas.getByTestId('pin-value');
    await expect(output.textContent).toBe('1234');
    
    const status = canvas.getByTestId('pin-status');
    await expect(status.textContent).toBe('Completed');

    // Test backspace
    await userEvent.type(inputs[3], '{Backspace}');
    await expect(inputs[3]).toHaveFocus(); // Should clear and stay
    await expect(output.textContent).toBe('123');
    
    await userEvent.type(inputs[3], '{Backspace}'); // Should clear previous and move back
    await expect(inputs[2]).toHaveFocus();
    await expect(output.textContent).toBe('12');
  }
};

export const SixDigitMasked: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    length: 6,
    mask: true,
  }
};

export const Disabled: Story = {
  args: {
    length: 4,
    value: '1234',
    disabled: true,
  }
};
