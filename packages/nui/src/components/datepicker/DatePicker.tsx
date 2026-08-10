"use client";

import { useState, useRef, useEffect, KeyboardEvent, useMemo, useCallback, useId } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../button/Button';

/* ------------------------------------------
 Helpers
------------------------------------------- */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function fromISO(s?: string | null): Date | null {
 if (!s) return null;
 const [y, m, d] = s.split('-').map(Number);
 const dt = new Date(y, m - 1, d);
 return Number.isNaN(dt.getTime()) ? null : dt;
}

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

/* ------------------------------------------
 Component Props
------------------------------------------- */
export interface DatePickerProps {
 /** Controlled value in YYYY-MM-DD format */
 value?: string; 
 /** Initial uncontrolled value in YYYY-MM-DD format */
 defaultValue?: string;
 onChange?: (v: string) => void;
 minDate?: string;
 maxDate?: string;
 placeholder?: string;
 name?: string;
 /** Used for formatting the display date and weekdays. Defaults to 'en-US' */
 locale?: string;
 id?: string;
 className?: string;
 disabled?: boolean;
 /** Custom formatter for the trigger button label */
 formatDisplay?: (date: Date) => string;
}

/* ------------------------------------------
 Component
------------------------------------------- */

/**
 * DatePicker Component
 * * A robust, accessible date selection tool.
 * Architecture Note: Implements smart collision detection to flip the popover
 * above the trigger if it hits the bottom of the viewport.
 */
