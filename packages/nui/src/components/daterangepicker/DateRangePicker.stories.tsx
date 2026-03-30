import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { DateRangePicker, DateRange } from './DateRangePicker';
import { useState } from 'react';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'centered' },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: { from: '2026-10-10', to: '2026-10-15' },
  },
};

const ControlledWrapper = () => {
  const [value, setValue] = useState<DateRange | undefined>({ from: '2026-10-10', to: '2026-10-15' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DateRangePicker value={value} onChange={setValue} />
      <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
        Current State: {JSON.stringify(value)}
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledWrapper />,
};

export const MinMax: Story = {
  args: {
    minDate: '2026-10-05',
    maxDate: '2026-10-20',
    defaultValue: { from: '2026-10-10', to: '2026-10-15' },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const CustomFormat: Story = {
  args: {
    defaultValue: { from: '2026-10-10', to: '2026-10-15' },
    formatDisplay: (d) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
  },
};

export const FormIntegration: Story = {
  args: {
    nameFrom: 'startDate',
    nameTo: 'endDate',
    defaultValue: { from: '2026-10-10', to: '2026-10-15' },
  },
};

/**
 * Automated Interaction Test
 * Verifies that clicking two dates successfully selects a range.
 */
export const InteractiveRangeTest: Story = {
  args: { 
    defaultValue: { from: '2026-10-01' }, 
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    
    await userEvent.click(trigger);
    
    const day10 = document.evaluate(
      "//button[contains(@class, 'nui-daterange-day') and text()='10']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLButtonElement;

    const day15 = document.evaluate(
      "//button[contains(@class, 'nui-daterange-day') and text()='15']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLButtonElement;
    
    await userEvent.click(day10);
    await userEvent.click(day15);
    
    await expect(args.onChange).toHaveBeenCalledWith({
      from: '2026-10-10',
      to: '2026-10-15'
    });
  },
};