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
  const isTime = point.x instanceof Date;
  let title = '';
  if (isTime) {
    title = (point.x as Date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else if (point.label) {
    title = point.label;
  } else if (
    point.xOriginal !== undefined &&
    typeof point.xOriginal === 'string'
  ) {
    title = point.xOriginal;
  } else if (typeof point.x === 'number') {
    title = formatMetricNumber(point.x);
  } else {
    title = String(point.x);
  }

  // To prevent showing the same data twice:
  // If item label would be identical to title, leave label empty so only the swatch + value is rendered.
  let itemLabel = '';
  if (point.label && point.label !== title) {
    itemLabel = point.label;
  }

  return {
    title,
    items: [
      {
        color: point.color || defaultColor,
        label: itemLabel,
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
    .map((item) => {
      // Deduplication safeguard: if single item and item.label is identical to payload.title, don't repeat it!
      const shouldRenderLabel =
        Boolean(item.label) &&
        (payload.items.length > 1 || item.label !== payload.title);

      return `
    <div class="chart-tooltip-item">
      <div class="chart-tooltip-label-group">
        <span class="chart-tooltip-swatch" style="background-color: ${
          item.color
        };"></span>
        ${
          shouldRenderLabel
            ? `<span class="chart-tooltip-label">${item.label}</span>`
            : ''
        }
      </div>
      <span class="chart-tooltip-value">${item.value}</span>
    </div>
  `;
    })
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
