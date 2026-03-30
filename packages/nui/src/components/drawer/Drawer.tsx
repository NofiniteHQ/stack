"use client";

import React, { useRef, useEffect, useCallback, useState, forwardRef } from 'react';
import { cn } from '../../utils';
import { 
  Portal, 
  onClickOutside, 
  trapFocus, 
  restoreFocus, 
  scrollLock, 
  applyInertToSiblings, 
  removeInertFromSiblings 
} from '../../utils';
import './Drawer.css';

/* ----------------------------------------------------
   Props
---------------------------------------------------- */
export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls the open/closed state of the drawer */
  open: boolean;
  /** Callback fired when the drawer requests to be closed (e.g., Escape key, outside click) */
  onClose: () => void;
  /** The edge of the screen the drawer attaches to. Defaults to 'right' */
  position?: 'left' | 'right' | 'bottom' | 'top';
  /** Prevents the drawer from closing when the Escape key is pressed */
  disableEsc?: boolean;
  /** Prevents the drawer from closing when a click occurs outside the content area */
  disableClickOutside?: boolean;
  /** Custom class name applied to the backdrop overlay */
  overlayClassName?: string;
}

/* ----------------------------------------------------
   Component
---------------------------------------------------- */

/**
 * Drawer Component
 * * A sliding panel overlay for auxiliary content.
 * * Architecture Note (2-Step Unmount):
 * To allow smooth CSS exit transitions, the component uses two states:
 * 1. `isMounted`: Controls presence in the React Tree (DOM).
 * 2. `isVisible`: Controls the `data-state` attribute which triggers CSS transforms.
 * Upon closing, `isVisible` flips immediately, then a 300ms timeout delays the `isMounted` flip.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      position = 'right',
      className,
      overlayClassName,
      children,
      disableEsc = false,
      disableClickOutside = false,
      ...props
    },
    ref
  ) => {
    // 1. Mount & Animation States
    const [isMounted, setIsMounted] = useState(open);
    const [isVisible, setIsVisible] = useState(false);

    const overlayRef = useRef<HTMLDivElement | null>(null);
    const internalDrawerRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (node: HTMLDivElement) => {
        internalDrawerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    // 2. Handle Entrance & Exit Animations
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;

      if (open) {
        setIsMounted(true);
        // Micro-delay to ensure the DOM paints the element before applying the active transform class
        timer = setTimeout(() => setIsVisible(true), 15);
      } else {
        setIsVisible(false);
        // Wait for CSS transition (0.3s) to finish before unmounting from DOM
        timer = setTimeout(() => setIsMounted(false), 300);
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [open]);

    // 3. Handle Escape Key
    useEffect(() => {
      if (!isVisible || disableEsc) return;

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      };

      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [isVisible, disableEsc, handleClose]);

    // 4. Accessibility & Lifecycle Effects
    useEffect(() => {
      if (!isVisible) return;

      // Capture the element that had focus before the drawer opened
      previouslyFocused.current = document.activeElement as HTMLElement;

      // Lock body scroll
      scrollLock.lock();

      // WAI-ARIA Standard: Hide siblings from screen readers
      const inertTargets = overlayRef.current
        ? applyInertToSiblings(overlayRef.current)
        : [];

      // Trap focus inside the drawer
      const trapCleanup = internalDrawerRef.current
        ? trapFocus(internalDrawerRef.current)
        : undefined;

      // Click outside
      let cleanupOutside: (() => void) | undefined;
      if (!disableClickOutside && internalDrawerRef.current) {
        cleanupOutside = onClickOutside(internalDrawerRef, handleClose);
      }

      return () => {
        cleanupOutside?.();
        trapCleanup?.();
        scrollLock.unlock();
        removeInertFromSiblings(inertTargets);
        restoreFocus(previouslyFocused.current);
      };
    }, [isVisible, disableClickOutside, handleClose]);

    if (!isMounted) return null;

    return (
      <Portal>
        <div
          ref={overlayRef}
          className={cn('nui-drawer-overlay', overlayClassName)}
          data-state={isVisible ? 'open' : 'closed'}
          aria-hidden="true"
        />
        <div
          ref={setRefs}
          className={cn('nui-drawer', `nui-drawer--${position}`, className)}
          data-state={isVisible ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
        </div>
      </Portal>
    );
  }
);

Drawer.displayName = 'Drawer';