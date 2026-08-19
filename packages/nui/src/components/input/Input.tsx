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
 rightIconClassName?: string;
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
 rightIconClassName,
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
 "peer w-full bg-surface text-default border border-solid border-subtle rounded-md font-sans transition-all duration-200 appearance-none outline-none",
 "placeholder:text-muted",
 "hover:border-strong",
 "focus-visible:outline-none focus-visible:border-[var(--nui-fg-subtle)] focus-visible:ring-1 focus-visible:ring-[var(--nui-fg-subtle)]",
 "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle",
 inputSizeMap[inputSize],
 isInvalid && "border-danger focus-visible:border-danger focus-visible:shadow-[inset_0_0_0_1px_var(--nui-color-danger)]",
 !!leftIcon && "pl-[40px]",
 !!rightIcon && "pr-[40px]",
 className
 )}
 aria-invalid={!!error ? "true" : "false"}
 aria-describedby={describedBy}
 {...props}
 />

 {rightIcon && <span className={cn("absolute right-3 flex items-center justify-center text-muted pointer-events-none", rightIconClassName)}>{rightIcon}</span>}
 </div>

 {description && !error && (
 <div id={descriptionId} className="text-[13px] text-muted mt-1">
 {description}
 </div>
 )}

 {error && (
 <div id={errorId} className="text-[13px] text-danger font-medium mt-1" aria-live="polite">
 {error}
 </div>
 )}
 </div>
 );
 }
);

Input.displayName = 'Input';