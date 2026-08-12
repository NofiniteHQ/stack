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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';
import { VirtualList } from '../virtuallist/VirtualList';

export interface ComboboxOption {
 label: string;
 value: string;
 icon?: React.ReactNode;
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
 data: ComboboxOption[];
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
 data,
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
 if (isControlled && value) return data.find((o) => o.value === value)?.label ?? '';
 if (defaultValue) return data.find((o) => o.value === defaultValue)?.label ?? '';
 return '';
 });
 
 const [open, setOpen] = useState(false);
 const [activeIndex, setActiveIndex] = useState<number>(-1);
 const wrapperRef = useRef<HTMLDivElement | null>(null);
 const listRef = useRef<HTMLDivElement | null>(null);

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
 const filtered = data.filter((opt) =>
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
 const match = data.find((o) => o.value === currentValue);
 setDisplayLabel(match?.label || '');
 }, [isControlled, value, defaultValue, data]);

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
 const found = data.find((o) => o.value === value);
 setDisplayLabel(found?.label || '');
 }
 }, [isControlled, value, data]);

 // Auto-scroll for VirtualList
 useEffect(() => {
 if (open && listRef.current && activeIndex >= 0) {
 const list = listRef.current;
 const itemHeight = 36;
 const scrollTop = list.scrollTop;
 const viewportHeight = list.clientHeight || 240;
 const itemTop = activeIndex * itemHeight;
 const itemBottom = itemTop + itemHeight;

 if (itemTop < scrollTop) {
 list.scrollTop = itemTop;
 } else if (itemBottom > scrollTop + viewportHeight) {
 list.scrollTop = itemBottom - viewportHeight;
 }
 }
 }, [activeIndex, open]);

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
 <div ref={setRefs} className={cn('relative w-full font-sans', className)} {...props}>
 {/* INPUT WRAPPER */}
 <div className="relative flex w-full items-center">
 {leftIcon && <span className="absolute left-3 flex items-center justify-center text-muted pointer-events-none">{leftIcon}</span>}

 <input
 className={cn(
 'h-10 w-full rounded-md border border-default bg-surface px-3 text-sm text-default shadow-sm outline-none transition-all duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle',
 !!leftIcon && 'pl-10',
 !!rightIcon && 'pr-10'
 )}
 role="combobox"
 aria-haspopup="listbox"
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

 {rightIcon && <span className="absolute right-3 flex items-center justify-center text-muted pointer-events-none">{rightIcon}</span>}
 </div>

 {/* DROPDOWN LISTBOX */}
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.15 }}
 id={listboxId}
 role="presentation"
 className="absolute left-0 top-full mt-1 z-50 w-full rounded-md border border-default bg-glass backdrop-blur-md p-1 shadow-md overflow-hidden"
 >
 {filtered.length === 0 ? (
 <div className="p-3 text-center text-sm italic text-muted">{emptyMessage}</div>
 ) : (
 <VirtualList
 ref={listRef}
 items={filtered}
 height={Math.min(filtered.length * 36, 240)}
 itemHeight={36}
 keyExtractor={(opt) => opt.value}
 className="w-full h-auto bg-transparent border-none rounded-none outline-none focus-visible:ring-0 !p-0 m-0"
 role="listbox"
 renderItem={(opt, index) => {
 const isActive = index === activeIndex;
 const isSelected = opt.label === displayLabel; 

 return (
 <div
 id={`${listboxId}-option-${index}`}
 role="option"
 aria-selected={isSelected}
 className={cn(
 'flex w-full h-full cursor-pointer items-center rounded-sm px-3 text-sm text-default transition-colors duration-200',
 isActive && 'bg-muted',
 isSelected && 'bg-subtle font-medium text-default'
 )}
 // Prevent input blur when clicking an option
 onMouseDown={(e) => e.preventDefault()} 
 onClick={() => handleSelect(opt)}
 >
 {renderOptionIcon && (
 <span className="mr-2 inline-flex opacity-80">
 {renderOptionIcon(opt)}
 </span>
 )}

 {renderOption ? renderOption(opt, isActive) : opt.label}
 </div>
 );
 }}
 />
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 }
);

Combobox.displayName = 'Combobox';