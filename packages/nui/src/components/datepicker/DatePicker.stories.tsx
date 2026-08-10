import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
 title: 'Components/Forms/DatePicker',
 component: DatePicker,
 parameters: { layout: 'centered' },
 args: {
 onChange: fn(),
 },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
 args: { placeholder: 'Select a date' },
};

export const WithConstraints: Story = {
 args: {
 minDate: '2026-01-01',
 maxDate: '2026-12-31',
 defaultValue: '2026-10-24',
 },
};

/** This story tests the Smart Collision (Flipping) logic */
export const CollisionTest: Story = {
 render: () => (
 <div
 style={{
 height: '120vh',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'flex-end',
 padding: '50px',
 }}
 >
 <p style={{ marginBottom: '10px' }}>
 Scroll down. The picker should flip to the TOP when near the bottom
 edge.
 </p>
 <DatePicker />
 </div>
 ),
};

export const Disabled: Story = {
 args: {
 disabled: true,
 defaultValue: '2026-10-24',
 },
};

/**
 * Automated Interaction Test
 * Verifies that clicking a date successfully updates the component state.
 */
export const InteractiveTest: Story = {
 args: { 
 placeholder: 'Interactive Test',
 // Lock default to a known date so the test doesn't break depending on the month it is run
 defaultValue: '2026-10-01',
 },
 play: async ({ canvasElement, args }) => {
 // Portals attach to document body
 const canvas = within(canvasElement);
 const trigger = canvas.getByRole('button');
 
 // Open calendar
 await userEvent.click(trigger);
 
 const body = within(document.body);
 const day15 = body.getByText('15', { selector: 'button' });
 
 await userEvent.click(day15);
 
 // Ensure the event fired with the correct format
 await expect(args.onChange).toHaveBeenCalledWith('2026-10-15');
 },
};