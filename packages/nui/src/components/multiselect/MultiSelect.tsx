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
import { cn } from '../../utils';
import { Portal, onClickOutside, restoreFocus } from '../../utils';
import './MultiSelect.css';

/* ============================================================
 * Types
 * ============================================================ */

export type MultiSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export interface MultiSelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Array of available options */
  options: MultiSelectOption[];
  /** Controlled state for selected values */
  value?: string[]; 
  /** Uncontrolled initial state for selected values */
  defaultValue?: string[]; 
  /** Callback fired when the selection changes */
  onChange?: (value: string[]) => void;
  /** Text displayed when no options are selected */
  placeholder?: string;
  /** Name attribute applied to hidden inputs for native form submission */
  name?: string; 
  /** Toggles error styling */
  error?: boolean;
  /** Number of tags to render before collapsing into a summary string (e.g., "3 selected") */
  maxTags?: number; 
}

/* Helper: find next enabled index given direction */
function findNextEnabled(options: MultiSelectOption[], start: number, direction: 1 | -1) {
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
 * MultiSelect Component
 * * A custom, WAI-ARIA compliant dropdown for selecting multiple options.
 * * Architecture Note: Unlike a standard Select, the dropdown list intentionally 
 * remains open after a selection is made, allowing the user to quickly select 
 * multiple items without repeatedly reopening the menu.
 */
export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select multiple...',
  disabled = false,
  error = false,
  name,
  id,
  className,
  maxTags = 3,
  ...props
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue || []);
  const selectedValues = isControlled ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => options.findIndex((o) => !o.disabled));

  // Used for keyboard typeahead navigation
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
    const width = triggerRect.width; 

    // Viewport Bottom Collision & Hard Top Clamp
    const padding = 16;
    if (triggerRect.bottom + listRect.height + 4 > document.documentElement.clientHeight - padding) {
      top = triggerRect.top + scrollY - listRect.height - 4; 
      if (top < padding + scrollY) top = padding + scrollY; 
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
    // Reset active index to first non-disabled item when opened
    const idx = options.findIndex((o) => !o.disabled);
    setActiveIndex(idx >= 0 ? idx : -1);
    
    // Defer focus slightly to ensure Portal has rendered
    const timeoutId = setTimeout(() => listRef.current?.focus(), 10);
    return () => clearTimeout(timeoutId);
  }, [open, options]);

  // Auto-scroll to active item
  useEffect(() => {
    if (open && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  /* ----------------------------------------------------
     Event Handlers
  ---------------------------------------------------- */
  const toggleOption = useCallback((optValue: string) => {
    const isSelected = selectedValues.includes(optValue);
    const nextValues = isSelected 
      ? selectedValues.filter(v => v !== optValue) 
      : [...selectedValues, optValue];

    if (!isControlled) setInternalValue(nextValues);
    onChange?.(nextValues);
    
    // WAI-ARIA Standard: Do not close the dropdown for Multi-Select!
    // Refocus the list so the user can keep navigating via keyboard.
    listRef.current?.focus();
  }, [isControlled, selectedValues, onChange]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeList();
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
      if (activeIndex >= 0) {
        const opt = options[activeIndex];
        if (!opt.disabled) toggleOption(opt.value);
      }
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
     Trigger Rendering Logic
  ---------------------------------------------------- */
  const renderTriggerContent = () => {
    if (selectedValues.length === 0) {
      return <span className="nui-multiselect-placeholder">{placeholder}</span>;
    }

    if (selectedValues.length > maxTags) {
      return (
        <span className="nui-multiselect-summary">
          {selectedValues.length} items selected
        </span>
      );
    }

    // Render individual tags
    return (
      <div className="nui-multiselect-tags">
        {selectedValues.map(val => {
          const label = options.find(o => o.value === val)?.label ?? val;
          return (
            <span key={val} className="nui-multiselect-tag">
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  return (
    <div className={cn("nui-multiselect-root", className)}>
      
      {/* Hidden inputs for native form submission */}
      {name && selectedValues.map((val) => (
        <input key={val} type="hidden" name={name} value={val} />
      ))}

      <button
        ref={setTriggerRef}
        id={labelId}
        type="button"
        className={cn("nui-multiselect-trigger", error && "error")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && setOpen((s) => !s)}
        onKeyDown={onTriggerKeyDown}
        disabled={disabled}
        {...props}
      >
        <div className="nui-multiselect-value-container">
          {renderTriggerContent()}
        </div>
        <svg className="nui-multiselect-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            id={listboxId}
            ref={listRef}
            className="nui-multiselect-listbox"
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            tabIndex={0}
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            onKeyDown={onListKeyDown}
          >
            {options.map((opt, i) => {
              const isSelected = selectedValues.includes(opt.value);
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
                    "nui-multiselect-option",
                    isActive && "active",
                    isSelected && "selected",
                    opt.disabled && "disabled"
                  )}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => !opt.disabled && toggleOption(opt.value)}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                >
                  
                  {/* Custom Checkbox UI */}
                  <div className={cn("nui-multiselect-checkbox", isSelected && "checked")} aria-hidden="true">
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>

                  <span className="nui-multiselect-option-label">{opt.label}</span>
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
});
MultiSelect.displayName = 'MultiSelect';