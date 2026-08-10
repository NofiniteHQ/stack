import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from './Chart';

const meta: Meta<typeof Chart> = {
 title: 'Components/Data Display/Chart',
 component: Chart,
 tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chart>;

const timeSeriesData = [
 { date: new Date('2024-01-01').getTime(), value: 400 },
 { date: new Date('2024-02-01').getTime(), value: 300 },
 { date: new Date('2024-03-01').getTime(), value: 550 },
 { date: new Date('2024-04-01').getTime(), value: 450 },
 { date: new Date('2024-05-01').getTime(), value: 700 },
];

const categoricalData = [
 { label: 'Desktop', visitors: 400 },
 { label: 'Mobile', visitors: 700 },
 { label: 'Tablet', visitors: 200 },
 { label: 'Smart TV', visitors: 100 },
];

export const Area: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="area"
 data={timeSeriesData}
 xAccessor={(d: any) => d.date}
 yAccessor={(d: any) => d.value}
 />
 </div>
 )
};

export const Bar: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="bar"
 data={categoricalData}
 xAccessor={(d: any) => d.label}
 yAccessor={(d: any) => d.visitors}
 />
 </div>
 )
};

export const Donut: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="donut"
 data={categoricalData}
 labelAccessor={(d: any) => d.label}
 valueAccessor={(d: any) => d.visitors}
 />
 </div>
 )
};

export const Line: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="line"
 data={timeSeriesData}
 xAccessor={(d: any) => d.date}
 yAccessor={(d: any) => d.value}
 />
 </div>
 )
};

export const Pie: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="pie"
 data={categoricalData}
 labelAccessor={(d: any) => d.label}
 valueAccessor={(d: any) => d.visitors}
 />
 </div>
 )
};

export const Scatter: Story = {
 render: () => (
 <div style={{ width: '100%', height: '400px' }}>
 <Chart 
 variant="scatter"
 data={timeSeriesData}
 xAccessor={(d: any) => d.date}
 yAccessor={(d: any) => d.value}
 />
 </div>
 )
};
