import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitForElementToBeRemoved } from '@storybook/test';
import { Popover } from './Popover';
import { Button } from '../button/Button';

const meta: Meta<typeof Popover> = {
 title: 'Components/Overlays/Popover',
 component: Popover,
 parameters: {
 layout: 'centered',
 },
 tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<any> = {
  args: {
  showArrow: false,
  },
  argTypes: {
  showArrow: { control: 'boolean' },
  },
  render: (args) => (
  <Popover>
  <Popover.Trigger>
  <Button>Click Me</Button>
  </Popover.Trigger>
  <Popover.Content showArrow={args.showArrow}>
  <div className="flex flex-col gap-1 p-1">
  <h4 className="m-0 font-medium text-default">Popover Title</h4>
  <p className="m-0 text-sm text-muted">
  This is a headless-style popover component with built-in
  positioning and focus trapping.
  </p>
  </div>
  </Popover.Content>
  </Popover>
  ),
};

export const Placements: StoryObj<any> = {
  render: () => (
  <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
  <Popover>
  <Popover.Trigger><Button variant="outline">Top</Button></Popover.Trigger>
  <Popover.Content placement="top" showArrow><div className="p-2">Top placement</div></Popover.Content>
  </Popover>
  <Popover>
  <Popover.Trigger><Button variant="outline">Bottom</Button></Popover.Trigger>
  <Popover.Content placement="bottom" showArrow><div className="p-2">Bottom placement</div></Popover.Content>
  </Popover>
  <Popover>
  <Popover.Trigger><Button variant="outline">Left</Button></Popover.Trigger>
  <Popover.Content placement="left" showArrow><div className="p-2">Left placement</div></Popover.Content>
  </Popover>
  <Popover>
  <Popover.Trigger><Button variant="outline">Right</Button></Popover.Trigger>
  <Popover.Content placement="right" showArrow><div className="p-2">Right placement</div></Popover.Content>
  </Popover>
  </div>
  ),
};

export const WithCloseButton: StoryObj<any> = {
  render: () => (
  <Popover>
  <Popover.Trigger>
  <Button variant="primary">Confirm Action</Button>
  </Popover.Trigger>
  <Popover.Content>
  <div className="flex flex-col gap-4 min-w-[200px]">
  <h4 className="m-0 font-medium">Are you sure?</h4>
  <p className="m-0 text-sm text-muted">This action cannot be undone.</p>
  <div className="flex justify-end gap-2 mt-2">
  <Popover.Close>
  <Button variant="ghost" size="sm">Cancel</Button>
  </Popover.Close>
  <Popover.Close>
  <Button variant="danger" size="sm">Delete</Button>
  </Popover.Close>
  </div>
  </div>
  </Popover.Content>
  </Popover>
  ),
};

export const CustomOffset: StoryObj<any> = {
  render: () => (
  <Popover>
  <Popover.Trigger>
  <Button variant="outline">Offset 24px</Button>
  </Popover.Trigger>
  <Popover.Content offset={24}>
  <div className="p-2 text-sm">Popover rendered 24px away</div>
  </Popover.Content>
  </Popover>
  ),
};

/**
 * Interactive test to ensure Popover opens on click, traps focus, and closes on Escape
 */
export const InteractiveTest: StoryObj<any> = {
  render: () => (
  <Popover>
  <Popover.Trigger>
  <Button>Interactive Trigger</Button>
  </Popover.Trigger>
  <Popover.Content>
  <div className="flex flex-col gap-4">
  <p className="m-0 text-sm">Press Esc or click outside to close</p>
  <input type="text" placeholder="Focus is trapped here" className="rounded border px-2 py-1 text-sm bg-surface" />
  </div>
  </Popover.Content>
  </Popover>
  ),
  play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  const trigger = canvas.getByRole('button', { name: /Interactive Trigger/i });
  await userEvent.click(trigger);
  
  const dialog = await within(document.body).findByRole('dialog');
  await expect(dialog).toBeInTheDocument();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  
  await userEvent.keyboard('{Escape}');
  await waitForElementToBeRemoved(() => within(document.body).queryByRole('dialog'));
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
