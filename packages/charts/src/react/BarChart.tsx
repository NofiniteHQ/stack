import { useMemo, useState } from 'react';
import {
  calculateMultiBarLayout,
  type DataPoint,
  defaultMargin,
  type ChartSeries,
  type BarLayoutMode,
  type ReferenceLine,
} from '../core/math';
import { formatMetricNumber } from '../core/axis';
import { useChartTooltip } from './useChartTooltip';
import { ChartLegend } from './ChartLegend';
import type { TooltipFormatter } from '../core/tooltip';
import clsx from 'clsx';

export interface BarChartProps<T = DataPoint> {
  data?: T[];
  series?: ChartSeries<T>[];
  barLayout?: BarLayoutMode;
  referenceLines?: ReferenceLine[];
  showLegend?: boolean;
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
  onToggleSeries?: (seriesName: string) => void;
}

export function BarChart<T = DataPoint>({
  data,
  series: propSeries,
  barLayout = 'grouped',
  referenceLines,
  showLegend,
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
  onToggleSeries,
}: BarChartProps<T>) {
  const [internalHidden, setInternalHidden] = useState<Record<string, boolean>>(
    {}
  );

  const seriesList: ChartSeries<T>[] = useMemo(() => {
    if (propSeries && propSeries.length > 0) {
      return propSeries.map((s) => ({
        ...s,
        hidden:
          internalHidden[s.name] !== undefined
            ? internalHidden[s.name]
            : s.hidden,
      }));
    }
    return [
      {
        name: 'Series 1',
        data: data || [],
        color,
      },
    ];
  }, [propSeries, data, color, internalHidden]);

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

  const { bars, xScale, yScale, categories } = useMemo(() => {
    return calculateMultiBarLayout(
      seriesList,
      { width, height, margin },
      barLayout,
      { xAccessor: xAccessor as any, yAccessor: yAccessor as any }
    );
  }, [seriesList, width, height, margin, barLayout, xAccessor, yAccessor]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const isHorizontal = barLayout === 'horizontal';

  const handleToggle = (seriesName: string) => {
    if (onToggleSeries) {
      onToggleSeries(seriesName);
    } else {
      setInternalHidden((prev) => ({
        ...prev,
        [seriesName]: !prev[seriesName],
      }));
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
            !isHorizontal &&
            yScale?.ticks &&
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
            !isHorizontal &&
            yScale?.ticks &&
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
            isHorizontal &&
            xScale?.ticks &&
            xScale.ticks(5).map((t: number) => (
              <text
                key={t}
                x={xScale(t)}
                y={innerHeight + 18}
                textAnchor="middle"
                className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                fill="var(--fg-muted, currentColor)"
                opacity={0.75}
              >
                {xTickFormat ? xTickFormat(t) : formatMetricNumber(t)}
              </text>
            ))}

          {referenceLines &&
            referenceLines.map((ref, idx) => {
              if (ref.y === undefined || typeof yScale !== 'function')
                return null;
              const yPos = yScale(ref.y);
              if (isNaN(yPos)) return null;
              const strokeColor = ref.color || 'var(--color-danger, #ef4444)';
              return (
                <g key={`ref-${idx}`} className="chart-reference-group">
                  <line
                    x1={0}
                    y1={yPos}
                    x2={innerWidth}
                    y2={yPos}
                    stroke={strokeColor}
                    strokeWidth={1.5}
                    strokeDasharray={ref.strokeDasharray || '4,4'}
                    className="chart-reference-line"
                  />
                  {ref.label && (
                    <text
                      x={innerWidth - 6}
                      y={yPos - 6}
                      textAnchor="end"
                      className="chart-reference-label text-[10px] font-medium font-sans select-none pointer-events-none"
                      fill={strokeColor}
                    >
                      {ref.label}
                    </text>
                  )}
                </g>
              );
            })}

          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={3}
              fill={b.color}
              opacity={activePoint && activePoint !== b.data ? 0.6 : 1}
              className="chart-bar transition-all duration-150 cursor-pointer hover:opacity-85"
              onPointerEnter={(e) => {
                show(b.data, e.currentTarget);
              }}
              onPointerLeave={hide}
            />
          ))}

          {showAxes &&
            !isHorizontal &&
            categories.map((cat, i) => {
              const cx = cat.x + cat.width / 2;
              const label = xTickFormat ? xTickFormat(cat.label) : cat.label;
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

          {showAxes &&
            isHorizontal &&
            categories.map((cat, i) => {
              const catY = yScale(cat.label) ?? 0;
              const cy = catY + yScale.bandwidth() / 2;
              return (
                <text
                  key={`cat-h-${i}`}
                  x={-10}
                  y={cy}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)"
                  opacity={0.75}
                >
                  {cat.label}
                </text>
              );
            })}
        </g>
      </svg>

      {showLegend && (
        <ChartLegend
          series={seriesList.map((s, idx) => ({
            name: s.name,
            color:
              s.color || `var(--chart-${(idx % 8) + 1}, var(--color-primary))`,
            hidden: s.hidden,
          }))}
          onToggle={handleToggle}
        />
      )}

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
