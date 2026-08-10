"use client";

import React, {
 createContext,
 useContext,
 useState,
 useRef,
 useEffect,
 useCallback,
 useId,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, onClickOutside } from '../../utils';

export type HoverCardPlacement = 'top' | 'bottom';

/* -------------------------------------------------------
 * Context
 * ------------------------------------------------------*/
interface HoverCardContextValue {
 open: boolean;
 setOpen: React.Dispatch<React.SetStateAction<boolean>>;
 triggerRef: React.RefObject<HTMLElement | null>;
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
 offset: offsetProp = 8,
 ...props
}: HoverCardContentProps) {
 const { open, setOpen, triggerRef, contentId, scheduleClose, clearTimers } = useHoverCard();

 const { refs, x, y } = useFloating<HTMLElement>({
 open,
 placement,
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(offsetProp),
 flip({ padding: 16, fallbackPlacements: ['top', 'bottom'] }),
 shift({ padding: 16 }),
 ],
 });

 useEffect(() => {
 if (triggerRef.current) {
 refs.setReference(triggerRef.current);
 }
 }, [triggerRef, refs]);

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
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
 setOpen(false);
 });
 return cleanup;
 }, [open, setOpen, refs.floating, triggerRef]);

 return (
 <AnimatePresence>
 {open && (
 <Portal>
 <motion.div
 id={contentId}
 ref={refs.setFloating}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ type: 'spring', damping: 20, stiffness: 300 }}
 role="dialog"
 aria-modal="false"
 data-placement={placement}
 className={cn(
 'absolute z-[1000] box-border min-w-[240px] max-w-[360px] p-4 bg-surface backdrop-blur-md text-default font-sans border border-glassBorder rounded-lg shadow-2xl',
 'data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom',
 className
 )}
 style={{ position: 'absolute', top: y ?? 0, left: x ?? 0 }}
 onMouseEnter={() => {
 // If user moves mouse onto the card, cancel the close timer!
 // This allows users to move from the trigger to the content without it disappearing.
 clearTimers();
 }}
 onMouseLeave={scheduleClose}
 {...props}
 >
 {children}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
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