"use client";

import React, {
 createContext,
 useContext,
 useRef,
 useEffect,
 useState,
 useId,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, restoreFocus, trapFocus, onClickOutside } from '../../utils';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/* -------------------------------------------------------
 * Context
 * ------------------------------------------------------*/
interface PopoverContextValue {
 open: boolean;
 setOpen: React.Dispatch<React.SetStateAction<boolean>>;
 triggerRef: React.RefObject<HTMLElement | null>;
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

export function PopoverRoot({ children, defaultOpen = false }: PopoverRootProps) {
 const [open, setOpen] = useState(defaultOpen);
 const triggerRef = useRef<HTMLElement | null>(null);
 const contentId = `popover-${useId()}`;

 useEffect(() => {
 if (!open && triggerRef.current) {
 restoreFocus(triggerRef.current);
 }
 }, [open]);

 return (
 <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
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

export function PopoverTrigger({ children }: PopoverTriggerProps) {
 const { open, setOpen, triggerRef, contentId } = usePopover();

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
 offset: offsetProp = 8,
 ...props
}: PopoverContentProps) {
 const { open, setOpen, triggerRef, contentId } = usePopover();

 const { refs, x, y, placement: floatingPlacement } = useFloating<HTMLElement>({
 open,
 placement,
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(offsetProp),
 flip({ padding: 16 }),
 shift({ padding: 16 }),
 ],
 });

 useEffect(() => {
 if (triggerRef.current) {
 refs.setReference(triggerRef.current);
 }
 }, [triggerRef, refs]);

 // Focus Trapping
 useEffect(() => {
 if (open && refs.floating.current) {
 return trapFocus(refs.floating.current as HTMLElement);
 }
 return undefined;
 }, [open, refs.floating]);

 // Click Outside Handler
 useEffect(() => {
 if (!open) return;
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
 setOpen(false);
 });
 return cleanup;
 }, [open, setOpen, refs.floating, triggerRef]);

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
 role="dialog"
 aria-modal="true"
 data-placement={floatingPlacement}
 className={cn(
 'z-[9999] min-w-[220px] max-w-[360px] p-4 bg-glass backdrop-blur-md text-default font-sans border border-glassBorder rounded-lg shadow-xl',
 // Arrow Base
 'before:absolute before:w-3 before:h-3 before:bg-inherit before:border before:border-default before:rounded-[2px] before:rotate-45 before:z-[1]',
 // Arrow Bottom Placement
 'data-[placement=bottom]:before:-top-1.5 data-[placement=bottom]:before:left-[var(--nui-popover-arrow-x,50%)] data-[placement=bottom]:before:-ml-1.5 data-[placement=bottom]:before:border-b-transparent data-[placement=bottom]:before:border-r-transparent data-[placement=bottom]:before:origin-top-left',
 // Arrow Top Placement
 'data-[placement=top]:before:-bottom-1.5 data-[placement=top]:before:left-[var(--nui-popover-arrow-x,50%)] data-[placement=top]:before:-ml-1.5 data-[placement=top]:before:border-t-transparent data-[placement=top]:before:border-l-transparent data-[placement=top]:before:origin-bottom-right',
 // Arrow Left Placement
 'data-[placement=left]:before:-right-1.5 data-[placement=left]:before:top-[var(--nui-popover-arrow-y,50%)] data-[placement=left]:before:-mt-1.5 data-[placement=left]:before:border-b-transparent data-[placement=left]:before:border-l-transparent data-[placement=left]:before:origin-top-right',
 // Arrow Right Placement
 'data-[placement=right]:before:-left-1.5 data-[placement=right]:before:top-[var(--nui-popover-arrow-y,50%)] data-[placement=right]:before:-mt-1.5 data-[placement=right]:before:border-t-transparent data-[placement=right]:before:border-r-transparent data-[placement=right]:before:origin-bottom-left',
 className
 )}
 {...props}
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: floatingPlacement.startsWith('top') ? 'bottom' : floatingPlacement.startsWith('bottom') ? 'top' : floatingPlacement.startsWith('left') ? 'right' : 'left'
 }}
 >
 {children}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
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