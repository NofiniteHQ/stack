"use client";

import React, { useEffect, useRef, useCallback, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

/* -------------------------------------------------------------------------- */
/* Props */
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
/* Component */
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const baseId = useId();
 const titleId = labelledById || `${baseId}-title`;
 const descId = describedById || `${baseId}-desc`;

 const handleClose = useCallback(() => {
 onClose();
 }, [onClose]);

 // Framer motion handles animations, no need for manual timers

 useEffect(() => {
 if (!open || disableEsc) return;

 const onKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 e.preventDefault();
 handleClose();
 }
 };

 document.addEventListener('keydown', onKey);
 return () => document.removeEventListener('keydown', onKey);
 }, [open, disableEsc, handleClose]);

 useEffect(() => {
 if (!open) return;

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
 }, [open, disableClickOutside, handleClose, initialFocusRef]);

  if (!isMounted) return null;

  return (
  <Portal>
  <AnimatePresence>
  {open && (
 <motion.div 
 ref={overlayRef} 
 className={cn(
 "fixed inset-0 flex items-center justify-center z-[9998] bg-overlay",
 overlayClassName
 )} 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 <motion.div
 ref={dialogRef}
 className={cn(
 "relative z-[9999] w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] m-4 flex flex-col bg-surface backdrop-blur-md text-default font-sans border border-default rounded-lg shadow-2xl outline-none will-change-[transform,opacity]",
 className
 )}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ type: 'spring', damping: 20, stiffness: 300 }}
 role="dialog"
 aria-modal="true"
 aria-labelledby={title ? titleId : undefined}
 aria-describedby={description ? descId : undefined}
 tabIndex={-1} 
 onClick={(e) => e.stopPropagation()}
 {...props}
 >
 {(title || description) && (
 <div className={cn("p-5 pb-3 pr-10")}>
 {title && (
 <h2 id={titleId} className={cn("text-lg font-semibold tracking-tight leading-tight m-0")}>
 {title}
 </h2>
 )}
 {description && (
 <p id={descId} className={cn("mt-2 text-muted text-sm leading-relaxed mb-0")}>
 {description}
 </p>
 )}
 </div>
 )}

 <div className={cn("px-5 pb-5 overflow-y-auto", !(title || description) && "pt-5")}>
 {children}
 </div>

 {/* Conditionally render the close button */}
 {!hideCloseButton && (
 <button
 type="button"
 aria-label="Close dialog"
 className={cn("absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-transparent border-none rounded text-muted cursor-pointer transition-all duration-200 hover:bg-subtle hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus p-0")}
 onClick={handleClose}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <line x1="18" y1="6" x2="6" y2="18"></line>
 <line x1="6" y1="6" x2="18" y2="18"></line>
 </svg>
 </button>
 )}
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </Portal>
 );
}