"use client";

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '../../utils';


export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  type?: 'numeric' | 'alphanumeric' | 'alphabetic';
  otp?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: "w-10 h-10 text-lg",
  md: "w-12 h-12 text-xl",
  lg: "w-14 h-14 text-2xl",
};

export function PinInput({
  length = 4,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  mask = false,
  disabled = false,
  autoFocus = false,
  placeholder = '○',
  type = 'numeric',
  otp = false,
  size = 'md',
  className,
  ...props
}: PinInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    (defaultValue || '').slice(0, length)
  );

  const value = isControlled ? controlledValue : internalValue;
  const valueArray = value.split('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerChange = (newVal: string) => {
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(newVal);
    if (newVal.length === length) {
      onComplete?.(newVal);
    }
  };

  const focusInput = (index: number) => {
    const targetIndex = Math.max(0, Math.min(length - 1, index));
    inputRefs.current[targetIndex]?.focus();
  };

  const handleInputChange = (index: number, val: string) => {
    if (disabled) return;
    
    // Only take the last character typed
    const char = val.slice(-1);

    if (char) {
      if (type === 'numeric' && !/^[0-9]+$/.test(char)) return;
      if (type === 'alphabetic' && !/^[a-zA-Z]+$/.test(char)) return;
      if (type === 'alphanumeric' && !/^[a-zA-Z0-9]+$/.test(char)) return;
    }
    
    const newValueArray = [...valueArray];
    while (newValueArray.length < length) newValueArray.push('');
    newValueArray[index] = char;

    const newValue = newValueArray.join('');
    triggerChange(newValue);

    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      const isCurrentEmpty = !valueArray[index];
      
      const newValueArray = [...valueArray];
      while (newValueArray.length < length) newValueArray.push('');
      
      if (isCurrentEmpty && index > 0) {
        // Current is empty, delete previous and move focus back
        newValueArray[index - 1] = '';
        triggerChange(newValueArray.join(''));
        focusInput(index - 1);
      } else {
        // Delete current
        newValueArray[index] = '';
        triggerChange(newValueArray.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    let pastedData = e.clipboardData.getData('text');
    
    // Filter pasted data based on type
    if (type === 'numeric') {
      pastedData = pastedData.replace(/[^0-9]/g, '');
    } else if (type === 'alphabetic') {
      pastedData = pastedData.replace(/[^a-zA-Z]/g, '');
    } else if (type === 'alphanumeric') {
      pastedData = pastedData.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    pastedData = pastedData.slice(0, length);
    if (!pastedData) return;

    triggerChange(pastedData);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = pastedData.length < length ? pastedData.length : length - 1;
    focusInput(nextEmptyIndex);
  };

  return (
    <div
      className={cn("flex items-center gap-3 font-sans", className)}
      role="group"
      {...props}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type={mask ? "password" : type === 'numeric' ? "tel" : "text"}
          inputMode={type === 'numeric' ? "numeric" : "text"}
          autoComplete={otp ? "one-time-code" : "off"}
          maxLength={2}
          value={valueArray[index] || ''}
          placeholder={placeholder}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={cn(
            // Base styles for perfect square, minimalist aesthetic
            "text-center font-medium px-0",
            sizeMap[size],
            "bg-surface text-default border border-solid border-subtle rounded-xl",
            "transition-all duration-200 outline-none appearance-none",
            // Placeholder hollow circle styling
            "placeholder:text-muted placeholder:font-light",
            // Focus and hover states (matching standard but flat/minimalist)
            "hover:border-strong",
            "focus-visible:outline-none focus-visible:border-[var(--nui-fg-subtle)] focus-visible:ring-1 focus-visible:ring-[var(--nui-fg-subtle)]",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle",
            // Mask handling
            mask && "tracking-widest"
          )}
          aria-label={`Pin input ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
