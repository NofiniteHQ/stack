import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, fn } from '@storybook/test';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { Button } from '../button/Button';
import { FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';

const items: ContextMenuItem[] = [
 {
 label: 'Edit',
 icon: <FiEdit />,
 onSelect: fn(),
 },
 {
 label: 'Copy',
 icon: <FiCopy />,
 onSelect: fn(),
 },
 { type: 'separator' },
 {
 label: 'Delete',
 icon: <FiTrash2 />,
 danger: true,
 onSelect: fn(),
 },
 {
 label: 'Disabled',
 disabled: true,
 },
];

const meta: Meta<typeof ContextMenu> = {
 title: 'Components/Overlays/ContextMenu',
 component: ContextMenu,
 parameters: {
 layout: 'centered',
 },
 args: {
 items,
 },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
 render: (args) => (
 <ContextMenu {...args}>
 <div
 data-testid="trigger"
 style={{
 padding: 40,
 border: '1px dashed gray',
 borderRadius: 8,
 cursor: 'context-menu',
 }}
 >
 Right click here
 </div>
 </ContextMenu>
 ),
};

export const WithCustomTrigger: Story = {
 args: { asChild: true },
 render: (args) => (
 <ContextMenu {...args}>
 <Button variant="outline">Right click button</Button>
 </ContextMenu>
 ),
};

export const IconlessItems: Story = {
 args: {
 items: [
 { label: 'Open' },
 { label: 'Rename' },
 { type: 'separator' },
 { label: 'Delete', danger: true },
 ],
 },
 render: Default.render,
};

export const LargeMenu: Story = {
 args: {
 items: Array.from({ length: 10 }).map((_, i) => ({
 label: `Item ${i + 1}`,
 onSelect: () => console.log(i),
 })),
 },
 render: Default.render,
};

/**
 * Automated Interaction Test
 * Verifies that triggering a native contextmenu event correctly spawns the portal.
 */
export const InteractiveTest: Story = {
 args: { items },
 render: Default.render,
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const trigger = canvas.getByTestId('trigger');
 
 // Simulate a native right click using standard DOM events because
 // userEvent does not natively support triggering contextmenu events directly.
 const rightClick = new MouseEvent('contextmenu', {
 bubbles: true,
 cancelable: true,
 clientX: 200,
 clientY: 200,
 });
 
 trigger.dispatchEvent(rightClick);
 
 // Check document for the Portal rendering
 const body = within(document.body);
 const menu = await body.findByRole('menu');
 await expect(menu).toBeInTheDocument();
 },
};