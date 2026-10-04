/**
 * @nofinite/charts - React Tooltip & Crosshair Hook
 * Powered by @floating-ui/dom and styled with @nofinite/nuicss tokens.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  positionTooltip,
  defaultTooltipPayload,
  renderTooltipHtml,
  type TooltipFormatter,
  type TooltipPayload,
} from '../core/tooltip';
import type { NormalizedDataPoint } from '../core/math';

export interface UseChartTooltipOptions {
  enabled?: boolean;
  formatter?: TooltipFormatter;
  defaultColor?: string;
}

export function useChartTooltip(options: UseChartTooltipOptions = {}) {
  const { enabled = true, formatter, defaultColor } = options;
  const [activePoint, setActivePoint] = useState<NormalizedDataPoint | null>(
    null
  );
  const [tooltipHtml, setTooltipHtml] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pendingReferenceRef = useRef<
    Element | { getBoundingClientRect: () => DOMRect } | null
  >(null);

  const show = useCallback(
    (
      point: NormalizedDataPoint,
      reference: Element | { getBoundingClientRect: () => DOMRect },
      customPayload?: TooltipPayload | string
    ) => {
      if (!enabled) return;
      setActivePoint(point);
      pendingReferenceRef.current = reference;
      const payload =
        customPayload !== undefined
          ? customPayload
          : formatter
          ? formatter(point)
          : defaultTooltipPayload(point, defaultColor);
      setTooltipHtml(renderTooltipHtml(payload));
      setIsOpen(true);
    },
    [enabled, formatter, defaultColor]
  );

  useEffect(() => {
    if (isOpen && pendingReferenceRef.current && tooltipRef.current) {
      positionTooltip(pendingReferenceRef.current, tooltipRef.current);
    }
  }, [isOpen, tooltipHtml]);

  const hide = useCallback(() => {
    setIsOpen(false);
    setActivePoint(null);
    pendingReferenceRef.current = null;
  }, []);

  return {
    isOpen,
    activePoint,
    tooltipHtml,
    tooltipRef,
    containerRef,
    show,
    hide,
  };
}
