"use client";

import React, { createContext, useContext, forwardRef, useState, useCallback } from 'react';
import { cn } from '../../utils';
import './RadioGroup.css';

/* ============================================================
 * Context
 * ============================================================ */

interface RadioGroupContextValue {
  value?: string;
  onChange: (value: string) => void;
  name: string;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('RadioGroup.Item must be used within a <RadioGroup>');
  return ctx;
}

/* ============================================================
 * 1. RadioGroup Root
 * ============================================================ */

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'dir'> {
  /** Controlled state value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Callback fired when a new radio item is selected */
  onChange?: (value: string) => void;
  /** The name attribute applied to all children to group them natively for forms */
  name?: string;
  /** Disables the entire radio group */
  disabled?: boolean;
  /** Determines the flex layout direction of the group */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * RadioGroup Component
 * * A WAI-ARIA compliant wrapper for a set of mutually exclusive radio buttons.
 * * Automatically manages the native `name` attribute to enable built-in browser keyboard navigation (arrow keys).
 */
const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
  ...props
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  // Auto-generate a stable name so native arrow-key navigation works flawlessly!
  const reactId = React.useId();
  const groupName = name || `nui-radiogroup-${reactId}`;

  const handleChange = useCallback((val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }, [isControlled, onChange]);

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onChange: handleChange, name: groupName, disabled }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-orientation={orientation}
        className={cn(
          "nui-radio-group",
          orientation === 'horizontal' && "nui-radio-group--horizontal",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
RadioGroupRoot.displayName = 'RadioGroup';

/* ============================================================
 * 2. RadioGroup Item
 * ============================================================ */

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'name' | 'onChange' | 'type'> {
  /** The unique value of this specific radio option */
  value: string;
}

/**
 * RadioGroup Item Component
 * * A styled native radio input. Must be rendered inside a `<RadioGroup>`.
 */
const RadioGroupItem = forwardRef<HTMLInputElement, RadioItemProps>(({
  value,
  disabled: itemDisabled,
  className,
  id,
  ...props
}, ref) => {
  const context = useRadioGroup();
  const isDisabled = context.disabled || itemDisabled;
  const isChecked = context.value === value;

  // We generate a fallback ID so standard <label htmlFor="..."> clicks always work
  const autoId = React.useId();
  const inputId = id || `nui-radio-${autoId}`;

  return (
    <input
      ref={ref}
      id={inputId}
      type="radio"
      name={context.name}
      value={value}
      checked={isChecked}
      disabled={isDisabled}
      aria-checked={isChecked}
      onChange={(e) => context.onChange(e.target.value)}
      className={cn("nui-radio-input", className)}
      {...props}
    />
  );
});
RadioGroupItem.displayName = 'RadioGroup.Item';

/* ============================================================
 * Export
 * ============================================================ */

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});