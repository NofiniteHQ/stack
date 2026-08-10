import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = {
 title: 'Components/Forms/TimePicker',
 component: TimePicker,
 parameters: { layout: 'centered' },
 tags: ['autodocs'],
};

export default meta;

export const TwelveHour: StoryObj<typeof TimePicker> = {
 args: { 
 clockType: 12,
 placeholder: 'Select 12h time', onChange: fn() },
};

export const TwentyFourHour: StoryObj<typeof TimePicker> = {
 args: {
 clockType: 24,
 defaultValue: '13:45',
 },
};

export const CustomStep: StoryObj<typeof TimePicker> = {
 args: {
 minuteStep: 15,
 placeholder: 'Quarter hours only',
 },
};

export const Disabled: StoryObj<typeof TimePicker> = {
 args: {
 disabled: true,
 value: '10:00',
 },
};

export const Controlled: StoryObj<typeof TimePicker> = {
 render: function ControlledTimePicker() {
 const [time, setTime] = useState<string>('08:30');
 return (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', color: '#64748b' }}>
 Database Value: {time}
 </p>
 <TimePicker value={time} onChange={setTime} clockType={12} />
 </div>
 );
 }
};

/**
 * Automated Interaction Test
 * Verifies the dropdown opens and commits new segments successfully.
 */
export const InteractiveTest: StoryObj<typeof TimePicker> = {
 args: {
 clockType: 24,
 defaultValue: '09:00', onChange: fn()},
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);

 const trigger = canvas.getByRole('button');
 await expect(canvas.getByText('09:00')).toBeInTheDocument();

 // Open Popover
 await userEvent.click(trigger);
 
 // Select Hour 18
 const hourBtn = body.getAllByText('18', { selector: 'button' })[0];
 await userEvent.click(hourBtn);

 // Select Minute 45
 const minBtn = body.getByText('45', { selector: 'button' });
 await userEvent.click(minBtn);

 // The trigger label should immediately update
 await expect(canvas.getByText('18:45')).toBeInTheDocument();
 }
};