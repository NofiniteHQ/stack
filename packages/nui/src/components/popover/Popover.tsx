"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useId,
  useCallback,
} from 'react';
import { cn } from '../../utils';
import { Portal, restoreFocus, trapFocus, onClickOutside } from '../../utils';
import './Popover.css';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/* -------------------------------------------------------
 * Context
 * ------------------------------------------------------*/
interface PopoverContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover components must be inside <Popover>');
  return ctx;
}

/* -------------------------------------------------------
 * 1. Root
 * ------------------------------------------------------*/

export interface PopoverRootProps {
  children: React.ReactNode; 
  defaultOpen?: boolean;
}

/**
 * Popover Component (Root)
 * * A non-modal dialog that floats around a trigger element.
 * * Uses Compound Component Architecture.
 */
export function PopoverRoot({ children, defaultOpen = false }: PopoverRootProps) {
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentId = `popover-${useId()}`;

  // WAI-ARIA Standard: Restore focus to trigger on close
  useEffect(() => {
    if (!open && triggerRef.current) {
      restoreFocus(triggerRef.current);
    }
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef, contentId }}>
      {children}
    </PopoverContext.Provider>
  );
}
PopoverRoot.displayName = 'Popover';

/* -------------------------------------------------------
 * 2. Trigger
 * ------------------------------------------------------*/

export interface PopoverTriggerProps {
  children: React.ReactElement;
}

/**
 * Popover Trigger
 * * Automatically clones the child element and injects necessary event listeners and ARIA attributes.
 */
export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef, contentId } = usePopover();

  // Safely extract the child and ref
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
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setOpen((prev) => !prev);
      child.props.onClick?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Escape' && open) {
        e.stopPropagation();
        setOpen(false);
      }
      child.props.onKeyDown?.(e);
    },
  };

  return React.cloneElement(child, triggerProps);
}
PopoverTrigger.displayName = 'Popover.Trigger';

/* -------------------------------------------------------
 * 3. Content
 * ------------------------------------------------------*/
export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Preferred placement of the popover relative to the trigger. Defaults to 'bottom' */
  placement?: PopoverPlacement;
  /** Gap in pixels between the trigger and the popover. Defaults to 8px. */
  offset?: number;
}

/**
 * Popover Content
 * * Renders inside a Portal and implements smart collision detection to stay in the viewport.
 * * Automatically traps focus when open.
 */
export function PopoverContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
  ...props
}: PopoverContentProps) {
  const { open, setOpen, triggerRef, contentRef, contentId } = usePopover();
  const [coords, setCoords] = useState({ top: -9999, left: -9999, arrowX: 50, arrowY: 50 });
  const [actualPlacement, setActualPlacement] = useState<PopoverPlacement>(placement);

  // Focus Trapping
  useEffect(() => {
    if (open && contentRef.current) {
      return trapFocus(contentRef.current);
    }
    return undefined;
  }, [open, contentRef]);

  // Click Outside Handler
  useEffect(() => {
    if (!open) return;
    const cleanup = onClickOutside([contentRef, triggerRef], () => {
      setOpen(false);
    });
    return cleanup;
  }, [open, setOpen, contentRef, triggerRef]);

  // Escape Key Handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  // Positioning Math (Includes Boundary Collision)
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;
    let arrowX = 50;
    let arrowY = 50;
    let nextPlacement = placement;

    // Viewport boundaries with safety padding
    const padding = 12;
    const minLeft = padding;
    const maxLeft = document.documentElement.clientWidth - contentRect.width - padding;
    const minTop = padding;
    const maxTop = document.documentElement.clientHeight - contentRect.height - padding;

    if (placement === 'top' || placement === 'bottom') {
      const actualCenter = triggerRect.left + scrollX + triggerRect.width / 2;
      left = actualCenter - contentRect.width / 2;

      // Clamp X
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      // Calculate Arrow X
      arrowX = actualCenter - left;

      if (placement === 'bottom') {
        top = triggerRect.bottom + scrollY + offset;
        // Collision Detection: Flip if clipping bottom
        if (top + contentRect.height > maxTop + scrollY) {
          top = triggerRect.top + scrollY - contentRect.height - offset;
          nextPlacement = 'top';
        }
      } else {
        top = triggerRect.top + scrollY - contentRect.height - offset;
        // Collision Detection: Flip if clipping top
        if (top < minTop + scrollY) {
          top = triggerRect.bottom + scrollY + offset;
          nextPlacement = 'bottom';
        }
      }
    } else {
      const actualCenterY = triggerRect.top + scrollY + triggerRect.height / 2;
      top = actualCenterY - contentRect.height / 2;

      // Clamp Y
      if (top < minTop) top = minTop;
      if (top > maxTop) top = maxTop;

      // Calculate Arrow Y
      arrowY = actualCenterY - top;

      if (placement === 'right') {
        left = triggerRect.right + scrollX + offset;
        // Collision Detection: Flip to left if clipping right
        if (left + contentRect.width > maxLeft + scrollX) {
          left = triggerRect.left + scrollX - contentRect.width - offset;
          nextPlacement = 'left';
        }
      } else {
        left = triggerRect.left + scrollX - contentRect.width - offset;
        // Collision Detection: Flip to right if clipping left
        if (left < minLeft + scrollX) {
          left = triggerRect.right + scrollX + offset;
          nextPlacement = 'right';
        }
      }
    }

    setActualPlacement(nextPlacement);
    setCoords({ top, left, arrowX, arrowY });
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
        aria-modal="true"
        data-placement={actualPlacement}
        className={cn('nui-popover-content', className)}
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
          '--nui-popover-arrow-x': `${coords.arrowX}px`,
          '--nui-popover-arrow-y': `${coords.arrowY}px`,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}
PopoverContent.displayName = 'Popover.Content';

/* -------------------------------------------------------
 * 4. Close Button
 * ------------------------------------------------------*/

export interface PopoverCloseProps {
  children: React.ReactElement;
}

/**
 * Popover Close
 * * Optional headless wrapper that injects a close action into a child button.
 */
export function PopoverClose({ children }: PopoverCloseProps) {
  const { setOpen } = usePopover();
  
  const child = React.Children.only(children) as React.ReactElement<React.HTMLProps<HTMLElement>>;
  
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      setOpen(false);
      child.props.onClick?.(e);
    },
  });
}
PopoverClose.displayName = 'Popover.Close';

/* -------------------------------------------------------
 * Export
 * ------------------------------------------------------*/
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});