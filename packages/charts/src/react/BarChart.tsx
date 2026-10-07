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
import { generateA11yTableHtml } from '../core/a11y';
import { useChartTooltip } from './useChartTooltip';
import { useChartDimensions } from './useChartDimensions';
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
  ariaLabel?: string;
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
  width: propWidth,
  height: propHeight = 300,
  margin: propMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  ariaLabel,
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
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);

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

  const { width, height } = useChartDimensions(containerRef, {
    width: propWidth,
    height: propHeight,
    defaultWidth: 500,
    defaultHeight: 300,
  });

  const {
    bars,
    xScale,
    yScale,
    categories,
    margin: layoutMargin,
  } = useMemo(() => {
    return calculateMultiBarLayout(
      seriesList,
      { width, height, margin: propMargin },
      barLayout,
      { xAccessor: xAccessor as any, yAccessor: yAccessor as any }
    );
  }, [seriesList, width, height, propMargin, barLayout, xAccessor, yAccessor]);

  const margin = layoutMargin || propMargin || defaultMargin;
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const isHorizontal = barLayout === 'horizontal';

  const effectiveYTickFormat =
    yTickFormat ||
    (!isHorizontal && barLayout === 'percent'
      ? (val: number) => `${val}%`
      : undefined);

  const effectiveXTickFormat = xTickFormat;

  const activateBarByIndex = (index: number) => {
    if (!bars || bars.length === 0) return;
    const b = bars[index];
    if (!b) return;

    const isMulti = seriesList.length > 1;
    const virtualRef = {
      getBoundingClientRect: () => {
        const cRect = containerRef.current?.getBoundingClientRect();
        if (!cRect) return new DOMRect(0, 0, 0, 0);
        const scaleX = cRect.width / width;
        const scaleY = cRect.height / height;
        const px = cRect.left + (margin.left + b.x + b.width / 2) * scaleX;
        const py = cRect.top + (margin.top + b.y + b.height / 2) * scaleY;
        return new DOMRect(px, py, 0, 0);
      },
    };

    if (tooltipFormatter) {
      show(b.data, virtualRef);
    } else {
      show(b.data, virtualRef, {
        title: b.data.label,
        items: [
          {
            color: b.color,
            label: isMulti ? b.seriesName : '',
            value:
              barLayout === 'percent'
                ? `${formatMetricNumber(b.data.y)}%`
                : formatMetricNumber(b.data.y),
          },
        ],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (bars.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx =
        keyboardIndex === null
          ? 0
          : Math.min(bars.length - 1, keyboardIndex + 1);
      setKeyboardIndex(nextIdx);
      activateBarByIndex(nextIdx);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx =
        keyboardIndex === null
          ? bars.length - 1
          : Math.max(0, keyboardIndex - 1);
      setKeyboardIndex(prevIdx);
      activateBarByIndex(prevIdx);
    } else if (e.key === 'Escape') {
      setKeyboardIndex(null);
      hide();
    }
  };

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
      role="region"
      aria-label={ariaLabel || 'Bar chart data visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={clsx(
        'chart-container nui-chart-container relative w-full select-none font-sans focus:outline-none focus-visible:ring-1 focus-visible:ring-primary',
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

          {showGrid &&
            isHorizontal &&
            xScale?.ticks &&
            xScale.ticks(5).map((t: number) => {
              const x = xScale(t);
              const isZero = t === 0;
              return (
                <line
                  key={t}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={innerHeight}
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
                {effectiveYTickFormat
                  ? effectiveYTickFormat(t)
                  : formatMetricNumber(t)}
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
                {effectiveXTickFormat
                  ? effectiveXTickFormat(t)
                  : formatMetricNumber(t)}
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
                if (tooltipFormatter) {
                  show(b.data, e.currentTarget);
                } else {
                  const isMulti = seriesList.length > 1;
                  show(b.data, e.currentTarget, {
                    title: b.data.label,
                    items: [
                      {
                        color: b.color,
                        label: isMulti ? b.seriesName : '',
                        value: formatMetricNumber(b.data.y),
                      },
                    ],
                  });
                }
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

      <div
        className="sr-only chart-a11y-container"
        dangerouslySetInnerHTML={{
          __html: generateA11yTableHtml(seriesList as any, {
            title: ariaLabel || 'Bar chart data table',
          }),
        }}
      />

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
