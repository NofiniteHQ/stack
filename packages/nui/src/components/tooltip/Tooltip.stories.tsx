import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../button/Button';

const meta: Meta<typeof Tooltip> = {
 title: 'Components/Overlays/Tooltip',
 component: Tooltip,
 parameters: { layout: 'centered' },
};

export default meta;


export const Default: StoryObj<typeof Tooltip> = {
 args: {
 label: 'This is a tooltip',
 children: <Button variant="outline">Hover over me</Button>,
 delay: 200,
 },
};

export const EdgeCase: StoryObj<typeof Tooltip> = {
 render: () => (
 <div
 style={{ width: '100vw', display: 'flex', justifyContent: 'flex-start' }}
 >
 <Tooltip label="I am clamped to the screen edge, but my arrow still points to the button!">
 <Button variant="outline" className="ml-2">Left Edge Trigger</Button>
 </Tooltip>
 </div>
 ),
};

/**
 * Automated Interaction Test
 * Verifies that hovering triggers the tooltip to render in the portal.
 */
export const InteractiveTest: StoryObj<typeof Tooltip> = {
 args: {
 label: 'Interactive Label',
 delay: 50,
 children: <Button variant="outline">Trigger</Button>
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);

 const trigger = canvas.getByRole('button');
 
 // Initial state: No tooltip
 await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();

 // Hover
 await userEvent.hover(trigger);

 // Because Storybook play functions run in real-time, we wait for the delay
 const tooltip = await body.findByRole('tooltip', { name: 'Interactive Label' });
 await expect(tooltip).toBeInTheDocument();

 // Unhover
 await userEvent.unhover(trigger);
 await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
 }
};