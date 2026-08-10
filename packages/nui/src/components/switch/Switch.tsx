"use client";

import React, { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
 checked?: boolean;
 defaultChecked?: boolean;
 onChange?: (checked: boolean) => void;
 disabled?: boolean;
 label?: React.ReactNode;
 description?: React.ReactNode;
 name?: string;
 value?: string;
 size?: 'sm' | 'md';
 wrapperClassName?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
 (
 {
 checked,
 defaultChecked,
 onChange,
 disabled = false,
 label,
 description,
 id,
 name,
 value,
 size = 'md',
 className,
 wrapperClassName,
 ...props
 },
 ref
 ) => {
 const reactId = useId();
 const switchId = id ?? `nui-switch-${reactId}`;
 const descriptionId = `${switchId}-description`;

 const isControlled = checked !== undefined;
 const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
 const currentChecked = isControlled ? checked : internalChecked;

 const toggle = () => {
 if (disabled) return;
 const nextState = !currentChecked;
 if (!isControlled) setInternalChecked(nextState);
 onChange?.(nextState);
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
 if (e.key === ' ' || e.key === 'Enter') {
 e.preventDefault();
 toggle();
 }
 props.onKeyDown?.(e);
 };

 const handleLabelClick = (e: React.MouseEvent) => {
 if (disabled) return;
 e.preventDefault(); 
 toggle();
 document.getElementById(switchId)?.focus();
 };

 const hiddenValue = value ?? (currentChecked ? 'on' : 'off');

 return (
 <div 
 className={cn(
 "inline-flex items-start gap-3 font-sans", 
 disabled && "opacity-60 cursor-not-allowed", 
 wrapperClassName
 )}
 >
 {name && (
 <input type="hidden" name={name} value={currentChecked ? hiddenValue : ''} />
 )}

 <button
 ref={ref}
 id={switchId}
 type="button"
 role="switch"
 aria-checked={currentChecked}
 aria-disabled={disabled}
 aria-describedby={description ? descriptionId : undefined}
 className={cn(
 "relative shadow-sm inline-flex shrink-0 items-center m-0 p-0.5 rounded-full cursor-pointer transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50",
 size === 'sm' ? "w-9 h-5" : "w-11 h-6",
 currentChecked ? "bg-primary border border-primary text-inverse hover:not(:disabled):opacity-90" : "bg-surface border border-default hover:not(:disabled):bg-subtle",
 className
 )}
 onClick={toggle}
 onKeyDown={handleKeyDown}
 disabled={disabled}
 {...props}
 >
 <motion.span 
 className={cn(
 "block rounded-full shadow-sm bg-surface", 
 size === 'sm' ? "w-4 h-4" : "w-5 h-5"
 )} 
 animate={{ x: currentChecked ? (size === 'sm' ? 16 : 20) : 0 }}
 transition={{ type: "spring", stiffness: 500, damping: 30 }}
 aria-hidden="true" 
 />
 </button>

 {(label || description) && (
 <div className="flex flex-col gap-[2px] mt-[1px]">
 {label && (
 <label 
 htmlFor={switchId} 
 className={cn(
 "text-sm text-default font-medium leading-tight cursor-pointer select-none",
 disabled && "cursor-not-allowed"
 )}
 onClick={handleLabelClick}
 >
 {label}
 </label>
 )}
 {description && (
 <div id={descriptionId} className="text-xs text-muted leading-snug">
 {description}
 </div>
 )}
 </div>
 )}
 </div>
 );
 }
);

Switch.displayName = 'Switch';