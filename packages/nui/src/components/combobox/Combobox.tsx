"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  useId,
  forwardRef,
} from 'react';
import { cn } from '../../utils';
import './Combobox.css';

export interface ComboboxOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: ComboboxOption[];
  /** Controlled value of the combobox */
  value?: string;
  /** Initial uncontrolled value */
  defaultValue?: string;
  /** Callback fired when an option is selected */
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Message displayed when filtering returns zero results */
  emptyMessage?: string;
  /** Custom filter function. Defaults to simple substring matching on the label. */
  filter?: (input: string, option: ComboboxOption) => boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Custom renderer for the entire option row */
  renderOption?: (option: ComboboxOption, active: boolean) => React.ReactNode;
  /** Custom renderer strictly for the option's icon */
  renderOptionIcon?: (option: ComboboxOption) => React.ReactNode;
}

/**
 * Combobox Component
 * * A text input that provides a dropdown list of options to help users enter data.
 * Architecture Note: Implements the WAI-ARIA Combobox pattern, supporting full keyboard 
 * navigation (Arrow keys, Enter, Escape) and click-outside dismissal.
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder = 'Select...',
      disabled = false,
      className,
      emptyMessage = 'No results found',
      filter,
      leftIcon,
      rightIcon,
      renderOption,
      renderOptionIcon,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;

    // * State Management
    // displayLabel tracks what the user is currently typing OR the label of the selected option.
    const [displayLabel, setDisplayLabel] = useState<string>(() => {
      if (isControlled && value) return options.find((o) => o.value === value)?.label ?? '';
      if (defaultValue) return options.find((o) => o.value === defaultValue)?.label ?? '';
      return '';
    });
    
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Merge forwarded ref with our internal wrapper ref
    const setRefs = useCallback(
      (node: HTMLDivElement) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    // Filter Options based on current input
    const filtered = options.filter((opt) =>
      filter
        ? filter(displayLabel, opt)
        : opt.label.toLowerCase().includes(displayLabel.toLowerCase())
    );

    const openList = useCallback(() => {
      if (!disabled) setOpen(true);
    }, [disabled]);

    const closeList = useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, []);

    // * UX Architecture: Revert Label
    // If a user types "App", sees "Apple", but clicks away without selecting it,
    // we must revert the input field back to whatever value was previously confirmed,
    // rather than leaving "App" dangling in the input.
    const revertLabel = useCallback(() => {
      const currentValue = isControlled ? value : defaultValue;
      const match = options.find((o) => o.value === currentValue);
      setDisplayLabel(match?.label || '');
    }, [isControlled, value, defaultValue, options]);

    // Click outside to close
    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          closeList();
          revertLabel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, [open, closeList, revertLabel]);

    // Sync controlled value changes from parent
    useEffect(() => {
      if (isControlled && value !== undefined) {
        const found = options.find((o) => o.value === value);
        setDisplayLabel(found?.label || '');
      }
    }, [isControlled, value, options]);

    // Keyboard Navigation
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) openList();
          setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) openList();
          setActiveIndex((i) => Math.max(0, i - 1));
          break;
        case 'Enter':
          if (open && activeIndex >= 0 && filtered[activeIndex]) {
            e.preventDefault();
            handleSelect(filtered[activeIndex]);
          } else if (!open) {
            openList();
          }
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            closeList();
            revertLabel();
          }
          break;
      }
    };

    // Selection Handler
    const handleSelect = (opt: ComboboxOption) => {
      setDisplayLabel(opt.label);
      onChange?.(opt.value);
      closeList();
    };

    return (
      <div ref={setRefs} className={cn('nui-combobox', className)} {...props}>
        {/* INPUT WRAPPER */}
        <div className="nui-combobox__wrapper">
          {leftIcon && <span className="nui-combobox__icon -left">{leftIcon}</span>}

          <input
            className={cn(
              'nui-combobox__input',
              !!leftIcon && 'nui-combobox__input--has-left',
              !!rightIcon && 'nui-combobox__input--has-right'
            )}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            placeholder={placeholder}
            disabled={disabled}
            value={displayLabel}
            onFocus={openList}
            onClick={openList}
            onChange={(e) => {
              setDisplayLabel(e.target.value);
              if (!open) openList();
              setActiveIndex(-1); // Reset highlight when typing
            }}
            onKeyDown={onKeyDown}
          />

          {rightIcon && <span className="nui-combobox__icon -right">{rightIcon}</span>}
        </div>

        {/* DROPDOWN LISTBOX */}
        {open && (
          <div id={listboxId} role="listbox" className="nui-combobox__listbox">
            {filtered.length === 0 ? (
              <div className="nui-combobox__empty">{emptyMessage}</div>
            ) : (
              filtered.map((opt, index) => {
                const isActive = index === activeIndex;
                const isSelected = opt.label === displayLabel; 

                return (
                  <div
                    key={opt.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'nui-combobox__option',
                      isActive && 'nui-combobox__option--active',
                      isSelected && 'nui-combobox__option--selected'
                    )}
                    // Prevent input blur when clicking an option
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={() => handleSelect(opt)}
                  >
                    {renderOptionIcon && (
                      <span className="nui-combobox__option-icon">
                        {renderOptionIcon(opt)}
                      </span>
                    )}

                    {renderOption ? renderOption(opt, isActive) : opt.label}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';