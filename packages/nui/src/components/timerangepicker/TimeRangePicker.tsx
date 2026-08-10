"use client";

import React, {
 useState,
 useRef,
 useEffect,
 useMemo,
 useCallback,
 useLayoutEffect,
 forwardRef,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';

/* ----------------------------------------------------
 Helpers
---------------------------------------------------- */
const pad = (n: number | string) => String(n).padStart(2, '0');

interface ParsedTime {
 hour: number;
 minute: number;
 ampm: 'AM' | 'PM' | null;
}

function parseTime(timeStr?: string, clockType: 12 | 24 = 12): ParsedTime | null {
 if (!timeStr) return null;
 const [hStr, mStr] = timeStr.split(':');
 let h = parseInt(hStr, 10);
 const m = parseInt(mStr, 10);

 if (isNaN(h) || isNaN(m)) return null;

 if (clockType === 24) {
 return { hour: h, minute: m, ampm: null };
 }

 const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
 h = h % 12;
 h = h ? h : 12; 
 return { hour: h, minute: m, ampm };
}

function buildTime(hour: number, minute: number, ampm: 'AM' | 'PM' | null, clockType: 12 | 24) {
 let h = hour;
 if (clockType === 12) {
 if (ampm === 'PM' && h < 12) h += 12;
 if (ampm === 'AM' && h === 12) h = 0;
 }
 return `${pad(h)}:${pad(minute)}`;
}

/* ----------------------------------------------------
 Types
---------------------------------------------------- */
export interface TimeRange {
 from?: string; // Standard HH:mm format
 to?: string; // Standard HH:mm format
}

export interface TimeRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
 /** Controlled time range object */
 value?: TimeRange;
 /** Uncontrolled default time range object */
 defaultValue?: TimeRange;
 /** Callback fired when either the start or end time changes */
 onChange?: (v: TimeRange) => void;
 
 /** Uses 12-hour or 24-hour clock formatting. Defaults to 12. */
 clockType?: 12 | 24;
 /** Step interval for the minute column. Defaults to 1. */
 minuteStep?: number;
 
 /** Placeholder text displayed when no range is selected */
 placeholder?: string;
 /** Name attribute applied to the "from" hidden input for native forms */
 nameFrom?: string;
 /** Name attribute applied to the "to" hidden input for native forms */
 nameTo?: string;
 /** Disables the picker entirely */
 disabled?: boolean;
}

/* ----------------------------------------------------
 Component
---------------------------------------------------- */

/**
 * TimeRangePicker Component
 * * A dual-state dropdown for selecting a start and end time.
 * * Features automatic scrolling, safe boundary positioning, and WAI-ARIA compliance.
 */
