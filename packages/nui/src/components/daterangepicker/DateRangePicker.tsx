"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
  useLayoutEffect,
} from 'react';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import './DateRangePicker.css';

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
  const popRef = useRef<HTMLDivElement | null>(null);
  const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  
  const calendarRef = useRef<HTMLDivElement | null>(null);

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
      if (calendarRef.current && !showYMM) {
        calendarRef.current.focus();
      }
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      restoreFocus(t);
    };
  }, [open, showYMM]);

  /* ----------------------------------------------------
     Smart Popover Position (with collision math)
  ---------------------------------------------------- */
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
      if (left < padding + scrollX) left = padding + scrollX; 
    }

    if (triggerRect.bottom + popRect.height + 8 > document.documentElement.clientHeight - padding) {
      top = triggerRect.top + scrollY - popRect.height - 8;
      
      if (top < padding + scrollY) {
        top = padding + scrollY; 
      }
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
    <div className={cn("nui-daterange-root", className)}>
      {nameFrom && <input type="hidden" name={nameFrom} value={range.from ?? ''} />}
      {nameTo && <input type="hidden" name={nameTo} value={range.to ?? ''} />}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className="nui-daterange-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((s) => !s);
          setShowYMM(false);
          if (!range.from && !range.to) {
            setActivePart('from');
          }
        }}
      >
        <span className={(!range.from && !range.to) ? "nui-daterange-placeholder" : ""}>
          {label()}
        </span>
        <svg className="nui-daterange-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            className="nui-daterange-popover"
            style={{ position: 'absolute', top: coords.top, left: coords.left }}
          >
            <div className="nui-daterange-panel">
              
              {/* Internal Part Toggle */}
              <div className="nui-daterange-actions">
                <button
                  className={cn("nui-daterange-part", activePart === 'from' && "active")}
                  onClick={() => setActivePart('from')}
                >
                  Start Date
                </button>
                <button
                  disabled={!range.from}
                  className={cn("nui-daterange-part", activePart === 'to' && "active")}
                  onClick={() => setActivePart('to')}
                >
                  End Date
                </button>
              </div>

              {/* HEADER */}
              <div className="nui-daterange-header">
                <button
                  className="nui-daterange-arrow"
                  onClick={() => setVisible((v) => addMonths(v, -1))}
                  aria-label="Previous Month"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                <button
                  className="nui-daterange-ym-toggle"
                  onClick={() => setShowYMM((s) => !s)}
                >
                  {visible.toLocaleDateString(locale, { month: 'long' })} {visible.getFullYear()}
                </button>

                <button
                  className="nui-daterange-arrow"
                  onClick={() => setVisible((v) => addMonths(v, 1))}
                  aria-label="Next Month"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>

              {/* YEAR + MONTH PANEL */}
              {showYMM && (
                <div className="nui-daterange-ym-panel">
                  <div className="nui-daterange-year-grid">
                    {years.map((y) => {
                      const sel = y === visible.getFullYear();
                      return (
                        <button
                          key={y}
                          ref={sel ? selectedYearRef : null}
                          className={cn("nui-daterange-year", sel && "selected")}
                          onClick={() => setVisible(startOfMonth(new Date(y, visible.getMonth(), 1)))}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>

                  <div className="nui-daterange-month-grid">
                    {months.map((ml, i) => {
                      const disabled = isMonthDisabled(visible.getFullYear(), i);
                      const sel = i === visible.getMonth();
                      return (
                        <button
                          key={i}
                          className={cn("nui-daterange-month", disabled && "disabled", sel && "selected")}
                          disabled={disabled ? true : undefined}
                          onClick={() => {
                            if (!disabled) {
                              setVisible(startOfMonth(new Date(visible.getFullYear(), i, 1)));
                              setShowYMM(false);
                            }
                          }}
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
                  className="nui-daterange-calendar" 
                  role="grid"
                  ref={calendarRef}
                  tabIndex={-1}
                  onKeyDown={onCalendarKey}
                  style={{ outline: 'none' }}
                >
                  <div className="nui-daterange-weekdays" role="row">
                    {weekdays.map((w, i) => (
                      <div key={i} className="nui-daterange-weekday" role="columnheader">{w}</div>
                    ))}
                  </div>

                  <div className="nui-daterange-days" role="rowgroup">
                    {grid.map((cell, idx) => {
                      if (cell === null) return <div key={idx} className="nui-daterange-empty" role="gridcell" />;

                      const dt = new Date(visible.getFullYear(), visible.getMonth(), cell);
                      const disabled = isDisabled(dt);

                      const start = isStart(dt);
                      const end = isEnd(dt);
                      const between = inRange(dt);
                      const drag = inDragRange(dt);

                      const key = `${visible.getFullYear()}-${visible.getMonth()}-${cell}`;

                      return (
                        <button
                          key={key}
                          role="gridcell"
                          ref={(el) => { dayRefs.current[key] = el; }}
                          disabled={disabled ? true : undefined}
                          className={cn(
                            "nui-daterange-day",
                            start && "start",
                            end && "end",
                            between && "between",
                            drag && "dragging",
                            disabled && "disabled"
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
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FOOTER */}
              <div className="nui-daterange-footer">
                <button
                  className="nui-daterange-clear"
                  onClick={() => {
                    const empty = { from: undefined, to: undefined };
                    if (!controlled) setInternal(empty);
                    onChange?.(empty);
                    setActivePart('from');
                    setOpen(false); // Restored proper clear/close behavior
                    setShowYMM(false);
                  }}
                >
                  Clear
                </button>

                <button
                  className="nui-daterange-close"
                  onClick={() => {
                    setOpen(false);
                    setShowYMM(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}