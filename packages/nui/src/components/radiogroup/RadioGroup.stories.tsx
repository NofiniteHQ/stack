import React, { useState, useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;

// Helper to render items with labels in stories
const RadioItemWithLabel = ({
  value,
  label,
  disabled,
}: {
  value: string;
  label: string;
  disabled?: boolean;
}) => {
  const id = useId();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value={value} id={id} disabled={disabled} />
      <label
        htmlFor={id}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: disabled ? 'var(--nui-fg-muted, #94a3b8)' : 'inherit',
          fontSize: '14px',
          userSelect: 'none',
          fontFamily: 'sans-serif'
        }}
      >
        {label}
      </label>
    </div>
  );
};

export const Default: StoryObj<typeof RadioGroup> = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="apple">
      <RadioItemWithLabel value="apple" label="Apple" />
      <RadioItemWithLabel value="banana" label="Banana" />
      <RadioItemWithLabel value="cherry" label="Cherry" />
    </RadioGroup>
  ),
};

export const Horizontal: StoryObj<typeof RadioGroup> = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args} defaultValue="small">
      <RadioItemWithLabel value="small" label="Small" />
      <RadioItemWithLabel value="medium" label="Medium" />
      <RadioItemWithLabel value="large" label="Large" />
    </RadioGroup>
  ),
};

export const DisabledGroup: StoryObj<typeof RadioGroup> = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <RadioGroup {...args} defaultValue="opt-1">
      <RadioItemWithLabel value="opt-1" label="Option 1" />
      <RadioItemWithLabel value="opt-2" label="Option 2" />
    </RadioGroup>
  ),
};

export const IndividualDisabled: StoryObj<typeof RadioGroup> = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioItemWithLabel value="active" label="Available Option" />
      <RadioItemWithLabel value="disabled" label="Disabled Option" disabled />
      <RadioItemWithLabel value="active-2" label="Another Option" />
    </RadioGroup>
  ),
};

export const Controlled: StoryObj<typeof RadioGroup> = {
  render: function ControlledRender() {
    const [value, setValue] = useState('light');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, fontFamily: 'sans-serif' }}>
          Selected: {value}
        </p>
        <RadioGroup value={value} onChange={setValue}>
          <RadioItemWithLabel value="light" label="Light Mode" />
          <RadioItemWithLabel value="dark" label="Dark Mode" />
          <RadioItemWithLabel value="system" label="System Preference" />
        </RadioGroup>
      </div>
    );
  },
};

/**
 * Automated Interaction Test
 * Verifies that clicking a label selects the appropriate radio button.
 */
export const InteractiveTest: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup defaultValue="apple">
      <RadioItemWithLabel value="apple" label="Apple" />
      <RadioItemWithLabel value="banana" label="Banana" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const appleRadio = canvas.getByRole('radio', { name: 'Apple' });
    const bananaRadio = canvas.getByRole('radio', { name: 'Banana' });

    // Initial state
    await expect(appleRadio).toBeChecked();
    await expect(bananaRadio).not.toBeChecked();

    // Click the banana label
    await userEvent.click(canvas.getByText('Banana'));

    // State should swap
    await expect(bananaRadio).toBeChecked();
    await expect(appleRadio).not.toBeChecked();
  }
};