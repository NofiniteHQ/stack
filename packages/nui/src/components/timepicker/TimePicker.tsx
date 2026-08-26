"use client";

import React, {
 useState,
 useRef,
 useEffect,
 useMemo,
 forwardRef,
 useId,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import { Button } from '../button/Button';

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

// Converts 12h/24h selections back into standard HH:mm HTML format
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
export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
 /** Standard HTML5 time format: HH:mm (24-hour format internally) */
 value?: string; 
 /** Uncontrolled default time */
 defaultValue?: string;
 /** Callback fired when a time segment is selected */
 onChange?: (v: string) => void;
 
 /** 12-hour or 24-hour clock formatting. Defaults to 12. */
 clockType?: 12 | 24;
 /** Step interval for the minute column. Defaults to 1. */
 minuteStep?: number; 
 
 /** Placeholder text when empty */
 placeholder?: string;
 /** Name attribute for the hidden input (for native forms) */
 name?: string;
 /** Disables the time picker trigger */
 disabled?: boolean;
}

/* ----------------------------------------------------
 Component
---------------------------------------------------- */

/**
 * TimePicker Component
 * * A highly usable dropdown for selecting hours, minutes, and periods.
 * * Uses smart positioning and automatic scroll-to-selected logic.
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(({
 value,
 defaultValue,
 onChange,
 clockType = 12,
 minuteStep = 1,
 placeholder = 'Select time',
 id,
 className,
 name,
 disabled = false,
 ...props
}, ref) => {
 const controlled = value !== undefined;
 const [internal, setInternal] = useState<string | undefined>(defaultValue);
 const selectedTime = controlled ? value : internal;

 const [open, setOpen] = useState(false);
 const [isMounted, setIsMounted] = useState(false);
 
 useEffect(() => {
 setIsMounted(true);
 }, []);

 const generatedId = useId();
 const dialogId = id || `timepicker-${generatedId}`;

 // Refs for positioning and click-outside
 const triggerRef = useRef<HTMLButtonElement | null>(null);

 const { refs, x, y, placement } = useFloating<HTMLElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(4),
 flip({ padding: 16, fallbackPlacements: ['top-start'] }),
 shift({ padding: 16 }),
 ],
 });

 // Refs for scroll columns
 const hourColRef = useRef<HTMLDivElement | null>(null);
 const minColRef = useRef<HTMLDivElement | null>(null);
 const ampmColRef = useRef<HTMLDivElement | null>(null);

 // Parse current selection for UI
 const parsed = parseTime(selectedTime, clockType) || {
 hour: clockType === 12 ? 12 : 0,
 minute: 0,
 ampm: 'AM' as const,
 };

 /* ----------------------------------------------------
 Click outside & Restore Focus
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
  Auto-Scroll and Initial Focus
  ---------------------------------------------------- */
  useEffect(() => {
  if (!open) return;
  // Wait a tick for the popover to render and measure
  const timer = setTimeout(() => {
  [hourColRef, minColRef, ampmColRef].forEach((colRef, idx) => {
  if (!colRef.current) return;
  const selectedEl = colRef.current.querySelector('[aria-selected="true"]') as HTMLElement;
  if (selectedEl) {
  selectedEl.scrollIntoView({ block: 'center', behavior: 'instant' });
  // Focus the selected item in the first column for keyboard navigation
  if (idx === 0) selectedEl.focus({ preventScroll: true });
  } else if (idx === 0) {
  const firstEl = colRef.current.querySelector('button') as HTMLElement;
  if (firstEl) firstEl.focus({ preventScroll: true });
  }
  });
  }, 10);
  return () => clearTimeout(timer);
  }, [open]);

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
 if (!controlled) setInternal(newVal);
 onChange?.(newVal);
 };

 /* ----------------------------------------------------
 Display Label
 ---------------------------------------------------- */
 const formatDisplay = () => {
 if (!selectedTime) return placeholder;
 const p = parseTime(selectedTime, clockType);
 if (!p) return placeholder;
 return clockType === 12 
 ? `${pad(p.hour)}:${pad(p.minute)} ${p.ampm}`
 : `${pad(p.hour)}:${pad(p.minute)}`;
 };

  /* ----------------------------------------------------
  Keyboard Navigation
  ---------------------------------------------------- */
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  if (disabled) return;
  if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
  e.preventDefault();
  setOpen(true);
  }
  };

  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Escape') {
  e.preventDefault();
  setOpen(false);
  triggerRef.current?.focus();
  return;
  }

  const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
  if (!isArrow) return;
  e.preventDefault();

  const cols = [hourColRef, minColRef];
  if (clockType === 12) cols.push(ampmColRef);

  const activeEl = document.activeElement as HTMLElement;
  let colIdx = cols.findIndex(col => col.current?.contains(activeEl));
  if (colIdx === -1) colIdx = 0;

  const col = cols[colIdx].current;
  if (!col) return;

  if (e.key === 'ArrowLeft') {
  const prevCol = cols[Math.max(0, colIdx - 1)].current;
  const target = (prevCol?.querySelector('[aria-selected="true"]') as HTMLElement) || prevCol?.querySelector('button');
  target?.focus();
  } else if (e.key === 'ArrowRight') {
  const nextCol = cols[Math.min(cols.length - 1, colIdx + 1)].current;
  const target = (nextCol?.querySelector('[aria-selected="true"]') as HTMLElement) || nextCol?.querySelector('button');
  target?.focus();
  } else {
  const btns = Array.from(col.querySelectorAll('button'));
  const idx = btns.indexOf(activeEl as HTMLButtonElement);
  if (idx === -1) {
  btns[0]?.focus();
  } else {
  const nextIdx = e.key === 'ArrowDown' 
  ? (idx + 1) % btns.length 
  : (idx - 1 + btns.length) % btns.length;
  btns[nextIdx]?.focus();
  }
  }
  };

 /* ----------------------------------------------------
 Render
 ---------------------------------------------------- */
 return (
 <div ref={ref} className={cn("inline-block font-sans", className)} {...props}>
 {name && <input type="hidden" name={name} value={selectedTime ?? ''} />}

 <Button
 variant="outline"
 id={`${dialogId}-trigger`}
 ref={(node) => {
 triggerRef.current = node;
 refs.setReference(node);
 }}
 type="button"
 disabled={disabled}
 className={cn(
 "flex items-center justify-between w-full sm:w-[140px] px-2.5 py-1.5 h-auto font-normal text-sm",
 !selectedTime && "text-muted"
 )}
 aria-haspopup="dialog"
 aria-expanded={open}
 aria-controls={open ? dialogId : undefined}
 onClick={() => setOpen((s) => !s)}
 onKeyDown={onTriggerKeyDown}
 iconRight={
 <svg className="text-muted shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="12" cy="12" r="10"></circle>
 <polyline points="12 6 12 12 16 14"></polyline>
 </svg>
 }
 >
 <span className="truncate block w-full text-left">
 {formatDisplay()}
 </span>
 </Button>

 {isMounted && (
 <Portal>
 <AnimatePresence>
 {open && (
 <motion.div
 key="timepicker-dialog"
 ref={refs.setFloating}
 className="z-50"
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: placement.startsWith('top') ? 'bottom left' : 'top left'
 }}
 initial={{ opacity: 0, y: -4, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -4, scale: 0.95 }}
 transition={{ duration: 0.15, ease: 'easeOut' }}
 >
 <div 
 id={dialogId}
 role="dialog"
 aria-modal="true"
 aria-label="Time picker"
 className="bg-surface text-default border border-default rounded-lg shadow-lg p-3 focus-visible:outline-none"
 tabIndex={-1}
 onKeyDown={onDialogKeyDown}
 >
 <div className="flex h-[220px] rounded-md overflow-hidden focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]">
 
 {/* HOURS */}
 <div role="listbox" aria-label="Hours" className="flex flex-1 flex-col overflow-y-auto p-2 min-w-[72px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide" ref={hourColRef}>
 {hours.map((h) => {
 const sel = parsed.hour === h;
 return (
 <button
 key={`h-${h}`}
 role="option"
 aria-selected={sel}
 className={cn(
 "shrink-0 flex items-center justify-center h-9 w-full min-w-[40px] mx-auto bg-transparent border-none rounded-md text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]",
 sel && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary"
 )}
 onClick={() => commit(h, parsed.minute, parsed.ampm)}
 >
 {pad(h)}
 </button>
 );
 })}
 </div>

 {/* MINUTES */}
 <div role="listbox" aria-label="Minutes" className="flex flex-1 flex-col overflow-y-auto p-2 min-w-[72px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide" ref={minColRef}>
 {minutes.map((m) => {
 const sel = parsed.minute === m;
 return (
 <button
 key={`m-${m}`}
 role="option"
 aria-selected={sel}
 className={cn(
 "shrink-0 flex items-center justify-center h-9 w-full min-w-[40px] mx-auto bg-transparent border-none rounded-md text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]",
 sel && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary"
 )}
 onClick={() => commit(parsed.hour, m, parsed.ampm)}
 >
 {pad(m)}
 </button>
 );
 })}
 </div>

 {/* AM / PM (Only for 12h clock) */}
 {clockType === 12 && (
 <div role="listbox" aria-label="AM/PM" className="flex flex-1 flex-col overflow-y-auto p-2 min-w-[72px] border-r border-default last:border-r-0 scroll-smooth scrollbar-hide" ref={ampmColRef}>
 {(['AM', 'PM'] as const).map((a) => {
 const sel = parsed.ampm === a;
 return (
 <button
 key={a}
 role="option"
 aria-selected={sel}
 className={cn(
 "shrink-0 flex items-center justify-center h-9 w-full min-w-[40px] mx-auto bg-transparent border-none rounded-md text-default text-sm cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]",
 sel && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary"
 )}
 onClick={() => commit(parsed.hour, parsed.minute, a)}
 >
 {a}
 </button>
 );
 })}
 </div>
 )}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </Portal>
 )}
 </div>
 );
});

TimePicker.displayName = 'TimePicker';
