/**
 * @nofinite/charts - Interactive Legend Engine
 * Strict compliance with @nofinite/nuicss design tokens.
 */

export interface LegendItem {
  name: string;
  color: string;
  hidden?: boolean;
}

export function renderLegendHtml(
  series: LegendItem[],
  options?: { className?: string }
): string {
  if (!series || series.length === 0) return '';

  const className = options?.className || '';

  return `
    <div class="chart-legend nui-chart-legend flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-sans select-none ${className}">
      ${series
        .map(
          (s) => `
        <button
          type="button"
          class="chart-legend-item inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-opacity ${
            s.hidden ? 'opacity-40 line-through' : 'opacity-100'
          } hover:opacity-80 cursor-pointer"
          data-series="${s.name}"
        >
          <span class="chart-legend-swatch w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${
            s.color
          };"></span>
          <span class="chart-legend-label font-medium text-default">${
            s.name
          }</span>
        </button>
      `
        )
        .join('')}
    </div>
  `.trim();
}
