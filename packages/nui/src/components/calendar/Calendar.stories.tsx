import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Data Display/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<string>();
    return (
      <div className="flex flex-col gap-4 items-center">
        <Calendar {...args} value={date} onChange={setDate} />
        <div className="text-sm text-muted">
          Selected: {date || 'None'}
        </div>
      </div>
    );
  }
};

export const WithMinMaxDate: Story = {
  render: (args) => {
    // Current year/month
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    
    // Allow selecting from 5th to 20th of current month
    const minDate = `${y}-${m}-05`;
    const maxDate = `${y}-${m}-20`;

    return (
      <Calendar {...args} minDate={minDate} maxDate={maxDate} />
    );
  }
};

export const RangeMode: Story = {
  render: (args) => {
    const [range, setRange] = useState<{from?: string, to?: string}>({});
    return (
      <div className="flex flex-col gap-4 items-center">
        <Calendar 
          {...args} 
          mode="range" 
          value={range} 
          onChange={(r: any) => setRange(r)} 
        />
        <div className="text-sm text-muted">
          Selected: {range.from || 'None'} → {range.to || 'None'}
        </div>
      </div>
    );
  }
};
