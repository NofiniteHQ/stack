"use client";

import React, { useRef, useEffect, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
 * 2. `<AnimatePresence>` controls the unmount sequence automatically.
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
 // 1. Mount & Animation States handled by framer-motion

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

 // 2. Entrance & Exit Animations are handled by framer-motion (see JSX)

 // 3. Handle Escape Key
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

 // 4. Accessibility & Lifecycle Effects
 useEffect(() => {
 if (!open) return;

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
 }, [open, disableClickOutside, handleClose]);

 return (
 <Portal>
 <AnimatePresence>
 {open && (
 <>
 <motion.div
 ref={overlayRef}
 className={cn(
 'fixed inset-0 bg-overlay z-[9998]',
 overlayClassName
 )}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 aria-hidden="true"
 />
 <motion.div
 ref={setRefs}
 className={cn(
 'fixed z-[9999] flex flex-col bg-surface backdrop-blur-md text-default shadow-2xl will-change-transform',
 position === 'left' && 'top-0 bottom-0 left-0 w-full max-w-[320px] border-r border-glassBorder',
 position === 'right' && 'top-0 bottom-0 right-0 w-full max-w-[320px] border-l border-glassBorder',
 position === 'top' && 'top-0 left-0 right-0 h-auto min-h-[250px] max-h-[90vh] border-b border-glassBorder',
 position === 'bottom' && 'bottom-0 left-0 right-0 h-auto min-h-[250px] max-h-[90vh] border-t border-glassBorder rounded-t-xl',
 className
 )}
 initial={{
 x: position === 'left' ? '-100%' : position === 'right' ? '100%' : 0,
 y: position === 'top' ? '-100%' : position === 'bottom' ? '100%' : 0,
 }}
 animate={{ x: 0, y: 0 }}
 exit={{
 x: position === 'left' ? '-100%' : position === 'right' ? '100%' : 0,
 y: position === 'top' ? '-100%' : position === 'bottom' ? '100%' : 0,
 }}
 transition={{ type: 'spring', damping: 20, stiffness: 300 }}
 role="dialog"
 aria-modal="true"
 {...props}
 >
 {children}
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </Portal>
 );
 }
);

Drawer.displayName = 'Drawer';