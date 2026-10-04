/**
 * @nofinite/charts - Responsive Dimensions Hook
 * Observes container size via ResizeObserver to adapt D3 coordinate spaces dynamically.
 */

import { useState, useEffect, type RefObject } from 'react';

export interface UseChartDimensionsOptions {
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function useChartDimensions(
  containerRef: RefObject<HTMLElement | null>,
  options: UseChartDimensionsOptions = {}
): { width: number; height: number } {
  const {
    width: propWidth,
    height: propHeight,
    defaultWidth = 500,
    defaultHeight = 300,
  } = options;

  const [measuredWidth, setMeasuredWidth] = useState<number>(propWidth || 0);

  useEffect(() => {
    if (propWidth) {
      setMeasuredWidth(propWidth);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Initial measurement
    if (container.clientWidth > 0) {
      setMeasuredWidth(container.clientWidth);
    }

    let rafId: number | null = null;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const newWidth = Math.round(entry.contentRect.width);
      if (newWidth > 0) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setMeasuredWidth((prev) =>
            Math.abs(prev - newWidth) >= 2 ? newWidth : prev
          );
        });
      }
    });

    observer.observe(container);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [containerRef, propWidth]);

  return {
    width: propWidth || (measuredWidth > 0 ? measuredWidth : defaultWidth),
    height: propHeight || defaultHeight,
  };
}
