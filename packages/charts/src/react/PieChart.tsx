import { useMemo } from 'react';
import { calculatePieSegments, type DataPoint } from '../core/math';
import { useChartTooltip } from './useChartTooltip';
import { useChartDimensions } from './useChartDimensions';
import type { TooltipFormatter } from '../core/tooltip';
import clsx from 'clsx';

export interface PieChartProps<T = DataPoint> {
  data: T[];
  width?: number;
  height?: number;
  donutCutout?: number;
  className?: string;
  showTooltip?: boolean;
  tooltipFormatter?: TooltipFormatter;
  labelAccessor?: (d: T) => string;
  valueAccessor?: (d: T) => number;
}

export function PieChart<T = DataPoint>({
  data,
  width: propWidth,
  height: propHeight = 300,
  donutCutout = 0,
  className,
  showTooltip = true,
  tooltipFormatter,
  labelAccessor,
  valueAccessor,
}: PieChartProps<T>) {
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
  });

  const { width, height } = useChartDimensions(containerRef, {
    width: propWidth,
    height: propHeight,
    defaultWidth: 300,
    defaultHeight: 300,
  });

  const size = Math.min(width, height);
  const radius = Math.max(10, size / 2 - 16);

  const segments = useMemo(() => {
    return calculatePieSegments(data, radius, donutCutout, {
      labelAccessor: labelAccessor as any,
      valueAccessor: valueAccessor as any,
    });
  }, [data, radius, donutCutout, labelAccessor, valueAccessor]);

  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div
      ref={containerRef}
      className={clsx(
        'chart-container chart-container-circular nui-chart-container relative flex items-center justify-center select-none font-sans',
        className
      )}
      style={{ width: '100%', height }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
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
              opacity={activePoint && activePoint !== s.data ? 0.6 : 1}
              className="chart-segment transition-all duration-150 cursor-pointer hover:scale-105"
              onPointerEnter={(e) => {
                show(s.data, e.currentTarget);
              }}
              onPointerLeave={hide}
            />
          ))}
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

export function DonutChart<T = DataPoint>(
  props: Omit<PieChartProps<T>, 'donutCutout'> & { donutCutout?: number }
) {
  return <PieChart {...props} donutCutout={props.donutCutout ?? 0.6} />;
}
