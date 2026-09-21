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
import { extent, max, bisector } from 'd3-array';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  date?: string | Date;
  color?: string;
  [key: string]: any;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const defaultMargin = { top: 24, right: 24, bottom: 36, left: 40 };

export function calculateAreaPath(
  data: DataPoint[],
  dimensions: ChartDimensions,
  xAccessor: (d: DataPoint) => number | Date = (d) =>
    d.date ? new Date(d.date) : 0,
  yAccessor: (d: DataPoint) => number = (d) => d.value
): { areaPath: string; linePath: string; xScale: any; yScale: any } {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const xExtent = extent(data, xAccessor) as [Date | number, Date | number];
  const isTime = xExtent[0] instanceof Date;

  const xScale = isTime
    ? scaleTime().domain(xExtent).range([0, innerWidth])
    : scaleLinear()
        .domain(xExtent as [number, number])
        .range([0, innerWidth]);

  const yMax = max(data, yAccessor) || 100;
  const yScale = scaleLinear()
    .domain([0, yMax * 1.1])
    .range([innerHeight, 0]);

  const lineGenerator = d3Line<DataPoint>()
    .x((d) => xScale(xAccessor(d))!)
    .y((d) => yScale(yAccessor(d))!)
    .curve(curveMonotoneX);

  const areaGenerator = d3Area<DataPoint>()
    .x((d) => xScale(xAccessor(d))!)
    .y0(innerHeight)
    .y1((d) => yScale(yAccessor(d))!)
    .curve(curveMonotoneX);

  const linePath = lineGenerator(data) || '';
  const areaPath = areaGenerator(data) || '';

  return { areaPath, linePath, xScale, yScale };
}

export function calculateBarLayout(
  data: DataPoint[],
  dimensions: ChartDimensions
): {
  bars: {
    x: number;
    y: number;
    width: number;
    height: number;
    data: DataPoint;
  }[];
  xScale: any;
  yScale: any;
} {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const xScale = scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.3);

  const yMax = max(data, (d) => d.value) || 100;
  const yScale = scaleLinear()
    .domain([0, yMax * 1.1])
    .range([innerHeight, 0]);

  const bars = data.map((d) => {
    const x = xScale(d.label) || 0;
    const y = yScale(d.value) || 0;
    const barWidth = xScale.bandwidth();
    const barHeight = innerHeight - y;
    return { x, y, width: barWidth, height: barHeight, data: d };
  });

  return { bars, xScale, yScale };
}

export function calculatePieSegments(
  data: DataPoint[],
  radius: number,
  donutCutout = 0
): { path: string; data: DataPoint; centroid: [number, number] }[] {
  const pieGenerator = d3Pie<DataPoint>()
    .value((d) => d.value)
    .sort(null);

  const innerRadius = radius * donutCutout;
  const arcGenerator = d3Arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(4)
    .padAngle(0.02);

  const pieData = pieGenerator(data);

  return pieData.map((d) => ({
    path: arcGenerator(d) || '',
    data: d.data,
    centroid: arcGenerator.centroid(d),
  }));
}

export const bisectDate = bisector<DataPoint, Date>(
  (d) => new Date(d.date || d.label)
).left;
