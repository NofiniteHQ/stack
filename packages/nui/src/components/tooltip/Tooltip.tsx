"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  useId,
} from 'react';
import { cn } from '../../utils';
import { Portal } from '../../utils';
import './Tooltip.css';

/* ============================================================
 * Types
 * ============================================================ */

export type TooltipPlacement = 'top' | 'bottom';

export interface TooltipProps {
  /** The text or content displayed inside the tooltip */
  label: React.ReactNode;
  /** The trigger element. Must be a single valid React Element (like a button) */
  children: React.ReactElement;
  /** Additional CSS classes for the tooltip container */
  className?: string;
  /** Delay in milliseconds before showing the tooltip on hover/focus. Defaults to 200. */
  delay?: number;
  /** Distance in pixels between the tooltip and the trigger. Defaults to 8. */
  offset?: number;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Tooltip Component
 * * A contextual popup that displays information when hovering or focusing an element.
 * * Uses a custom math engine to calculate collision-safe positioning and dynamic arrow rendering.
 */
export function Tooltip({
  label,
  children,
  className,
  delay = 200,
  offset = 8,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  // ArrowLeft is injected as a CSS custom property to slide the pseudo-element arrow!
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: 50 });
  const [placement, setPlacement] = useState<TooltipPlacement>('top');

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reactId = useId();
  const tooltipId = `tooltip-${reactId}`;

  /* ----------------------------------------------------
     Visibility
  ---------------------------------------------------- */
  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  }, []);

  /* ----------------------------------------------------
     Positioning Engine
  ---------------------------------------------------- */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 1. Calculate ideal X (Center of the trigger)
    const actualCenter = triggerRect.left + scrollX + triggerRect.width / 2;
    let left = actualCenter;
    
    // Prevent bleeding off left/right edges of the viewport
    const minLeft = tooltipRect.width / 2 + 8;
    const maxLeft = document.documentElement.clientWidth - (tooltipRect.width / 2) - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    // 2. Arrow offset math (Keep arrow pointing at trigger even if the box got clamped)
    const physicalLeftEdge = left - (tooltipRect.width / 2);
    let arrowLeft = actualCenter - physicalLeftEdge;

    // Clamp arrow so it doesn't break out of the rounded corners of the tooltip box
    const arrowMin = 12;
    const arrowMax = tooltipRect.width - 12;
    if (arrowLeft < arrowMin) arrowLeft = arrowMin;
    if (arrowLeft > arrowMax) arrowLeft = arrowMax;

    // 3. Calculate Y
    let top = triggerRect.top + scrollY - tooltipRect.height - offset;
    let nextPlacement: TooltipPlacement = 'top';

    // Flip to bottom if there is no space at the top of the viewport
    if (triggerRect.top - tooltipRect.height - offset < 0) {
      top = triggerRect.bottom + scrollY + offset;
      nextPlacement = 'bottom';
    }

    setPlacement(nextPlacement);
    setCoords({ top, left, arrowLeft });
  }, [offset]);

  /* ----------------------------------------------------
     Effects
  ---------------------------------------------------- */
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // WAI-ARIA states Tooltips must close on Escape
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, hide]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  
  // 1. Extract the child and type it to include ALL HTML props + Ref attributes
  const child = React.Children.only(children) as React.ReactElement<React.HTMLProps<HTMLElement>>;

  // 2. Safely extract the original ref (Handles both React 18 element refs and React 19 prop refs)
  const childRef = child.props.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  // 3. Explicitly type the new props object so TypeScript knows 'ref' is allowed
  const triggerProps: React.HTMLProps<HTMLElement> = {
    ref: (node: HTMLElement | null) => {
      if (!node) return;
      
      // Assign to our internal ref for positioning math
      triggerRef.current = node;
      
      // Preserve user's ref if they passed one originally
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
        (childRef as { current: HTMLElement | null }).current = node;
      }
    },
    'aria-describedby': isOpen ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      show();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hide();
      child.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      show();
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hide();
      child.props.onBlur?.(e);
    },
  };

  // 4. Clone the child and inject the event listeners and refs
  const trigger = React.cloneElement(child, triggerProps);

  return (
    <>
      {trigger}

      {isOpen && (
        <Portal>
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            data-placement={placement}
            className={cn('nui-tooltip', className)}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              // Pass the arrow position dynamically to CSS!
              '--nui-tooltip-arrow-x': `${coords.arrowLeft}px`,
            } as React.CSSProperties}
          >
            {label}
          </div>
        </Portal>
      )}
    </>
  );
}