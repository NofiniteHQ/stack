import React from 'react';
import { cn } from '../../utils';

export interface FloatingArrowProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'x' | 'y'> {
  placement: string;
  x?: number | null;
  y?: number | null;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * FloatingArrow Component
 * -----------------------
 * High-performance, mathematically contoured SVG directional arrow for
 * floating overlays (Tooltip, HoverCard, Popover).
 *
 * Renders a smoothly rounded tip with seamless open-base masking,
 * eliminating the crude right-angled triangle artifacts of rotated squares.
 */
export const FloatingArrow = React.forwardRef<
  SVGSVGElement,
  FloatingArrowProps
>(
  (
    {
      placement,
      x,
      y,
      fill = 'var(--bg-surface)',
      stroke = 'var(--border-default)',
      strokeWidth = 1,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const side = placement.split('-')[0] || 'top';

    const rotationMap: Record<string, string> = {
      top: 'rotate(0deg)',
      bottom: 'rotate(180deg)',
      left: 'rotate(270deg)',
      right: 'rotate(90deg)',
    };

    const transform = rotationMap[side] || 'rotate(0deg)';

    const positionStyle: React.CSSProperties = {
      position: 'absolute',
      width: '14px',
      height: '14px',
      pointerEvents: 'none',
      transform,
      ...(side === 'top' && {
        bottom: '-7px',
        left: x != null ? `${x}px` : undefined,
      }),
      ...(side === 'bottom' && {
        top: '-7px',
        left: x != null ? `${x}px` : undefined,
      }),
      ...(side === 'left' && {
        right: '-7px',
        top: y != null ? `${y}px` : undefined,
      }),
      ...(side === 'right' && {
        left: '-7px',
        top: y != null ? `${y}px` : undefined,
      }),
      ...style,
    };

    return (
      <svg
        ref={ref}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        className={cn('floating-arrow select-none z-[1]', className)}
        style={positionStyle}
        aria-hidden="true"
        {...props}
      >
        {/* Base fill mask that seamlessly joins with the container background */}
        <path d="M 0 7 L 5.5 12.5 Q 7 14 8.5 12.5 L 14 7 Z" fill={fill} />
        {/* Contoured stroke on the two angled pointing sides only */}
        <path
          d="M 0 7 L 5.5 12.5 Q 7 14 8.5 12.5 L 14 7"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

FloatingArrow.displayName = 'FloatingArrow';
