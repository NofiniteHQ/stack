/**
 * @nofinite/charts - Glassmorphic Tooltip & Crosshair Engine
 * Powered by @floating-ui/dom and styled with @nofinite/nuicss design tokens.
 */

import {
  computePosition,
  flip,
  shift,
  offset,
  limitShift,
} from '@floating-ui/dom';
import type { NormalizedDataPoint } from './math';
import { formatMetricNumber } from './axis';

export interface TooltipItem {
  color: string;
  label: string;
  value: string | number;
}

export interface TooltipPayload {
  title?: string;
  items: TooltipItem[];
}

export type TooltipFormatter = (
  point: NormalizedDataPoint
) => TooltipPayload | string;

export function defaultTooltipPayload(
  point: NormalizedDataPoint,
  defaultColor = 'var(--chart-1, var(--color-primary))'
): TooltipPayload {
  const title =
    point.xOriginal !== undefined
      ? String(point.xOriginal)
      : point.label ||
        (point.x instanceof Date
          ? point.x.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : String(point.x));

  return {
    title,
    items: [
      {
        color: point.color || defaultColor,
        label: point.label || 'Value',
        value:
          typeof point.y === 'number'
            ? formatMetricNumber(point.y)
            : String(point.y),
      },
    ],
  };
}

export function renderTooltipHtml(payload: TooltipPayload | string): string {
  if (typeof payload === 'string') {
    return `<div class="chart-tooltip-content">${payload}</div>`;
  }

  const titleHtml = payload.title
    ? `<div class="chart-tooltip-title">${payload.title}</div>`
    : '';

  const itemsHtml = payload.items
    .map(
      (item) => `
    <div class="chart-tooltip-item">
      <div class="chart-tooltip-label-group">
        <span class="chart-tooltip-swatch" style="background-color: ${item.color};"></span>
        <span class="chart-tooltip-label">${item.label}</span>
      </div>
      <span class="chart-tooltip-value">${item.value}</span>
    </div>
  `
    )
    .join('');

  return `
    <div class="chart-tooltip-container">
      ${titleHtml}
      <div class="chart-tooltip-items">
        ${itemsHtml}
      </div>
    </div>
  `.trim();
}

export interface PositionTooltipOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}

export async function positionTooltip(
  reference: Element | { getBoundingClientRect: () => DOMRect },
  tooltipEl: HTMLElement,
  options?: PositionTooltipOptions
): Promise<void> {
  const placement = options?.placement ?? 'top';
  const offsetDistance = options?.offset ?? 10;

  const { x, y } = await computePosition(reference, tooltipEl, {
    placement,
    middleware: [
      offset(offsetDistance),
      flip({ fallbackPlacements: ['bottom', 'top', 'right', 'left'] }),
      shift({ padding: 8, limiter: limitShift() }),
    ],
  });

  Object.assign(tooltipEl.style, {
    left: `${Math.round(x)}px`,
    top: `${Math.round(y)}px`,
  });
}
