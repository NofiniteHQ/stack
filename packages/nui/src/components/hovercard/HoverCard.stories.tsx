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
 argTypes: {
  openDelay: { control: 'number' },
  closeDelay: { control: 'number' },
 },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
 render: (args) => (
 <HoverCard {...args}>
 <HoverCard.Trigger>
 <Button variant="outline">Hover me</Button>
 </HoverCard.Trigger>
 <HoverCard.Content hideArrow={args.hideArrow}>
 <p className="m-0 text-sm">Hover card content</p>
 </HoverCard.Content>
 </HoverCard>
 ),
 args: {
  hideArrow: false,
 },
 argTypes: {
  hideArrow: { control: 'boolean', description: 'Hide the directional arrow' },
 }
};

export const TopPlacement: Story = {
 render: () => (
 <HoverCard>
 <HoverCard.Trigger>
 <Button variant="outline">Hover me</Button>
 </HoverCard.Trigger>
 <HoverCard.Content placement="top">
 <p className="m-0 text-sm">Top placement content</p>
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
 <p className="m-0 text-sm">Custom delay content</p>
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
 <div className="flex flex-col gap-2 min-w-[200px]">
 <strong className="text-base">John Doe</strong>
 <span className="text-muted text-sm">Senior Engineer @ Nofinite</span>
 <p className="text-xs my-2 leading-relaxed">
 Building the next generation of scalable UI libraries.
 </p>
 <Button variant="primary" className="w-full mt-2">
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
 <p className="m-0 text-sm">Interactive Content</p>
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
