import { useMemo } from 'react';
import { calculateAreaPath, type DataPoint, defaultMargin } from '../core/math';
import { formatMetricNumber, formatTemporalTick } from '../core/axis';
import { useChartTooltip } from './useChartTooltip';
import type { TooltipFormatter } from '../core/tooltip';
import clsx from 'clsx';

export interface LineChartProps<T = DataPoint> {
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
  showCrosshair?: boolean;
  xTickFormat?: (val: any) => string;
  yTickFormat?: (val: number) => string;
  tooltipFormatter?: TooltipFormatter;
}

export function LineChart<T = DataPoint>({
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
  showCrosshair = true,
  xTickFormat,
  yTickFormat,
  tooltipFormatter,
}: LineChartProps<T>) {
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

  const { linePath, xScale, yScale, points } = useMemo(() => {
    return calculateAreaPath(
      data,
      { width, height, margin },
      xAccessor as any,
      yAccessor as any
    );
  }, [data, width, height, margin, xAccessor, yAccessor]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const activePointCoord = useMemo(() => {
    if (!activePoint) return null;
    return points.find((p) => p.data === activePoint) || null;
  }, [activePoint, points]);

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!points || points.length === 0 || (!showTooltip && !showCrosshair))
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = (e.clientX - rect.left) * (innerWidth / rect.width);

    let closest = points[0];
    let minDistance = Infinity;
    for (const p of points) {
      const dist = Math.abs(p.x - localX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = p;
      }
    }

    if (closest) {
      const virtualRef = {
        getBoundingClientRect: () => {
          const cRect = containerRef.current?.getBoundingClientRect() || rect;
          const scaleX = cRect.width / width;
          const scaleY = cRect.height / height;
          const px = cRect.left + (margin.left + closest.x) * scaleX;
          const py = cRect.top + (margin.top + closest.y) * scaleY;
          return new DOMRect(px, py, 0, 0);
        },
      };
      show(closest.data, virtualRef);
    }
  };

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
            />
          ))}

          {showCrosshair && activePointCoord && (
            <line
              x1={activePointCoord.x}
              y1={0}
              x2={activePointCoord.x}
              y2={innerHeight}
              className="chart-crosshair pointer-events-none"
              stroke="var(--border-strong, var(--border-default))"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.7}
            />
          )}

          {activePointCoord && (
            <circle
              cx={activePointCoord.x}
              cy={activePointCoord.y}
              r={6}
              fill={color}
              stroke="var(--bg-surface)"
              strokeWidth={2.5}
              className="chart-point pointer-events-none transition-all duration-75"
            />
          )}

          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            pointerEvents="all"
            onPointerMove={handlePointerMove}
            onPointerLeave={hide}
          />
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
