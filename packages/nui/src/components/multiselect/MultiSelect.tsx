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
import { Checkbox } from '../checkbox/Checkbox';


/* ============================================================
 * Types
 * ============================================================ */

export type MultiSelectOption = {
 value: string;
 label: React.ReactNode;
 disabled?: boolean;
};

export interface MultiSelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
 /** Array of available options */
 options: MultiSelectOption[];
 /** Controlled state for selected values */
 value?: string[]; 
 /** Uncontrolled initial state for selected values */
 defaultValue?: string[]; 
 /** Callback fired when the selection changes */
 onChange?: (value: string[]) => void;
 /** Text displayed when no options are selected */
 placeholder?: string;
 /** Name attribute applied to hidden inputs for native form submission */
 name?: string; 
 /** Toggles error styling */
 error?: boolean;
 /** Number of tags to render before collapsing into a summary string (e.g., "3 selected") */
 maxTags?: number; 
}

/* Helper: find next enabled index given direction */
function findNextEnabled(options: MultiSelectOption[], start: number, direction: 1 | -1) {
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
 * MultiSelect Component
 * * A custom, WAI-ARIA compliant dropdown for selecting multiple options.
 * * Architecture Note: Unlike a standard Select, the dropdown list intentionally 
 * remains open after a selection is made, allowing the user to quickly select 
 * multiple items without repeatedly reopening the menu.
 */
export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(({
 options,
 value,
 defaultValue,
 onChange,
 placeholder = 'Select multiple...',
 disabled = false,
 error = false,
 name,
 id,
 className,
 maxTags = 3,
 ...props
}, ref) => {
 const isControlled = value !== undefined;
 const [internalValue, setInternalValue] = useState<string[]>(defaultValue || []);
 const selectedValues = isControlled ? value : internalValue;

 const [open, setOpen] = useState(false);
 const [activeIndex, setActiveIndex] = useState<number>(() => options.findIndex((o) => !o.disabled));

 // Used for keyboard typeahead navigation
 const typeaheadRef = useRef({ buffer: '', lastTime: 0 });
 const triggerRef = useRef<HTMLButtonElement | null>(null);
 const activeOptionRef = useRef<HTMLDivElement | null>(null);

 const reactId = React.useId();
 const baseId = id ?? reactId;
 const listboxId = `${baseId}-listbox`;
 const labelId = `${baseId}-label`;

 const { refs, x, y, placement: floatingPlacement } = useFloating<HTMLButtonElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(4),
 flip({ padding: 8, fallbackPlacements: ['top-start', 'bottom-start'] }),
 shift({ padding: 8, crossAxis: false }),
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
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => setOpen(false));
 return cleanup;
 }, [open, refs.floating]);

 useEffect(() => {
 if (!open) return;
 // Reset active index to first non-disabled item when opened
 const idx = options.findIndex((o) => !o.disabled);
 setActiveIndex(idx >= 0 ? idx : -1);
 
 // Defer focus slightly to ensure Portal has rendered
 const timeoutId = setTimeout(() => {
 if (refs.floating.current) (refs.floating.current as HTMLElement).focus();
 }, 10);
 return () => clearTimeout(timeoutId);
 }, [open, options, refs.floating]);

 // Auto-scroll to active item
 useEffect(() => {
 if (open && activeOptionRef.current) {
 activeOptionRef.current.scrollIntoView({ block: 'nearest' });
 }
 }, [activeIndex, open]);

 /* ----------------------------------------------------
 Event Handlers
 ---------------------------------------------------- */
 const toggleOption = useCallback((optValue: string) => {
 const isSelected = selectedValues.includes(optValue);
 const nextValues = isSelected 
 ? selectedValues.filter(v => v !== optValue) 
 : [...selectedValues, optValue];

 if (!isControlled) setInternalValue(nextValues);
 onChange?.(nextValues);
 
 // WAI-ARIA Standard: Do not close the dropdown for Multi-Select!
 // Refocus the list so the user can keep navigating via keyboard.
 if (refs.floating.current) (refs.floating.current as HTMLElement).focus();
 }, [isControlled, selectedValues, onChange, refs.floating]);

 const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
 if (disabled) return;
 if (['ArrowDown', 'ArrowUp', '', 'Enter'].includes(e.key)) {
 e.preventDefault();
 setOpen(true);
 } else if (e.key === 'Escape' && open) {
 e.preventDefault();
 closeList();
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
 if (activeIndex >= 0) {
 const opt = options[activeIndex];
 if (!opt.disabled) toggleOption(opt.value);
 }
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
 Trigger Rendering Logic
 ---------------------------------------------------- */
 const renderTriggerContent = () => {
 if (selectedValues.length === 0) {
 return <span className="py-1 text-muted">{placeholder}</span>;
 }

 if (selectedValues.length > maxTags) {
 return (
 <span className="font-medium text-default">
 {selectedValues.length} items selected
 </span>
 );
 }

 // Render individual tags
 return (
 <div className="flex flex-wrap gap-1.5 py-0.5">
 {selectedValues.map(val => {
 const label = options.find(o => o.value === val)?.label ?? val;
 return (
 <span key={val} className="inline-flex items-center rounded bg-subtle px-2 py-0.5 text-xs font-medium text-default">
 {label}
 </span>
 );
 })}
 </div>
 );
 };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div className={cn("relative block w-full font-sans", className)}>
 
 {/* Hidden inputs for native form submission */}
 {name && selectedValues.map((val) => (
 <input key={val} type="hidden" name={name} value={val} />
 ))}

 <button
 ref={setTriggerRef}
 id={labelId}
 type="button"
 className={cn(
   "flex min-h-[40px] w-full items-center justify-between rounded-md border border-solid border-default bg-surface px-3 py-2 text-left text-sm text-default transition-all duration-200 hover:border-strong focus-visible:outline-none focus-visible:border-[var(--nui-fg-default)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle", 
   error && "border-danger focus-visible:ring-danger/20 focus-visible:border-danger"
 )}
 aria-haspopup="listbox"
 aria-expanded={open}
 aria-controls={open ? listboxId : undefined}
 aria-disabled={disabled || undefined}
 onClick={() => !disabled && setOpen((s) => !s)}
 onKeyDown={onTriggerKeyDown}
 disabled={disabled}
 {...props}
 >
 <div className="flex min-h-[28px] grow items-center overflow-hidden">
 {renderTriggerContent()}
 </div>
 <svg className={cn("ml-2 h-4 w-4 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <polyline points="6 9 12 15 18 9"></polyline>
 </svg>
 </button>

 {open && (
 <Portal>
 <div
 id={listboxId}
 ref={refs.setFloating}
 className="z-50 max-h-60 overflow-y-auto rounded-md border border-solid border-default bg-surface p-1.5 shadow-md outline-none animate-in fade-in zoom-in-95 font-sans box-border"
 role="listbox"
 aria-multiselectable="true"
 aria-labelledby={labelId}
 tabIndex={0}
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: floatingPlacement.startsWith('top') ? 'bottom left' : 'top left'
 }}
 onKeyDown={onListKeyDown}
 >
 {options.map((opt, i) => {
 const isSelected = selectedValues.includes(opt.value);
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
 "flex cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-sm text-default outline-none transition-colors duration-200",
 isActive && !opt.disabled && "bg-subtle",
 opt.disabled && "cursor-not-allowed opacity-50 disabled:bg-transparent"
 )}
 tabIndex={-1}
 onMouseDown={(e) => e.preventDefault()} 
 onClick={() => !opt.disabled && toggleOption(opt.value)}
 onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
 >
 
  {/* NUI Checkbox UI (visual only, click handled by parent) */}
  <div className="flex h-5 w-5 shrink-0 items-center justify-center pointer-events-none" aria-hidden="true">
    <Checkbox checked={isSelected} readOnly tabIndex={-1} />
  </div>

 <span className="truncate">{opt.label}</span>
 </div>
 );
 })}
 </div>
 </Portal>
 )}
 </div>
 );
});
MultiSelect.displayName = 'MultiSelect';