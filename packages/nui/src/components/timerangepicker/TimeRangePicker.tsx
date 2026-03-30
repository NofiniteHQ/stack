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
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import './TimeRangePicker.css';

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
  to?: string;   // Standard HH:mm format
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
  const popRef = useRef<HTMLDivElement | null>(null);

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
    const cleanup = onClickOutside([popRef, triggerRef], () => setOpen(false));
    return cleanup;
  }, [open]);

  useEffect(() => {
    if (!open && triggerRef.current) restoreFocus(triggerRef.current);
  }, [open]);

  /* ----------------------------------------------------
     Smart Popover Position (with Hard Top Clamp)
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

    // X-Axis Clamp
    const maxLeft = document.documentElement.clientWidth - popRect.width - padding;
    if (left > maxLeft + scrollX) {
      left = triggerRect.right + scrollX - popRect.width;
      if (left < padding + scrollX) left = padding + scrollX;
    }

    // Y-Axis Clamp
    const maxTop = document.documentElement.clientHeight - popRect.height - padding;
    if (triggerRect.bottom + 8 > maxTop) {
      top = triggerRect.top + scrollY - popRect.height - 8;
      // Hard Top Clamp
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
    <div ref={ref} className={cn("nui-timerange-root", className)} {...props}>
      {nameFrom && <input type="hidden" name={nameFrom} value={range.from ?? ''} />}
      {nameTo && <input type="hidden" name={nameTo} value={range.to ?? ''} />}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className="nui-timerange-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((s) => !s);
          setActivePart('from');
        }}
      >
        <span className={(!range.from && !range.to) ? "nui-timerange-placeholder" : ""}>
          {label()}
        </span>
        <svg className="nui-timerange-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            ref={popRef}
            className="nui-timerange-popover"
            style={{ position: 'absolute', top: coords.top, left: coords.left }}
          >
            <div className="nui-timerange-panel">
              
              {/* Internal Part Toggle */}
              <div className="nui-timerange-actions">
                <button
                  className={cn("nui-timerange-part", activePart === 'from' && "active")}
                  onClick={() => setActivePart('from')}
                >
                  Start Time
                </button>
                <button
                  className={cn("nui-timerange-part", activePart === 'to' && "active")}
                  onClick={() => setActivePart('to')}
                >
                  End Time
                </button>
              </div>

              {/* Time Columns */}
              <div className="nui-timerange-columns">
                {/* HOURS */}
                <div className="nui-timerange-col" ref={hourColRef}>
                  {hours.map((h) => {
                    const sel = parsed.hour === h;
                    return (
                      <button
                        key={`h-${h}`}
                        className={cn("nui-timerange-item", sel && "selected")}
                        onClick={() => commit(h, parsed.minute, parsed.ampm)}
                      >
                        {pad(h)}
                      </button>
                    );
                  })}
                </div>

                {/* MINUTES */}
                <div className="nui-timerange-col" ref={minColRef}>
                  {minutes.map((m) => {
                    const sel = parsed.minute === m;
                    return (
                      <button
                        key={`m-${m}`}
                        className={cn("nui-timerange-item", sel && "selected")}
                        onClick={() => commit(parsed.hour, m, parsed.ampm)}
                      >
                        {pad(m)}
                      </button>
                    );
                  })}
                </div>

                {/* AM / PM */}
                {clockType === 12 && (
                  <div className="nui-timerange-col" ref={ampmColRef}>
                    {(['AM', 'PM'] as const).map((a) => {
                      const sel = parsed.ampm === a;
                      return (
                        <button
                          key={a}
                          className={cn("nui-timerange-item", sel && "selected")}
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
              <div className="nui-timerange-footer">
                <button
                  className="nui-timerange-clear"
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
                  className="nui-timerange-close"
                  onClick={() => setOpen(false)}
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
});

TimeRangePicker.displayName = 'TimeRangePicker';