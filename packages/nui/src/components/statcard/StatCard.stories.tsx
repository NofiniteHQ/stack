import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Users, DollarSign, Activity, Pointer, HardDrive, Target, AlertTriangle } from 'lucide-react';
import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Data Display/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$45,231.89',
    icon: <DollarSign size={20} />,
    trend: 'up',
    trendValue: '+20.1%',
    trendLabel: 'from last month',
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const NegativeTrend: Story = {
  args: {
    label: 'Active Users',
    value: '2,350',
    icon: <Users size={20} />,
    trend: 'down',
    trendValue: '-4.5%',
    trendLabel: 'since last week',
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const LoadingState: Story = {
  args: {
    label: 'Total Revenue',
    value: '$45,231.89',
    icon: <DollarSign size={20} />,
    trend: 'up',
    trendValue: '+20.1%',
    isLoading: true,
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const WithTooltip: Story = {
  args: {
    label: 'Monthly Recurring Revenue',
    value: '$124,500',
    icon: <DollarSign size={20} />,
    trend: 'up',
    trendValue: '+12%',
    info: 'Excludes one-time setup fees and non-recurring transactions.',
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const WithProgress: Story = {
  args: {
    label: 'Storage Capacity',
    value: '845 GB',
    icon: <HardDrive size={20} />,
    info: 'Out of 1TB allocated quota',
    progressValue: 84.5,
    progressMax: 100,
    accent: 'warning',
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const WithSparkline: Story = {
  args: {
    label: 'API Requests',
    value: '1.2M',
    icon: <Activity size={20} />,
    trend: 'up',
    trendValue: '+18%',
    sparklineData: [40, 45, 55, 50, 70, 65, 80, 95, 100, 90, 110, 120],
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const WithAccent: Story = {
  args: {
    label: 'Critical Errors',
    value: '12',
    icon: <AlertTriangle size={20} />,
    trend: 'down',
    trendValue: '-2',
    accent: 'danger',
    sparklineData: [20, 18, 15, 16, 14, 15, 12],
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  )
};

export const Interactive: Story = {
  args: {
    label: 'Interactive Goal',
    value: '84%',
    icon: <Target size={20} />,
    trend: 'up',
    trendValue: '+4%',
    progressValue: 84,
    accent: 'success',
    onClick: fn(),
  },
  render: (args) => (
    <div className="w-[340px]">
      <StatCard {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalled();
  }
};
