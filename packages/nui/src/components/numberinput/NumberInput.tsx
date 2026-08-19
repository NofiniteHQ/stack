"use client";

import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { Input, InputProps } from '../input/Input';

export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value?: number | '';
  defaultValue?: number | '';
  onChange?: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  hideStepper?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      hideStepper = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number | ''>(defaultValue ?? '');
    
    const value = isControlled ? controlledValue : internalValue;
    const inputRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const handleRef = useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const updateValue = (newValue: number | '') => {
      let finalValue = newValue;

      if (typeof finalValue === 'number') {
        if (min !== undefined) finalValue = Math.max(min, finalValue);
        if (max !== undefined) finalValue = Math.min(max, finalValue);
        // Round to avoid float precision issues if step has decimals
        const multiplier = Math.pow(10, step.toString().split('.')[1]?.length || 0);
        finalValue = Math.round(finalValue * multiplier) / multiplier;
      }

      if (!isControlled) {
        setInternalValue(finalValue);
      }
      onChange?.(finalValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        updateValue('');
        return;
      }
      const num = Number(val);
      if (!isNaN(num)) {
        if (!isControlled) {
          setInternalValue(num);
        }
        onChange?.(num);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clamp on blur to ensure bounds using the raw input value to prevent stale state issues
      const val = e.target.value;
      if (val !== '') {
        const num = Number(val);
        if (!isNaN(num)) {
          updateValue(num);
        }
      }
      props.onBlur?.(e);
    };

    const handleIncrement = () => {
      if (disabled) return;
      const current = typeof value === 'number' ? value : (min ?? 0);
      updateValue(current + step);
      inputRef.current?.focus();
    };

    const handleDecrement = () => {
      if (disabled) return;
      const current = typeof value === 'number' ? value : (min ?? 0);
      updateValue(current - step);
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }
      props.onKeyDown?.(e);
    };

    const stepperNode = !hideStepper && !disabled && (
      <div className="flex flex-col border-l border-solid border-subtle !border-t-0 !border-r-0 !border-b-0 h-full w-8 overflow-hidden rounded-r-[5px] bg-transparent">
        <motion.button
          type="button"
          tabIndex={-1}
          aria-label="Increase value"
          className="flex-1 flex items-center justify-center appearance-none bg-transparent !border-t-0 !border-r-0 !border-l-0 !border-b border-solid border-subtle text-muted hover:text-default hover:bg-subtle transition-colors focus-visible:outline-none focus-visible:bg-subtle m-0 p-0 cursor-pointer"
          onClick={handleIncrement}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ChevronUp size={14} strokeWidth={2} />
        </motion.button>
        <motion.button
          type="button"
          tabIndex={-1}
          aria-label="Decrease value"
          className="flex-1 flex items-center justify-center appearance-none bg-transparent !border-0 text-muted hover:text-default hover:bg-subtle transition-colors focus-visible:outline-none focus-visible:bg-subtle m-0 p-0 cursor-pointer"
          onClick={handleDecrement}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ChevronDown size={14} strokeWidth={2} />
        </motion.button>
      </div>
    );

    return (
      <div className="relative inline-block w-full font-sans nui-number-input-container">
        <Input
          {...props}
          ref={handleRef}
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          role="spinbutton"
          aria-valuenow={typeof value === 'number' ? value : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          className={cn(
            "nui-number-input", 
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
          rightIcon={stepperNode}
          rightIconClassName="!right-[1px] !top-[1px] !bottom-[1px] h-[calc(100%-2px)] pointer-events-auto"
        />
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

