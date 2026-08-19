import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { PasswordInput, PasswordInputProps } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Forms/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check initial type is password
    const input = canvas.getByLabelText('Password') as HTMLInputElement;
    await expect(input.type).toBe('password');

    // Type something
    await userEvent.type(input, 'secret123');
    await expect(input).toHaveValue('secret123');

    // Toggle to text
    const toggleBtn = canvas.getByLabelText('Show password');
    await userEvent.click(toggleBtn);
    
    await expect(input.type).toBe('text');
    await expect(toggleBtn).toHaveAttribute('aria-label', 'Hide password');

    // Toggle back to password
    await userEvent.click(toggleBtn);
    await expect(input.type).toBe('password');
  }
};

export const WithError: Story = {
  args: {
    label: 'Confirm Password',
    defaultValue: 'hunter2',
    error: 'Passwords do not match.',
  }
};
