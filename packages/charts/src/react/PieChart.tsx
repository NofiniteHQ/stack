import { useMemo, useState } from 'react';
import {
  calculatePieSegments,
  type DataPoint,
  type NormalizedDataPoint,
} from '../core/math';
import clsx from 'clsx';

export interface PieChartProps<T = DataPoint> {
  data: T[];
  width?: number;
  height?: number;
  donutCutout?: number;
  className?: string;
  labelAccessor?: (d: T) => string;
  valueAccessor?: (d: T) => number;
}

export function PieChart<T = DataPoint>({
  data,
  width = 300,
  height = 300,
  donutCutout = 0,
  className,
  labelAccessor,
  valueAccessor,
}: PieChartProps<T>) {
  const [activeSegment, setActiveSegment] =
    useState<NormalizedDataPoint | null>(null);

  const radius = Math.min(width, height) / 2 - 16;

  const segments = useMemo(() => {
    return calculatePieSegments(data, radius, donutCutout, {
      labelAccessor: labelAccessor as any,
      valueAccessor: valueAccessor as any,
    });
  }, [data, radius, donutCutout, labelAccessor, valueAccessor]);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      className={clsx(
        'chart-container nui-chart-container relative flex items-center justify-center select-none font-sans',
        className
      )}
      style={{ width: '100%', height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {segments.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={
                s.data.color ||
                `var(--chart-${(i % 8) + 1}, var(--color-primary))`
              }
              stroke="var(--bg-surface)"
              strokeWidth={2}
              opacity={activeSegment && activeSegment !== s.data ? 0.6 : 1}
              className="chart-segment transition-all duration-150 cursor-pointer hover:scale-105"
              onMouseEnter={() => setActiveSegment(s.data)}
              onMouseLeave={() => setActiveSegment(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function DonutChart<T = DataPoint>(
  props: Omit<PieChartProps<T>, 'donutCutout'> & { donutCutout?: number }
) {
  return <PieChart {...props} donutCutout={props.donutCutout ?? 0.6} />;
}
