/**
 * @nofinite/charts - React Sparkline Component
 * Minimalist, high-performance inline trendline visualization for tables,
 * stat cards, and metrics summaries. Styled with @nofinite/nuicss tokens.
 */

import clsx from 'clsx';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = 'var(--color-primary)',
  className,
  ariaLabel,
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
      role="img"
      aria-label={ariaLabel || `Sparkline trend: ${data.length} data points`}
      className={clsx(
        'sparkline inline-flex items-center select-none',
        className
      )}
      style={{ width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        aria-hidden="true"
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
