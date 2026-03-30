import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
    },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 40,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '300px',
      }}
    >
      <Progress {...args} variant="default" value={25} label="Default" />
      <Progress {...args} variant="success" value={50} label="Success" />
      <Progress {...args} variant="warning" value={75} label="Warning" />
      <Progress {...args} variant="danger" value={90} label="Danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '300px',
      }}
    >
      <Progress {...args} size="sm" value={60} label="Small" />
      <Progress {...args} size="md" value={60} label="Medium" />
      <Progress {...args} size="lg" value={60} label="Large" />
    </div>
  ),
};

export const Animated: Story = {
  render: function Render() {
    const [val, setVal] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setVal((v) => (v >= 100 ? 0 : v + 10));
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return <Progress value={val} variant="default" />;
  },
};

/**
 * Automated Bounds Check Test
 * Verifies that the clamping logic perfectly prevents the bar from exceeding 100% 
 * even when given bad data.
 */
export const AutomatedBoundsCheck: Story = {
  args: {
    value: 150, // Invalid value!
    max: 100,
    label: 'Overflow Test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progress = canvas.getByRole('progressbar', { name: 'Overflow Test' });
    
    // WAI-ARIA must strictly report the clamped value (100)
    await expect(progress).toHaveAttribute('aria-valuenow', '100');
  },
};