export function DatePicker({
 value,
 defaultValue,
 onChange,
 minDate,
 maxDate,
 placeholder = 'Select date',
 name,
 locale = 'en-US',
 id,
 className,
 disabled = false,
 formatDisplay,
}: DatePickerProps) {
 const controlled = value !== undefined;
 const [internal, setInternal] = useState<string | undefined>(defaultValue);
 const selected = controlled ? value : internal;
 const selectedDate = fromISO(selected) ?? new Date();

 const generatedId = useId();
 const baseId = id || generatedId;
 const triggerId = `${baseId}-trigger`;
 const dialogId = `${baseId}-dialog`;

 const [visible, setVisible] = useState<Date>(startOfMonth(selectedDate));
 const [open, setOpen] = useState(false);
 const [showYMM, setShowYMM] = useState(false);

 const triggerRef = useRef<HTMLButtonElement | null>(null);
 const gridDayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
 const selectedYearRef = useRef<HTMLButtonElement | null>(null);
 const calendarRef = useRef<HTMLDivElement | null>(null);

 /* ------------------------------------------
 Positioning & Smart Collision
 ------------------------------------------- */
 const { refs, x, y, placement } = useFloating<HTMLElement>({
 open,
 placement: 'bottom-start',
 whileElementsMounted: (reference, floating, update) => 
    autoUpdate(reference, floating, update, { animationFrame: false }),
 middleware: [
 offset(4),
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

 /* ------------------------------------------
 Min/Max handling
 ------------------------------------------- */
 const minDt = fromISO(minDate) ?? undefined;
 const maxDt = fromISO(maxDate) ?? undefined;

 const isDisabledDate = useCallback((d: Date): boolean => {
 if (minDt && d < minDt) return true;
 if (maxDt && d > maxDt) return true;
 return false;
 }, [minDt, maxDt]);

 /* ------------------------------------------
 Click outside & Focus
 ------------------------------------------- */
 useEffect(() => {
 if (!open) return;
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
 setOpen(false);
 });
 return cleanup;
 }, [open, refs.floating]);

 useEffect(() => {
 if (!open) {
   setShowYMM(false);
   restoreFocus(triggerRef.current);
   return;
 }
 
 const timeoutId = setTimeout(() => {
 if (!showYMM) {
 const targetDate = fromISO(selected) || new Date();
 const d = (targetDate.getMonth() === visible.getMonth() && targetDate.getFullYear() === visible.getFullYear())
 ? targetDate.getDate()
 : 1;

 const key = `${visible.getFullYear()}-${visible.getMonth()}-${d}`;
 
 if (gridDayRefs.current[key]) {
 gridDayRefs.current[key]?.focus();
 } else {
 const firstValidKey = `${visible.getFullYear()}-${visible.getMonth()}-1`;
 gridDayRefs.current[firstValidKey]?.focus();
 }
 }
 }, 10);

 return () => clearTimeout(timeoutId);
 }, [open, showYMM, selected, visible]);

 /* ------------------------------------------
 Auto-Scroll Year Selector
 ------------------------------------------- */
 useEffect(() => {
 if (showYMM && selectedYearRef.current) {
 selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
 }
 }, [showYMM]);

 /* ------------------------------------------
 Calendar Grids
 ------------------------------------------- */
 const grid = useMemo(() => {
 const first = startOfMonth(visible);
 const startDow = first.getDay(); 
 const totalDays = daysInMonth(visible);
 
 const cells: (number | null)[] = [];

 for (let i = 0; i < startDow; i++) cells.push(null);
 for (let d = 1; d <= totalDays; d++) cells.push(d);
 while (cells.length % 7 !== 0) cells.push(null);

 return cells;
 }, [visible]);

 const rows = useMemo(() => {
 const r = [];
 for (let i = 0; i < grid.length; i += 7) {
 r.push(grid.slice(i, i + 7));
 }
 return r;
 }, [grid]);

 const weekdays = useMemo(
 () => Array.from({ length: 7 }).map((_, i) =>
 new Date(2020, 5, 7 + i).toLocaleDateString(locale, { weekday: 'short' })
 ),
 [locale]
 );

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

 const isMonthDisabled = useCallback((year: number, month: number): boolean => {
 const start = new Date(year, month, 1);
 const end = new Date(year, month, daysInMonth(start));
 if (minDt && end < minDt) return true;
 if (maxDt && start > maxDt) return true;
 return false;
 }, [minDt, maxDt]);

 /* ------------------------------------------
 Commit Selections
 ------------------------------------------- */
 const commitDay = (d: number) => {
 const dt = new Date(visible.getFullYear(), visible.getMonth(), d);
 if (isDisabledDate(dt)) return;

 const iso = toISO(dt);
 if (!controlled) setInternal(iso);
 onChange?.(iso);

 setOpen(false);
 setShowYMM(false);
 };

 const commitMonth = (month: number) => {
 setVisible(new Date(visible.getFullYear(), month, 1));
 setShowYMM(false);
 };

 const commitYear = (year: number) => {
 setVisible(new Date(year, visible.getMonth(), 1));
 };

 /* ------------------------------------------
 Keyboard Navigation
 ------------------------------------------- */
 const focusDayByIndex = (idx: number) => {
 if (idx < 0 || idx >= grid.length) return;
 const day = grid[idx];
 if (!day) return;
 const key = `${visible.getFullYear()}-${visible.getMonth()}-${day}`;
 gridDayRefs.current[key]?.focus();
 };

 const onCalendarKey = (e: KeyboardEvent<HTMLDivElement>) => {
 if (e.target === calendarRef.current && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
 e.preventDefault();
 
 const targetDate = fromISO(selected) || new Date();
 const d = (targetDate.getMonth() === visible.getMonth() && targetDate.getFullYear() === visible.getFullYear())
 ? targetDate.getDate()
 : 1;

 const idx = grid.findIndex((c) => c === d);
 
 if (idx !== -1) {
 focusDayByIndex(idx);
 } else {
 const firstValidIdx = grid.findIndex((c) => c !== null);
 if (firstValidIdx !== -1) focusDayByIndex(firstValidIdx);
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
 commitDay(day);
 return;
 case 'PageUp':
 e.preventDefault();
 setVisible((v) => addMonths(v, -1));
 return;
 case 'PageDown':
 e.preventDefault();
 setVisible((v) => addMonths(v, 1));
 return;
 case 'Escape':
 e.preventDefault();
 setOpen(false);
 return;
 default:
 return;
 }

 if (nextIdx !== null && nextIdx >= 0 && nextIdx < grid.length) {
 if (grid[nextIdx] !== null) {
 e.preventDefault();
 focusDayByIndex(nextIdx);
 }
 }
 };

 const headerMonthLabel = visible.toLocaleDateString(locale, { month: 'long' });
 const headerYearLabel = visible.getFullYear();

 /* ------------------------------------------
 Render
 ------------------------------------------- */
 return (
 <div className={cn("inline-block font-sans", className)}>
 {name && <input type="hidden" name={name} value={selected ?? ''} />}

 <button
 id={triggerId}
 ref={(node) => {
 triggerRef.current = node;
 refs.setReference(node);
 }}
 type="button"
 disabled={disabled}
 className={cn(
 "flex items-center justify-between gap-2 w-full sm:w-[240px] px-2.5 py-1.5 bg-surface text-default text-sm border border-default rounded-md shadow-sm transition-colors duration-200",
 "hover:border-default hover:bg-subtle",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
 "disabled:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:border-default"
 )}
 aria-haspopup="dialog"
 aria-expanded={open}
 aria-controls={open ? `${id || 'datepicker'}-dialog` : undefined}
 onClick={() => {
 setOpen((s) => !s);
 setShowYMM(false);
 }}
 >
 <span className={cn("truncate", !selected && "text-muted")}>
 {selected 
    ? (formatDisplay ? formatDisplay(fromISO(selected)!) : fromISO(selected)!.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }))
    : placeholder}
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
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.15, ease: 'easeOut' }}
 ref={refs.setFloating}
 className="z-50"
 style={{
 position: 'absolute',
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: placement.startsWith('top') ? 'bottom left' : 'top left',
 }}
