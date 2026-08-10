import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Chip } from './Chip';
import { Check, Star, User } from 'lucide-react'; 

const meta: Meta<typeof Chip> = {
 title: 'Components/Data Display/Chip',
 component: Chip,
 parameters: {
 layout: 'centered',
 docs: {
 description: {
 component:
 'A compact element used for tags, filters, or triggering actions.',
 },
 },
 },
 args: {
 // Automatically spy on events in the Storybook Actions panel
 onSelect: fn(),
 onRemove: fn(),
 },
 argTypes: {
 size: { control: 'inline-radio' },
 selected: { control: 'boolean' },
 removable: { control: 'boolean' },
 },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
 args: {
 children: 'Badge Label',
 },
};

export const SelectionStates: Story = {
 render: () => (
 <div style={{ display: 'flex', gap: '8px' }}>
 <Chip>Unselected</Chip>
 <Chip selected>
 Selected
 </Chip>
 </div>
 ),
};

export const WithRichContent: Story = {
 args: {
 children: 'User Account',
 iconLeft: <User size={14} />,
 removable: true,
 },
};

/** Use this to test text truncation in your CSS layout */
export const OverflowEdgeCase: Story = {
 args: {
  removable: false
 },

 render: () => (
 <div style={{ width: '150px' }}>
 <Chip removable onSelect={fn()}>
 Very long text that should truncate gracefully
 </Chip>
 </div>
 )
};

export const KitchenSink: Story = {
 render: () => (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
 <Chip size="sm">Small</Chip>
 <Chip size="sm" iconLeft={<Star size={12} />} selected>
 Favorite
 </Chip>
 <Chip size="sm" removable>
 Tag
 </Chip>
 </div>
 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
 <Chip size="md">Medium</Chip>
 <Chip size="md" iconRight={<Check size={14} />} selected>
 Confirmed
 </Chip>
 <Chip size="md" removable onSelect={fn()}>
 Interactive
 </Chip>
 </div>
 </div>
 ),
};

/**
 * Automated Interaction Test: Selection
 * Verifies that the main body of the chip triggers onSelect.
 */
export const InteractiveSelectTest: Story = {
 args: {
 children: 'Selectable Chip',
 },
 play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const chip = canvas.getByRole('button', { name: 'Selectable Chip' });
 
 await userEvent.click(chip);
 await expect(args.onSelect).toHaveBeenCalled();
 },
};

/**
 * Automated Interaction Test: Removal
 * Verifies that the removal button works and DOES NOT trigger the underlying onSelect.
 */
export const InteractiveRemoveTest: Story = {
  args: {
    children: 'Removable Chip',
    removable: true,
  },
  render: function Render(args) {
    const [isVisible, setIsVisible] = useState(true);
    if (!isVisible) return <div className="text-sm text-muted">Chip removed successfully!</div>;
    return <Chip {...args} onRemove={() => { setIsVisible(false); args.onRemove?.(); }} />;
  },
  play: async ({ canvasElement, args }) => {
 const canvas = within(canvasElement);
 const removeButton = canvas.getByRole('button', { name: 'Remove' });
 
 await userEvent.click(removeButton);
 
 // Validate event propagation was stopped correctly
 await expect(args.onRemove).toHaveBeenCalled();
 await expect(args.onSelect).not.toHaveBeenCalled();
 },
};