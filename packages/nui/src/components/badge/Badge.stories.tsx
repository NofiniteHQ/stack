import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
 title: 'Components/Data Display/Badge',
 component: Badge,
 tags: ['autodocs'],
 parameters: {
 layout: 'centered',
 },
 args: {
 // Spies on the onClick handler automatically in the Storybook Actions panel
 onClick: fn(),
 },
 argTypes: {
 variant: {
 control: 'select',
 options: [
 'default',
 'primary',
 'success',
 'warning',
 'danger',
 'outline',
 ],
 },
 size: {
 control: 'select',
 options: ['sm', 'md', 'lg'],
 },
 pill: { control: 'boolean' },
 dot: { control: 'boolean' },
 count: { control: 'number' },
 },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
 args: {
 children: 'Badge',
 },
};

export const Variants: Story = {
 render: () => (
 <div style={{ display: 'flex', gap: 12 }}>
 <Badge variant="default">Default</Badge>
 <Badge variant="primary">Primary</Badge>
 <Badge variant="success">Success</Badge>
 <Badge variant="warning">Warning</Badge>
 <Badge variant="danger">Danger</Badge>
 <Badge variant="outline">Outline</Badge>
 </div>
 ),
};

export const Sizes: Story = {
 render: () => (
 <div style={{ display: 'flex', gap: 12 }}>
 <Badge size="sm">Small</Badge>
 <Badge size="md">Medium</Badge>
 <Badge size="lg">Large</Badge>
 </div>
 ),
};

export const Count: Story = {
 args: {
 count: 25,
 },
};

export const OverflowCount: Story = {
 args: {
 count: 150,
 max: 99,
 },
};

export const Pill: Story = {
 args: {
 pill: true,
 children: 'Pill Badge',
 },
};

export const Dot: Story = {
 args: {
 dot: true,
 },
};

export const Interactive: Story = {
 args: {
 children: 'Clickable',
 },
 play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const badgeButton = canvas.getByRole('button', { name: 'Clickable' });
 
 await userEvent.click(badgeButton);
 await expect(args.onClick).toHaveBeenCalled();
 },
};