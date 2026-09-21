import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { defaultMargin } from '../core/math';
import clsx from 'clsx';

export interface ScatterChartProps {
  data: { x: number; y: number; label?: string; color?: string }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  className?: string;
}

export function ScatterChart({
  data,
  width = 500,
  height = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
}: ScatterChartProps) {
  const [activePoint, setActivePoint] = useState<any | null>(null);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const { xScale, yScale } = useMemo(() => {
    const xExt = extent(data, (d) => d.x) as [number, number];
    const yExt = extent(data, (d) => d.y) as [number, number];

    const xScale = scaleLinear()
      .domain([xExt[0] || 0, xExt[1] || 100])
      .range([0, innerWidth]);
    const yScale = scaleLinear()
      .domain([yExt[0] || 0, yExt[1] || 100])
      .range([innerHeight, 0]);

    return { xScale, yScale };
  }, [data, innerWidth, innerHeight]);

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
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={activePoint === d ? 6 : 4}
              fill={d.color || color}
              stroke="var(--bg-surface)"
              strokeWidth={2}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setActivePoint(d)}
              onMouseLeave={() => setActivePoint(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = 'var(--color-primary)',
  className,
}: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      className={clsx('inline-flex items-center select-none', className)}
      style={{ width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}
