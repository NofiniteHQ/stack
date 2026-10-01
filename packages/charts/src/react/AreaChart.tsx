import { useMemo, useState, useId } from 'react';
import {
  calculateAreaPath,
  type DataPoint,
  defaultMargin,
  type NormalizedDataPoint,
} from '../core/math';
import clsx from 'clsx';

export interface AreaChartProps<T = DataPoint> {
  data: T[];
  xAccessor?: (d: T) => number | Date | string;
  yAccessor?: (d: T) => number;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  className?: string;
  showGrid?: boolean;
}

export function AreaChart<T = DataPoint>({
  data,
  xAccessor,
  yAccessor,
  width = 500,
  height = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  showGrid = true,
}: AreaChartProps<T>) {
  const gradientId = useId();
  const [activePoint, setActivePoint] = useState<NormalizedDataPoint | null>(
    null
  );

  const { areaPath, linePath, yScale, points } = useMemo(() => {
    return calculateAreaPath(
      data,
      { width, height, margin },
      xAccessor as any,
      yAccessor as any
    );
  }, [data, width, height, margin, xAccessor, yAccessor]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);

  return (
    <div
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
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {showGrid &&
            yScale.ticks &&
            yScale
              .ticks(5)
              .map((t: number) => (
                <line
                  key={t}
                  x1={0}
                  y1={yScale(t)}
                  x2={innerWidth}
                  y2={yScale(t)}
                  stroke="var(--border-default)"
                  strokeOpacity={0.5}
                  strokeDasharray="3,3"
                  className="chart-grid"
                />
              ))}

          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={activePoint === p.data ? 5.5 : 3.5}
              fill={color}
              stroke="var(--bg-surface)"
              strokeWidth={2}
              className="chart-point transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setActivePoint(p.data)}
              onMouseLeave={() => setActivePoint(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