export const TimeRangePicker = forwardRef<HTMLDivElement, TimeRangePickerProps>(({
 value,
 defaultValue,
 onChange,
 clockType = 12,
 minuteStep = 1,
 placeholder = 'Select time range',
 id,
 className,
 nameFrom,
 nameTo,
 disabled = false,
 ...props
}, ref) => {
 const controlled = value !== undefined;
 const [internal, setInternal] = useState<TimeRange | undefined>(defaultValue);
 const range: TimeRange = controlled ? value || {} : internal || {};

 const [open, setOpen] = useState(false);
 const [activePart, setActivePart] = useState<'from' | 'to'>('from');

 const triggerRef = useRef<HTMLButtonElement | null>(null);

 const { refs, x, y } = useFloating<HTMLElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(4),
 flip({ padding: 16, fallbackPlacements: ['top-start'] }),
 shift({ padding: 16 }),
 ],
 });

 const hourColRef = useRef<HTMLDivElement | null>(null);
 const minColRef = useRef<HTMLDivElement | null>(null);
 const ampmColRef = useRef<HTMLDivElement | null>(null);

 // Parse the currently active time part for the scroll wheels
 const activeTimeStr = activePart === 'from' ? range.from : range.to;
 const parsed = parseTime(activeTimeStr, clockType) || {
 hour: clockType === 12 ? 12 : 0,
 minute: 0,
 ampm: 'AM' as const,
 };

 /* ----------------------------------------------------
 Click Outside & Focus Management
 ---------------------------------------------------- */
 useEffect(() => {
 if (!open) return;
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => setOpen(false));
 return cleanup;
 }, [open, refs.floating]);

 useEffect(() => {
 if (!open && triggerRef.current) restoreFocus(triggerRef.current);
 }, [open]);


 /* ----------------------------------------------------
 Auto-Scroll to Selected Item
 ---------------------------------------------------- */
 // We run this effect when `open` changes AND when `activePart` changes!
 useEffect(() => {
 if (!open) return;
 const timer = setTimeout(() => {
 [hourColRef, minColRef, ampmColRef].forEach((colRef) => {
 if (!colRef.current) return;
 const selectedEl = colRef.current.querySelector('.selected');
 if (selectedEl) {
 selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
 }
 });
 }, 10);
 return () => clearTimeout(timer);
 }, [open, activePart]);

 /* ----------------------------------------------------
 Column Generation
 ---------------------------------------------------- */
 const hours = useMemo(() => {
 const length = clockType === 12 ? 12 : 24;
 const start = clockType === 12 ? 1 : 0;
 return Array.from({ length }).map((_, i) => start + i);
 }, [clockType]);

 const minutes = useMemo(() => {
 const arr = [];
 for (let i = 0; i < 60; i += minuteStep) arr.push(i);
 return arr;
 }, [minuteStep]);

 /* ----------------------------------------------------
 Commit Selections
 ---------------------------------------------------- */
 const commit = (h: number, m: number, a: 'AM' | 'PM' | null) => {
 const newVal = buildTime(h, m, a, clockType);
 const newRange = { ...range, [activePart]: newVal };
 
 if (!controlled) setInternal(newRange);
 onChange?.(newRange);
 };

 /* ----------------------------------------------------
 Display Label
 ---------------------------------------------------- */
 const formatLabel = (timeStr?: string) => {
 if (!timeStr) return null;
 const p = parseTime(timeStr, clockType);
 if (!p) return null;
 return clockType === 12 
 ? `${pad(p.hour)}:${pad(p.minute)} ${p.ampm}`
 : `${pad(p.hour)}:${pad(p.minute)}`;
 };

 const label = (): string => {
 if (!range.from && !range.to) return placeholder;
 const f = formatLabel(range.from);
 const t = formatLabel(range.to);
 
 if (f && !t) return `${f} → `;
 if (!f && t) return ` → ${t}`;
 return `${f} → ${t}`;
 };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div ref={ref} className={cn("inline-block font-sans", className)} {...props}>
 {nameFrom && <input type="hidden" name={nameFrom} value={range.from ?? ''} />}
 {nameTo && <input type="hidden" name={nameTo} value={range.to ?? ''} />}

 <button
 id={id}
 ref={(node) => {
 triggerRef.current = node;
 refs.setReference(node);
 }}
 type="button"
 disabled={disabled}
 className="flex items-center justify-between w-full sm:w-[240px] px-2.5 py-1.5 bg-surface text-default text-sm border border-default rounded-md shadow-sm transition-colors duration-200 hover:border-default hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:bg-muted disabled:text-muted disabled:cursor-not-allowed"
 aria-haspopup="dialog"
 aria-expanded={open}
 aria-controls={open ? `${id || 'time-picker'}-dialog` : undefined}
 onClick={() => {
 setOpen((s) => !s);
 setActivePart('from');
 }}
 >
 <span className={(!range.from && !range.to) ? "text-muted" : ""}>
 {label()}
 </span>
 <svg className="text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="12" cy="12" r="10"></circle>
 <polyline points="12 6 12 12 16 14"></polyline>
 </svg>
 </button>

 <AnimatePresence>
 {open && (
 <Portal>
 <div
 ref={refs.setFloating}
 className="z-50"
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: 'top left'
 }}
 >
 <motion.div 
 id={`${id || 'time-picker'}-dialog`}
 role="dialog"
 aria-modal="true"
 aria-label="Time range picker"
 initial={{ opacity: 0, scale: 0.95, y: -4 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -4 }}
 transition={{ duration: 0.15, ease: "easeOut" }}
 className="bg-glass backdrop-blur-md text-default border border-default rounded-lg shadow-xl p-3"
 >
 
 {/* Internal Part Toggle */}
 <div className="flex gap-2 mb-4 p-1 bg-subtle rounded-md" role="tablist">
 <button
 role="tab"
 aria-selected={activePart === 'from'}
 className={cn("flex-1 border-none bg-transparent py-1.5 rounded-sm text-sm text-muted cursor-pointer transition-all duration-200 hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", activePart === 'from' && "bg-surface text-default font-medium shadow-sm ring-1 ring-default")}
 onClick={() => setActivePart('from')}
 >
 Start Time
 </button>
 <button
 role="tab"
 aria-selected={activePart === 'to'}
 className={cn("flex-1 border-none bg-transparent py-1.5 rounded-sm text-sm text-muted cursor-pointer transition-all duration-200 hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", activePart === 'to' && "bg-surface text-default font-medium shadow-sm ring-1 ring-default")}
 onClick={() => setActivePart('to')}
 >
 End Time
 </button>
 </div>

 {/* Time Columns */}
 <div className="flex h-[200px] border border-default rounded-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
 {/* HOURS */}
 <div 
 role="listbox"
 aria-label="Hours"
 className="flex flex-col overflow-y-auto p-2 w-[68px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide focus-visible:outline-none" 
 ref={hourColRef}
 >
 {hours.map((h) => {
 const sel = parsed.hour === h;
 return (
 <button
 key={`h-${h}`}
 role="option"
 aria-selected={sel}
 className={cn("shrink-0 flex items-center justify-center h-9 w-full bg-transparent border-none rounded-sm text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", sel && "bg-primary text-inverse font-bold shadow-sm hover:bg-primary", sel && "selected")}
 onClick={() => commit(h, parsed.minute, parsed.ampm)}
 >
 {pad(h)}
 </button>
 );
 })}
 </div>

 {/* MINUTES */}
 <div 
 role="listbox"
 aria-label="Minutes"
 className="flex flex-col overflow-y-auto p-2 w-[68px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide focus-visible:outline-none" 
 ref={minColRef}
 >
 {minutes.map((m) => {
 const sel = parsed.minute === m;
 return (
 <button
 key={`m-${m}`}
 role="option"
 aria-selected={sel}
 className={cn("shrink-0 flex items-center justify-center h-9 w-full bg-transparent border-none rounded-sm text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", sel && "bg-primary text-inverse font-bold shadow-sm hover:bg-primary", sel && "selected")}
 onClick={() => commit(parsed.hour, m, parsed.ampm)}
 >
 {pad(m)}
 </button>
 );
 })}
 </div>

 {/* AM / PM */}
 {clockType === 12 && (
 <div 
 role="listbox"
 aria-label="AM or PM"
 className="flex flex-col overflow-y-auto p-2 w-[68px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide focus-visible:outline-none" 
 ref={ampmColRef}
 >
 {(['AM', 'PM'] as const).map((a) => {
 const sel = parsed.ampm === a;
 return (
 <button
 key={a}
 role="option"
 aria-selected={sel}
 className={cn("shrink-0 flex items-center justify-center h-9 w-full bg-transparent border-none rounded-sm text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", sel && "bg-primary text-inverse font-bold shadow-sm hover:bg-primary", sel && "selected")}
 onClick={() => commit(parsed.hour, parsed.minute, a)}
 >
 {a}
 </button>
 );
 })}
 </div>
 )}
 </div>

 {/* FOOTER */}
 <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-default">
 <button
 className="bg-transparent border-none px-3 py-1 rounded-sm text-sm text-muted cursor-pointer transition-colors duration-200 hover:bg-muted hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
 onClick={() => {
 const empty = { from: undefined, to: undefined };
 if (!controlled) setInternal(empty);
 onChange?.(empty);
 setOpen(false);
 }}
 >
 Clear
 </button>

 <button
 className="bg-muted border-none px-3 py-1 rounded-sm text-sm font-bold text-default cursor-pointer transition-colors duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
 onClick={() => setOpen(false)}
 >
 Apply
 </button>
 </div>

 </motion.div>
 </div>
 </Portal>
 )}
 </AnimatePresence>
 </div>
 );
});

TimeRangePicker.displayName = 'TimeRangePicker';