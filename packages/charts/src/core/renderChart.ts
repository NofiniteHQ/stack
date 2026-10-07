import {
  type DataPoint,
  defaultMargin,
  calculateAreaPath,
  calculatePieSegments,
  calculateMultiSeriesAreaPath,
  calculateMultiBarLayout,
  calculateMultiScatterLayout,
  type ChartSeries,
  type BarLayoutMode,
  type ReferenceLine,
  type AreaMode,
} from './math';
import { generateAxisSvg } from './axis';
import { renderLegendHtml } from './legend';
import { generateA11yTableHtml } from './a11y';
import type { TooltipFormatter } from './tooltip';

export type ChartVariant =
  | 'area'
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'scatter';

export interface ChartOptions {
  variant: ChartVariant;
  data?: DataPoint[];
  series?: ChartSeries[];
  barLayout?: BarLayoutMode;
  areaMode?: AreaMode;
  referenceLines?: ReferenceLine[];
  showLegend?: boolean;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  donutCutout?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  showTooltip?: boolean;
  showCrosshair?: boolean;
  xLabel?: string;
  yLabel?: string;
  xAccessor?: (d: unknown) => number | Date | string;
  yAccessor?: (d: unknown) => number;
  xTickFormat?: (val: unknown) => string;
  yTickFormat?: (val: number) => string;
  tooltipFormatter?: TooltipFormatter;
}

let gradientCounter = 0;

function renderReferenceLinesSvg(
  referenceLines: ReferenceLine[] | undefined,
  yScale: ((val: number) => number) | undefined,
  innerWidth: number
): string {
  if (!referenceLines || referenceLines.length === 0 || !yScale) return '';

  return referenceLines
    .map((ref) => {
      if (ref.y === undefined || typeof yScale !== 'function') return '';
      const yPos = yScale(ref.y);
      if (isNaN(yPos)) return '';

      const strokeColor = ref.color || 'var(--color-danger, #ef4444)';
      const dash = ref.strokeDasharray || '4,4';
      const labelText = ref.label
        ? `<text x="${innerWidth - 6}" y="${
            yPos - 6
          }" text-anchor="end" class="chart-reference-label text-[10px] font-medium font-sans select-none pointer-events-none" fill="${strokeColor}">${
            ref.label
          }</text>`
        : '';

      return `
        <g class="chart-reference-group">
          <line x1="0" y1="${yPos}" x2="${innerWidth}" y2="${yPos}" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="${dash}" class="chart-reference-line" />
          ${labelText}
        </g>
      `;
    })
    .join('');
}