role="dialog"
 aria-modal="true"
 aria-label={placeholder || "Date picker"}
 id={dialogId}
 >
  <div className="w-max p-3 bg-surface text-default border border-default rounded-lg shadow-lg">
  
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
  <Button
  type="button"
  variant="outline"
  className="h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100"
  aria-label="Previous month"
  onClick={() => setVisible((v) => addMonths(v, -1))}
  >
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </Button>

  <div
  className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
  onClick={() => setShowYMM((s) => !s)}
  aria-expanded={showYMM}
  >
  {headerMonthLabel} {headerYearLabel}
  </div>

  <Button
  type="button"
  variant="outline"
  className="h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100"
  aria-label="Next month"
  onClick={() => setVisible((v) => addMonths(v, 1))}
  >
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </Button>
  </div>

  {/* Year + Month Selector */}
  {showYMM && (
  <div className="flex flex-col gap-3 w-[252px]">
  <div className="grid grid-cols-4 gap-1 max-h-[180px] overflow-y-auto pr-1">
  {years.map((y) => {
  const sel = y === visible.getFullYear();
  return (
  <button
  key={y}
  ref={sel ? selectedYearRef : null}
  className={cn("py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle", sel && "bg-primary text-inverse hover:bg-primary")}
  onClick={() => commitYear(y)}
  >
  {y}
  </button>
  );
  })}
  </div>

  <div className="grid grid-cols-3 gap-1 pt-3 border-t border-default">
  {months.map((label, i) => {
  const disabled = isMonthDisabled(visible.getFullYear(), i);
  const sel = i === visible.getMonth();
  return (
  <button
  key={i}
  className={cn("py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle", disabled && "text-muted cursor-not-allowed hover:bg-transparent", sel && "bg-primary text-inverse hover:bg-primary")}
  disabled={disabled ? true : undefined}
  onClick={() => !disabled && commitMonth(i)}
  >
  {label}
  </button>
  );
  })}
  </div>
  </div>
  )}

  {/* Calendar Grid */}
  {!showYMM && (
  <div 
  className="flex flex-col space-y-2" 
  role="grid" 
  aria-label={`${headerMonthLabel} ${headerYearLabel}`}
  ref={calendarRef}
  tabIndex={-1}
  onKeyDown={onCalendarKey}
  style={{ outline: 'none' }}
  >
  <div role="row" className="flex">
  {weekdays.map((w, i) => (
  <div key={i} role="columnheader" aria-label={w} className="w-9 text-[0.8rem] font-normal text-muted text-center">{w.slice(0, 2)}</div>
  ))}
  </div>

  <div className="flex flex-col">
  {rows.map((row, rowIdx) => (
  <div key={rowIdx} role="row" className="flex mt-2">
  {row.map((cell, colIdx) => {
  const idx = rowIdx * 7 + colIdx;
  if (cell === null) return <div key={idx} role="gridcell" className="w-9 h-9" />;

  const dt = new Date(visible.getFullYear(), visible.getMonth(), cell);
  const iso = toISO(dt);
  const disabled = isDisabledDate(dt);
  const sel = selected === iso;
  const today = toISO(new Date()) === iso;
  const key = `${visible.getFullYear()}-${visible.getMonth()}-${cell}`;

  return (
  <div key={key} role="gridcell" className="w-9 h-9 p-0 relative focus-within:relative focus-within:z-20 text-center">
  <button
  ref={(el) => { gridDayRefs.current[key] = el; }}
  className={cn(
  "inline-flex items-center justify-center w-9 h-9 bg-transparent border border-transparent rounded-md text-sm font-normal text-default cursor-pointer transition-colors duration-200 hover:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none focus-visible:bg-subtle focus-visible:ring-1 focus-visible:ring-focus", 
  sel && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary", 
  today && !sel && "border-primary text-primary"
  )}
  aria-selected={sel || undefined}
  onClick={() => !disabled && commitDay(cell)}
  onKeyDown={(e) => onDayKey(e, cell)}
  disabled={disabled ? true : undefined}
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
  </div>
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
 </div>
 );
}