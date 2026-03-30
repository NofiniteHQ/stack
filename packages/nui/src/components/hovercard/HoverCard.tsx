"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useId,
} from 'react';
import { cn } from '../../utils';
import { Portal, onClickOutside } from '../../utils';
import './HoverCard.css';

export type HoverCardPlacement = 'top' | 'bottom';

/* -------------------------------------------------------
 * Context
 * ------------------------------------------------------*/
interface HoverCardContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  clearTimers: () => void;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCard() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error('HoverCard components must be inside <HoverCard>');
  return ctx;
}

/* -------------------------------------------------------
 * 1. Root
 * ------------------------------------------------------*/
export interface HoverCardProps {
  children: React.ReactNode;
  /** Delay in milliseconds before the card opens. Defaults to 200ms. */
  openDelay?: number;
  /** Delay in milliseconds before the card closes. Defaults to 300ms. */
  closeDelay?: number;
}

/**
 * HoverCard Component (Root)
 * * Implements a Compound Component Architecture.
 * * Manages the delayed hover state and provides context to the Trigger and Content.
 */
export function HoverCardRoot({
  children,
  openDelay = 200, // Standard modern UI delay
  closeDelay = 300,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentId = `hovercard-${useId()}`;

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay, clearTimers]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, clearTimers]);

  // Clean up timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <HoverCardContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentRef,
        contentId,
        scheduleOpen,
        scheduleClose,
        clearTimers,
      }}
    >
      {children}
    </HoverCardContext.Provider>
  );
}
HoverCardRoot.displayName = 'HoverCard';

/* -------------------------------------------------------
 * 2. Trigger
 * ------------------------------------------------------*/
export interface HoverCardTriggerProps {
  children: React.ReactElement;
}

/**
 * HoverCard Trigger
 * * Automatically clones the child element and injects necessary event listeners and ARIA attributes.
 */
export function HoverCardTrigger({ children }: HoverCardTriggerProps) {
  const { open, triggerRef, contentId, scheduleOpen, scheduleClose } = useHoverCard();

  const child = React.Children.only(children) as React.ReactElement<React.HTMLProps<HTMLElement>>;
  const childRef = child.props.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  const triggerProps: React.HTMLProps<HTMLElement> = {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
        (childRef as { current: HTMLElement | null }).current = node;
      }
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      scheduleOpen();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      scheduleClose();
      child.props.onMouseLeave?.(e);
    },
    // WAI-ARIA Standard: Hover cards must open on keyboard focus
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      scheduleOpen();
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      scheduleClose();
      child.props.onBlur?.(e);
    },
  };

  return React.cloneElement(child, triggerProps);
}
HoverCardTrigger.displayName = 'HoverCard.Trigger';

/* -------------------------------------------------------
 * 3. Content
 * ------------------------------------------------------*/
export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Preferred placement of the card relative to the trigger. Defaults to 'bottom' */
  placement?: HoverCardPlacement;
  /** Gap in pixels between the trigger and the card. Defaults to 8px. */
  offset?: number;
}

/**
 * HoverCard Content
 * * Renders in a Portal and implements smart collision detection.
 */
export function HoverCardContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
  ...props
}: HoverCardContentProps) {
  const { open, setOpen, triggerRef, contentRef, contentId, scheduleClose, clearTimers } = useHoverCard();
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [actualPlacement, setActualPlacement] = useState<HoverCardPlacement>(placement);

  // ESC Key Dismiss
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  // Click Outside
  useEffect(() => {
    if (!open) return;
    // Pass both refs in an array to prevent the trigger from immediately closing the card
    const cleanup = onClickOutside([contentRef, triggerRef], () => {
      setOpen(false);
    });
    return cleanup;
  }, [open, setOpen, contentRef, triggerRef]);

  // Smart Positioning & Collision Math
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Center horizontally by default relative to the trigger
    let left = triggerRect.left + scrollX + (triggerRect.width / 2) - (contentRect.width / 2);
    
    // Boundary Clamp (Left/Right)
    const padding = 12;
    const maxLeft = document.documentElement.clientWidth - contentRect.width - padding;
    if (left < padding) left = padding;
    if (left > maxLeft) left = maxLeft;

    // Y Axis Placement
    let top = triggerRect.bottom + scrollY + offset;
    let nextPlacement = placement;

    // Collision Detection: Flip to top if no space at bottom
    if (placement === 'bottom' && top + contentRect.height > window.innerHeight + scrollY - padding) {
      top = triggerRect.top + scrollY - contentRect.height - offset;
      nextPlacement = 'top';
    } 
    // Collision Detection: Flip to bottom if no space at top
    else if (placement === 'top') {
      top = triggerRect.top + scrollY - contentRect.height - offset;
      if (top < scrollY + padding) {
        top = triggerRect.bottom + scrollY + offset;
        nextPlacement = 'bottom';
      }
    }

    setActualPlacement(nextPlacement);
    setCoords({ top, left });
  }, [placement, offset, triggerRef, contentRef]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  if (!open) return null;

  return (
    <Portal>
      <div
        id={contentId}
        ref={contentRef}
        role="dialog"
        data-placement={actualPlacement}
        className={cn('nui-hovercard-content', className)}
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
        } as React.CSSProperties}
        onMouseEnter={() => {
          // If user moves mouse onto the card, cancel the close timer!
          // This allows users to move from the trigger to the content without it disappearing.
          clearTimers();
        }}
        onMouseLeave={scheduleClose}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}
HoverCardContent.displayName = 'HoverCard.Content';

/* -------------------------------------------------------
 * Export
 * ------------------------------------------------------*/
export const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});