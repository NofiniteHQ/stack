"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils';
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

const asDate = (v: Date | null | undefined): Date | null => (v ? v : null);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

/* ------------------------------------------
 Types
------------------------------------------- */
export interface DateRange {
  from?: string;
  to?: string;
}

type BaseCalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> & {
  minDate?: string;
  maxDate?: string;
  locale?: string;
  defaultMonth?: Date; // Allows forcing a specific month
};

export interface CalendarSingleProps extends BaseCalendarProps {
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
}

export interface CalendarRangeProps extends BaseCalendarProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (v: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (props, ref) => {
    const { minDate, maxDate, locale = 'en-US', className, mode = 'single', defaultMonth, ...restProps } = props;

    // --- State Initialization ---
    // Single Mode
    const singleProps = props as CalendarSingleProps;
    const isSingleControlled = singleProps.value !== undefined;
    const [singleInternal, setSingleInternal] = useState<string | undefined>(singleProps.defaultValue);
    const singleSelected = isSingleControlled ? singleProps.value : singleInternal;
    
    // Range Mode
    const rangeProps = props as CalendarRangeProps;
    const isRangeControlled = rangeProps.value !== undefined;
    const [rangeInternal, setRangeInternal] = useState<DateRange | undefined>(rangeProps.defaultValue);
    const rangeSelected: DateRange = (isRangeControlled ? rangeProps.value : rangeInternal) || {};

    const fromDate = fromISO(rangeSelected.from);
    const toDate = fromISO(rangeSelected.to);
    const today = new Date();

    // Determine initial visible month based on mode and selections
    const initialVisible = defaultMonth 
      ? startOfMonth(defaultMonth)
      : mode === 'single'
        ? startOfMonth(fromISO(singleSelected) ?? today)
        : startOfMonth(fromDate ?? toDate ?? today);

    const [visible, setVisible] = useState<Date>(initialVisible);
    const [showYMM, setShowYMM] = useState(false);

    // Track active part of the range selection (first click sets 'from', second click sets 'to')
    const [activePart, setActivePart] = useState<'from' | 'to'>('from');
    
    // Drag selection states (Range mode only)
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [dragEnd, setDragEnd] = useState<Date | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const minDt = fromISO(minDate) ?? undefined;
    const maxDt = fromISO(maxDate) ?? undefined;

    const isDisabledDate = useCallback((d: Date): boolean => {
      if (minDt && d < minDt) return true;
      if (maxDt && d > maxDt) return true;
      return false;
    }, [minDt, maxDt]);

    const isMonthDisabled = useCallback((year: number, month: number): boolean => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month, daysInMonth(start));
      if (minDt && end < minDt) return true;
      if (maxDt && start > maxDt) return true;
      return false;
    }, [minDt, maxDt]);

    // Update visible month if defaultMonth changes
    useEffect(() => {
      if (defaultMonth) setVisible(startOfMonth(defaultMonth));
    }, [defaultMonth]);

    /* ------------------------------------------
     Range Normalization & Committing
    ------------------------------------------- */
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
      if (!isRangeControlled) setRangeInternal(out);
      rangeProps.onChange?.(out);
    }, [rangeProps, isRangeControlled]);

    /* ------------------------------------------
     Drag selection (Global mouseup)
    ------------------------------------------- */
    useEffect(() => {
      const stopDrag = () => {
        if (!isDragging || mode === 'single') return;
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
    }, [isDragging, dragStart, dragEnd, commitRange, mode]);

    /* ------------------------------------------
     Range flags
    ------------------------------------------- */
    const inRange = useCallback((dt: Date) => {
      if (mode === 'single') return false;
      if (!fromDate || !toDate) return false;
      return dt > fromDate && dt < toDate;
    }, [fromDate, toDate, mode]);

    const isStart = useCallback((dt: Date) => {
      if (mode === 'single') return false;
      return fromDate && dt.getTime() === fromDate.getTime();
    }, [fromDate, mode]);
    
    const isEnd = useCallback((dt: Date) => {
      if (mode === 'single') return false;
      return toDate && dt.getTime() === toDate.getTime();
    }, [toDate, mode]);

    const inDragRange = useCallback((d: Date) => {
      if (mode === 'single' || !isDragging || !dragStart || !dragEnd) return false;
      const t = d.getTime();
      const a = dragStart.getTime();
      const b = dragEnd.getTime();
      return t >= Math.min(a, b) && t <= Math.max(a, b);
    }, [isDragging, dragStart, dragEnd, mode]);

    /* ------------------------------------------
     Commit Selections
    ------------------------------------------- */
    const pickDay = (d: number) => {
      const dt = new Date(visible.getFullYear(), visible.getMonth(), d);
      if (isDisabledDate(dt)) return;

      if (mode === 'single') {
        const iso = toISO(dt);
        if (!isSingleControlled) setSingleInternal(iso);
        singleProps.onChange?.(iso);
        return;
      }

      // Range Mode Logic
      let s = fromDate;
      let e = toDate;

      // Sequential click logic:
      // If we are selecting 'from', or if we start a fresh selection by clicking again
      if (activePart === 'from' || (s && e)) {
        s = dt;
        e = null;
        setActivePart('to'); 
      } else {
        // We are selecting 'to'
        e = dt;
        // If they clicked a date BEFORE the start date, swap them
        if (s && dt < s) {
          s = dt;
          e = null;
          // Keep activePart 'to' because they just replaced 'from'
        } else {
          setActivePart('from'); // Done selecting range, next click resets
        }
      }

      commitRange(asDate(s), asDate(e));
    };

    /* ------------------------------------------
     Keyboard Nav
    ------------------------------------------- */
    const focusDay = (idx: number) => {
      if (idx < 0 || idx >= grid.length) return;
      const d = grid[idx];
      if (!d) return;
      const key = `${visible.getFullYear()}-${visible.getMonth()}-${d}`;
      dayRefs.current[key]?.focus();
    };

    const onDayKey = (e: React.KeyboardEvent<HTMLButtonElement>, day: number) => {
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
        default: return;
      }
      e.preventDefault();
      if (nextIdx != null && grid[nextIdx] != null) focusDay(nextIdx);
    };

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

    const commitMonth = (month: number) => {
      setVisible(new Date(visible.getFullYear(), month, 1));
      setShowYMM(false);
    };
    const commitYear = (year: number) => {
      setVisible(new Date(year, visible.getMonth(), 1));
    };

    const headerMonthLabel = visible.toLocaleDateString(locale, { month: 'long' });
    const headerYearLabel = visible.getFullYear();

    return (
      <div 
        ref={ref} 
        className={cn("inline-block w-max p-3 bg-surface text-default border border-solid border-default rounded-lg shadow-sm font-sans", className)}
        {...restProps}
      >
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
            className="text-sm font-medium cursor-pointer hover:text-primary transition-colors select-none"
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
                    type="button"
                    className={cn(
                      "py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle", 
                      sel && "bg-primary text-inverse hover:bg-primary"
                    )}
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
                    type="button"
                    className={cn(
                      "py-2 px-1 bg-transparent border-none rounded-md text-default text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:bg-subtle", 
                      disabled && "text-muted cursor-not-allowed hover:bg-transparent", 
                      sel && "bg-primary text-inverse hover:bg-primary"
                    )}
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
            className="flex flex-col space-y-2 select-none" 
            role="grid" 
            aria-label={`${headerMonthLabel} ${headerYearLabel}`}
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
                    const today = toISO(new Date()) === iso;
                    const key = `${visible.getFullYear()}-${visible.getMonth()}-${cell}`;

                    // Selection classes
                    let isSelected = false;
                    let isRangeStart = false;
                    let isRangeEnd = false;
                    let isRangeBetween = false;
                    let isRangeDrag = false;

                    if (mode === 'single') {
                      isSelected = singleSelected === iso;
                    } else {
                      isRangeStart = isStart(dt) || false;
                      isRangeEnd = isEnd(dt) || false;
                      isRangeBetween = inRange(dt);
                      isRangeDrag = inDragRange(dt);
                      isSelected = isRangeStart || isRangeEnd || isRangeBetween;
                    }

                    return (
                      <div 
                        key={key} 
                        role="gridcell" 
                        className={cn(
                          "w-9 h-9 p-0 text-center relative focus-within:relative focus-within:z-20",
                          mode === 'range' && [
                            (isRangeBetween || (isRangeStart && isRangeDrag) || (isRangeDrag && !isRangeStart && !isRangeEnd)) && "bg-subtle",
                            isRangeStart && (isRangeBetween || isRangeDrag) && "rounded-l-md",
                            isRangeEnd && isRangeBetween && "rounded-r-md",
                            (!isRangeStart && !isRangeEnd && isRangeDrag && (colIdx === 0)) && "rounded-l-md",
                            (!isRangeStart && !isRangeEnd && isRangeDrag && (colIdx === 6)) && "rounded-r-md"
                          ]
                        )}
                      >
                        <button
                          type="button"
                          ref={(el) => { dayRefs.current[key] = el; }}
                          className={cn(
                            "inline-flex items-center justify-center w-9 h-9 bg-transparent border border-transparent rounded-md text-sm font-normal text-default cursor-pointer transition-colors duration-200 z-10", 
                            "focus-visible:outline-none focus-visible:bg-subtle focus-visible:ring-1 focus-visible:ring-focus", 
                            mode === 'single' && isSelected && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary",
                            mode === 'range' && (isRangeStart || isRangeEnd) && "bg-primary text-inverse hover:bg-primary hover:text-inverse focus-visible:bg-primary",
                            today && !isSelected && "text-primary font-medium relative after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-[2px] after:bg-primary after:rounded-full",
                            !isSelected && !disabled && "hover:bg-subtle hover:text-default",
                            disabled && "text-muted cursor-not-allowed opacity-50 hover:bg-transparent"
                          )}
                          aria-selected={isSelected || undefined}
                          onClick={() => !disabled && pickDay(cell)}
                          onKeyDown={(e) => onDayKey(e, cell)}
                          disabled={disabled ? true : undefined}
                          onMouseDown={(e) => {
                            if (disabled || mode === 'single') return;
                            e.preventDefault(); 
                            setDragStart(dt);
                            setDragEnd(dt);
                            setIsDragging(true);
                          }}
                          onMouseEnter={() => {
                            if (!isDragging || disabled || mode === 'single') return;
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
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
