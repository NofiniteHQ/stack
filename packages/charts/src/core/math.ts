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
  parseDateSafe,
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

export function calculateLinearDomain(
  yMin: number,
  yMax: number
): [number, number] {
  if (yMin === 0 && yMax === 0) {
    return [0, 10];
  }
  if (yMax <= 0) {
    const low = yMin < 0 ? yMin * 1.15 : -10;
    return [low, 0];
  }
  if (yMin >= 0) {
    return [0, yMax * 1.1];
  }
  return [yMin * 1.1, yMax * 1.1];
}

export interface AreaPathResult {
  areaPath: string;
  linePath: string;
  xScale: any;
  yScale: any;
  points: { x: number; y: number; data: NormalizedDataPoint }[];
  normalizedData: NormalizedDataPoint[];
  isCategorical?: boolean;
  categories?: { label: string; x: number }[];
}

export function calculateAreaPath(
  data: any[],
  dimensions: ChartDimensions,
  xAccessor?: (d: any) => number | Date | string,
  yAccessor?: (d: any) => number
): AreaPathResult {
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
  const isCategorical =
    !isTime &&
    normalized.some(
      (d) =>
        typeof d.xOriginal === 'string' &&
        isNaN(Number(d.xOriginal)) &&
        !(parseDateSafe(d.xOriginal) instanceof Date)
    );

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
  } else if (isCategorical) {
    const maxIdx = Math.max(0, normalized.length - 1);
    xScale = scaleLinear().domain([0, maxIdx]).range([0, innerWidth]);
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
  const yMin = Math.min(...normalized.map((d) => d.y));
  const [domainMin, domainMax] = calculateLinearDomain(yMin, yMax);
  const yScale = scaleLinear()
    .domain([domainMin, domainMax])
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

  const categories = isCategorical
    ? normalized.map((d) => ({
        label: d.label,
        x: xScale(d.x)!,
      }))
    : undefined;

  return {
    areaPath,
    linePath,
    xScale,
    yScale,
    points,
    normalizedData: normalized,
    isCategorical,
    categories,
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

export interface ChartSeries<T = any> {
  id?: string;
  name: string;
  data: T[];
  color?: string;
  hidden?: boolean;
}

export interface ReferenceLine {
  y?: number;
  x?: any;
  label?: string;
  color?: string;
  strokeDasharray?: string;
}

export interface MultiSeriesPathResult {
  xScale: any;
  yScale: any;
  series: Array<{
    id: string;
    name: string;
    color: string;
    hidden: boolean;
    areaPath: string;
    linePath: string;
    points: Array<{ x: number; y: number; data: NormalizedDataPoint }>;
  }>;
  isCategorical?: boolean;
  categories?: { label: string; x: number }[];
}

export function calculateMultiSeriesAreaPath(
  seriesList: ChartSeries[],
  dimensions: ChartDimensions,
  xAccessor?: (d: any) => number | Date | string,
  yAccessor?: (d: any) => number
): MultiSeriesPathResult {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const normalizedSeries = seriesList.map((s, i) => ({
    id: s.id || `series-${i}`,
    name: s.name || `Series ${i + 1}`,
    color: s.color || `var(--chart-${(i % 8) + 1}, var(--color-primary))`,
    hidden: !!s.hidden,
    data: normalizeData(s.data, { xAccessor, yAccessor }),
  }));

  const activeSeries = normalizedSeries.filter((s) => !s.hidden);
  const allActivePoints = activeSeries.flatMap((s) => s.data);

  if (allActivePoints.length === 0) {
    const dummyScale = scaleLinear().range([0, innerWidth]);
    return {
      xScale: dummyScale,
      yScale: dummyScale,
      series: normalizedSeries.map((s) => ({
        ...s,
        areaPath: '',
        linePath: '',
        points: [],
      })),
    };
  }

  const isTime = allActivePoints[0]?.x instanceof Date;
  const isCategorical =
    !isTime &&
    allActivePoints.some(
      (d) =>
        typeof d.xOriginal === 'string' &&
        isNaN(Number(d.xOriginal)) &&
        !(parseDateSafe(d.xOriginal) instanceof Date)
    );

  const categoryLabels: string[] = [];
  if (isCategorical) {
    for (const s of normalizedSeries) {
      for (const d of s.data) {
        if (d.label && !categoryLabels.includes(d.label)) {
          categoryLabels.push(d.label);
        }
      }
    }

    // Harmonize points to category indices so multi-series points align identically on X
    for (const s of normalizedSeries) {
      for (const d of s.data) {
        const catIdx = categoryLabels.indexOf(d.label);
        if (catIdx !== -1) {
          d.x = catIdx;
        }
      }
    }
  }

  let xScale: any;

  if (isTime) {
    const allDates = allActivePoints.map((d) =>
      d.x instanceof Date ? d.x : new Date(d.x)
    );
    let minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    let maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    if (minDate.getTime() === maxDate.getTime()) {
      minDate = new Date(minDate.getTime() - 86400000);
      maxDate = new Date(maxDate.getTime() + 86400000);
    }
    xScale = scaleTime().domain([minDate, maxDate]).range([0, innerWidth]);
  } else if (isCategorical) {
    const maxIdx = Math.max(0, categoryLabels.length - 1);
    xScale = scaleLinear().domain([0, maxIdx]).range([0, innerWidth]);
  } else {
    const allNums = allActivePoints.map((d) =>
      typeof d.x === 'number' ? d.x : 0
    );
    let minNum = Math.min(...allNums);
    let maxNum = Math.max(...allNums);
    if (minNum === maxNum) {
      minNum = minNum - 1;
      maxNum = maxNum + 1;
    }
    xScale = scaleLinear().domain([minNum, maxNum]).range([0, innerWidth]);
  }

  const yMax = max(allActivePoints, (d) => d.y) ?? 100;
  const yMin = Math.min(...allActivePoints.map((d) => d.y));
  const [domainMin, domainMax] = calculateLinearDomain(yMin, yMax);
  const yScale = scaleLinear()
    .domain([domainMin, domainMax])
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

  const seriesResults = normalizedSeries.map((s) => {
    if (s.hidden) {
      return {
        id: s.id,
        name: s.name,
        color: s.color,
        hidden: true,
        areaPath: '',
        linePath: '',
        points: [],
      };
    }

    const linePath = lineGenerator(s.data) || '';
    const areaPath = areaGenerator(s.data) || '';
    const points = s.data.map((d) => ({
      x: xScale(d.x)!,
      y: yScale(d.y)!,
      data: d,
    }));

    return {
      id: s.id,
      name: s.name,
      color: s.color,
      hidden: false,
      areaPath,
      linePath,
      points,
    };
  });

  const categories = isCategorical
    ? categoryLabels.map((label, idx) => ({
        label,
        x: xScale(idx) ?? 0,
      }))
    : undefined;

  return { xScale, yScale, series: seriesResults, isCategorical, categories };
}

export type BarLayoutMode = 'grouped' | 'stacked' | 'horizontal';

export interface MultiBarResult {
  xScale: any;
  yScale: any;
  margin?: { top: number; right: number; bottom: number; left: number };
  bars: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    seriesName: string;
    data: NormalizedDataPoint;
  }>;
  categories: Array<{ label: string; x: number; width: number }>;
}

export function calculateMultiBarLayout(
  seriesList: ChartSeries[],
  dimensions: ChartDimensions,
  layout: BarLayoutMode = 'grouped',
  options?: DataAccessorOptions
): MultiBarResult {
  const rawMargin = dimensions.margin || defaultMargin;
  const margin = { ...rawMargin };

  const normalizedSeries = seriesList.map((s, i) => ({
    name: s.name || `Series ${i + 1}`,
    color: s.color || `var(--chart-${(i % 8) + 1}, var(--color-primary))`,
    hidden: !!s.hidden,
    data: normalizeData(s.data, options),
  }));

  const activeSeries = normalizedSeries.filter((s) => !s.hidden);

  const categoryLabels: string[] = [];
  for (const s of normalizedSeries) {
    for (const d of s.data) {
      if (!categoryLabels.includes(d.label)) {
        categoryLabels.push(d.label);
      }
    }
  }

  if (
    layout === 'horizontal' &&
    !dimensions.margin?.left &&
    categoryLabels.length > 0
  ) {
    const maxLen = Math.max(...categoryLabels.map((l) => l.length));
    margin.left = Math.max(
      margin.left,
      Math.min(160, Math.round(maxLen * 7 + 16))
    );
  }

  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  if (categoryLabels.length === 0 || activeSeries.length === 0) {
    const dummyScale = scaleBand().range([0, innerWidth]);
    const dummyLinear = scaleLinear().range([innerHeight, 0]);
    return {
      xScale: dummyScale,
      yScale: dummyLinear,
      margin,
      bars: [],
      categories: [],
    };
  }

  if (layout === 'horizontal') {
    const yScale = scaleBand()
      .domain(categoryLabels)
      .range([0, innerHeight])
      .padding(0.25);

    const allValues = activeSeries.flatMap((s) => s.data.map((d) => d.y));
    const maxX = Math.max(10, ...allValues);
    const xScale = scaleLinear()
      .domain([0, maxX * 1.1])
      .range([0, innerWidth]);

    const seriesBand = scaleBand()
      .domain(activeSeries.map((s) => s.name))
      .range([0, yScale.bandwidth()])
      .padding(0.1);

    const bars: MultiBarResult['bars'] = [];
    for (const cat of categoryLabels) {
      const catY = yScale(cat) ?? 0;
      for (const s of activeSeries) {
        const item = s.data.find((d) => d.label === cat);
        if (item) {
          const barY =
            catY + (activeSeries.length > 1 ? seriesBand(s.name) ?? 0 : 0);
          const barH =
            activeSeries.length > 1
              ? seriesBand.bandwidth()
              : yScale.bandwidth();
          const barW = Math.max(2, xScale(item.y));
          bars.push({
            x: 0,
            y: barY,
            width: barW,
            height: barH,
            color: item.color || s.color,
            seriesName: s.name,
            data: item,
          });
        }
      }
    }

    const categories = categoryLabels.map((label) => ({
      label,
      x: 0,
      width: innerWidth,
    }));

    return { xScale, yScale, margin, bars, categories };
  }

  // Vertical: 'grouped' or 'stacked'
  const xScale = scaleBand()
    .domain(categoryLabels)
    .range([0, innerWidth])
    .padding(0.25);

  const categories = categoryLabels.map((cat) => ({
    label: cat,
    x: xScale(cat) ?? 0,
    width: xScale.bandwidth(),
  }));

  if (layout === 'stacked') {
    const catSums = categoryLabels.map((cat) => {
      return activeSeries.reduce((acc, s) => {
        const item = s.data.find((d) => d.label === cat);
        return acc + (item ? Math.max(0, item.y) : 0);
      }, 0);
    });
    const yMax = Math.max(10, ...catSums);
    const yScale = scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

    const bars: MultiBarResult['bars'] = [];
    for (const cat of categoryLabels) {
      const catX = xScale(cat) ?? 0;
      const barWidth = xScale.bandwidth();
      let cumulativeY = 0;

      for (const s of activeSeries) {
        const item = s.data.find((d) => d.label === cat);
        if (item && item.y > 0) {
          const y0 = yScale(cumulativeY);
          cumulativeY += item.y;
          const y1 = yScale(cumulativeY);
          const barHeight = Math.max(2, Math.abs(zeroY_or_diff(y0, y1)));

          bars.push({
            x: catX,
            y: y1,
            width: barWidth,
            height: barHeight,
            color: item.color || s.color,
            seriesName: s.name,
            data: item,
          });
        }
      }
    }

    return { xScale, yScale, bars, categories };
  }

  // Default: 'grouped'
  const allY = activeSeries.flatMap((s) => s.data.map((d) => d.y));
  const yMax = Math.max(10, ...allY);
  const yMin = Math.min(0, ...allY);
  const yScale = scaleLinear()
    .domain([yMin, yMax * 1.1])
    .range([innerHeight, 0]);

  const seriesBand = scaleBand()
    .domain(activeSeries.map((s) => s.name))
    .range([0, xScale.bandwidth()])
    .padding(0.1);

  const bars: MultiBarResult['bars'] = [];
  for (const cat of categoryLabels) {
    const catX = xScale(cat) ?? 0;
    for (const s of activeSeries) {
      const item = s.data.find((d) => d.label === cat);
      if (item) {
        const subX =
          activeSeries.length > 1 ? catX + (seriesBand(s.name) ?? 0) : catX;
        const subW =
          activeSeries.length > 1 ? seriesBand.bandwidth() : xScale.bandwidth();
        const yVal = yScale(Math.max(0, item.y));
        const zeroY = yScale(0);
        const barHeight = Math.max(2, Math.abs(zeroY - yVal));
        const y = item.y >= 0 ? yVal : zeroY;

        bars.push({
          x: subX,
          y,
          width: subW,
          height: barHeight,
          color: item.color || s.color,
          seriesName: s.name,
          data: item,
        });
      }
    }
  }

  return { xScale, yScale, margin, bars, categories };
}

function zeroY_or_diff(y0: number, y1: number): number {
  return Math.abs(y0 - y1);
}

export interface MultiScatterPoint {
  x: number;
  y: number;
  seriesName: string;
  color: string;
  data: NormalizedDataPoint;
}

export interface MultiScatterResult {
  xScale: any;
  yScale: any;
  points: MultiScatterPoint[];
  allActivePoints: NormalizedDataPoint[];
}

export function calculateMultiScatterLayout(
  series: ChartSeries[],
  dimensions: ChartDimensions,
  options?: DataAccessorOptions
): MultiScatterResult {
  const margin = dimensions.margin || defaultMargin;
  const innerWidth = Math.max(0, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(
    0,
    dimensions.height - margin.top - margin.bottom
  );

  const activeSeries = series.filter((s) => !s.hidden);
  const normalizedSeries = activeSeries.map((s, idx) => ({
    name: s.name,
    color: s.color || `var(--chart-${(idx % 8) + 1}, var(--color-primary))`,
    data: normalizeData(s.data, options),
  }));

  const allActivePoints = normalizedSeries.flatMap((s) => s.data);

  if (allActivePoints.length === 0) {
    const dummyX = scaleLinear().domain([0, 10]).range([0, innerWidth]);
    const dummyY = scaleLinear().domain([0, 10]).range([innerHeight, 0]);
    return { xScale: dummyX, yScale: dummyY, points: [], allActivePoints: [] };
  }

  const xs = allActivePoints.map((d) => (typeof d.x === 'number' ? d.x : 0));
  const ys = allActivePoints.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const [domainMinX, domainMaxX] = calculateLinearDomain(minX, maxX);
  const [domainMinY, domainMaxY] = calculateLinearDomain(minY, maxY);

  const xScale = scaleLinear()
    .domain([domainMinX, domainMaxX])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([domainMinY, domainMaxY])
    .range([innerHeight, 0]);

  const points: MultiScatterPoint[] = [];
  for (const s of normalizedSeries) {
    for (const d of s.data) {
      const cx = xScale(typeof d.x === 'number' ? d.x : 0);
      const cy = yScale(d.y);
      points.push({
        x: cx,
        y: cy,
        seriesName: s.name,
        color: d.color || s.color,
        data: d,
      });
    }
  }

  return { xScale, yScale, points, allActivePoints };
}
