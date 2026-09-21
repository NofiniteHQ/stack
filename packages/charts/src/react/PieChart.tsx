import { useMemo, useState } from 'react';
import { calculatePieSegments, type DataPoint } from '../core/math';
import clsx from 'clsx';

export interface PieChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  donutCutout?: number;
  className?: string;
}

export function PieChart({
  data,
  width = 300,
  height = 300,
  donutCutout = 0,
  className,
}: PieChartProps) {
  const [activeSegment, setActiveSegment] = useState<DataPoint | null>(null);

  const radius = Math.min(width, height) / 2 - 20;

  const segments = useMemo(() => {
    return calculatePieSegments(data, radius, donutCutout);
  }, [data, radius, donutCutout]);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center select-none font-sans',
        className
      )}
      style={{ width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {segments.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={
                s.data.color ||
                `var(--chart-${(i % 5) + 1}, var(--color-primary))`
              }
              stroke="var(--bg-surface)"
              strokeWidth={2}
              opacity={activeSegment && activeSegment !== s.data ? 0.6 : 1}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setActiveSegment(s.data)}
              onMouseLeave={() => setActiveSegment(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function DonutChart(
  props: Omit<PieChartProps, 'donutCutout'> & { donutCutout?: number }
) {
  return <PieChart {...props} donutCutout={props.donutCutout ?? 0.6} />;
}
