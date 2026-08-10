"use client";

import React, {
 useState,
 useRef,
 useLayoutEffect,
 useEffect,
 useCallback,
 useId,
} from 'react';
import { useFloating, autoUpdate, offset as floatingOffset, flip, shift, size } from '@floating-ui/react-dom';
import { cn } from '../../utils';
import { Portal } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

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

 const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const reactId = useId();
 const tooltipId = `tooltip-${reactId}`;

 const { refs, x, y, placement: floatingPlacement } = useFloating<HTMLElement>({
 open: isOpen,
 placement: 'top',
 whileElementsMounted: autoUpdate,
 middleware: [
 floatingOffset(offset),
 flip({ padding: 16, fallbackPlacements: ['top-start', 'bottom'] }),
 shift({ padding: 16 }),
 ],
 });

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
 Effects
 ---------------------------------------------------- */

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
 // Assign to our internal ref for positioning math
 refs.setReference(node);
 
 // Preserve user's ref if they passed one originally
 if (typeof childRef === 'function') {
 childRef(node);
 } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
 (childRef as { current: HTMLElement | null }).current = node;
 }
 },
 'aria-describedby': isOpen ? tooltipId : undefined,
 className: cn(
 child.props.className,
 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus '
 ),
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

 <AnimatePresence>
 {isOpen && (
 <Portal>
 <motion.div
 ref={refs.setFloating}
 id={tooltipId}
 role="tooltip"
 data-placement={floatingPlacement}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ type: 'spring', damping: 20, stiffness: 300 }}
 className={cn(
 'absolute z-[10000] max-w-[280px] px-3 py-1.5 bg-surface backdrop-blur-md text-default border border-glassBorder font-sans text-xs font-medium leading-[1.4] rounded-md text-center pointer-events-none shadow-2xl',
 // Arrow Base
 'after:absolute after:w-2.5 after:h-2.5 after:bg-surface after:border-default after:left-[var(--nui-tooltip-arrow-x,50%)] after:-translate-x-1/2 after:rotate-45 after:rounded-[1px] after:z-[-1]',
 // Arrow Placement
 'data-[placement=top]:after:-bottom-[5px] data-[placement=top]:after:border-b data-[placement=top]:after:border-r',
 'data-[placement=bottom]:after:-top-[5px] data-[placement=bottom]:after:border-t data-[placement=bottom]:after:border-l',
 className
 )}
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: floatingPlacement.startsWith('top') ? 'bottom' : 'top'
 }}
 >
 {label}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
 </>
 );
}