import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { TimeRangePicker, TimeRange } from './TimeRangePicker';

const meta: Meta<typeof TimeRangePicker> = {
 title: 'Components/Forms/TimeRangePicker',
 component: TimeRangePicker,
 parameters: { layout: 'centered' },
 tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof TimeRangePicker> = {
 args: { 
 placeholder: 'Business Hours',
 clockType: 12, onChange: fn() },
};

export const PreselectedRange: StoryObj<typeof TimeRangePicker> = {
 args: {
 defaultValue: { from: '09:00', to: '18:00' },
 clockType: 24,
 },
};

export const FifteenMinuteIncrements: StoryObj<typeof TimeRangePicker> = {
 args: {
 minuteStep: 15,
 placeholder: 'Select slots',
 },
};

export const Controlled: StoryObj<typeof TimeRangePicker> = {
 render: function ControlledTimeRange() {
 const [range, setRange] = useState<TimeRange>({ from: '08:00', to: '16:00' });
 return (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px', color: '#64748b' }}>
 Start: {range.from || 'null'} | End: {range.to || 'null'}
 </p>
 <TimeRangePicker value={range} onChange={setRange} clockType={12} />
 </div>
 );
 }
};

/**
 * Automated Interaction Test
 * Verifies that the internal active parts (Start Time vs End Time) seamlessly update the range.
 */
export const InteractiveTest: StoryObj<typeof TimeRangePicker> = {
 args: {
 clockType: 24,
 defaultValue: { from: '09:00', to: undefined , onChange: fn()},
 },
 play: async ({ canvasElement }) => {
 const canvas = within(canvasElement);
 const body = within(document.body);

 const trigger = canvas.getByRole('button');
 await expect(canvas.getByText('09:00 →')).toBeInTheDocument();

 // Open Popover
 await userEvent.click(trigger);
 
 // Switch to 'End Time'
 const endTab = body.getByText('End Time');
 await userEvent.click(endTab);

 // Pick 17:30
 const hour17 = body.getAllByText('17', { selector: 'button' })[0];
 await userEvent.click(hour17);

 const min30 = body.getByText('30', { selector: 'button' });
 await userEvent.click(min30);

 // Verify UI reflects the newly completed range
 await expect(canvas.getByText('09:00 → 17:30')).toBeInTheDocument();
 }
};