"use client";

import { useState, useRef, useEffect, KeyboardEvent, useMemo, useCallback, useLayoutEffect } from 'react';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import './DatePicker.css';

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

  const [visible, setVisible] = useState<Date>(startOfMonth(selectedDate));
  const [open, setOpen] = useState(false);
  const [showYMM, setShowYMM] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const gridDayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

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
    const cleanup = onClickOutside([popRef, triggerRef], () => {
      setOpen(false);
      setShowYMM(false);
    });
    return cleanup;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = triggerRef.current;
    
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

    return () => {
      clearTimeout(timeoutId);
      restoreFocus(t ?? null);
      setShowYMM(false);
    };
  }, [open, showYMM, selected, visible]);

 /* ------------------------------------------
     Positioning & Smart Collision
  ------------------------------------------- */
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popRect = popRef.current.getBoundingClientRect();

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = triggerRect.bottom + scrollY + 8;
    let left = triggerRect.left + scrollX;

    const padding = 16;
    const maxLeft = document.documentElement.clientWidth - popRect.width - padding;

    if (left > maxLeft + scrollX) {
      left = triggerRect.right + scrollX - popRect.width;
      
      if (left < padding + scrollX) {
        left = padding + scrollX;
      }
    }

    const maxTop = document.documentElement.clientHeight - popRect.height - padding;
    
    if (triggerRect.bottom + 8 > maxTop) {
      top = triggerRect.top + scrollY - popRect.height - 8;
    }

    setCoords({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

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
    <div className={cn("nui-datepicker-root", className)}>
      {name && <input type="hidden" name={name} value={selected ?? ''} />}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className="nui-datepicker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((s) => !s);
          setShowYMM(false);
        }}
      >
        <span className={!selected ? "nui-datepicker-placeholder" : ""}>
          {selected
            ? formatDisplay
              ? formatDisplay(selectedDate)
              : new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(selectedDate)
            : placeholder}
        </span>
        <svg className="nui-datepicker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            ref={popRef}
            className="nui-datepicker-popover"
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
            }}
          >
            <div className="nui-datepicker-panel">
              
              {/* Header */}
              <div className="nui-datepicker-header">
                <button
                  className="nui-datepicker-arrow"
                  aria-label="Previous month"
                  onClick={() => setVisible((v) => addMonths(v, -1))}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                <button
                  className="nui-datepicker-ym-toggle"
                  onClick={() => setShowYMM((s) => !s)}
                  aria-expanded={showYMM}
                >
                  {headerMonthLabel} {headerYearLabel}
                </button>

                <button
                  className="nui-datepicker-arrow"
                  aria-label="Next month"
                  onClick={() => setVisible((v) => addMonths(v, 1))}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>

              {/* Year + Month Selector */}
              {showYMM && (
                <div className="nui-datepicker-ym-panel">
                  <div className="nui-datepicker-year-grid">
                    {years.map((y) => {
                      const sel = y === visible.getFullYear();
                      return (
                        <button
                          key={y}
                          ref={sel ? selectedYearRef : null}
                          className={cn("nui-datepicker-year", sel && "selected")}
                          onClick={() => commitYear(y)}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>

                  <div className="nui-datepicker-month-grid">
                    {months.map((label, i) => {
                      const disabled = isMonthDisabled(visible.getFullYear(), i);
                      const sel = i === visible.getMonth();
                      return (
                        <button
                          key={i}
                          className={cn("nui-datepicker-month", disabled && "disabled", sel && "selected")}
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
                  className="nui-datepicker-calendar" 
                  role="grid" 
                  aria-label={`${headerMonthLabel} ${headerYearLabel}`}
                  ref={calendarRef}
                  tabIndex={-1}
                  onKeyDown={onCalendarKey}
                  style={{ outline: 'none' }}
                >
                  <div className="nui-datepicker-weekdays">
                    {weekdays.map((w, i) => (
                      <div key={i} className="nui-datepicker-weekday">{w}</div>
                    ))}
                  </div>

                  <div className="nui-datepicker-days">
                    {grid.map((cell, idx) => {
                      if (cell === null) return <div key={idx} className="nui-datepicker-empty" />;

                      const dt = new Date(visible.getFullYear(), visible.getMonth(), cell);
                      const iso = toISO(dt);
                      const disabled = isDisabledDate(dt);
                      const sel = selected === iso;
                      const today = toISO(new Date()) === iso;
                      const key = `${visible.getFullYear()}-${visible.getMonth()}-${cell}`;

                      return (
                        <button
                          key={key}
                          ref={(el) => { gridDayRefs.current[key] = el; }}
                          className={cn(
                            "nui-datepicker-day", 
                            sel && "selected", 
                            today && !sel && "today"
                          )}
                          aria-selected={sel || undefined}
                          onClick={() => !disabled && commitDay(cell)}
                          onKeyDown={(e) => onDayKey(e, cell)}
                          disabled={disabled ? true : undefined}
                        >
                          {cell}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}