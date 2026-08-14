"use client";

import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: React.ReactNode;
 description?: React.ReactNode;
 error?: React.ReactNode;
 inputSize?: 'sm' | 'md' | 'lg';
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
 wrapperClassName?: string;
}

const inputSizeMap = {
 sm: "h-8 px-2.5 py-1 text-xs",
 md: "h-9 px-3 py-1.5 text-sm",
 lg: "h-11 px-4 py-2 text-base"
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
 (
 {
 label,
 description,
 error,
 inputSize = 'md',
 leftIcon,
 rightIcon,
 className,
 wrapperClassName,
 id,
 required,
 disabled,
 ...props
 },
 ref
 ) => {
 const reactId = useId();
 const inputId = id ?? reactId;
 const errorId = `${inputId}-error`;
 const descriptionId = `${inputId}-description`;
 const describedBy = error ? errorId : description ? descriptionId : undefined;
 const isInvalid = !!error || props['aria-invalid'] === true || props['aria-invalid'] === "true";

 return (
 <div className={cn("flex flex-col gap-1 w-full font-sans", wrapperClassName)}>
 {label && (
 <label 
 htmlFor={inputId} 
 className={cn("text-sm font-medium text-default leading-tight", disabled && "text-muted")}
 >
 {label}
 {required && <span className="text-danger" aria-hidden="true"> *</span>}
 </label>
 )}

 <div className="relative w-full flex items-center">
 {leftIcon && <span className="absolute left-3 flex items-center justify-center text-muted pointer-events-none">{leftIcon}</span>}
 
 <input
 ref={ref}
 id={inputId}
 required={required}
 disabled={disabled}
 className={cn(
 "w-full bg-white dark:bg-[#0a0a0b] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md font-sans transition-all duration-200 appearance-none outline-none shadow-sm",
 "placeholder:text-slate-400 dark:placeholder:text-slate-500",
 "hover:border-slate-300 dark:hover:border-slate-700",
 "focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/20",
 "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900",
 inputSizeMap[inputSize],
 isInvalid && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
 !!leftIcon && "pl-[40px]",
 !!rightIcon && "pr-[40px]",
 className
 )}
 aria-invalid={!!error ? "true" : "false"}
 aria-describedby={describedBy}
 {...props}
 />

 {rightIcon && <span className="absolute right-3 flex items-center justify-center text-muted pointer-events-none">{rightIcon}</span>}
 </div>

 {description && !error && (
 <div id={descriptionId} className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
 {description}
 </div>
 )}

 {error && (
 <div id={errorId} className="text-[13px] text-red-500 font-medium mt-1" aria-live="polite">
 {error}
 </div>
 )}
 </div>
 );
 }
);

Input.displayName = 'Input';