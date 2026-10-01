/**
 * @nofinite/charts - SVG Axis & Ticks Engine
 * Renders high-legibility X/Y axes conforming to @nofinite/nuicss typography.
 */

export interface AxisOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xScale: any;
  yScale: any;
  showAxes?: boolean;
  showGrid?: boolean;
  xTickFormat?: (val: any) => string;
  yTickFormat?: (val: number) => string;
  numXTicks?: number;
  numYTicks?: number;
  categories?: { label: string; x: number; width: number }[];
}

export function formatMetricNumber(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1_000_000_000) {
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (abs >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (abs >= 1_000) {
    return (val / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  if (Number.isInteger(val)) {
    return String(val);
  }
  return val.toFixed(1).replace(/\.0$/, '');
}

export function formatTemporalTick(val: any): string {
  if (val instanceof Date) {
    return val.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
  if (typeof val === 'number') {
    return formatMetricNumber(val);
  }
  return String(val);
}

export function generateAxisSvg(options: AxisOptions): {
  gridSvg: string;
  yAxisSvg: string;
  xAxisSvg: string;
} {
  const {
    margin,
    xScale,
    yScale,
    showAxes = true,
    showGrid = true,
    xTickFormat = formatTemporalTick,
    yTickFormat = formatMetricNumber,
    numXTicks = 5,
    numYTicks = 5,
    categories,
  } = options;

  const innerWidth = Math.max(0, options.width - margin.left - margin.right);
  const innerHeight = Math.max(0, options.height - margin.top - margin.bottom);

  // 1. Grid & Y Axis
  let gridSvg = '';
  let yAxisSvg = '';

  if (yScale && typeof yScale.ticks === 'function') {
    const ticks: number[] = yScale.ticks(numYTicks);

    if (showGrid) {
      gridSvg = ticks
        .map((t) => {
          const y = yScale(t);
          const isZero = t === 0;
          return `
            <line x1="0" y1="${y}" x2="${innerWidth}" y2="${y}"
                  stroke="var(--border-default)"
                  stroke-opacity="${isZero ? '0.6' : '0.35'}"
                  stroke-dasharray="${isZero ? 'none' : '3,3'}"
                  class="chart-grid" />
          `;
        })
        .join('');
    }

    if (showAxes) {
      yAxisSvg = ticks
        .map((t) => {
          const y = yScale(t);
          return `
            <text x="-10" y="${y}" text-anchor="end" dominant-baseline="central"
                  class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)" opacity="0.75">
              ${yTickFormat(t)}
            </text>
          `;
        })
        .join('');
    }
  }

  // 2. X Axis
  let xAxisSvg = '';

  if (showAxes) {
    if (categories && categories.length > 0) {
      // Categorical / Band Layout (e.g. Bar Charts)
      xAxisSvg = categories
        .map((cat) => {
          const cx = cat.x + cat.width / 2;
          return `
            <text x="${cx}" y="${innerHeight + 18}" text-anchor="middle"
                  class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)" opacity="0.75">
              ${cat.label}
            </text>
          `;
        })
        .join('');
    } else if (xScale && typeof xScale.ticks === 'function') {
      // Continuous / Time Series (Area, Line, Scatter)
      const xTicks = xScale.ticks(
        Math.min(numXTicks, innerWidth > 450 ? 6 : 3)
      );
      xAxisSvg = xTicks
        .map((t: any) => {
          const x = xScale(t);
          if (x < -5 || x > innerWidth + 5) return '';
          return `
            <text x="${x}" y="${innerHeight + 18}" text-anchor="middle"
                  class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)" opacity="0.75">
              ${xTickFormat(t)}
            </text>
          `;
        })
        .join('');
    }
  }

  return { gridSvg, yAxisSvg, xAxisSvg };
}
