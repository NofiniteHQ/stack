"use client";

import {
 useState,
 useRef,
 useEffect,
 useMemo,
 useCallback,
 KeyboardEvent,
 useId,
} from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import { Button } from '../button/Button';

/* ----------------------------------------------------
 Helpers
---------------------------------------------------- */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function fromISO(s?: string | null): Date | null {
 if (!s) return null;
 const [y, m, d] = s.split('-').map(Number);
 const dt = new Date(y, m - 1, d);
 return Number.isNaN(dt.getTime()) ? null : dt;
}

const asDate = (v: Date | null | undefined): Date | null => (v ? v : null);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

/* ----------------------------------------------------
 Types
---------------------------------------------------- */
export interface DateRange {
 from?: string;
 to?: string;
}

export interface DateRangePickerProps {
 value?: DateRange;
 defaultValue?: DateRange;
 onChange?: (r: DateRange) => void;

 minDate?: string;
 maxDate?: string;

 placeholder?: string;
 locale?: string;

 id?: string;
 className?: string;

 nameFrom?: string;
 nameTo?: string;
 disabled?: boolean;
 
 formatDisplay?: (date: Date) => string;
}

/* ----------------------------------------------------
 Component
---------------------------------------------------- */
export function DateRangePicker({
 value,
 defaultValue,
 onChange,
 minDate,
 maxDate,
 placeholder = 'Pick range',
 locale = 'en-US',
 id,
 className,
 nameFrom,
 nameTo,
 disabled = false,
 formatDisplay,
}: DateRangePickerProps) {
 const fallbackId = useId();
 const triggerId = id || `daterange-trigger-${fallbackId}`;
 const dialogId = `daterange-dialog-${fallbackId}`;

 const controlled = value !== undefined;
 const [internal, setInternal] = useState<DateRange | undefined>(defaultValue);
 const range: DateRange = controlled ? value || {} : internal || {};

 const fromDate = fromISO(range.from);
 const toDate = fromISO(range.to);

 const today = new Date();
 const initialVisible = startOfMonth(fromDate ?? toDate ?? today);

 const [visible, setVisible] = useState<Date>(initialVisible);
 const [open, setOpen] = useState(false);
 const [showYMM, setShowYMM] = useState(false);

 const [activePart, setActivePart] = useState<'from' | 'to'>('from');

 const triggerRef = useRef<HTMLButtonElement | null>(null);
 const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
 const selectedYearRef = useRef<HTMLButtonElement | null>(null);
 
 const calendarRef = useRef<HTMLDivElement | null>(null);

 /* ----------------------------------------------------
 Smart Popover Position (with collision math)
 ---------------------------------------------------- */
 const { refs, x, y } = useFloating<HTMLElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: (reference, floating, update) => 
    autoUpdate(reference, floating, update, { animationFrame: false }),
 middleware: [
 offset(6),
 flip({ padding: 16, fallbackPlacements: ['top-start', 'bottom', 'top'], fallbackStrategy: 'initialPlacement' }),
 shift({ padding: 16 }),
 size({
   padding: 16,
   apply({ availableWidth, availableHeight, elements }) {
     Object.assign(elements.floating.style, {
       maxWidth: `${availableWidth}px`,
       maxHeight: `${availableHeight}px`,
     });
   },
 }),
 ],
 });

 /* ----------------------------------------------------
 Min/max
 ---------------------------------------------------- */
 const minDt = fromISO(minDate);
 const maxDt = fromISO(maxDate);

 const isDisabled = useCallback((d: Date) => {
 if (minDt && d < minDt) return true;
 if (maxDt && d > maxDt) return true;
 return false;
 }, [minDt, maxDt]);

 /* ----------------------------------------------------
 Drag select
 ---------------------------------------------------- */
 const [dragStart, setDragStart] = useState<Date | null>(null);
 const [dragEnd, setDragEnd] = useState<Date | null>(null);
 const [isDragging, setIsDragging] = useState(false);

 const inDragRange = useCallback((d: Date) => {
 if (!isDragging || !dragStart || !dragEnd) return false;
 const t = d.getTime();
 const a = dragStart.getTime();
 const b = dragEnd.getTime();
 return t >= Math.min(a, b) && t <= Math.max(a, b);
 }, [isDragging, dragStart, dragEnd]);

 /* ----------------------------------------------------
 Click outside to close & Restore Focus
 ---------------------------------------------------- */
 useEffect(() => {
 if (!open) return;
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
 setOpen(false);
 setShowYMM(false);
 });
 return cleanup;
 }, [open, refs.floating]);

 useEffect(() => {
 if (!open) return;
 const t = triggerRef.current;
 
 const timeoutId = setTimeout(() => {
 if (calendarRef.current && !showYMM) {
 calendarRef.current.focus();
 }
 }, 10);

 return () => {
 clearTimeout(timeoutId);
 restoreFocus(t);
 };
 }, [open, showYMM]);

 /* ------------------------------------------
 Auto-Scroll Year Selector
 ------------------------------------------- */
 useEffect(() => {
 if (showYMM && selectedYearRef.current) {
 selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
 }
 }, [showYMM]);

 /* ----------------------------------------------------
 Grid computation
 ---------------------------------------------------- */
 const grid = useMemo(() => {
 const first = startOfMonth(visible);
 const startDow = first.getDay();
 const total = daysInMonth(visible);
 const g: (number | null)[] = [];
 
 for (let i = 0; i < startDow; i++) g.push(null);
 for (let d = 1; d <= total; d++) g.push(d);
 while (g.length % 7 !== 0) g.push(null);
 return g;
 }, [visible]);

 const weekdays = useMemo(
 () => Array.from({ length: 7 }).map((_, i) =>
 new Date(2020, 5, 7 + i).toLocaleDateString(locale, { weekday: 'short' })
 ),
 [locale]
 );

 /* ----------------------------------------------------
 Month/year panel
 ---------------------------------------------------- */
 const visibleYear = visible.getFullYear();
 const YEAR_SPAN = 100;
 const yearStart = visibleYear - YEAR_SPAN;

 const years = useMemo(
 () => Array.from({ length: YEAR_SPAN * 2 + 1 }).map((_, i) => yearStart + i),
 [yearStart]
 );

 const months = useMemo(
 () => Array.from({ length: 12 }).map((_, i) =>
 new Date(2020, i, 1).toLocaleDateString(locale, { month: 'short' })
 ),
 [locale]
 );

 const isMonthDisabled = useCallback((y: number, m: number) => {
 const s = new Date(y, m, 1);
 const e = new Date(y, m, daysInMonth(s));
 if (minDt && e < minDt) return true;
 if (maxDt && s > maxDt) return true;
 return false;
 }, [minDt, maxDt]);

 /* ----------------------------------------------------
 Normalize + commit range
 ---------------------------------------------------- */
 const normalizeRange = (a: Date | null, b: Date | null) => {
 if (!a && !b) return { from: undefined, to: undefined };
 if (!a) return { from: undefined, to: b ? toISO(b) : undefined };
 if (!b) return { from: toISO(a), to: undefined };

 return a.getTime() <= b.getTime()
 ? { from: toISO(a), to: toISO(b) }
 : { from: toISO(b), to: toISO(a) };
 };

 const commitRange = useCallback((a: Date | null, b: Date | null) => {
 const out = normalizeRange(a, b);
 if (!controlled) setInternal(out);
 onChange?.(out);
 }, [onChange, controlled]);

 /* ----------------------------------------------------
 Clicking days
 ---------------------------------------------------- */
 const pickDay = (d: number) => {
 const dt = new Date(visible.getFullYear(), visible.getMonth(), d);
 if (isDisabled(dt)) return;

 let s = fromDate;
 let e = toDate;

 if (activePart === 'from') {
 s = dt;
 if (e && dt > e) e = null;
 setActivePart('to'); 
 } else {
 e = dt;
 if (s && dt < s) {
 s = dt;
 e = null;
 }
 }

 commitRange(asDate(s), asDate(e));
 };

 /* ----------------------------------------------------
 Drag end (global)
 ---------------------------------------------------- */
 useEffect(() => {
 const stopDrag = () => {
 if (!isDragging) return;
 setIsDragging(false);

 if (dragStart && dragEnd) {
 if (dragStart.getTime() !== dragEnd.getTime()) {
 const s = dragStart <= dragEnd ? dragStart : dragEnd;
 const e = dragStart <= dragEnd ? dragEnd : dragStart;
 commitRange(s, e);
 setActivePart('from');
 }
 }

 setDragStart(null);
 setDragEnd(null);
 };

 window.addEventListener('mouseup', stopDrag);
 return () => window.removeEventListener('mouseup', stopDrag);
 }, [isDragging, dragStart, dragEnd, commitRange]);

 /* ----------------------------------------------------
 Range flags
 ---------------------------------------------------- */
 const inRange = useCallback((dt: Date) => {
 if (!fromDate || !toDate) return false;
 return dt > fromDate && dt < toDate;
 }, [fromDate, toDate]);

 const isStart = useCallback((dt: Date) => 
 fromDate && dt.getTime() === fromDate.getTime()
 , [fromDate]);
 
 const isEnd = useCallback((dt: Date) => 
 toDate && dt.getTime() === toDate.getTime()
 , [toDate]);

 /* ----------------------------------------------------
 Keyboard nav
 ---------------------------------------------------- */
 const focusDay = (idx: number) => {
 if (idx < 0 || idx >= grid.length) return;
 const d = grid[idx];
 if (!d) return;
 const key = `${visible.getFullYear()}-${visible.getMonth()}-${d}`;
 dayRefs.current[key]?.focus();
 };

 const onCalendarKey = (e: KeyboardEvent<HTMLDivElement>) => {
 if (e.target === calendarRef.current && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
 e.preventDefault();
 
 const targetDate = fromDate || new Date();
 const d = (targetDate.getMonth() === visible.getMonth() && targetDate.getFullYear() === visible.getFullYear())
 ? targetDate.getDate()
 : 1;

 const idx = grid.findIndex((c) => c === d);
 
 if (idx !== -1) {
 focusDay(idx);
 } else {
 const firstValidIdx = grid.findIndex((c) => c !== null);
 if (firstValidIdx !== -1) focusDay(firstValidIdx);
 }
 }
 }

 const onDayKey = (e: KeyboardEvent<HTMLButtonElement>, day: number) => {
 const idx = grid.findIndex((c) => c === day);
 if (idx === -1) return;

 const cols = 7;
 let nextIdx: number | null = null;

 switch (e.key) {
 case 'ArrowRight': nextIdx = idx + 1; break;
 case 'ArrowLeft': nextIdx = idx - 1; break;
 case 'ArrowDown': nextIdx = idx + cols; break;
 case 'ArrowUp': nextIdx = idx - cols; break;
 case 'Enter':
 case ' ':
 e.preventDefault();
 pickDay(day);
 return;
 case 'PageUp':
 setVisible((v) => addMonths(v, -1));
 return;
 case 'PageDown':
 setVisible((v) => addMonths(v, 1));
 return;
 case 'Escape':
 setOpen(false);
 return;
 default: return;
 }

 e.preventDefault();
 if (nextIdx != null && grid[nextIdx] != null) focusDay(nextIdx);
 };

 /* ----------------------------------------------------
 Trigger label (with formatting)
 ---------------------------------------------------- */
 const formatLabel = (iso?: string) => {
 if (!iso) return null;
 const d = fromISO(iso);
 if (!d) return null;
 return formatDisplay 
 ? formatDisplay(d)
 : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
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
 <div className={cn("inline-block font-sans", className)}>
 {nameFrom && <input type="hidden" name={nameFrom} value={range.from ?? ''} />}
 {nameTo && <input type="hidden" name={nameTo} value={range.to ?? ''} />}

 <button
 id={triggerId}
 ref={(node) => {
 triggerRef.current = node;
 refs.setReference(node);
 }}
 type="button"
 disabled={disabled}
 className={cn(
 "flex items-center justify-between gap-2 w-full sm:w-[280px] px-2.5 py-1.5 bg-surface text-default text-sm border border-default rounded-md shadow-sm transition-colors duration-200",
 "hover:border-default hover:bg-subtle",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 "disabled:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:border-default"
 )}
 aria-haspopup="dialog"
 aria-expanded={open}
 aria-controls={open ? dialogId : undefined}
 onClick={() => {
 setOpen((s) => !s);
 setShowYMM(false);
 if (!range.from && !range.to) {
 setActivePart('from');
 }
 }}
 >
 <span className={cn("truncate", (!range.from && !range.to) && "text-muted")}>
 {label()}
 </span>
 <svg className="text-muted shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
 <line x1="16" y1="2" x2="16" y2="6"></line>
 <line x1="8" y1="2" x2="8" y2="6"></line>
 <line x1="3" y1="10" x2="21" y2="10"></line>
 </svg>
 </button>

 <AnimatePresence>
 {open && (
 <Portal>
 <div
 ref={refs.setFloating}
 className="z-50"
 style={{ position: 'absolute', top: y ?? 0, left: x ?? 0 }}
 >
 <motion.div
 initial={{ opacity: 0, y: -4, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -4, scale: 0.98 }}
 transition={{ duration: 0.15, ease: "easeOut" }}
 id={dialogId}
 role="dialog"
 aria-modal="true"
 aria-label={placeholder || "Date range picker"}
 className="w-max p-3 bg-surface text-default border border-default rounded-lg shadow-lg"
 >
 
 {/* Internal Part Toggle */}
 <div className="flex gap-2 mb-4 p-1 bg-subtle rounded-md" role="tablist" aria-label="Select date part">
 <button
 type="button"
 role="tab"
 aria-selected={activePart === 'from'}
 className={cn(
 "flex-1 border-none bg-transparent py-1 rounded-sm text-xs font-medium text-muted cursor-pointer transition-all duration-200 hover:text-default",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 activePart === 'from' && "bg-surface text-default shadow-sm ring-1 ring-default"
 )}
 onClick={() => setActivePart('from')}
 >
 Start Date
 </button>
 <button
 type="button"
 role="tab"
 aria-selected={activePart === 'to'}
 disabled={!range.from}
 className={cn(
 "flex-1 border-none bg-transparent py-1 rounded-sm text-xs font-medium text-muted cursor-pointer transition-all duration-200 hover:text-default disabled:opacity-50 disabled:cursor-not-allowed",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 activePart === 'to' && "bg-surface text-default shadow-sm ring-1 ring-default"
 )}
 onClick={() => setActivePart('to')}
 >
 End Date
 </button>
 </div>

 {/* HEADER */}
 <div className="flex justify-between items-center mb-4">
 <Button
 type="button"
 variant="outline"
 className="h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100"
 onClick={() => setVisible((v) => addMonths(v, -1))}
 aria-label="Previous Month"
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
 </Button>

 <div
 className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
 aria-live="polite"
 onClick={() => setShowYMM((s) => !s)}
 >
 {visible.toLocaleDateString(locale, { month: 'long' })} {visible.getFullYear()}
 </div>

 <Button
 type="button"
 variant="outline"
 className="h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100"
 onClick={() => setVisible((v) => addMonths(v, 1))}
 aria-label="Next Month"
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
 </Button>
 </div>

 {/* YEAR + MONTH PANEL */}
 {showYMM && (
 <div className="flex flex-col gap-3 w-[252px]">
 <div className="grid grid-cols-4 gap-1 max-h-[180px] overflow-y-auto pr-1">
 {years.map((y) => {
 const sel = y === visible.getFullYear();
 return (
 <button
 type="button"
 key={y}
 ref={sel ? selectedYearRef : null}
 className={cn(
 "py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200",
 "hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle",
 sel && "bg-primary text-inverse hover:bg-primary"
 )}
 onClick={() => setVisible(startOfMonth(new Date(y, visible.getMonth(), 1)))}
 aria-pressed={sel}
 >
 {y}
 </button>
 );
 })}
 </div>

 <div className="grid grid-cols-3 gap-1 pt-3 border-t border-default">
 {months.map((ml, i) => {
 const disabled = isMonthDisabled(visible.getFullYear(), i);
 const sel = i === visible.getMonth();
 return (
 <button
 type="button"
 key={i}
 className={cn(
 "py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200",
 "hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle",
 disabled && "text-muted opacity-50 cursor-not-allowed hover:bg-transparent",
 sel && "bg-primary text-inverse hover:bg-primary"
 )}
 disabled={disabled ? true : undefined}
 onClick={() => {
 if (!disabled) {
 setVisible(startOfMonth(new Date(visible.getFullYear(), i, 1)));
 setShowYMM(false);
 }
 }}
 aria-pressed={sel}
 >
 {ml}
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* CALENDAR */}
 {!showYMM && (
 <div 
 className="flex flex-col space-y-2" 
 role="grid"
 aria-label="Calendar"
 ref={calendarRef}
 tabIndex={-1}
 onKeyDown={onCalendarKey}
 style={{ outline: 'none' }}
 >
  <div className="flex" role="row">
  {weekdays.map((w, i) => (
  <div key={i} className="w-9 text-[0.8rem] font-normal text-muted text-center" role="columnheader" aria-label={w}>{w.slice(0,2)}</div>
  ))}
  </div>

  <div className="flex flex-col" role="rowgroup">
  {Array.from({ length: Math.ceil(grid.length / 7) }).map((_, rowIdx) => (
    <div key={rowIdx} className="flex w-full mt-2" role="row">
      {grid.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, colIdx) => {
  const idx = rowIdx * 7 + colIdx;
  if (cell === null) return <div key={idx} className="w-9 h-9" role="gridcell" />;

  const dt = new Date(visible.getFullYear(), visible.getMonth(), cell);
  const disabled = isDisabled(dt);

  const start = isStart(dt);
  const end = isEnd(dt);
  const between = inRange(dt);
  const drag = inDragRange(dt);
  
  const today = toISO(new Date()) === toISO(dt);

  const key = `${visible.getFullYear()}-${visible.getMonth()}-${cell}`;

  return (
  <div 
    key={key} 
    role="gridcell" 
    className={cn(
      "w-9 h-9 p-0 text-center relative focus-within:relative focus-within:z-20",
      (between || (start && drag) || (drag && !start && !end)) && "bg-subtle",
      start && (between || drag) && "rounded-l-md",
      end && between && "rounded-r-md",
      (!start && !end && drag && (colIdx === 0)) && "rounded-l-md",
      (!start && !end && drag && (colIdx === 6)) && "rounded-r-md"
    )}
  >
  <button
  type="button"
  aria-disabled={disabled}
  aria-selected={start || end || between}
  ref={(el) => { dayRefs.current[key] = el; }}
  disabled={disabled ? true : undefined}
  className={cn(
  "inline-flex items-center justify-center w-9 h-9 bg-transparent border border-transparent rounded-md text-sm font-normal text-default cursor-pointer transition-colors duration-200 z-10",
  "focus-visible:outline-none focus-visible:bg-subtle focus-visible:ring-1 focus-visible:ring-focus",
  (!start && !end && !disabled) && "hover:bg-subtle hover:text-default",
  (start || end) && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary",
  (today && !start && !end) && "border-primary text-primary",
  disabled && "text-muted cursor-not-allowed opacity-50 hover:bg-transparent"
  )}
  onClick={() => !disabled && pickDay(cell)}
  onKeyDown={(e) => onDayKey(e, cell)}
  onMouseDown={(e) => {
  if (disabled) return;
  e.preventDefault(); 
  setDragStart(dt);
  setDragEnd(dt);
  setIsDragging(true);
  }}
  onMouseEnter={() => {
  if (!isDragging || disabled) return;
  setDragEnd(dt);
  }}
  >
  {cell}
  </button>
  </div>
  );
  })}
  </div>
  ))}
  </div>
 </div>
 )}

 {/* FOOTER */}
 <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-default">
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={() => {
 const empty = { from: undefined, to: undefined };
 if (!controlled) setInternal(empty);
 onChange?.(empty);
 setActivePart('from');
 setOpen(false); 
 setShowYMM(false);
 }}
 >
 Clear
 </Button>

 <Button
 type="button"
 variant="primary"
 size="sm"
 onClick={() => {
 setOpen(false);
 setShowYMM(false);
 }}
 >
 Apply
 </Button>
 </div>
 </motion.div>
 </div>
 </Portal>
 )}
 </AnimatePresence>
 </div>
 );
}