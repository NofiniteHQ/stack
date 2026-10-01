/**
 * @nofinite/charts - React Legend Component
 * Styled with @nofinite/nuicss design tokens.
 */

import clsx from 'clsx';
import type { LegendItem } from '../core/legend';

export interface ChartLegendProps {
  series: LegendItem[];
  onToggle?: (seriesName: string) => void;
  className?: string;
}

export function ChartLegend({ series, onToggle, className }: ChartLegendProps) {
  if (!series || series.length === 0) return null;

  return (
    <div
      className={clsx(
        'chart-legend nui-chart-legend flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-sans select-none',
        className
      )}
    >
      {series.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => onToggle?.(s.name)}
          className={clsx(
            'chart-legend-item inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-opacity hover:opacity-80 cursor-pointer',
            s.hidden ? 'opacity-40 line-through' : 'opacity-100'
          )}
        >
          <span
            className="chart-legend-swatch w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: s.color }}
          />
          <span className="chart-legend-label font-medium text-default">
            {s.name}
          </span>
        </button>
      ))}
    </div>
  );
}
