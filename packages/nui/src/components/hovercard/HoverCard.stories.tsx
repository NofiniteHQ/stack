import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import { HoverCard } from './HoverCard';
import { Button } from '../button/Button';

const meta: Meta<typeof HoverCard> = {
 title: 'Components/Overlays/HoverCard',
 component: HoverCard,
 parameters: {
 layout: 'centered',
 },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
 render: () => (
 <HoverCard>
 <HoverCard.Trigger>
 <Button variant="outline">Hover me</Button>
 </HoverCard.Trigger>
 <HoverCard.Content>
 <p style={{ margin: 0 }}>Hover card content</p>
 </HoverCard.Content>
 </HoverCard>
 ),
};

export const TopPlacement: Story = {
 render: () => (
 <HoverCard>
 <HoverCard.Trigger>
 <Button variant="outline">Hover me</Button>
 </HoverCard.Trigger>
 <HoverCard.Content placement="top">
 <p style={{ margin: 0 }}>Top placement content</p>
 </HoverCard.Content>
 </HoverCard>
 ),
};

export const CustomDelay: Story = {
 render: () => (
 <HoverCard openDelay={500} closeDelay={800}>
 <HoverCard.Trigger>
 <Button variant="outline">Slow hover</Button>
 </HoverCard.Trigger>
 <HoverCard.Content>
 <p style={{ margin: 0 }}>Custom delay content</p>
 </HoverCard.Content>
 </HoverCard>
 ),
};

export const RichContent: Story = {
 render: () => (
 <HoverCard>
 <HoverCard.Trigger>
 <Button variant="outline" className="rounded-full">User Profile</Button>
 </HoverCard.Trigger>
 <HoverCard.Content>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
 <strong style={{ fontSize: '16px' }}>John Doe</strong>
 <span style={{ color: '#666', fontSize: '14px' }}>Senior Engineer @ Nofinite</span>
 <p style={{ fontSize: '12px', margin: '8px 0', lineHeight: 1.4 }}>
 Building the next generation of scalable UI libraries.
 </p>
 <Button variant="primary" size="sm" className="w-full mt-2">
 Follow
 </Button>
 </div>
 </HoverCard.Content>
 </HoverCard>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that the hover delays work and content renders correctly in the portal.
 */
export const InteractiveTest: Story = {
 render: () => (
 <HoverCard openDelay={100} closeDelay={100}>
 <HoverCard.Trigger>
 <Button variant="outline">Interactive Trigger</Button>
 </HoverCard.Trigger>
 <HoverCard.Content>
 <p>Interactive Content</p>
 </HoverCard.Content>
 </HoverCard>
 ),
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);
 
 // 1. Hover over the trigger
 const trigger = canvas.getByRole('button', { name: /Interactive Trigger/i });
 await userEvent.hover(trigger);

 // 2. Wait for the openDelay (100ms) to pass and dialog to appear in Portal
 await waitFor(async () => {
 const dialog = await body.findByRole('dialog');
 await expect(dialog).toBeInTheDocument();
 await expect(trigger).toHaveAttribute('aria-expanded', 'true');
 }, { timeout: 500 });
 },
};