/**
 * @nofinite/charts - SVG Axis & Ticks Engine
 * Renders high-legibility X/Y axes conforming to @nofinite/nuicss typography.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChartScale<TTick = number | Date> = ((
  val: any
) => number | undefined) & {
  ticks?: (count?: number) => TTick[];
  bandwidth?: () => number;
};

export interface AxisOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xScale: ChartScale<number | Date>;
  yScale: ChartScale<number>;
  showAxes?: boolean;
  showGrid?: boolean;
  isHorizontal?: boolean;
  xTickFormat?: (val: unknown) => string;
  yTickFormat?: (val: number) => string;
  numXTicks?: number;
  numYTicks?: number;
  categories?: { label: string; x?: number; width?: number }[];
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

export function formatTemporalTick(val: unknown): string {
  if (val instanceof Date) {
    return val.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
  if (typeof val === 'number') {
    return formatMetricNumber(val);
  }
  if (typeof val === 'string') {
    return val;
  }
  return val != null ? String(val) : '';
}

export function deduplicateTicks<T>(
  ticks: T[],
  format: (val: T) => string
): { value: T; formatted: string }[] {
  const seen = new Set<string>();
  const result: { value: T; formatted: string }[] = [];
  for (const t of ticks) {
    const formatted = format(t);
    if (!seen.has(formatted)) {
      seen.add(formatted);
      result.push({ value: t, formatted });
    }
  }
  return result;
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
    isHorizontal = false,
    xTickFormat = formatTemporalTick,
    yTickFormat = formatMetricNumber,
    numXTicks = 5,
    numYTicks = 5,
    categories,
  } = options;

  const innerWidth = Math.max(0, options.width - margin.left - margin.right);
  const innerHeight = Math.max(0, options.height - margin.top - margin.bottom);

  let gridSvg = '';
  let yAxisSvg = '';
  let xAxisSvg = '';

  if (isHorizontal) {
    // 1. Grid: vertical value lines
    if (showGrid && xScale && typeof xScale.ticks === 'function') {
      const ticks = (xScale.ticks(numXTicks) as number[]) ?? [];
      gridSvg = ticks
        .map((t) => {
          const x = xScale(t);
          const isZero = t === 0;
          return `
            <line x1="${x}" y1="0" x2="${x}" y2="${innerHeight}"
                  stroke="var(--border-default)"
                  stroke-opacity="${isZero ? '0.6' : '0.35'}"
                  stroke-dasharray="${isZero ? 'none' : '3,3'}"
                  class="chart-grid" />
          `;
        })
        .join('');
    }

    // 2. Y Axis: Category labels
    if (showAxes && categories && categories.length > 0 && yScale) {
      yAxisSvg = categories
        .map((cat) => {
          const catY = yScale(cat.label) ?? 0;
          const cy =
            catY +
            (typeof yScale.bandwidth === 'function'
              ? yScale.bandwidth() / 2
              : 0);
          return `
            <text x="-10" y="${cy}" text-anchor="end" dominant-baseline="central"
                  class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)" opacity="0.75">
              ${cat.label}
            </text>
          `;
        })
        .join('');
    }

    // 3. X Axis: Metric value labels
    if (showAxes && xScale && typeof xScale.ticks === 'function') {
      const xTicks =
        (xScale.ticks(
          Math.min(numXTicks, innerWidth > 450 ? 6 : 3)
        ) as number[]) ?? [];
      const dedupedXTicks = deduplicateTicks(
        xTicks,
        yTickFormat || formatMetricNumber
      );
      xAxisSvg = dedupedXTicks
        .map(({ value: t, formatted }) => {
          const x = xScale(t);
          if (x === undefined || x < -5 || x > innerWidth + 5) return '';
          return `
            <text x="${x}" y="${innerHeight + 18}" text-anchor="middle"
                  class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)" opacity="0.75">
              ${formatted}
            </text>
          `;
        })
        .join('');
    }
  } else {
    // Standard Vertical Layout
    // 1. Grid & Y Axis
    if (yScale && typeof yScale.ticks === 'function') {
      const ticks = (yScale.ticks(numYTicks) as number[]) ?? [];

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
        const dedupedYTicks = deduplicateTicks(ticks, yTickFormat);
        yAxisSvg = dedupedYTicks
          .map(({ value: t, formatted }) => {
            const y = yScale(t);
            return `
              <text x="-10" y="${y}" text-anchor="end" dominant-baseline="central"
                    class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                    fill="var(--fg-muted, currentColor)" opacity="0.75">
                ${formatted}
              </text>
            `;
          })
          .join('');
      }
    }

    // 2. X Axis
    if (showAxes) {
      if (categories && categories.length > 0) {
        // Categorical Layout (Bar Charts, Categorical Line/Area Charts)
        xAxisSvg = categories
          .map((cat) => {
            const cx =
              cat.width !== undefined
                ? (cat.x ?? 0) + cat.width / 2
                : cat.x ?? 0;
            const displayLabel =
              cat.width && cat.width < 55 && cat.label.length > 8
                ? `${cat.label.slice(0, 6)}…`
                : xTickFormat
                ? xTickFormat(cat.label)
                : cat.label;

            return `
              <text x="${cx}" y="${innerHeight + 18}" text-anchor="middle"
                    class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                    fill="var(--fg-muted, currentColor)" opacity="0.75">
                ${displayLabel}
              </text>
            `;
          })
          .join('');
      } else if (xScale && typeof xScale.ticks === 'function') {
        // Continuous / Time Series
        const xTicks =
          (xScale.ticks(Math.min(numXTicks, innerWidth > 450 ? 6 : 3)) as (
            | number
            | Date
          )[]) ?? [];
        const dedupedXTicks = deduplicateTicks(xTicks, xTickFormat);
        xAxisSvg = dedupedXTicks
          .map(({ value: t, formatted }) => {
            const x = xScale(t);
            if (x === undefined || x < -5 || x > innerWidth + 5) return '';
            return `
              <text x="${x}" y="${innerHeight + 18}" text-anchor="middle"
                    class="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                    fill="var(--fg-muted, currentColor)" opacity="0.75">
                ${formatted}
              </text>
            `;
          })
          .join('');
      }
    }
  }

  return { gridSvg, yAxisSvg, xAxisSvg };
}
