import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { TransferList, TransferListProps } from './TransferList';

const meta: Meta<typeof TransferList> = {
  title: 'Components/Data Display/TransferList',
  component: TransferList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransferList>;

const mockOptions = [
  { value: '1', label: 'Admin Access' },
  { value: '2', label: 'Billing Access' },
  { value: '3', label: 'User Management' },
  { value: '4', label: 'View Reports' },
  { value: '5', label: 'Edit Content' },
  { value: '6', label: 'API Access' },
];

const InteractiveWrapper = (args: Partial<TransferListProps>) => {
  const [value, setValue] = useState<string[]>(args.defaultValue || []);

  return (
    <div className="w-[600px] flex flex-col gap-4">
      <TransferList
        {...args}
        options={args.options || mockOptions}
        value={value}
        onChange={setValue}
      />
      <div className="text-sm text-muted">
        Selected Values: <strong data-testid="output">{value.join(', ')}</strong>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    defaultValue: ['4', '5'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByTestId('output');
    
    // Check initial
    await expect(output.textContent).toBe('4, 5');

    // Find left list items
    const leftCheckbox = canvas.getByRole('checkbox', { name: 'Admin Access' });
    await userEvent.click(leftCheckbox);

    // Move to right
    const moveRightBtn = canvas.getByRole('button', { name: 'Move selected right' });
    await userEvent.click(moveRightBtn);
    
    // Now 1 is in the right list
    await expect(output.textContent).toContain('1');
    await expect(output.textContent).toContain('4');
    await expect(output.textContent).toContain('5');
    
    // Move all left
    const moveAllLeftBtn = canvas.getByRole('button', { name: 'Move all left' });
    await userEvent.click(moveAllLeftBtn);
    
    await expect(output.textContent).toBe('');
  }
};
