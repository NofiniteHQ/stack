"use client";

import React, { createContext, useContext, forwardRef, useState, useCallback } from 'react';
import { cn } from '../../utils';

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

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'dir'> {
 value?: string;
 defaultValue?: string;
 onChange?: (value: string) => void;
 name?: string;
 disabled?: boolean;
 orientation?: 'horizontal' | 'vertical';
}

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
 "flex font-sans text-default",
 orientation === 'horizontal' ? "flex-row flex-wrap gap-6" : "flex-col gap-3",
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

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'name' | 'onChange' | 'type'> {
 value: string;
}

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
 aria-checked={isChecked ? "true" : "false"}
 onChange={(e) => context.onChange(e.target.value)}
 className={cn(
 "appearance-none w-4 h-4 m-0 rounded-full border border-solid border-strong bg-surface transition-all duration-200 cursor-pointer hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] checked:border-[5px] checked:border-primary checked:bg-surface disabled:cursor-not-allowed disabled:opacity-50",
 className
 )}
 {...props}
 />
 );
});
RadioGroupItem.displayName = 'RadioGroup.Item';

export const RadioGroup = Object.assign(RadioGroupRoot, {
 Item: RadioGroupItem,
});