export function renderChart(options: ChartOptions): string {
  const width = options.width || 600;
  const height = options.height || 300;
  const margin = options.margin || defaultMargin;
  const variant = options.variant;
  const color = options.color || 'var(--chart-1, var(--color-primary))';
  const showGrid = options.showGrid !== false;
  const showAxes = options.showAxes !== false;
  const showTooltip = options.showTooltip !== false;
  const showCrosshair = options.showCrosshair !== false;

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const baseGradId = `nui-chart-grad-${++gradientCounter}`;

  // Standardize series list
  const seriesList: ChartSeries[] =
    options.series && options.series.length > 0
      ? options.series
      : [
          {
            name: 'Series 1',
            data: options.data || [],
            color,
          },
        ];

  let contentSvg = '';
  let defsSvg = '';

  if (variant === 'area' || variant === 'line') {
    if (seriesList.length > 1) {
      // Multi-Series
      const { xScale, yScale, series, isCategorical, categories } =
        calculateMultiSeriesAreaPath(
          seriesList,
          { width, height, margin },
          options.xAccessor,
          options.yAccessor,
          options.areaMode || 'overlapping'
        );

      const effectiveYTickFormat =
        options.yTickFormat ||
        (options.areaMode === 'percent'
          ? (val: number) => `${val}%`
          : undefined);

      const { gridSvg, yAxisSvg, xAxisSvg } = generateAxisSvg({
        width,
        height,
        margin,
        xScale,
        yScale,
        showAxes,
        showGrid,
        xTickFormat: options.xTickFormat,
        yTickFormat: effectiveYTickFormat,
        categories: isCategorical ? categories : undefined,
      });

      const refLinesSvg = renderReferenceLinesSvg(
        options.referenceLines,
        yScale,
        innerWidth
      );

      defsSvg = series
        .map(
          (s, idx) => `
        <linearGradient id="${baseGradId}-${idx}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${s.color}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${s.color}" stop-opacity="0.00" />
        </linearGradient>
      `
        )
        .join('');

      const seriesSvg = series
        .map((s, idx) => {
          if (s.hidden) return '';
          return `
          <g class="chart-series" data-series="${s.name}">
            ${
              variant === 'area'
                ? `<path d="${s.areaPath}" fill="url(#${baseGradId}-${idx})" />`
                : ''
            }
            <path d="${s.linePath}" fill="none" stroke="${
            s.color
          }" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            ${s.points
              .map(
                (p) => `
              <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${s.color}" stroke="var(--bg-surface)" stroke-width="2" class="chart-point transition-transform hover:scale-150" data-label="${p.data.label}" data-value="${p.data.y}" data-series="${s.name}" />
            `
              )
              .join('')}
          </g>
        `;
        })
        .join('');

      contentSvg = `
        <g transform="translate(${margin.left}, ${margin.top})">
          ${gridSvg}
          ${yAxisSvg}
          ${xAxisSvg}
          ${refLinesSvg}
          ${seriesSvg}
          ${
            showCrosshair
              ? `<line class="chart-crosshair" x1="0" y1="0" x2="0" y2="${innerHeight}" stroke="var(--border-strong, var(--border-default))" stroke-width="1" stroke-dasharray="3,3" opacity="0" pointer-events="none" style="transition: opacity 0.1s ease;" />`
              : ''
          }
          <circle class="chart-active-dot" cx="0" cy="0" r="5.5" fill="${color}" stroke="var(--bg-surface)" stroke-width="2.5" opacity="0" pointer-events="none" style="transition: opacity 0.1s ease;" />
          <rect class="chart-scrub-overlay" x="0" y="0" width="${innerWidth}" height="${innerHeight}" fill="transparent" pointer-events="all" style="cursor: crosshair;" />
        </g>
      `;
    } else {
      // Single series
      const {
        areaPath,
        linePath,
        xScale,
        yScale,
        points,
        isCategorical,
        categories,
      } = calculateAreaPath(
        seriesList[0].data,
        { width, height, margin },
        options.xAccessor,
        options.yAccessor
      );

      const { gridSvg, yAxisSvg, xAxisSvg } = generateAxisSvg({
        width,
        height,
        margin,
        xScale,
        yScale,
        showAxes,
        showGrid,
        xTickFormat: options.xTickFormat,
        yTickFormat: options.yTickFormat,
        categories: isCategorical ? categories : undefined,
      });

      const refLinesSvg = renderReferenceLinesSvg(
        options.referenceLines,
        yScale,
        innerWidth
      );

      defsSvg = `
        <linearGradient id="${baseGradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.00" />
        </linearGradient>
      `;

      contentSvg = `
        <g transform="translate(${margin.left}, ${margin.top})">
          ${gridSvg}
          ${yAxisSvg}
          ${xAxisSvg}
          ${refLinesSvg}
          ${
            variant === 'area'
              ? `<path d="${areaPath}" fill="url(#${baseGradId})" />`
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
          ${
            showCrosshair
              ? `<line class="chart-crosshair" x1="0" y1="0" x2="0" y2="${innerHeight}" stroke="var(--border-strong, var(--border-default))" stroke-width="1" stroke-dasharray="3,3" opacity="0" pointer-events="none" style="transition: opacity 0.1s ease;" />`
              : ''
          }
          <circle class="chart-active-dot" cx="0" cy="0" r="5.5" fill="${color}" stroke="var(--bg-surface)" stroke-width="2.5" opacity="0" pointer-events="none" style="transition: opacity 0.1s ease;" />
          <rect class="chart-scrub-overlay" x="0" y="0" width="${innerWidth}" height="${innerHeight}" fill="transparent" pointer-events="all" style="cursor: crosshair; touch-action: none;" />
        </g>
      `;
    }
  } else if (variant === 'bar') {
    const layout = options.barLayout || 'grouped';
    const {
      bars,
      xScale,
      yScale,
      categories,
      margin: layoutMargin,
    } = calculateMultiBarLayout(seriesList, { width, height, margin }, layout, {
      xAccessor: options.xAccessor,
      yAccessor: options.yAccessor,
    });
    const activeMargin = layoutMargin || margin;
    const isHorizontal = layout === 'horizontal';

    const effectiveBarYTickFormat =
      options.yTickFormat ||
      (layout === 'percent' ? (val: number) => `${val}%` : undefined);

    const { gridSvg, yAxisSvg, xAxisSvg } = generateAxisSvg({
      width,
      height,
      margin: activeMargin,
      xScale,
      yScale,
      showAxes,
      showGrid,
      isHorizontal,
      xTickFormat: options.xTickFormat,
      yTickFormat: effectiveBarYTickFormat,
      categories,
    });

    const refLinesSvg = renderReferenceLinesSvg(
      options.referenceLines,
      yScale,
      Math.max(0, width - activeMargin.left - activeMargin.right)
    );

    contentSvg = `
      <g transform="translate(${activeMargin.left}, ${activeMargin.top})">
        ${gridSvg}
        ${yAxisSvg}
        ${xAxisSvg}
        ${refLinesSvg}
        ${bars
          .map(
            (b) => `
          <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="4"
                fill="${b.color}" class="chart-bar transition-opacity hover:opacity-85" data-label="${b.data.label}" data-value="${b.data.y}" data-series="${b.seriesName}" />
        `
          )
          .join('')}
      </g>
    `;
  } else if (variant === 'pie' || variant === 'donut') {
    const size = Math.min(width, height);
    const radius = size / 2 - 16;
    const cutout = variant === 'donut' ? options.donutCutout ?? 0.6 : 0;
    const segments = calculatePieSegments(seriesList[0].data, radius, cutout, {
      xAccessor: options.xAccessor,
      yAccessor: options.yAccessor,
    });
    const centerX = size / 2;
    const centerY = size / 2;

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
    const { xScale, yScale, points } = calculateMultiScatterLayout(
      seriesList,
      { width, height, margin },
      {
        xAccessor: options.xAccessor,
        yAccessor: options.yAccessor,
      }
    );

    const { gridSvg, yAxisSvg, xAxisSvg } = generateAxisSvg({
      width,
      height,
      margin,
      xScale,
      yScale,
      showAxes,
      showGrid,
      xTickFormat: options.xTickFormat,
      yTickFormat: options.yTickFormat,
    });

    const refLinesSvg = renderReferenceLinesSvg(
      options.referenceLines,
      yScale,
      innerWidth
    );

    contentSvg = `
      <g transform="translate(${margin.left}, ${margin.top})">
        ${gridSvg}
        ${yAxisSvg}
        ${xAxisSvg}
        ${refLinesSvg}
        ${
          showCrosshair
            ? `
          <g class="chart-crosshair-group pointer-events-none" style="opacity: 0; transition: opacity 0.1s ease;">
            <line class="chart-crosshair-x" x1="0" y1="0" x2="0" y2="${innerHeight}" stroke="var(--border-strong, var(--border-default))" stroke-width="1" stroke-dasharray="3,3" />
            <line class="chart-crosshair-y" x1="0" y1="0" x2="${innerWidth}" y2="0" stroke="var(--border-strong, var(--border-default))" stroke-width="1" stroke-dasharray="3,3" />
          </g>
        `
            : ''
        }
        <circle class="chart-active-dot" cx="0" cy="0" r="6.5" fill="${color}" stroke="var(--bg-surface)" stroke-width="2" opacity="0" pointer-events="none" style="transition: opacity 0.1s ease;" />
        ${points
          .map(
            (pt) => `
          <g class="chart-scatter-point-group" data-series="${pt.seriesName}">
            <circle cx="${pt.x}" cy="${pt.y}" r="4"
                    fill="${pt.color}" stroke="var(--bg-surface)" stroke-width="2"
                    class="chart-point pointer-events-none transition-all duration-150" />
          </g>
        `
          )
          .join('')}
        <rect class="chart-scrub-overlay chart-scatter-overlay" x="0" y="0" width="${innerWidth}" height="${innerHeight}" fill="transparent" pointer-events="all" style="cursor: crosshair; touch-action: none;" />
      </g>
    `;
  }

  const isCircular = variant === 'pie' || variant === 'donut';
  const circularSize = Math.min(width, height);
  const viewBoxAttr = isCircular
    ? `0 0 ${circularSize} ${circularSize}`
    : `0 0 ${width} ${height}`;
  const preserveAspect = isCircular ? 'xMidYMid meet' : 'none';

  const legendHtml =
    options.showLegend && seriesList.length > 0
      ? renderLegendHtml(
          seriesList.map((s, idx) => ({
            name: s.name,
            color:
              s.color || `var(--chart-${(idx % 8) + 1}, var(--color-primary))`,
            hidden: s.hidden,
          }))
        )
      : '';

  return `
    <div class="chart-container nui-chart-container ${
      isCircular ? 'chart-container-circular' : ''
    } relative w-full font-sans select-none" style="height: ${height}px;">
      <svg viewBox="${viewBoxAttr}" class="w-full h-full overflow-visible" preserveAspectRatio="${preserveAspect}">
        <defs>
          ${defsSvg}
        </defs>
        ${contentSvg}
      </svg>
      ${legendHtml}
      ${generateA11yTableHtml(seriesList, {
        title: `${variant.toUpperCase()} chart data table`,
      })}
      ${
        showTooltip
          ? `<div class="chart-tooltip nui-chart-tooltip" role="tooltip" style="opacity: 0; pointer-events: none; position: absolute; top: 0; left: 0; transition: opacity 0.15s ease;"></div>`
          : ''
      }
    </div>
  `.trim();
}
