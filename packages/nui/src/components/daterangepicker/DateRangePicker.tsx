"use client";

import { useState, useRef, useEffect, useId } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import { Button } from '../button/Button';
import { Calendar, DateRange } from '../calendar/Calendar';

/* ----------------------------------------------------
 Helpers
---------------------------------------------------- */
function fromISO(s?: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

/* ----------------------------------------------------
 Types
---------------------------------------------------- */
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
  const range: DateRange = (controlled ? value : internal) || {};

  // For the uncontrolled draft state inside the popover before hitting "Apply"
  const [draft, setDraft] = useState<DateRange>(range);

  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  /* ----------------------------------------------------
  Smart Popover Position
  ---------------------------------------------------- */
  const { refs, x, y, placement } = useFloating<HTMLElement>({
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
  Click outside to close & Restore Focus
  ---------------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
      setOpen(false);
      // Revert draft to saved value when closing without applying
      setDraft(range);
    });
    return cleanup;
  }, [open, refs.floating, range]);

  useEffect(() => {
    if (!open) {
      restoreFocus(triggerRef.current);
      return;
    }
    const timeoutId = setTimeout(() => {
      if (calendarRef.current) calendarRef.current.focus();
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [open]);

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
  Apply / Clear Actions
  ---------------------------------------------------- */
  const handleApply = () => {
    if (!controlled) setInternal(draft);
    onChange?.(draft);
    setOpen(false);
  };

  const handleClear = () => {
    const empty = { from: undefined, to: undefined };
    setDraft(empty);
    if (!controlled) setInternal(empty);
    onChange?.(empty);
    setOpen(false);
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
          "flex items-center justify-between gap-2 w-full sm:w-[280px] px-2.5 py-1.5 bg-surface text-default text-sm border border-solid border-default rounded-md transition-colors duration-200",
          "hover:border-default hover:bg-subtle",
          "focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]",
          "disabled:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:border-default"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => {
          setDraft(range); // Initialize draft with current saved value
          setOpen((s) => !s);
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

      {isMounted && (
        <Portal>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                ref={refs.setFloating}
                className="z-50"
                style={{
                  position: 'absolute',
                  top: y ?? 0,
                  left: x ?? 0,
                  transformOrigin: placement.startsWith('top') ? 'bottom left' : 'top left',
                }}
                id={dialogId}
                role="dialog"
                aria-modal="true"
                aria-label={placeholder || "Date range picker"}
              >
                <div className="w-max bg-surface text-default border border-solid border-default rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <Calendar
                    ref={calendarRef}
                    mode="range"
                    value={draft}
                    onChange={(r) => setDraft(r)}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                    tabIndex={-1}
                    className="border-none shadow-none rounded-none"
                    style={{ outline: 'none' }}
                  />
                  
                  {/* FOOTER */}
                  <div className="flex justify-between items-center px-3 pb-3 bg-surface">
                    <span className="text-xs text-muted truncate max-w-[120px]">
                      {draft.from && draft.to ? `${draft.from} to ${draft.to}` : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleApply}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Portal>
      )}
    </div>
  );
}