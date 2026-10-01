/**
 * @nofinite/charts - Mathematical Vector SVG Engine
 * Powered by modular D3 algorithms (d3-shape, d3-scale, d3-array)
 */

import {
  line as d3Line,
  area as d3Area,
  curveMonotoneX,
  pie as d3Pie,
  arc as d3Arc,
} from 'd3-shape';
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale';
import { max, bisector } from 'd3-array';
import {
  normalizeData,
  type NormalizedDataPoint,
  type DataAccessorOptions,
} from './normalize';

export { normalizeData, type NormalizedDataPoint, type DataAccessorOptions };

export type DataPoint = NormalizedDataPoint | Record<string, any>;

export interface ChartDimensions {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const defaultMargin = { top: 24, right: 24, bottom: 36, left: 40 };

export function calculateAreaPath(
  data: any[],
  dimensions: ChartDimensions,
  xAccessor?: (d: any) => number | Date | string,
  yAccessor?: (d: any) => number
): {
  areaPath: string;
  linePath: string;
  xScale: any;
  yScale: any;
  points: { x: number; y: number; data: NormalizedDataPoint }[];
  normalizedData: NormalizedDataPoint[];
} {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const normalized = normalizeData(data, { xAccessor, yAccessor });

  if (normalized.length === 0) {
    const dummyScale = scaleLinear().range([0, innerWidth]);
    return {
      areaPath: '',
      linePath: '',
      xScale: dummyScale,
      yScale: dummyScale,
      points: [],
      normalizedData: [],
    };
  }

  const isTime = normalized[0].x instanceof Date;
  let xScale: any;

  if (isTime) {
    const dates = normalized.map((d) => d.x as Date);
    let minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    let maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // If single point or identical dates, widen extent by 1 day
    if (minDate.getTime() === maxDate.getTime()) {
      minDate = new Date(minDate.getTime() - 86400000);
      maxDate = new Date(maxDate.getTime() + 86400000);
    }
    xScale = scaleTime().domain([minDate, maxDate]).range([0, innerWidth]);
  } else {
    const nums = normalized.map((d) => d.x as number);
    let minNum = Math.min(...nums);
    let maxNum = Math.max(...nums);

    if (minNum === maxNum) {
      minNum = minNum - 1;
      maxNum = maxNum + 1;
    }
    xScale = scaleLinear().domain([minNum, maxNum]).range([0, innerWidth]);
  }

  const yMax = max(normalized, (d) => d.y) ?? 100;
  const yMin = Math.min(0, ...normalized.map((d) => d.y));
  const yScale = scaleLinear()
    .domain([yMin, yMax === 0 ? 10 : yMax * 1.1])
    .range([innerHeight, 0]);

  const lineGenerator = d3Line<NormalizedDataPoint>()
    .x((d) => xScale(d.x)!)
    .y((d) => yScale(d.y)!)
    .curve(curveMonotoneX);

  const areaGenerator = d3Area<NormalizedDataPoint>()
    .x((d) => xScale(d.x)!)
    .y0(innerHeight)
    .y1((d) => yScale(d.y)!)
    .curve(curveMonotoneX);

  const linePath = lineGenerator(normalized) || '';
  const areaPath = areaGenerator(normalized) || '';

  // Perfectly synchronized points aligned with the exact xScale and yScale
  const points = normalized.map((d) => ({
    x: xScale(d.x)!,
    y: yScale(d.y)!,
    data: d,
  }));

  return {
    areaPath,
    linePath,
    xScale,
    yScale,
    points,
    normalizedData: normalized,
  };
}

export function calculateBarLayout(
  data: any[],
  dimensions: ChartDimensions,
  options?: DataAccessorOptions
): {
  bars: {
    x: number;
    y: number;
    width: number;
    height: number;
    data: NormalizedDataPoint;
  }[];
  xScale: any;
  yScale: any;
  normalizedData: NormalizedDataPoint[];
} {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const normalized = normalizeData(data, options);
  if (normalized.length === 0) {
    const dummyScale = scaleBand().range([0, innerWidth]);
    const dummyLinear = scaleLinear().range([innerHeight, 0]);
    return {
      bars: [],
      xScale: dummyScale,
      yScale: dummyLinear,
      normalizedData: [],
    };
  }

  // Ensure unique domain labels while preserving item mapping
  const domainLabels = normalized.map((d, i) => `${d.label}__${i}`);

  const xScale = scaleBand()
    .domain(domainLabels)
    .range([0, innerWidth])
    .padding(0.3);

  const yMax = max(normalized, (d) => d.y) ?? 100;
  const yMin = Math.min(0, ...normalized.map((d) => d.y));
  const yScale = scaleLinear()
    .domain([yMin, yMax === 0 ? 10 : yMax * 1.1])
    .range([innerHeight, 0]);

  const bars = normalized.map((d, i) => {
    const key = `${d.label}__${i}`;
    const x = xScale(key) ?? 0;
    const yVal = yScale(Math.max(0, d.y));
    const zeroY = yScale(0);
    const barWidth = xScale.bandwidth();
    const barHeight = Math.max(2, Math.abs(zeroY - yVal));
    const y = d.y >= 0 ? yVal : zeroY;
    return { x, y, width: barWidth, height: barHeight, data: d };
  });

  return { bars, xScale, yScale, normalizedData: normalized };
}

export function calculatePieSegments(
  data: any[],
  radius: number,
  donutCutout = 0,
  options?: DataAccessorOptions
): { path: string; data: NormalizedDataPoint; centroid: [number, number] }[] {
  const normalized = normalizeData(data, options);
  if (normalized.length === 0) {
    return [];
  }

  const pieGenerator = d3Pie<NormalizedDataPoint>()
    .value((d) => Math.max(0, d.y))
    .sort(null);

  const innerRadius = radius * donutCutout;
  const arcGenerator = d3Arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(4)
    .padAngle(0.02);

  const pieData = pieGenerator(normalized);

  return pieData.map((d) => ({
    path: arcGenerator(d) || '',
    data: d.data,
    centroid: arcGenerator.centroid(d),
  }));
}

export const bisectDate = bisector<NormalizedDataPoint, Date>((d) =>
  d.x instanceof Date ? d.x : new Date(d.xOriginal || d.label)
).left;
