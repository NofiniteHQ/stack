import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
 title: 'Components/Data Display/Accordion',
 component: Accordion,
 tags: ['autodocs'],
 parameters: {
 layout: 'padded',
 },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const demoItems = [
 {
 id: 'item-1',
 title: 'What is NUI?',
 content: (
 <p>
 NUI is a design system focused on composability, accessibility,
 and developer experience.
 </p>
 ),
 },
 {
 id: 'item-2',
 title: 'Is it accessible?',
 content: (
 <p>
 Yes. The accordion follows WAI-ARIA guidelines,
 supports keyboard navigation, and screen readers.
 </p>
 ),
 },
 {
 id: 'item-3',
 title: 'Can multiple items stay open?',
 content: (
 <p>
 When <code>multiple</code> is enabled, more than one item
 can remain expanded.
 </p>
 ),
 },
];

export const Default: Story = {
 render: (args) => (
 <div className="w-full max-w-2xl mx-auto mt-10">
 <Accordion {...args} />
 </div>
 ),
 args: {
 items: demoItems,
 },
};

export const DefaultOpen: Story = {
 args: {
 items: demoItems,
 defaultOpenId: 'item-2',
 },
};

export const MultipleOpen: Story = {
 args: {
 items: demoItems,
 multiple: true,
 },
};

export const LongContent: Story = {
 args: {
 items: [
 {
 id: 'long',
 title: 'Long Content Example',
 content: (
 <div>
 <p>
 This demonstrates how the accordion handles larger
 blocks of content and animation transitions.
 </p>
 <p>
 The grid-based animation ensures smooth expansion
 without layout jumps.
 </p>
 <p>
 This pattern is production-safe and widely used
 in modern UI libraries.
 </p>
 </div>
 ),
 },
 ],
 },
};

export const CustomStyled: Story = {
 args: {
 items: demoItems,
 className: 'custom-accordion',
 },
};

/**
 * Automated Interaction Test
 * Runs automatically in Storybook to verify click behavior.
 */
export const InteractiveTest: Story = {
 args: {
 items: demoItems,
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const firstItemButton = canvas.getByRole('button', { name: 'What is NUI?' });
 
 // Validate initial closed state
 await expect(firstItemButton).toHaveAttribute('aria-expanded', 'false');
 
 // Simulate user click
 await userEvent.click(firstItemButton);
 
 // Validate opened state
 await expect(firstItemButton).toHaveAttribute('aria-expanded', 'true');
 },
};