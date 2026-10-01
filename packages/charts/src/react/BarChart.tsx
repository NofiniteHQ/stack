import { useMemo } from 'react';
import {
  calculateBarLayout,
  type DataPoint,
  defaultMargin,
} from '../core/math';
import { formatMetricNumber } from '../core/axis';
import { useChartTooltip } from './useChartTooltip';
import type { TooltipFormatter } from '../core/tooltip';
import clsx from 'clsx';

export interface BarChartProps<T = DataPoint> {
  data: T[];
  xAccessor?: (d: T) => number | Date | string;
  yAccessor?: (d: T) => number;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  className?: string;
  showGrid?: boolean;
  showAxes?: boolean;
  showTooltip?: boolean;
  xTickFormat?: (val: any) => string;
  yTickFormat?: (val: number) => string;
  tooltipFormatter?: TooltipFormatter;
}

export function BarChart<T = DataPoint>({
  data,
  xAccessor,
  yAccessor,
  width = 500,
  height = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  showGrid = true,
  showAxes = true,
  showTooltip = true,
  xTickFormat,
  yTickFormat,
  tooltipFormatter,
}: BarChartProps<T>) {
  const {
    isOpen,
    activePoint,
    tooltipHtml,
    tooltipRef,
    containerRef,
    show,
    hide,
  } = useChartTooltip({
    enabled: showTooltip,
    formatter: tooltipFormatter,
    defaultColor: color,
  });

  const { bars, yScale } = useMemo(() => {
    return calculateBarLayout(
      data,
      { width, height, margin },
      { xAccessor: xAccessor as any, yAccessor: yAccessor as any }
    );
  }, [data, width, height, margin, xAccessor, yAccessor]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'chart-container nui-chart-container relative w-full select-none font-sans',
        className
      )}
      style={{ height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {showGrid &&
            yScale.ticks &&
            yScale.ticks(5).map((t: number) => {
              const y = yScale(t);
              const isZero = t === 0;
              return (
                <line
                  key={t}
                  x1={0}
                  y1={y}
                  x2={innerWidth}
                  y2={y}
                  stroke="var(--border-default)"
                  strokeOpacity={isZero ? 0.6 : 0.35}
                  strokeDasharray={isZero ? 'none' : '3,3'}
                  className="chart-grid"
                />
              );
            })}

          {showAxes &&
            yScale.ticks &&
            yScale.ticks(5).map((t: number) => (
              <text
                key={t}
                x={-10}
                y={yScale(t)}
                textAnchor="end"
                dominantBaseline="central"
                className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                fill="var(--fg-muted, currentColor)"
                opacity={0.75}
              >
                {yTickFormat ? yTickFormat(t) : formatMetricNumber(t)}
              </text>
            ))}

          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={4}
              fill={b.data.color || color}
              opacity={activePoint && activePoint !== b.data ? 0.6 : 1}
              className="chart-bar transition-all duration-150 cursor-pointer hover:opacity-85"
              onPointerEnter={(e) => {
                show(b.data, e.currentTarget);
              }}
              onPointerLeave={hide}
            />
          ))}

          {showAxes &&
            bars.map((b, i) => {
              const cx = b.x + b.width / 2;
              const label = xTickFormat
                ? xTickFormat(b.data.label)
                : b.data.label;
              return (
                <text
                  key={`cat-${i}`}
                  x={cx}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)"
                  opacity={0.75}
                >
                  {label}
                </text>
              );
            })}
        </g>
      </svg>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="chart-tooltip nui-chart-tooltip"
          role="tooltip"
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'opacity 0.15s ease',
          }}
          dangerouslySetInnerHTML={{ __html: tooltipHtml }}
        />
      )}
    </div>
  );
}
