import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Dropdown } from './Dropdown';
import { Button } from '../button/Button';

const meta: Meta<typeof Dropdown> = {
 title: 'Components/Overlays/Dropdown',
 component: Dropdown,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 }
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>Options</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Profile</Dropdown.Item>
 <Dropdown.Item>Settings</Dropdown.Item>
 <Dropdown.Item>Logout</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
};

export const AlignEnd: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>Align End</Dropdown.Trigger>

 <Dropdown.Menu align="end">
 <Dropdown.Item>Profile</Dropdown.Item>
 <Dropdown.Item>Settings</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
};

export const CustomTrigger: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>
 <Button variant="outline">
 Custom Button
 </Button>
 </Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Profile</Dropdown.Item>
 <Dropdown.Item>Settings</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
};

export const DangerItem: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>Actions</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Edit</Dropdown.Item>
 <Dropdown.Item className="nui-text-danger">Delete</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
};

export const MultipleItems: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>Keyboard Demo</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>First</Dropdown.Item>
 <Dropdown.Item>Second</Dropdown.Item>
 <Dropdown.Item>Third</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the trigger opens the menu and keyboard navigation functions correctly.
 */
export const InteractiveTest: Story = {
 render: () => (
 <Dropdown>
 <Dropdown.Trigger>Options</Dropdown.Trigger>

 <Dropdown.Menu>
 <Dropdown.Item>Profile</Dropdown.Item>
 <Dropdown.Item>Settings</Dropdown.Item>
 <Dropdown.Item>Logout</Dropdown.Item>
 </Dropdown.Menu>
 </Dropdown>
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 
 // 1. Find and click trigger
 const trigger = canvas.getByRole('button', { name: /Options/i });
 await userEvent.click(trigger);

 // 2. Verify Menu is open
 const menu = canvas.getByRole('menu');
 await expect(menu).toBeInTheDocument();
 await expect(trigger).toHaveAttribute('aria-expanded', 'true');

 // 3. Close the menu via Escape
 await userEvent.keyboard('{Escape}');
 await expect(menu).not.toBeInTheDocument();
 await expect(trigger).toHaveAttribute('aria-expanded', 'false');
 },
};