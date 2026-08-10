"use client";

import React, {
 useState,
 useRef,
 useEffect,
 useCallback,
 useLayoutEffect,
 KeyboardEvent,
 forwardRef,
} from 'react';
import { Portal, onClickOutside, restoreFocus, cn } from '../../utils';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================
 * Types
 * ============================================================ */

export type SelectOption = {
 value: string;
 label: React.ReactNode;
 disabled?: boolean;
};

export interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
 /** Array of available options */
 options: SelectOption[];
 /** Controlled state value */
 value?: string; 
 /** Uncontrolled initial value */
 defaultValue?: string; 
 /** Callback fired when an option is selected */
 onChange?: (value: string) => void;
 /** Text displayed when no option is selected */
 placeholder?: string;
 /** Name attribute applied to the hidden input for native form submission */
 name?: string; 
 /** Applies error styling to the trigger button */
 error?: boolean; 
}

/* Helper: find next enabled index given direction */
function findNextEnabled(options: SelectOption[], start: number, direction: 1 | -1) {
 const len = options.length;
 let i = start;
 for (let step = 0; step < len; step++) {
 i = (i + direction + len) % len;
 if (!options[i].disabled) return i;
 }
 return -1;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Select Component
 * * A highly accessible dropdown select menu.
 * * Automatically manages focus, keyboard typeahead navigation, and viewport collision detection.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(({
 options,
 value,
 defaultValue,
 onChange,
 placeholder = 'Select...',
 disabled = false,
 error = false,
 name,
 id,
 className,
 ...props
}, ref) => {
 const isControlled = value !== undefined;
 const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
 const selectedValue = isControlled ? value : internalValue;
 const selectedOption = options.find((o) => o.value === selectedValue) ?? null;

 const [open, setOpen] = useState(false);
 const [activeIndex, setActiveIndex] = useState<number>(() => options.findIndex((o) => !o.disabled));

 // Used for WAI-ARIA keyboard typeahead navigation
 const typeaheadRef = useRef({ buffer: '', lastTime: 0 });
 const triggerRef = useRef<HTMLButtonElement | null>(null);
 const activeOptionRef = useRef<HTMLDivElement | null>(null);

 const reactId = React.useId();
 const baseId = id ?? reactId;
 const listboxId = `${baseId}-listbox`;
 const labelId = `${baseId}-label`;

 const { refs, x, y, placement } = useFloating<HTMLButtonElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(4),
 flip({ padding: 16, fallbackPlacements: ['top-start', 'bottom-start'] }),
 shift({ padding: 16 }),
 size({
 apply({ rects, elements }) {
 Object.assign(elements.floating.style, {
 width: `${rects.reference.width}px`,
 });
 },
 }),
 ],
 });

 const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
 triggerRef.current = node;
 refs.setReference(node);
 if (typeof ref === 'function') ref(node);
 else if (ref) ref.current = node;
 }, [ref, refs]);

 /* ----------------------------------------------------
 Focus & Scroll Management
 ---------------------------------------------------- */
 const closeList = useCallback(() => {
 setOpen(false);
 restoreFocus(triggerRef.current);
 }, []);

 useEffect(() => {
 if (!open) return;
 // We pass refs.floating.current instead of listRef.current
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => setOpen(false));
 return cleanup;
 }, [open, refs.floating]);

 useEffect(() => {
 if (!open) return;
 // Set active index to the currently selected item, or the first available option
 const selIndex = options.findIndex((o) => o.value === selectedValue && !o.disabled);
 const idx = selIndex >= 0 ? selIndex : options.findIndex((o) => !o.disabled);
 setActiveIndex(idx >= 0 ? idx : -1);

 // Defer focus to ensure Portal is rendered
 const timeoutId = setTimeout(() => {
 if (refs.floating.current) (refs.floating.current as HTMLElement).focus();
 }, 10);
 return () => clearTimeout(timeoutId);
 }, [open, options, selectedValue, refs.floating]);

 // Auto-scroll to active item when navigating via keyboard
 useEffect(() => {
 if (open && activeOptionRef.current) {
 activeOptionRef.current.scrollIntoView({ block: 'nearest' });
 }
 }, [activeIndex, open]);

 /* ----------------------------------------------------
 Event Handlers
 ---------------------------------------------------- */
 const selectIndex = useCallback((i: number) => {
 if (i < 0 || i >= options.length) return;
 const opt = options[i];
 if (opt.disabled) return;
 if (!isControlled) setInternalValue(opt.value);
 onChange?.(opt.value);
 setOpen(false);
 triggerRef.current?.focus();
 }, [isControlled, options, onChange]);

 const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
 if (disabled) return;
 if (['ArrowDown', 'ArrowUp', '', 'Enter'].includes(e.key)) {
 e.preventDefault();
 setOpen(true);
 }
 };

 const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
 const key = e.key;
 if (key === 'ArrowDown') {
 e.preventDefault();
 const next = findNextEnabled(options, activeIndex, 1);
 if (next >= 0) setActiveIndex(next);
 } else if (key === 'ArrowUp') {
 e.preventDefault();
 const prev = findNextEnabled(options, activeIndex, -1);
 if (prev >= 0) setActiveIndex(prev);
 } else if (key === 'Home') {
 e.preventDefault();
 const first = options.findIndex((o) => !o.disabled);
 if (first >= 0) setActiveIndex(first);
 } else if (key === 'End') {
 e.preventDefault();
 const last = options.length - 1 - [...options].reverse().findIndex((o) => !o.disabled);
 if (last >= 0) setActiveIndex(last);
 } else if (key === 'Enter' || key === ' ') {
 e.preventDefault();
 if (activeIndex >= 0) selectIndex(activeIndex);
 } else if (key === 'Escape') {
 e.preventDefault();
 closeList();
 } else if (key.length === 1 && key.match(/\S/)) {
 // Typeahead logic
 const now = Date.now();
 if (now - typeaheadRef.current.lastTime > 700) typeaheadRef.current.buffer = '';
 typeaheadRef.current.buffer += key.toLowerCase();
 typeaheadRef.current.lastTime = now;

 const buf = typeaheadRef.current.buffer;
 const start = activeIndex >= 0 ? activeIndex + 1 : 0;
 const len = options.length;
 for (let i = 0; i < len; i++) {
 const idx = (start + i) % len;
 const lab = String(options[idx].label).toLowerCase();
 if (!options[idx].disabled && lab.startsWith(buf)) {
 setActiveIndex(idx);
 break;
 }
 }
 }
 };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div className={cn("relative block w-full font-sans", className)}>
 {/* Hidden input for native form submission */}
 {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}

 <button
 ref={setTriggerRef}
 id={labelId}
 type="button"
 className={cn("flex min-h-[40px] w-full items-center justify-between rounded-md border border-default bg-surface px-3 py-2 text-left text-sm text-default shadow-sm transition-all duration-200 active:scale-[0.98] hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle", error && "border-danger focus-visible:ring-danger")}
 aria-haspopup="listbox"
 aria-expanded={open}
 aria-controls={open ? listboxId : undefined}
 aria-disabled={disabled || undefined}
 onClick={() => !disabled && setOpen((s) => !s)}
 onKeyDown={onTriggerKeyDown}
 disabled={disabled}
 {...props}
 >
 <span className="truncate">
 {selectedOption ? (
 selectedOption.label
 ) : (
 <span className="text-muted">{placeholder}</span>
 )}
 </span>
 <svg className={cn("ml-2 h-4 w-4 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="6 9 12 15 18 9"></polyline>
 </svg>
 </button>

 <AnimatePresence>
 {open && (
 <Portal>
 <motion.div
 initial={{ opacity: 0, y: -5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 transition={{ duration: 0.15, ease: "easeOut" }}
 id={listboxId}
 ref={refs.setFloating}
 className="z-50 max-h-60 overflow-y-auto rounded-md border border-default bg-glass backdrop-blur-md p-1 shadow-md outline-none"
 role="listbox"
 aria-labelledby={labelId}
 tabIndex={0}
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: placement.startsWith('top') ? 'bottom left' : 'top left',
 }}
 onKeyDown={onListKeyDown}
 >
 {options.map((opt, i) => {
 const isSelected = selectedValue === opt.value;
 const isActive = activeIndex === i;
 return (
 <div
 key={opt.value}
 ref={isActive ? activeOptionRef : null}
 id={`${listboxId}-option-${i}`}
 role="option"
 aria-selected={isSelected}
 aria-disabled={opt.disabled || undefined}
 className={cn(
 "flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm text-default outline-none transition-colors duration-200",
 isActive && !opt.disabled && "bg-subtle text-default",
 isSelected && "font-bold text-default",
 isSelected && isActive && !opt.disabled && "bg-subtle",
 opt.disabled && "cursor-not-allowed opacity-50 disabled:bg-transparent"
 )}
 tabIndex={-1}
 onMouseDown={(e) => e.preventDefault()} 
 onClick={() => !opt.disabled && selectIndex(i)}
 onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
 >
 <span className="truncate">{opt.label}</span>
 {isSelected && (
 <svg className="ml-2 shrink-0 text-default" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="20 6 9 17 4 12"></polyline>
 </svg>
 )}
 </div>
 );
 })}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
 </div>
 );
});
Select.displayName = 'Select';