"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  disabled = false,
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleSelect = (val: string) => {
    if (disabled) return;
    const option = options.find((o) => o.value === val);
    if (option?.disabled) return;

    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const enabledOptions = options.filter(o => !o.disabled);
    if (enabledOptions.length === 0) return;

    const currentIndex = enabledOptions.findIndex(o => o.value === value);
    let nextValue = '';

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % enabledOptions.length;
      nextValue = enabledOptions[nextIndex].value;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
      nextValue = enabledOptions[prevIndex].value;
    }

    if (nextValue) {
      handleSelect(nextValue);
      buttonRefs.current.get(nextValue)?.focus();
    }
  };

  // Provide a fallback name if none provided, to ensure framer-motion layoutId is scoped (mostly) safely
  const safeName = name || React.useId();

  return (
    <div
      ref={containerRef}
      className={cn(
        "inline-flex p-1 bg-muted rounded-lg items-center relative z-0 font-sans",
        fullWidth && "flex w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      role="radiogroup"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        
        // Roving tabindex: only the selected item (or first enabled if none selected) is tabbable
        const isFirstEnabled = options.findIndex(o => !o.disabled) === index;
        const isTabbable = isSelected || (!value && isFirstEnabled);

        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(option.value, el);
              } else {
                buttonRefs.current.delete(option.value);
              }
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => handleSelect(option.value)}
            tabIndex={isDisabled ? -1 : (isTabbable ? 0 : -1)}
            className={cn(
              "relative flex items-center justify-center font-sans font-medium rounded-md transition-colors z-10 outline-none border-none bg-transparent appearance-none",
              sizeStyles[size],
              fullWidth && "flex-1",
              isSelected ? "text-default" : "text-muted hover:text-default",
              isDisabled && "opacity-50 cursor-not-allowed hover:text-muted"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-control-bg-${safeName}`}
                className="absolute inset-0 bg-surface rounded-md shadow-sm z-[-1]"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 1,
                }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
