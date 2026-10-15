// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  ScatterChart,
  Sparkline,
  ChartLegend,
} from './index';

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof ResizeObserver;
  }
});

const sampleTimeData = [
  { x: '2026-01-01', y: 30, label: 'Jan' },
  { x: '2026-02-01', y: 55, label: 'Feb' },
  { x: '2026-03-01', y: 40, label: 'Mar' },
  { x: '2026-04-01', y: 80, label: 'Apr' },
];

const sampleMultiSeries = [
  {
    name: 'Alpha',
    color: '#3b82f6',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 },
    ],
  },
  {
    name: 'Beta',
    color: '#10b981',
    data: [
      { x: 'Jan', y: 80 },
      { x: 'Feb', y: 120 },
    ],
  },
];

describe('@nofinite/charts React Component Suite', () => {
  describe('<LineChart />', () => {
    it('renders single series vector path and circle points', () => {
      const { container } = render(
        <LineChart
          data={sampleTimeData}
          width={400}
          height={200}
          ariaLabel="Telemetry Line Chart"
        />
      );

      const region = screen.getByRole('region', {
        name: 'Telemetry Line Chart',
      });
      expect(region).toBeDefined();

      const linePath = container.querySelector('path.chart-line');
      expect(linePath).not.toBeNull();
      expect(linePath?.getAttribute('d')).toMatch(/^M/);

      const points = container.querySelectorAll('circle.chart-point');
      expect(points.length).toBe(sampleTimeData.length);
    });

    it('applies entrance animation classes when animate=true and omits when animate=false', () => {
      const { container: animated } = render(
        <LineChart
          data={sampleTimeData}
          width={400}
          height={200}
          animate={true}
        />
      );
      expect(animated.querySelector('.chart-animate-line')).not.toBeNull();

      const { container: staticChart } = render(
        <LineChart
          data={sampleTimeData}
          width={400}
          height={200}
          animate={false}
        />
      );
      expect(staticChart.querySelector('.chart-animate-line')).toBeNull();
    });
    it('renders multi-series lines and legend', () => {
      const { container } = render(
        <LineChart
          series={sampleMultiSeries}
          width={400}
          height={200}
          showLegend={true}
        />
      );

      const legend = container.querySelector('.chart-legend');
      expect(legend).not.toBeNull();
      expect(legend?.textContent).toContain('Alpha');
      expect(legend?.textContent).toContain('Beta');
    });

    it('positions legend at top when legendPosition="top" and adjusts plotHeight', () => {
      const { container } = render(
        <LineChart
          series={sampleMultiSeries}
          width={400}
          height={200}
          showLegend={true}
          legendPosition="top"
        />
      );

      const root = container.querySelector('.nui-chart-container');
      const firstChild = root?.children[0];
      expect(firstChild?.classList.contains('chart-legend')).toBe(true);

      const plotWrapper = container.querySelector('.chart-plot-wrapper');
      expect(plotWrapper).not.toBeNull();
      expect((plotWrapper as HTMLElement)?.style.height).toBe('162px');
    });

    it('handles empty dataset without throwing', () => {
      const { container } = render(
        <LineChart data={[]} width={400} height={200} />
      );
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });

  describe('<AreaChart />', () => {
    it('renders area path, gradient definition, and bounding line', () => {
      const { container } = render(
        <AreaChart
          data={sampleTimeData}
          width={400}
          height={200}
          color="#6366f1"
          ariaLabel="Growth Area Chart"
        />
      );

      expect(
        screen.getByRole('region', { name: 'Growth Area Chart' })
      ).toBeDefined();

      const areaPath = container.querySelector('path.chart-area');
      expect(areaPath).not.toBeNull();
      expect(areaPath?.getAttribute('d')).toMatch(/^M/);

      const grad = container.querySelector('linearGradient');
      expect(grad).not.toBeNull();
    });

    it('supports stacked area mode with multiple series', () => {
      const { container } = render(
        <AreaChart
          series={sampleMultiSeries}
          width={400}
          height={200}
          areaMode="stacked"
        />
      );

      const areaPaths = container.querySelectorAll('path.chart-area');
      expect(areaPaths.length).toBe(2);
    });

    it('handles empty dataset without crashing', () => {
      const { container } = render(
        <AreaChart data={[]} width={400} height={200} />
      );
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });

  describe('<BarChart />', () => {
    it('renders vertical bar rects matching data item count', () => {
      const { container } = render(
        <BarChart
          data={sampleTimeData}
          width={400}
          height={200}
          ariaLabel="Monthly Bar Chart"
        />
      );

      expect(
        screen.getByRole('region', { name: 'Monthly Bar Chart' })
      ).toBeDefined();

      const bars = container.querySelectorAll('rect.chart-bar');
      expect(bars.length).toBe(sampleTimeData.length);
    });

    it('supports horizontal layout with proper bar growth animation class', () => {
      const { container } = render(
        <BarChart
          data={sampleTimeData}
          barLayout="horizontal"
          width={400}
          height={200}
          animate={true}
        />
      );

      const horizontalBars = container.querySelectorAll('.chart-animate-bar-x');
      expect(horizontalBars.length).toBe(sampleTimeData.length);
    });

    it('truncates long category labels with title tooltip in horizontal layout', () => {
      const longLabelData = [
        { x: 'Enterprise Customer Success Department North America', y: 120 },
      ];
      const { container } = render(
        <BarChart
          data={longLabelData}
          barLayout="horizontal"
          width={400}
          height={200}
        />
      );

      const titleTag = container.querySelector('text title');
      expect(titleTag).not.toBeNull();
      expect(titleTag?.textContent).toBe(
        'Enterprise Customer Success Department North America'
      );
      const labelText = titleTag?.parentElement;
      expect(labelText?.textContent).toContain('…');
    });

    it('positions legend at top when legendPosition="top" and adjusts plotHeight', () => {
      const { container } = render(
        <BarChart
          series={sampleMultiSeries}
          width={400}
          height={200}
          showLegend={true}
          legendPosition="top"
        />
      );

      const root = container.querySelector('.nui-chart-container');
      const firstChild = root?.children[0];
      expect(firstChild?.classList.contains('chart-legend')).toBe(true);

      const plotWrapper = container.querySelector('.chart-plot-wrapper');
      expect((plotWrapper as HTMLElement)?.style.height).toBe('162px');
    });

    it('handles empty data gracefully', () => {
      const { container } = render(
        <BarChart data={[]} width={400} height={200} />
      );
      expect(container.querySelectorAll('rect.chart-bar').length).toBe(0);
    });
  });

  describe('<PieChart />', () => {
    const pieData = [
      { label: 'Chrome', y: 65, color: '#4285f4' },
      { label: 'Safari', y: 20, color: '#0066cc' },
      { label: 'Firefox', y: 15, color: '#ff7139' },
    ];

    it('renders segmented circular paths', () => {
      const { container } = render(
        <PieChart data={pieData} width={300} height={300} />
      );

      const segments = container.querySelectorAll('path.chart-segment');
      expect(segments.length).toBe(3);
    });

    it('renders donut cutout when donutCutout prop is provided', () => {
      const { container } = render(
        <PieChart
          data={pieData}
          donutCutout={0.6}
          width={300}
          height={300}
          ariaLabel="Browser Share Donut"
        />
      );

      expect(
        screen.getByRole('region', { name: 'Browser Share Donut' })
      ).toBeDefined();

      const segments = container.querySelectorAll('path.chart-segment');
      expect(segments.length).toBe(3);
    });

    it('handles empty data gracefully', () => {
      const { container } = render(
        <PieChart data={[]} width={300} height={300} />
      );
      expect(container.querySelectorAll('path.chart-segment').length).toBe(0);
    });
  });

  describe('<ScatterChart />', () => {
    const scatterPoints = [
      { x: 10, y: 20 },
      { x: 30, y: 70 },
      { x: 50, y: 45 },
    ];

    it('renders scatter points and interactive overlay', () => {
      const { container } = render(
        <ScatterChart
          data={scatterPoints}
          width={400}
          height={200}
          ariaLabel="Latency Scatter"
        />
      );

      expect(
        screen.getByRole('region', { name: 'Latency Scatter' })
      ).toBeDefined();

      const circles = container.querySelectorAll('circle.chart-point');
      expect(circles.length).toBe(3);

      const overlay = container.querySelector('rect.chart-scatter-overlay');
      expect(overlay).not.toBeNull();
    });

    it('positions legend at top when legendPosition="top" for multi-series', () => {
      const { container } = render(
        <ScatterChart
          series={[
            { name: 'Cluster A', data: [{ x: 10, y: 20 }] },
            { name: 'Cluster B', data: [{ x: 30, y: 40 }] },
          ]}
          width={400}
          height={200}
          showLegend={true}
          legendPosition="top"
        />
      );

      const root = container.querySelector('.nui-chart-container');
      const firstChild = root?.children[0];
      expect(firstChild?.classList.contains('chart-legend')).toBe(true);

      const plotWrapper = container.querySelector('.chart-plot-wrapper');
      expect((plotWrapper as HTMLElement)?.style.height).toBe('162px');
    });

    it('handles empty dataset gracefully', () => {
      const { container } = render(
        <ScatterChart data={[]} width={400} height={200} />
      );
      expect(container.querySelectorAll('circle.chart-point').length).toBe(0);
    });
  });

  describe('<Sparkline />', () => {
    it('renders ultra-compact vector line and area fill with accessible title', () => {
      const { container } = render(
        <Sparkline
          data={[10, 25, 15, 35, 20]}
          width={120}
          height={32}
          color="#10b981"
          ariaLabel="Revenue Trend"
        />
      );

      const root = container.querySelector('.sparkline');
      expect(root).not.toBeNull();
      expect(root?.getAttribute('role')).toBe('img');
      expect(root?.getAttribute('aria-label')).toBe('Revenue Trend');

      const polyline = container.querySelector('polyline');
      expect(polyline).not.toBeNull();
      expect(polyline?.getAttribute('points')).toBeTruthy();
      expect(polyline?.getAttribute('stroke')).toBe('#10b981');
    });

    it('renders empty fallback when data is empty', () => {
      const { container } = render(
        <Sparkline data={[]} width={80} height={20} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('<ChartLegend />', () => {
    it('fires onToggle callback when clicking a series swatch', () => {
      const handleToggle = vi.fn();
      render(
        <ChartLegend
          series={[
            { name: 'Production', color: '#10b981', hidden: false },
            { name: 'Staging', color: '#f59e0b', hidden: true },
          ]}
          onToggle={handleToggle}
        />
      );

      const prodBtn = screen.getByText('Production');
      fireEvent.click(prodBtn);
      expect(handleToggle).toHaveBeenCalledWith('Production');

      const stagingBtn = screen.getByText('Staging');
      fireEvent.click(stagingBtn);
      expect(handleToggle).toHaveBeenCalledWith('Staging');
    });
  });
});
