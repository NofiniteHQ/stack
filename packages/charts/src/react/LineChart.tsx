import { useMemo, useState } from 'react';
import { calculateAreaPath, type DataPoint, defaultMargin } from '../core/math';
import clsx from 'clsx';

export interface LineChartProps<T = DataPoint> {
  data: T[];
  xAccessor?: (d: T) => number | Date;
  yAccessor?: (d: T) => number;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  className?: string;
  showGrid?: boolean;
}

export function LineChart<T = DataPoint>({
  data,
  xAccessor = (d: any) => (d.date ? new Date(d.date) : 0),
  yAccessor = (d: any) => d.value ?? 0,
  width = 500,
  height = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  showGrid = true,
}: LineChartProps<T>) {
  const [activePoint, setActivePoint] = useState<T | null>(null);

  const { linePath, yScale } = useMemo(() => {
    return calculateAreaPath(
      data as any,
      { width, height, margin },
      xAccessor as any,
      yAccessor as any
    );
  }, [data, width, height, margin, xAccessor, yAccessor]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);

  return (
    <div
      className={clsx('relative w-full select-none font-sans', className)}
      style={{ height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
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
                  strokeOpacity={0.6}
                  strokeDasharray="3,3"
                />
              ))}

          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((d: any, i: number) => {
            const x = (i / Math.max(1, data.length - 1)) * innerWidth;
            const y = yScale(yAccessor(d));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={activePoint === d ? 5 : 3.5}
                fill={color}
                stroke="var(--bg-surface)"
                strokeWidth={2}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setActivePoint(d)}
                onMouseLeave={() => setActivePoint(null)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
