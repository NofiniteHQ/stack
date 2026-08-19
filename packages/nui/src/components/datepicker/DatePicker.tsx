"use client";

import { useState, useRef, useEffect, useId } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react-dom';
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../button/Button';
import { Calendar } from '../calendar/Calendar';

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

/* ------------------------------------------
 Component Props
------------------------------------------- */
export interface DatePickerProps {
  value?: string; 
  defaultValue?: string;
  onChange?: (v: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  name?: string;
  locale?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  formatDisplay?: (date: Date) => string;
}

/* ------------------------------------------
 Component
------------------------------------------- */
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

  const generatedId = useId();
  const baseId = id || generatedId;
  const triggerId = `${baseId}-trigger`;
  const dialogId = `${baseId}-dialog`;

  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
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
      restoreFocus(triggerRef.current);
      return;
    }
    
    // Auto-focus calendar wrapper when opened for quick keyboard access
    const timeoutId = setTimeout(() => {
      if (calendarRef.current) {
        // Find the first selected day or today's button to focus if needed,
        // but focusing the wrapper is a solid fallback for screen readers.
        calendarRef.current.focus();
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [open]);

  const handleSelect = (v: string) => {
    if (!controlled) setInternal(v);
    onChange?.(v);
    setOpen(false); // Close upon selection
  };

  /* ------------------------------------------
   Render
  ------------------------------------------- */
  return (
    <div className={cn("inline-block font-sans", className)}>
      {name && <input type="hidden" name={name} value={selected ?? ''} />}

      <Button
        variant="outline"
        id={triggerId}
        ref={(node) => {
          triggerRef.current = node;
          refs.setReference(node);
        }}
        type="button"
        disabled={disabled}
        className={cn(
          "flex items-center justify-between w-full sm:w-[240px] px-2.5 py-1.5 h-auto font-normal text-sm"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${id || 'datepicker'}-dialog` : undefined}
        onClick={() => {
          setOpen((s) => !s);
        }}
        iconRight={
          <svg className="text-muted shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        }
      >
        <span className={cn("block w-full text-left truncate", !selected && "text-muted")}>
          {selected 
            ? (formatDisplay ? formatDisplay(fromISO(selected)!) : fromISO(selected)!.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }))
            : placeholder}
        </span>
      </Button>

      {isMounted && (
        <Portal>
          <AnimatePresence>
            {open && (
              <motion.div
                key="datepicker-dialog"
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
                {/* The Calendar component completely replaces the old internal grid code */}
                <Calendar
                  ref={calendarRef}
                  mode="single"
                  value={selected}
                  onChange={handleSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  locale={locale}
                  tabIndex={-1}
                  className="shadow-lg"
                  style={{ outline: 'none' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Portal>
      )}
    </div>
  );
}