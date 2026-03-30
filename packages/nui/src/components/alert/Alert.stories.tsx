import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  // Automatically spy on onClose to show it in the Storybook Actions tab
  args: {
    onClose: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: { control: 'text' },
    children: { control: 'text' },
    closable: { control: 'boolean' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    title: 'Information',
    children: 'This is an informational alert.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review the required fields before continuing.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'Something went wrong. Please try again.',
  },
};

export const Closable: Story = {
  args: {
    variant: 'info',
    title: 'Closable Alert',
    children: 'You can dismiss this alert.',
    closable: true,
  },
};

export const RichTitle: Story = {
  args: {
    variant: 'info',
    title: (
      <span>
        <strong>Heads up:</strong> Custom JSX title
      </span>
    ),
    children: 'Titles can accept React nodes.',
  },
};

/**
 * Automated Interaction Test
 * Validates that the close button correctly fires the onClose callback.
 */
export const InteractiveTest: Story = {
  args: {
    variant: 'warning',
    title: 'Action Required',
    children: 'Please close this alert to continue.',
    closable: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole('button', { name: /close alert/i });
    
    // Simulate user click
    await userEvent.click(closeButton);
    
    // Verify the mock function was called
    await expect(args.onClose).toHaveBeenCalled();
  },
};