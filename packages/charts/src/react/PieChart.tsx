import { useState, useMemo } from 'react';
import { calculatePieSegments, type DataPoint } from '../core/math';
import { formatMetricNumber } from '../core/axis';
import { generateA11yTableHtml } from '../core/a11y';
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
  ariaLabel?: string;
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
  ariaLabel,
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
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.max(10, size / 2 - 16);

  const segments = useMemo(() => {
    return calculatePieSegments(data, radius, donutCutout, {
      labelAccessor: labelAccessor as any,
      valueAccessor: valueAccessor as any,
    });
  }, [data, radius, donutCutout, labelAccessor, valueAccessor]);

  const totalSum = useMemo(() => {
    return segments.reduce(
      (sum, s) => sum + (typeof s.data.y === 'number' ? s.data.y : 0),
      0
    );
  }, [segments]);

  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);

  const activateSegmentByIndex = (index: number) => {
    if (!segments || segments.length === 0) return;
    const s = segments[index];
    if (!s) return;

    const val = typeof s.data.y === 'number' ? s.data.y : 0;
    const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : '0';
    const sliceColor =
      s.data.color || `var(--chart-${(index % 8) + 1}, var(--color-primary))`;

    const virtualRef = {
      getBoundingClientRect: () => {
        const cRect = containerRef.current?.getBoundingClientRect();
        if (!cRect) return new DOMRect(0, 0, 0, 0);
        const scale = Math.min(cRect.width, cRect.height) / size;
        const px = cRect.left + (centerX + s.centroid[0]) * scale;
        const py = cRect.top + (centerY + s.centroid[1]) * scale;
        return new DOMRect(px, py, 0, 0);
      },
    };

    if (tooltipFormatter) {
      show(s.data, virtualRef);
    } else {
      show(s.data, virtualRef, {
        title: s.data.label || `Segment ${index + 1}`,
        items: [
          {
            color: sliceColor,
            label: '',
            value: `${formatMetricNumber(val)} (${pct}%)`,
          },
        ],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (segments.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx =
        keyboardIndex === null
          ? 0
          : Math.min(segments.length - 1, keyboardIndex + 1);
      setKeyboardIndex(nextIdx);
      activateSegmentByIndex(nextIdx);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx =
        keyboardIndex === null
          ? segments.length - 1
          : Math.max(0, keyboardIndex - 1);
      setKeyboardIndex(prevIdx);
      activateSegmentByIndex(prevIdx);
    } else if (e.key === 'Escape') {
      setKeyboardIndex(null);
      hide();
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel || (donutCutout > 0 ? 'Donut chart' : 'Pie chart')}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={clsx(
        'chart-container chart-container-circular nui-chart-container relative flex items-center justify-center select-none font-sans focus:outline-none focus-visible:ring-1 focus-visible:ring-primary',
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
                setKeyboardIndex(i);
                if (tooltipFormatter) {
                  show(s.data, e.currentTarget);
                } else {
                  const val = typeof s.data.y === 'number' ? s.data.y : 0;
                  const pct =
                    totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : '0';
                  const sliceColor =
                    s.data.color ||
                    `var(--chart-${(i % 8) + 1}, var(--color-primary))`;
                  show(s.data, e.currentTarget, {
                    title: s.data.label || `Segment ${i + 1}`,
                    items: [
                      {
                        color: sliceColor,
                        label: '',
                        value: `${formatMetricNumber(val)} (${pct}%)`,
                      },
                    ],
                  });
                }
              }}
              onPointerLeave={() => {
                setKeyboardIndex(null);
                hide();
              }}
            />
          ))}
        </g>
      </svg>

      <div
        className="sr-only chart-a11y-container"
        dangerouslySetInnerHTML={{
          __html: generateA11yTableHtml(
            [{ name: 'Distribution', data: data as any }],
            {
              title:
                ariaLabel ||
                (donutCutout > 0
                  ? 'Donut chart data table'
                  : 'Pie chart data table'),
            }
          ),
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

export function DonutChart<T = DataPoint>(
  props: Omit<PieChartProps<T>, 'donutCutout'> & { donutCutout?: number }
) {
  return <PieChart {...props} donutCutout={props.donutCutout ?? 0.6} />;
}
