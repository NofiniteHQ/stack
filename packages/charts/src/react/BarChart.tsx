import { useMemo, useState } from 'react';
import {
  calculateBarLayout,
  type DataPoint,
  defaultMargin,
  type NormalizedDataPoint,
} from '../core/math';
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
}: BarChartProps<T>) {
  const [activeBar, setActiveBar] = useState<NormalizedDataPoint | null>(null);

  const { bars, yScale } = useMemo(() => {
    return calculateBarLayout(
      data,
      { width, height, margin },
      { xAccessor: xAccessor as any, yAccessor: yAccessor as any }
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

          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={4}
              fill={b.data.color || color}
              opacity={activeBar && activeBar !== b.data ? 0.6 : 1}
              className="chart-bar transition-all duration-150 cursor-pointer hover:opacity-85"
              onMouseEnter={() => setActiveBar(b.data)}
              onMouseLeave={() => setActiveBar(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
