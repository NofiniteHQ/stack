import { useMemo, useId, useState } from 'react';
import {
  calculateAreaPath,
  calculateMultiSeriesAreaPath,
  type DataPoint,
  defaultMargin,
  type ChartSeries,
  type ReferenceLine,
  type AreaMode,
} from '../core/math';
import { formatMetricNumber, formatTemporalTick } from '../core/axis';
import { generateA11yTableHtml } from '../core/a11y';
import { useChartTooltip } from './useChartTooltip';
import { useChartDimensions } from './useChartDimensions';
import { ChartLegend } from './ChartLegend';
import type { TooltipFormatter, TooltipPayload } from '../core/tooltip';
import clsx from 'clsx';

export interface AreaChartProps<T = DataPoint> {
  data?: T[];
  series?: ChartSeries<T>[];
  areaMode?: AreaMode;
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
  showCrosshair?: boolean;
  animate?: boolean;
  downsampleThreshold?: number;
  xTickFormat?: (val: any) => string;
  yTickFormat?: (val: number) => string;
  tooltipFormatter?: TooltipFormatter;
  onToggleSeries?: (seriesName: string) => void;
}

export function AreaChart<T = DataPoint>({
  data,
  series: propSeries,
  areaMode = 'overlapping',
  referenceLines,
  showLegend,
  xAccessor,
  yAccessor,
  width: propWidth,
  height: propHeight = 300,
  margin = defaultMargin,
  color = 'var(--chart-1, var(--color-primary))',
  className,
  ariaLabel,
  showGrid = true,
  showAxes = true,
  showTooltip = true,
  showCrosshair = true,
  animate = true,
  downsampleThreshold,
  xTickFormat,
  yTickFormat,
  tooltipFormatter,
  onToggleSeries,
}: AreaChartProps<T>) {
  const baseGradientId = useId();
  const [internalHidden, setInternalHidden] = useState<Record<string, boolean>>(
    {}
  );

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

  const isMulti = seriesList.length > 1;

  const multiResult = useMemo(() => {
    if (!isMulti) return null;
    return calculateMultiSeriesAreaPath(
      seriesList,
      { width, height, margin },
      xAccessor as any,
      yAccessor as any,
      areaMode,
      downsampleThreshold
    );
  }, [
    isMulti,
    seriesList,
    width,
    height,
    margin,
    xAccessor,
    yAccessor,
    areaMode,
    downsampleThreshold,
  ]);

  const singleResult = useMemo(() => {
    if (isMulti) return null;
    return calculateAreaPath(
      seriesList[0]?.data || [],
      { width, height, margin },
      xAccessor as any,
      yAccessor as any,
      downsampleThreshold
    );
  }, [
    isMulti,
    seriesList,
    width,
    height,
    margin,
    xAccessor,
    yAccessor,
    downsampleThreshold,
  ]);

  const xScale = isMulti ? multiResult?.xScale : singleResult?.xScale;
  const yScale = isMulti ? multiResult?.yScale : singleResult?.yScale;

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const effectiveYTickFormat =
    yTickFormat ||
    (areaMode === 'percent' ? (val: number) => `${val}%` : undefined);

  const [activeXPos, setActiveXPos] = useState<number | null>(null);
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);

  const activePointsList = useMemo(() => {
    if (isMulti && multiResult) {
      const activeSeries = multiResult.series.filter((s) => !s.hidden);
      return activeSeries[0]?.points || [];
    }
    return singleResult?.points || [];
  }, [isMulti, multiResult, singleResult]);

  const activatePointByIndex = (index: number) => {
    if (!activePointsList || activePointsList.length === 0) return;
    const pt = activePointsList[index];
    if (!pt) return;

    setActiveXPos(pt.x);
    const virtualRef = {
      getBoundingClientRect: () => {
        const cRect = containerRef.current?.getBoundingClientRect();
        if (!cRect) return new DOMRect(0, 0, 0, 0);
        const scaleX = cRect.width / width;
        const scaleY = cRect.height / height;
        const px = cRect.left + (margin.left + pt.x) * scaleX;
        const py = cRect.top + (margin.top + pt.y) * scaleY;
        return new DOMRect(px, py, 0, 0);
      },
    };

    if (tooltipFormatter) {
      show(pt.data, virtualRef);
    } else if (isMulti && multiResult) {
      const activeSeries = multiResult.series.filter((s) => !s.hidden);
      const multiPayload: TooltipPayload = {
        title:
          pt.data.label ||
          (pt.data.x instanceof Date
            ? pt.data.x.toLocaleDateString()
            : String(pt.data.x)),
        items: activeSeries.map((s) => {
          let sClosest = s.points[0];
          let sMin = Infinity;
          for (const sp of s.points) {
            const d = Math.abs(sp.x - pt.x);
            if (d < sMin) {
              sMin = d;
              sClosest = sp;
            }
          }
          return {
            color: s.color,
            label: s.name,
            value:
              typeof sClosest.data.y === 'number'
                ? formatMetricNumber(sClosest.data.y)
                : String(sClosest.data.y),
          };
        }),
      };
      show(pt.data, virtualRef, multiPayload);
    } else {
      const seriesName =
        seriesList[0]?.name && seriesList[0].name !== 'Series 1'
          ? seriesList[0].name
          : '';
      show(pt.data, virtualRef, {
        title:
          pt.data.label ||
          (pt.data.x instanceof Date
            ? pt.data.x.toLocaleDateString()
            : String(pt.data.x)),
        items: [
          {
            color,
            label: seriesName,
            value: formatMetricNumber(pt.data.y),
          },
        ],
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!showTooltip && !showCrosshair) return;
    if (activePointsList.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = (e.clientX - rect.left) * (innerWidth / rect.width);

    let closestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < activePointsList.length; i++) {
      const dist = Math.abs(activePointsList[i].x - localX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    setKeyboardIndex(closestIdx);
    activatePointByIndex(closestIdx);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activePointsList.length === 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx =
        keyboardIndex === null
          ? 0
          : Math.min(activePointsList.length - 1, keyboardIndex + 1);
      setKeyboardIndex(nextIdx);
      activatePointByIndex(nextIdx);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx =
        keyboardIndex === null
          ? activePointsList.length - 1
          : Math.max(0, keyboardIndex - 1);
      setKeyboardIndex(prevIdx);
      activatePointByIndex(prevIdx);
    } else if (e.key === 'Escape') {
      setActiveXPos(null);
      setKeyboardIndex(null);
      hide();
    }
  };

  const handlePointerLeave = () => {
    setActiveXPos(null);
    hide();
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
      aria-label={ariaLabel || 'Area chart data visualization'}
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
        <defs>
          {isMulti && multiResult ? (
            multiResult.series.map((s, idx) => (
              <linearGradient
                key={s.id}
                id={`${baseGradientId}-${idx}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))
          ) : (
            <linearGradient id={baseGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {showGrid &&
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
            xScale &&
            typeof xScale.ticks === 'function' &&
            !(isMulti
              ? multiResult?.isCategorical
              : singleResult?.isCategorical) &&
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

          {showAxes &&
            (isMulti
              ? multiResult?.isCategorical
              : singleResult?.isCategorical) &&
            (isMulti ? multiResult?.categories : singleResult?.categories)?.map(
              (cat, i) => (
                <text
                  key={i}
                  x={cat.x}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  className="chart-axes text-[11px] fill-muted font-sans select-none pointer-events-none"
                  fill="var(--fg-muted, currentColor)"
                  opacity={0.75}
                >
                  {xTickFormat ? xTickFormat(cat.label) : cat.label}
                </text>
              )
            )}

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

          {isMulti && multiResult
            ? multiResult.series.map((s, idx) => {
                if (s.hidden) return null;
                return (
                  <g key={s.id} className="chart-series">
                    {s.areaPath && (
                      <path
                        d={s.areaPath}
                        fill={`url(#${baseGradientId}-${idx})`}
                        className={clsx(
                          'chart-area transition-all duration-300',
                          animate && 'chart-animate-fade'
                        )}
                      />
                    )}
                    {s.linePath && (
                      <path
                        d={s.linePath}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={clsx(
                          'chart-line transition-all duration-300',
                          animate && 'chart-animate-line'
                        )}
                      />
                    )}
                    {s.points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={activePoint === p.data ? 5.5 : 3.5}
                        fill={s.color}
                        stroke="var(--bg-surface)"
                        strokeWidth={2}
                        className={clsx(
                          'chart-point transition-all duration-150 cursor-pointer',
                          animate && 'chart-animate-fade'
                        )}
                      />
                    ))}
                  </g>
                );
              })
            : singleResult && (
                <>
                  {singleResult.areaPath && (
                    <path
                      d={singleResult.areaPath}
                      fill={`url(#${baseGradientId})`}
                      className={clsx(
                        'chart-area transition-all duration-300',
                        animate && 'chart-animate-fade'
                      )}
                    />
                  )}
                  {singleResult.linePath && (
                    <path
                      d={singleResult.linePath}
                      fill="none"
                      stroke={color}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={clsx(
                        'chart-line transition-all duration-300',
                        animate && 'chart-animate-line'
                      )}
                    />
                  )}
                  {singleResult.points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={activePoint === p.data ? 5.5 : 3.5}
                      fill={color}
                      stroke="var(--bg-surface)"
                      strokeWidth={2}
                      className={clsx(
                        'chart-point transition-all duration-150 cursor-pointer',
                        animate && 'chart-animate-fade'
                      )}
                    />
                  ))}
                </>
              )}

          {showCrosshair && activeXPos !== null && (
            <line
              x1={activeXPos}
              y1={0}
              x2={activeXPos}
              y2={innerHeight}
              className="chart-crosshair pointer-events-none"
              stroke="var(--border-strong, var(--border-default))"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.7}
            />
          )}

          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            style={{ cursor: 'crosshair', touchAction: 'none' }}
            pointerEvents="all"
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          />
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
            title: ariaLabel || 'Area chart data table',
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
