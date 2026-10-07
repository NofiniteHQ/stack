import type { Meta, StoryObj } from '@storybook/react';
import {
  AreaChart,
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  ScatterChart,
} from './index';

const meta: Meta = {
  title: 'Chart',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const revenueVsExpensesSeries = [
  {
    name: 'Gross Revenue',
    color: 'var(--chart-1)',
    data: [
      { label: 'Jan', value: 125000 },
      { label: 'Feb', value: 210000 },
      { label: 'Mar', value: 340000 },
      { label: 'Apr', value: 480000 },
      { label: 'May', value: 410000 },
      { label: 'Jun', value: 590000 },
    ],
  },
  {
    name: 'Operating Expenses',
    color: 'var(--chart-2)',
    data: [
      { label: 'Jan', value: 95000 },
      { label: 'Feb', value: 140000 },
      { label: 'Mar', value: 190000 },
      { label: 'Apr', value: 260000 },
      { label: 'May', value: 240000 },
      { label: 'Jun', value: 320000 },
    ],
  },
];

const quarterlyProductData = [
  {
    name: 'Enterprise Cloud',
    color: 'var(--chart-1)',
    data: [
      { label: 'Q1', value: 120 },
      { label: 'Q2', value: 180 },
      { label: 'Q3', value: 240 },
      { label: 'Q4', value: 320 },
    ],
  },
  {
    name: 'SaaS Platform',
    color: 'var(--chart-2)',
    data: [
      { label: 'Q1', value: 90 },
      { label: 'Q2', value: 130 },
      { label: 'Q3', value: 170 },
      { label: 'Q4', value: 210 },
    ],
  },
  {
    name: 'API Add-ons',
    color: 'var(--chart-3)',
    data: [
      { label: 'Q1', value: 40 },
      { label: 'Q2', value: 65 },
      { label: 'Q3', value: 95 },
      { label: 'Q4', value: 140 },
    ],
  },
];

const browserShareData = [
  { label: 'Google Chrome', value: 65 },
  { label: 'Safari', value: 19 },
  { label: 'Firefox', value: 8 },
  { label: 'Microsoft Edge', value: 5 },
  { label: 'Others', value: 3 },
];

const countryTrafficData = [
  { label: 'United States', value: 45000 },
  { label: 'Germany', value: 32000 },
  { label: 'United Kingdom', value: 28000 },
  { label: 'Japan', value: 21000 },
  { label: 'France', value: 18000 },
];

export const MultiSeriesArea: StoryObj = {
  name: 'Area Chart - Multi-Series with Target Line',
  render: () => (
    <div className="card p-6 max-w-3xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Revenue vs Operating Expenses (USD)
        </h3>
        <p className="text-xs text-muted">
          Interactive multi-metric scrubbing with reference SLA threshold.
        </p>
      </div>
      <AreaChart
        series={revenueVsExpensesSeries}
        height={320}
        showLegend={true}
        referenceLines={[
          {
            y: 500000,
            label: 'Target Cap ($500k)',
            color: 'var(--color-danger, #ef4444)',
          },
        ]}
      />
    </div>
  ),
};

export const MultiSeriesLine: StoryObj = {
  name: 'Line Chart - Multi-Series Analytics',
  render: () => (
    <div className="card p-6 max-w-3xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Performance Trajectory
        </h3>
        <p className="text-xs text-muted">
          Smooth monotonic spline curves with snapping crosshair.
        </p>
      </div>
      <LineChart
        series={revenueVsExpensesSeries}
        height={320}
        showLegend={true}
      />
    </div>
  ),
};

export const GroupedBar: StoryObj = {
  name: 'Bar Chart - Grouped Columns',
  render: () => (
    <div className="card p-6 max-w-3xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Quarterly Product Line Comparisons
        </h3>
        <p className="text-xs text-muted">
          Side-by-side grouped category comparisons.
        </p>
      </div>
      <BarChart
        series={quarterlyProductData}
        barLayout="grouped"
        height={300}
        showLegend={true}
      />
    </div>
  ),
};

export const StackedBar: StoryObj = {
  name: 'Bar Chart - Stacked Volume',
  render: () => (
    <div className="card p-6 max-w-3xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Cumulative Quarterly Breakdown
        </h3>
        <p className="text-xs text-muted">
          Stacked columns showing proportional volume distribution.
        </p>
      </div>
      <BarChart
        series={quarterlyProductData}
        barLayout="stacked"
        height={300}
        showLegend={true}
      />
    </div>
  ),
};

export const HorizontalLeaderboard: StoryObj = {
  name: 'Bar Chart - Horizontal Leaderboard',
  render: () => (
    <div className="card p-6 max-w-2xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Geographic Traffic Rankings
        </h3>
        <p className="text-xs text-muted">
          Transposed horizontal bar layout for rankings and leaderboards.
        </p>
      </div>
      <BarChart
        data={countryTrafficData}
        barLayout="horizontal"
        height={280}
        color="var(--chart-1)"
      />
    </div>
  ),
};

export const DonutAndPie: StoryObj = {
  name: 'Pie & Donut Charts - Aspect Ratio Protected',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="card p-6 bg-surface border border-default rounded-xl shadow-sm">
        <h3 className="text-base font-semibold text-default mb-2">
          Global Browser Market Share
        </h3>
        <PieChart data={browserShareData} height={280} />
      </div>
      <div className="card p-6 bg-surface border border-default rounded-xl shadow-sm">
        <h3 className="text-base font-semibold text-default mb-2">
          Donut Representation (60% Cutout)
        </h3>
        <DonutChart data={browserShareData} height={280} donutCutout={0.6} />
      </div>
    </div>
  ),
};

export const Scatter: StoryObj = {
  name: 'Scatter Chart - Distribution Correlation',
  render: () => (
    <div className="card p-6 max-w-3xl mx-auto bg-surface border border-default rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-default">
          Latency vs Throughput Correlation
        </h3>
        <p className="text-xs text-muted">
          Continuous numeric coordinate grid with hover tooltips.
        </p>
      </div>
      <ScatterChart
        data={[
          { x: 10, y: 25 },
          { x: 20, y: 45 },
          { x: 35, y: 60 },
          { x: 50, y: 75 },
          { x: 65, y: 90 },
          { x: 80, y: 110 },
        ]}
        height={280}
        color="var(--chart-3)"
      />
    </div>
  ),
};
