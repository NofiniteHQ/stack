"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  KeyboardEvent,
  forwardRef,
} from 'react';
import { Portal, onClickOutside, restoreFocus, cn } from '../../utils';
import './Select.css';

/* ============================================================
 * Types
 * ============================================================ */

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Array of available options */
  options: SelectOption[];
  /** Controlled state value */
  value?: string; 
  /** Uncontrolled initial value */
  defaultValue?: string; 
  /** Callback fired when an option is selected */
  onChange?: (value: string) => void;
  /** Text displayed when no option is selected */
  placeholder?: string;
  /** Name attribute applied to the hidden input for native form submission */
  name?: string; 
  /** Applies error styling to the trigger button */
  error?: boolean; 
}

/* Helper: find next enabled index given direction */
function findNextEnabled(options: SelectOption[], start: number, direction: 1 | -1) {
  const len = options.length;
  let i = start;
  for (let step = 0; step < len; step++) {
    i = (i + direction + len) % len;
    if (!options[i].disabled) return i;
  }
  return -1;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * Select Component
 * * A highly accessible dropdown select menu.
 * * Automatically manages focus, keyboard typeahead navigation, and viewport collision detection.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  name,
  id,
  className,
  ...props
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => options.findIndex((o) => !o.disabled));

  // Used for WAI-ARIA keyboard typeahead navigation
  const typeaheadRef = useRef({ buffer: '', lastTime: 0 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeOptionRef = useRef<HTMLDivElement | null>(null);

  const reactId = React.useId();
  const baseId = id ?? reactId;
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;

  /* ----------------------------------------------------
     Ref Merging
  ---------------------------------------------------- */
  const setTriggerRef = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  /* ----------------------------------------------------
     Smart Position & Width Sync
  ---------------------------------------------------- */
  const [coords, setCoords] = useState({ top: -9999, left: -9999, width: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !listRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const listRect = listRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = triggerRect.bottom + scrollY + 4;
    const left = triggerRect.left + scrollX;
    const width = triggerRect.width; // Sync Portal width to trigger width

    // Viewport Bottom Collision
    const padding = 16;
    if (triggerRect.bottom + listRect.height + 4 > document.documentElement.clientHeight - padding) {
      top = triggerRect.top + scrollY - listRect.height - 4; // Flip above
      if (top < padding + scrollY) top = padding + scrollY; // Hard top clamp
    }

    setCoords({ top, left, width });
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
     Focus & Scroll Management
  ---------------------------------------------------- */
  const closeList = useCallback(() => {
    setOpen(false);
    restoreFocus(triggerRef.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const cleanup = onClickOutside([listRef, triggerRef], () => setOpen(false));
    return cleanup;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Set active index to the currently selected item, or the first available option
    const selIndex = options.findIndex((o) => o.value === selectedValue && !o.disabled);
    const idx = selIndex >= 0 ? selIndex : options.findIndex((o) => !o.disabled);
    setActiveIndex(idx >= 0 ? idx : -1);

    // Defer focus to ensure Portal is rendered
    const timeoutId = setTimeout(() => listRef.current?.focus(), 10);
    return () => clearTimeout(timeoutId);
  }, [open, options, selectedValue]);

  // Auto-scroll to active item when navigating via keyboard
  useEffect(() => {
    if (open && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  /* ----------------------------------------------------
     Event Handlers
  ---------------------------------------------------- */
  const selectIndex = useCallback((i: number) => {
    if (i < 0 || i >= options.length) return;
    const opt = options[i];
    if (opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onChange?.(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }, [isControlled, options, onChange]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    if (key === 'ArrowDown') {
      e.preventDefault();
      const next = findNextEnabled(options, activeIndex, 1);
      if (next >= 0) setActiveIndex(next);
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      const prev = findNextEnabled(options, activeIndex, -1);
      if (prev >= 0) setActiveIndex(prev);
    } else if (key === 'Home') {
      e.preventDefault();
      const first = options.findIndex((o) => !o.disabled);
      if (first >= 0) setActiveIndex(first);
    } else if (key === 'End') {
      e.preventDefault();
      const last = options.length - 1 - [...options].reverse().findIndex((o) => !o.disabled);
      if (last >= 0) setActiveIndex(last);
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0) selectIndex(activeIndex);
    } else if (key === 'Escape') {
      e.preventDefault();
      closeList();
    } else if (key.length === 1 && key.match(/\S/)) {
      // Typeahead logic
      const now = Date.now();
      if (now - typeaheadRef.current.lastTime > 700) typeaheadRef.current.buffer = '';
      typeaheadRef.current.buffer += key.toLowerCase();
      typeaheadRef.current.lastTime = now;

      const buf = typeaheadRef.current.buffer;
      const start = activeIndex >= 0 ? activeIndex + 1 : 0;
      const len = options.length;
      for (let i = 0; i < len; i++) {
        const idx = (start + i) % len;
        const lab = String(options[idx].label).toLowerCase();
        if (!options[idx].disabled && lab.startsWith(buf)) {
          setActiveIndex(idx);
          break;
        }
      }
    }
  };

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  return (
    <div className={cn("nui-select-root", className)}>
      {/* Hidden input for native form submission */}
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}

      <button
        ref={setTriggerRef}
        id={labelId}
        type="button"
        className={cn("nui-select-trigger", error && "error")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && setOpen((s) => !s)}
        onKeyDown={onTriggerKeyDown}
        disabled={disabled}
        {...props}
      >
        <span className="nui-select-value">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="nui-select-placeholder">{placeholder}</span>
          )}
        </span>
        <svg className="nui-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            id={listboxId}
            ref={listRef}
            className="nui-select-listbox"
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={0}
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            onKeyDown={onListKeyDown}
          >
            {options.map((opt, i) => {
              const isSelected = selectedValue === opt.value;
              const isActive = activeIndex === i;
              return (
                <div
                  key={opt.value}
                  ref={isActive ? activeOptionRef : null}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  className={cn(
                    "nui-select-option",
                    isActive && "active",
                    isSelected && "selected",
                    opt.disabled && "disabled"
                  )}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => !opt.disabled && selectIndex(i)}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                >
                  <span className="nui-select-option-label">{opt.label}</span>
                  {isSelected && (
                    <svg className="nui-select-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
});
Select.displayName = 'Select';