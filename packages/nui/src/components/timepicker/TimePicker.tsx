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
import './TimePicker.css';

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

  // Refs for positioning and click-outside
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

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
    const cleanup = onClickOutside([popRef, triggerRef], () => setOpen(false));
    return cleanup;
  }, [open]);

  useEffect(() => {
    if (!open && triggerRef.current) restoreFocus(triggerRef.current);
  }, [open]);

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

    // X-Axis Clamp
    const maxLeft = document.documentElement.clientWidth - popRect.width - padding;
    if (left > maxLeft + scrollX) {
      left = triggerRect.right + scrollX - popRect.width;
      if (left < padding + scrollX) left = padding + scrollX;
    }

    // Y-Axis Clamp (Hard Top Clamp included)
    const maxTop = document.documentElement.clientHeight - popRect.height - padding;
    if (triggerRect.bottom + 8 > maxTop) {
      top = triggerRect.top + scrollY - popRect.height - 8;
      if (top < padding + scrollY) top = padding + scrollY;
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
  useEffect(() => {
    if (!open) return;
    // Wait a tick for the popover to render and measure
    const timer = setTimeout(() => {
      [hourColRef, minColRef, ampmColRef].forEach((colRef) => {
        if (!colRef.current) return;
        const selectedEl = colRef.current.querySelector('.selected');
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      });
    }, 0);
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
     Render
  ---------------------------------------------------- */
  return (
    <div ref={ref} className={cn("nui-timepicker-root", className)} {...props}>
      {name && <input type="hidden" name={name} value={selectedTime ?? ''} />}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className="nui-timepicker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <span className={!selectedTime ? "nui-timepicker-placeholder" : ""}>
          {formatDisplay()}
        </span>
        <svg className="nui-timepicker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            ref={popRef}
            className="nui-timepicker-popover"
            style={{ position: 'absolute', top: coords.top, left: coords.left }}
          >
            <div className="nui-timepicker-panel">
              <div className="nui-timepicker-columns">
                
                {/* HOURS */}
                <div className="nui-timepicker-col" ref={hourColRef}>
                  {hours.map((h) => {
                    const sel = parsed.hour === h;
                    return (
                      <button
                        key={`h-${h}`}
                        className={cn("nui-timepicker-item", sel && "selected")}
                        onClick={() => commit(h, parsed.minute, parsed.ampm)}
                      >
                        {pad(h)}
                      </button>
                    );
                  })}
                </div>

                {/* MINUTES */}
                <div className="nui-timepicker-col" ref={minColRef}>
                  {minutes.map((m) => {
                    const sel = parsed.minute === m;
                    return (
                      <button
                        key={`m-${m}`}
                        className={cn("nui-timepicker-item", sel && "selected")}
                        onClick={() => commit(parsed.hour, m, parsed.ampm)}
                      >
                        {pad(m)}
                      </button>
                    );
                  })}
                </div>

                {/* AM / PM (Only for 12h clock) */}
                {clockType === 12 && (
                  <div className="nui-timepicker-col" ref={ampmColRef}>
                    {(['AM', 'PM'] as const).map((a) => {
                      const sel = parsed.ampm === a;
                      return (
                        <button
                          key={a}
                          className={cn("nui-timepicker-item", sel && "selected")}
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
          </div>
        </Portal>
      )}
    </div>
  );
});

TimePicker.displayName = 'TimePicker';