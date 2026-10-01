import {
  type DataPoint,
  defaultMargin,
  calculateAreaPath,
  calculateBarLayout,
  calculatePieSegments,
  normalizeData,
} from './math';
import { scaleLinear } from 'd3-scale';

export type ChartVariant =
  | 'area'
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'scatter';

export interface ChartOptions {
  variant: ChartVariant;
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  donutCutout?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  xAccessor?: (d: any) => number | Date | string;
  yAccessor?: (d: any) => number;
}

let gradientCounter = 0;

export function renderChart(options: ChartOptions): string {
  const width = options.width || 600;
  const height = options.height || 300;
  const margin = options.margin || defaultMargin;
  const data = options.data || [];
  const variant = options.variant;
  const color = options.color || 'var(--chart-1, var(--color-primary))';
  const showGrid = options.showGrid !== false;

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const gradientId = `nui-chart-grad-${++gradientCounter}`;

  let contentSvg = '';

  if (variant === 'area' || variant === 'line') {
    const { areaPath, linePath, yScale, points } = calculateAreaPath(
      data,
      { width, height, margin },
      options.xAccessor,
      options.yAccessor
    );

    // Grid lines
    let gridSvg = '';
    if (showGrid && yScale.ticks) {
      const ticks = yScale.ticks(5);
      gridSvg = ticks
        .map(
          (t: number) => `
        <line x1="0" y1="${yScale(t)}" x2="${innerWidth}" y2="${yScale(t)}"
              stroke="var(--border-default)" stroke-opacity="0.5" stroke-dasharray="3,3" class="chart-grid" />
      `
        )
        .join('');
    }

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${gridSvg}
        ${
          variant === 'area'
            ? `<path d="${areaPath}" fill="url(#${gradientId})" />`
            : ''
        }
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${points
          .map(
            (p) => `
          <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" stroke="var(--bg-surface)" stroke-width="2" class="chart-point transition-transform hover:scale-150" data-label="${p.data.label}" data-value="${p.data.y}" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'bar') {
    const { bars, yScale } = calculateBarLayout(
      data,
      { width, height, margin },
      { xAccessor: options.xAccessor, yAccessor: options.yAccessor }
    );

    let gridSvg = '';
    if (showGrid && yScale.ticks) {
      const ticks = yScale.ticks(5);
      gridSvg = ticks
        .map(
          (t: number) => `
        <line x1="0" y1="${yScale(t)}" x2="${innerWidth}" y2="${yScale(t)}"
              stroke="var(--border-default)" stroke-opacity="0.5" stroke-dasharray="3,3" class="chart-grid" />
      `
        )
        .join('');
    }

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${gridSvg}
        ${bars
          .map(
            (b) => `
          <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${
              b.height
            }" rx="4"
                fill="${
                  b.data.color || color
                }" class="chart-bar transition-opacity hover:opacity-85" data-label="${
              b.data.label
            }" data-value="${b.data.y}" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'pie' || variant === 'donut') {
    const radius = Math.min(innerWidth, innerHeight) / 2 - 8;
    const cutout = variant === 'donut' ? options.donutCutout ?? 0.6 : 0;
    const segments = calculatePieSegments(data, radius, cutout, {
      xAccessor: options.xAccessor,
      yAccessor: options.yAccessor,
    });
    const centerX = width / 2;
    const centerY = height / 2;

    contentSvg = `
      <g transform="translate(${centerX}, ${centerY})">
        ${segments
          .map(
            (s, i) => `
          <path d="${s.path}" fill="${
              s.data.color ||
              `var(--chart-${(i % 8) + 1}, var(--color-primary))`
            }"
                stroke="var(--bg-surface)" stroke-width="2" class="chart-segment transition-transform hover:scale-105" data-label="${
                  s.data.label
                }" data-value="${s.data.y}" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'scatter') {
    const normalized = normalizeData(data, {
      xAccessor: options.xAccessor,
      yAccessor: options.yAccessor,
    });
    const xs = normalized.map((d) => (typeof d.x === 'number' ? d.x : 0));
    const ys = normalized.map((d) => d.y);
    const minX = Math.min(0, ...xs);
    const maxX = Math.max(10, ...xs) || 100;
    const minY = Math.min(0, ...ys);
    const maxY = Math.max(10, ...ys) || 100;

    const xScale = scaleLinear()
      .domain([minX, maxX * 1.05])
      .range([0, innerWidth]);
    const yScale = scaleLinear()
      .domain([minY, maxY * 1.05])
      .range([innerHeight, 0]);

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${normalized
          .map(
            (d) => `
          <circle cx="${xScale(
            typeof d.x === 'number' ? d.x : 0
          )}" cy="${yScale(d.y)}" r="4"
                  fill="${
                    d.color || color
                  }" stroke="var(--bg-surface)" stroke-width="2"
                  class="chart-point transition-transform hover:scale-125" data-label="${
                    d.label
                  }" data-value="${d.y}" />
        `
          )
          .join('')}
      </g>
    `;
  }

  const isCircular = variant === 'pie' || variant === 'donut';
  const preserveAspect = isCircular ? 'xMidYMid meet' : 'none';

  return `
    <div class="chart-container nui-chart-container ${
      isCircular ? 'chart-container-circular' : ''
    } relative w-full font-sans select-none" style="height: ${height}px;">
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible" preserveAspectRatio="${preserveAspect}">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.00" />
          </linearGradient>
        </defs>
        ${contentSvg}
      </svg>
    </div>
  `.trim();
}
