import { useMemo, useState } from 'react';
import {
  defaultMargin,
  calculateMultiScatterLayout,
  type ChartSeries,
  type MultiScatterPoint,
  type DataPoint,
} from '../core/math';
import { formatMetricNumber, formatTemporalTick } from '../core/axis';
import { generateA11yTableHtml } from '../core/a11y';
import { useChartTooltip } from './useChartTooltip';
import { useChartDimensions } from './useChartDimensions';
import { ChartLegend } from './ChartLegend';
import type { TooltipFormatter } from '../core/tooltip';
import clsx from 'clsx';

export interface ScatterChartProps<T = DataPoint> {
  data?: T[];
  series?: ChartSeries<T>[];
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
  showLegend?: boolean;
  animate?: boolean;
  xLabel?: string;
  yLabel?: string;
  downsampleThreshold?: number;
  xTickFormat?: (val: number | Date | string) => string;
  yTickFormat?: (val: number) => string;
  tooltipFormatter?: TooltipFormatter;
  onToggleSeries?: (seriesName: string) => void;
}

export function ScatterChart<T = DataPoint>({
  data,
  series: propSeries,
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
  showLegend = false,
  animate = true,
  xLabel,
  yLabel,
  downsampleThreshold,
  xTickFormat,
  yTickFormat,
  tooltipFormatter,
  onToggleSeries,
}: ScatterChartProps<T>) {
  const [internalHidden, setInternalHidden] = useState<Record<string, boolean>>(
    {}
  );
  const [focusedPoint, setFocusedPoint] = useState<MultiScatterPoint | null>(
    null
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

  const isMulti = seriesList.length > 1;

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

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const { xScale, yScale, points } = useMemo(() => {
    return calculateMultiScatterLayout(
      seriesList,
      { width, height, margin },
      { xAccessor, yAccessor },
      downsampleThreshold
    );
  }, [
    seriesList,
    width,
    height,
    margin,
    xAccessor,
    yAccessor,
    downsampleThreshold,
  ]);

  const activatePoint = (pt: MultiScatterPoint) => {
    setFocusedPoint(pt);
    const d = pt.data;
    const rawObj =
      d.raw && typeof d.raw === 'object'
        ? (d.raw as Record<string, unknown>)
        : null;
    const hasExplicitLabel = Boolean(
      (rawObj && (rawObj.label || rawObj.name || rawObj.title)) ||
        (d.label &&
          d.label !== String(d.x) &&
          d.label !== formatMetricNumber(typeof d.x === 'number' ? d.x : 0))
    );
    const baseTitle = hasExplicitLabel
      ? d.label
      : `(${formatMetricNumber(
          typeof d.x === 'number' ? d.x : 0
        )}, ${formatMetricNumber(d.y)})`;
    const title =
      isMulti && pt.seriesName !== 'Series 1'
        ? `${pt.seriesName}: ${baseTitle}`
        : baseTitle;

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
      show(d, virtualRef);
    } else {
      show(d, virtualRef, {
        title,
        items: [
          {
            color: pt.color,
            label: xLabel || 'X',
            value: formatMetricNumber(typeof d.x === 'number' ? d.x : 0),
          },
          {
            color: 'transparent',
            label: yLabel || 'Y',
            value: formatMetricNumber(d.y),
          },
        ],
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = (e.clientX - rect.left) * (innerWidth / rect.width);
    const localY = (e.clientY - rect.top) * (innerHeight / rect.height);

    let closest: MultiScatterPoint | null = null;
    let minDistance = Infinity;

    for (const pt of points) {
      const dx = pt.x - localX;
      const dy = pt.y - localY;
      const dist = Math.hypot(dx, dy);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pt;
      }
    }

    // 2D Proximity Snap threshold (45px radius)
    if (closest && minDistance <= 45) {
      const idx = points.indexOf(closest);
      if (idx !== -1) setKeyboardIndex(idx);
      activatePoint(closest);
    } else {
      setFocusedPoint(null);
      hide();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (points.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx =
        keyboardIndex === null
          ? 0
          : Math.min(points.length - 1, keyboardIndex + 1);
      setKeyboardIndex(nextIdx);
      activatePoint(points[nextIdx]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx =
        keyboardIndex === null
          ? points.length - 1
          : Math.max(0, keyboardIndex - 1);
      setKeyboardIndex(prevIdx);
      activatePoint(points[prevIdx]);
    } else if (e.key === 'Escape') {
      setFocusedPoint(null);
      setKeyboardIndex(null);
      hide();
    }
  };

  const handlePointerLeave = () => {
    setFocusedPoint(null);
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
      aria-label={ariaLabel || 'Scatter plot data visualization'}
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
              .map((t: number | Date, i: number) => {
                const x = xScale(t);
                if (x === undefined || x < -5 || x > innerWidth + 5)
                  return null;
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

          {showCrosshair && focusedPoint && (
            <g className="chart-crosshair-group pointer-events-none">
              <line
                x1={focusedPoint.x}
                y1={0}
                x2={focusedPoint.x}
                y2={innerHeight}
                className="chart-crosshair chart-crosshair-x"
                stroke="var(--border-strong, var(--border-default))"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.65}
              />
              <line
                x1={0}
                y1={focusedPoint.y}
                x2={innerWidth}
                y2={focusedPoint.y}
                className="chart-crosshair chart-crosshair-y"
                stroke="var(--border-strong, var(--border-default))"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.65}
              />
            </g>
          )}

          {points.map((pt, i) => {
            const isPointActive =
              focusedPoint === pt || activePoint === pt.data;
            return (
              <g key={i} className="chart-scatter-point-group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPointActive ? 6.5 : 4}
                  fill={pt.color}
                  stroke="var(--bg-surface)"
                  strokeWidth={2}
                  className={clsx(
                    'chart-point pointer-events-none transition-all duration-150',
                    animate && 'chart-animate-fade'
                  )}
                  opacity={focusedPoint && !isPointActive ? 0.45 : 1}
                />
              </g>
            );
          })}

          <rect
            className="chart-scrub-overlay chart-scatter-overlay"
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

      {showLegend && isMulti && (
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
          __html: generateA11yTableHtml(seriesList, {
            title: ariaLabel || 'Scatter plot data table',
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

export { Sparkline, type SparklineProps } from './Sparkline';
