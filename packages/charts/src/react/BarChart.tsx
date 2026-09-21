import { useMemo, useState } from 'react';
import {
  calculateBarLayout,
  type DataPoint,
  defaultMargin,
} from '../core/math';
import clsx from 'clsx';

export interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  className?: string;
  showGrid?: boolean;
}

export function BarChart({
  data,
  width = 500,
  height = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  showGrid = true,
}: BarChartProps) {
  const [activeBar, setActiveBar] = useState<DataPoint | null>(null);

  const { bars, yScale } = useMemo(() => {
    return calculateBarLayout(data, { width, height, margin });
  }, [data, width, height, margin]);

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
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setActiveBar(b.data)}
              onMouseLeave={() => setActiveBar(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
