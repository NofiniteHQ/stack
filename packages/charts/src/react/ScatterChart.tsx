import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  defaultMargin,
  normalizeData,
  type NormalizedDataPoint,
} from '../core/math';
import { formatMetricNumber, formatTemporalTick } from '../core/axis';
import clsx from 'clsx';

export interface ScatterChartProps<T = any> {
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
  xTickFormat?: (val: any) => string;
  yTickFormat?: (val: number) => string;
}

export function ScatterChart<T = any>({
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
  xTickFormat,
  yTickFormat,
}: ScatterChartProps<T>) {
  const [activePoint, setActivePoint] = useState<NormalizedDataPoint | null>(
    null
  );

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const { normalized, xScale, yScale } = useMemo(() => {
    const items = normalizeData(data, {
      xAccessor: xAccessor as any,
      yAccessor: yAccessor as any,
    });
    const xs = items.map((d) => (typeof d.x === 'number' ? d.x : 0));
    const ys = items.map((d) => d.y);
    const minX = Math.min(0, ...xs);
    const maxX = Math.max(10, ...xs) || 100;
    const minY = Math.min(0, ...ys);
    const maxY = Math.max(10, ...ys) || 100;

    const xScale = scaleLinear()
      .domain([minX, maxX * 1.05])
      .range([0, innerWidth]);
    const yScale = scaleLinear()
      .domain([minY, maxY * 1.05])
      .range([innerHeight, 0]);

    return { normalized: items, xScale, yScale };
  }, [data, innerWidth, innerHeight, xAccessor, yAccessor]);

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

          {showAxes &&
            xScale &&
            typeof xScale.ticks === 'function' &&
            xScale
              .ticks(Math.min(5, innerWidth > 450 ? 6 : 3))
              .map((t: any, i: number) => {
                const x = xScale(t);
                if (x < -5 || x > innerWidth + 5) return null;
                return (
                  <text
                    key={i}
                    x={x}
                    y={innerHeight + 18}
                    textAnchor="middle"
                    className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                    fill="var(--fg-muted, currentColor)"
                    opacity={0.75}
                  >
                    {xTickFormat ? xTickFormat(t) : formatTemporalTick(t)}
                  </text>
                );
              })}

          {normalized.map((d, i) => (
            <circle
              key={i}
              cx={xScale(typeof d.x === 'number' ? d.x : 0)}
              cy={yScale(d.y)}
              r={activePoint === d ? 6 : 4}
              fill={d.color || color}
              stroke="var(--bg-surface)"
              strokeWidth={2}
              className="chart-point transition-all duration-150 cursor-pointer hover:scale-125"
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
  if (!data || data.length === 0) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / Math.max(1, data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      className={clsx(
        'sparkline inline-flex items-center select-none',
        className
      )}
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
