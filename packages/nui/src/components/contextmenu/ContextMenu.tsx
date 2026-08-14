"use client";

import React, {
 useEffect,
 useRef,
 useState,
 useLayoutEffect,
 ReactNode,
 KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Portal, onClickOutside } from '../../utils';

/* ============================================================
 * Types
 * ============================================================ */

export interface ContextMenuItem {
 label?: string;
 icon?: ReactNode;
 onSelect?: () => void;
 danger?: boolean;
 disabled?: boolean;
 type?: 'item' | 'separator';
}

export interface ContextMenuProps {
 children: ReactNode;
 items: ContextMenuItem[];
 className?: string;
 /** * If true, the ContextMenu will not wrap children in a <div>.
 * Instead, it clones the child and directly attaches the onContextMenu event.
 * Child MUST be a valid single React Element. 
 */
 asChild?: boolean; 
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * ContextMenu Component
 * * A custom right-click menu that replaces the browser's native context menu.
 */
export function ContextMenu({
 children,
 items,
 className,
 asChild = false,
}: ContextMenuProps) {
 const [open, setOpen] = useState(false);
 const [activeIndex, setActiveIndex] = useState<number>(0);
 const [coords, setCoords] = useState({ x: 0, y: 0 });

 const { refs, x, y, placement: floatingPlacement } = useFloating<HTMLElement>({
 open,
 placement: 'bottom-start',
 middleware: [
 offset(4),
 flip({ padding: 16, fallbackPlacements: ['top-start', 'bottom-start', 'bottom-end'] }),
 shift({ padding: 16 }),
 ],
 });

 /* ----------------------------------------------------
 Opening & Collision Detection
 ---------------------------------------------------- */
 const handleContext = (e: React.MouseEvent) => {
 e.preventDefault();
 setCoords({ x: e.clientX, y: e.clientY });
 
 refs.setReference({
 getBoundingClientRect: () => ({
 x: e.clientX,
 y: e.clientY,
 top: e.clientY,
 left: e.clientX,
 right: e.clientX,
 bottom: e.clientY,
 width: 0,
 height: 0,
 }),
 });

 setOpen(true);
 setActiveIndex(getFirstEnabledIndex());
 };

 useLayoutEffect(() => {
 if (open && refs.floating.current) {
 refs.floating.current.focus();
 }
 }, [open, refs.floating]);

 /* ----------------------------------------------------
 Keyboard Navigation Helpers
 ---------------------------------------------------- */
 const getFirstEnabledIndex = () => {
 return items.findIndex((i) => i.type !== 'separator' && !i.disabled);
 };

 const getLastEnabledIndex = () => {
 for (let i = items.length - 1; i >= 0; i--) {
 const it = items[i];
 if (it.type !== 'separator' && !it.disabled) return i;
 }
 return 0;
 };

 const move = (direction: 1 | -1) => {
 let idx = activeIndex;
 const len = items.length;

 if (len === 0) return;

 // Loop until we find a valid item, preventing infinite loops
 for (let i = 0; i < len; i++) {
 idx = (idx + direction + len) % len;
 const it = items[idx];
 if (it.type !== 'separator' && !it.disabled) {
 setActiveIndex(idx);
 break;
 }
 }
 };

 /* ----------------------------------------------------
 Event Listeners
 ---------------------------------------------------- */
 const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
 const { key } = e;

 if (key === 'ArrowDown') {
 e.preventDefault();
 move(1);
 } else if (key === 'ArrowUp') {
 e.preventDefault();
 move(-1);
 } else if (key === 'Home') {
 e.preventDefault();
 setActiveIndex(getFirstEnabledIndex());
 } else if (key === 'End') {
 e.preventDefault();
 setActiveIndex(getLastEnabledIndex());
 } else if (key === 'Enter' || key === ' ') {
 e.preventDefault();
 const it = items[activeIndex];
 if (it && !it.disabled && it.onSelect) {
 it.onSelect();
 setOpen(false);
 }
 }
 };

 useEffect(() => {
 if (!open) return;
 const handler = (e: KeyboardEvent) => {
 if (e.key === 'Escape') setOpen(false);
 };
 document.addEventListener('keydown', handler);
 return () => document.removeEventListener('keydown', handler);
 }, [open]);

 useEffect(() => {
 if (!open) return;
 return onClickOutside({ current: refs.floating.current as HTMLElement | null }, () => setOpen(false));
 }, [open, refs.floating]);

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 
 const renderTrigger = () => {
 // * Polymorphic Architecture:
 // When asChild is true, we clone the user's React element and attach the onContextMenu 
 // event directly to it. This avoids creating unnecessary <div> wrappers in the DOM.
 if (asChild && React.isValidElement(children)) {
 return React.cloneElement(children, {
 onContextMenu: (e: React.MouseEvent<Element>) => {
 handleContext(e);
 
 const childProps = children.props as React.DOMAttributes<Element>;
 if (childProps.onContextMenu) {
 childProps.onContextMenu(e);
 }
 }
 } as React.DOMAttributes<Element>);
 }

 return (
 <div onContextMenu={handleContext} className="contents">
 {children}
 </div>
 );
 };

 return (
 <>
 {renderTrigger()}

 <AnimatePresence>
 {open && (
 <Portal>
 <motion.div
 ref={refs.setFloating}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ type: 'spring', damping: 20, stiffness: 300 }}
 className={cn(
 "z-[1000] min-w-[220px] rounded-lg border border-glassBorder bg-surface backdrop-blur-md p-1 font-sans shadow-2xl outline-none",
 className
 )}
 role="menu"
 tabIndex={-1} 
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: floatingPlacement.startsWith('top') ? 'bottom left' : 'top left'
 }}
 onKeyDown={handleKeyDown}
 >
 {items.map((item, idx) => {
 if (item.type === 'separator') {
 return <div key={`sep-${idx}`} className="my-1 border-b border-default" role="separator" />;
 }

 const isActive = idx === activeIndex;

 return (
  <div
  key={`item-${idx}`}
  className={cn(
  "flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-default transition-colors duration-200",
  isActive && !item.danger && "bg-subtle text-default",
  item.danger && isActive && "bg-danger-subtle text-danger",
  item.disabled && "cursor-not-allowed opacity-50 text-muted"
  )}
 role="menuitem"
 tabIndex={-1}
 aria-disabled={item.disabled || undefined}
 onMouseEnter={() => !item.disabled && setActiveIndex(idx)}
 onClick={() => {
 if (!item.disabled) {
 item.onSelect?.();
 setOpen(false);
 }
 }}
 >
 {item.icon && (
 <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center", isActive && !item.danger ? "text-inherit" : "text-muted")}>{item.icon}</span>
 )}
 <span className="grow whitespace-nowrap font-medium">{item.label}</span>
 
 {!item.icon && <span className="w-4" />}
 </div>
 );
 })}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
 </>
 );
}