"use client";

import React, { useEffect, useRef, useCallback, useState, useId } from 'react';
import { cn } from '../../utils';
import { 
  trapFocus, 
  onClickOutside, 
  restoreFocus, 
  scrollLock, 
  Portal, 
  applyInertToSiblings, 
  removeInertFromSiblings 
} from '../../utils';
import './Modal.css';

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  
  labelledById?: string;
  describedById?: string;
  
  disableClickOutside?: boolean;
  disableEsc?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  
  overlayClassName?: string;

  /** Hides the 'X' close button in the top right corner. */
  hideCloseButton?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  labelledById,
  describedById,
  disableClickOutside = false,
  disableEsc = false,
  hideCloseButton = false,
  initialFocusRef,
  className,
  overlayClassName,
  children,
  ...props
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const baseId = useId();
  const titleId = labelledById || `${baseId}-title`;
  const descId = describedById || `${baseId}-desc`;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (open) {
      setIsMounted(true);
      timer = setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => setIsMounted(false), 300);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open]);

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

  useEffect(() => {
    if (!isVisible) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    scrollLock.lock();

    const inertTargets = overlayRef.current
      ? applyInertToSiblings(overlayRef.current)
      : [];

    if (
      initialFocusRef?.current &&
      dialogRef.current?.contains(initialFocusRef.current)
    ) {
      initialFocusRef.current.focus();
    }

    const trapCleanup = dialogRef.current
      ? trapFocus(dialogRef.current)
      : undefined;

    let clickOutsideCleanup: (() => void) | undefined;
    if (!disableClickOutside && dialogRef.current) {
      clickOutsideCleanup = onClickOutside(dialogRef, handleClose);
    }

    return () => {
      clickOutsideCleanup?.();
      trapCleanup?.();
      scrollLock.unlock();
      removeInertFromSiblings(inertTargets);
      restoreFocus(previouslyFocusedElementRef.current);
    };
  }, [isVisible, disableClickOutside, handleClose, initialFocusRef]);

  if (!isMounted) return null;

  return (
    <Portal>
      <div 
        ref={overlayRef} 
        className={cn("nui-modal-overlay", overlayClassName)} 
        data-state={isVisible ? 'open' : 'closed'}
        aria-hidden="true"
      >
        <div
          ref={dialogRef}
          className={cn("nui-modal-container", className)}
          data-state={isVisible ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1} 
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {(title || description) && (
            <div className="nui-modal__header">
              {title && (
                <h2 id={titleId} className="nui-modal__title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="nui-modal__description">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="nui-modal__content">
            {children}
          </div>

          {/* Conditionally render the close button */}
          {!hideCloseButton && (
          <button
            type="button"
            aria-label="Close dialog"
            className="nui-modal__close"
            onClick={handleClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          )}
        </div>
      </div>
    </Portal>
  );
}