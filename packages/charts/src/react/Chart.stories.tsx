import type { Meta, StoryObj } from '@storybook/react';
import {
  AreaChart,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
} from './index';

const meta: Meta = {
  title: 'Chart',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const timeSeriesData = [
  { x: 'Jan', y: 12 },
  { x: 'Feb', y: 19 },
  { x: 'Mar', y: 32 },
  { x: 'Apr', y: 48 },
  { x: 'May', y: 41 },
  { x: 'Jun', y: 55 },
  { x: 'Jul', y: 68 },
];

const categoricalData = [
  { x: 'Desktop', y: 64 },
  { x: 'Mobile', y: 31 },
  { x: 'Tablet', y: 5 },
];

const scatterData = [
  { x: 10, y: 20 },
  { x: 15, y: 35 },
  { x: 25, y: 45 },
  { x: 30, y: 30 },
  { x: 45, y: 70 },
  { x: 50, y: 65 },
  { x: 60, y: 85 },
];

export const Area: StoryObj = {
  render: () => (
    <div className="card p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Area Chart (Revenue Trend)</h3>
      <AreaChart
        data={timeSeriesData}
        height={280}
        color="var(--color-primary, #3b82f6)"
      />
    </div>
  ),
};

export const Line: StoryObj = {
  render: () => (
    <div className="card p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        Line Chart (Active Sessions)
      </h3>
      <LineChart
        data={timeSeriesData}
        height={280}
        color="var(--color-success, #10b981)"
      />
    </div>
  ),
};

export const Bar: StoryObj = {
  render: () => (
    <div className="card p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        Bar Chart (Quarterly Volume)
      </h3>
      <BarChart
        data={timeSeriesData}
        height={280}
        color="var(--color-primary, #6366f1)"
      />
    </div>
  ),
};

export const Pie: StoryObj = {
  render: () => (
    <div className="card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Pie Chart (Traffic Source)</h3>
      <PieChart data={categoricalData} height={260} />
    </div>
  ),
};

export const Scatter: StoryObj = {
  render: () => (
    <div className="card p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        Scatter Chart (Correlation)
      </h3>
      <ScatterChart
        data={scatterData}
        height={280}
        color="var(--color-warning, #f59e0b)"
      />
    </div>
  ),
};
