// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  calculateAreaPath,
  calculateBarLayout,
  calculatePieSegments,
  renderChart,
  Chart,
  defaultMargin,
} from './index';

describe('@nofinite/charts math engine', () => {
  const sampleData = [
    { label: 'Jan', value: 10, date: new Date('2024-01-01') },
    { label: 'Feb', value: 25, date: new Date('2024-02-01') },
    { label: 'Mar', value: 18, date: new Date('2024-03-01') },
    { label: 'Apr', value: 42, date: new Date('2024-04-01') },
  ];

  it('calculates smooth SVG area and line paths', () => {
    const { areaPath, linePath } = calculateAreaPath(sampleData, {
      width: 400,
      height: 200,
      margin: defaultMargin,
    });
    expect(areaPath).toBeTruthy();
    expect(areaPath.startsWith('M')).toBe(true);
    expect(linePath).toBeTruthy();
    expect(linePath.startsWith('M')).toBe(true);
  });

  it('calculates bar chart layout with exact dimensions', () => {
    const { bars } = calculateBarLayout(sampleData, {
      width: 400,
      height: 200,
      margin: defaultMargin,
    });
    expect(bars.length).toBe(4);
    expect(bars[0].width).toBeGreaterThan(0);
    expect(bars[0].height).toBeGreaterThan(0);
    expect(bars[0].y).toBeGreaterThanOrEqual(0);
    // Apr has highest value (42), so bars[3] should have largest height
    expect(bars[3].height).toBeGreaterThan(bars[0].height);
  });

  it('calculates pie and donut segments with arc paths', () => {
    const segments = calculatePieSegments(sampleData, 100, 0);
    expect(segments.length).toBe(4);
    segments.forEach((seg) => {
      expect(seg.path).toBeTruthy();
      expect(seg.path.startsWith('M')).toBe(true);
    });

    const donutSegments = calculatePieSegments(sampleData, 100, 0.6);
    expect(donutSegments.length).toBe(4);
    donutSegments.forEach((seg) => {
      expect(seg.path).toBeTruthy();
    });
  });
});

describe('@nofinite/charts universal renderer', () => {
  const sampleData = [
    { label: 'A', value: 30, x: 10, y: 30 },
    { label: 'B', value: 80, x: 20, y: 80 },
    { label: 'C', value: 45, x: 30, y: 45 },
  ];

  it('renders SVG for area chart', () => {
    const svg = renderChart({
      variant: 'area',
      data: sampleData,
      width: 500,
      height: 300,
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('linearGradient');
  });

  it('renders SVG for line chart', () => {
    const svg = renderChart({
      variant: 'line',
      data: sampleData,
      width: 500,
      height: 300,
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('stroke-width');
  });

  it('renders SVG for bar chart', () => {
    const svg = renderChart({
      variant: 'bar',
      data: sampleData,
      width: 500,
      height: 300,
    });
    expect(svg).toContain('<rect');
  });

  it('renders SVG for pie and donut charts', () => {
    const pieSvg = renderChart({
      variant: 'pie',
      data: sampleData,
      width: 300,
      height: 300,
    });
    expect(pieSvg).toContain('<path');

    const donutSvg = renderChart({
      variant: 'donut',
      data: sampleData,
      width: 300,
      height: 300,
    });
    expect(donutSvg).toContain('<path');
  });

  it('renders SVG for scatter chart', () => {
    const scatterSvg = renderChart({
      variant: 'scatter',
      data: sampleData,
      width: 500,
      height: 300,
    });
    expect(scatterSvg).toContain('<circle');
  });
});

describe('@nofinite/charts DOM class', () => {
  it('instantiates, updates, and destroys chart element', () => {
    const chart = new Chart({
      variant: 'bar',
      data: [{ label: 'Q1', value: 100 }],
      width: 400,
      height: 200,
    });

    expect(chart.element).toBeDefined();
    expect(chart.element?.innerHTML).toContain('<svg');

    chart.update([{ label: 'Q1', value: 200 }]);
    expect(chart.element?.innerHTML).toContain('<svg');

    chart.destroy();
    expect(chart.element?.innerHTML).toBe('');
  });
});
