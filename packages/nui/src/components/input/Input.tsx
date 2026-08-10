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
 sm: "h-8 px-2 py-1 text-xs",
 md: "h-10 px-3 py-2 text-sm",
 lg: "h-12 px-4 py-3 text-base"
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
 "w-full bg-surface text-default border border-default rounded-md font-inherit transition-all duration-200 appearance-none outline-none placeholder:text-muted placeholder:opacity-80 hover:bg-subtle focus-visible:outline-none focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle",
 inputSizeMap[inputSize],
 !!error && "border-danger focus-visible:ring-danger",
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
 <div id={descriptionId} className="text-xs text-muted mt-[2px]">
 {description}
 </div>
 )}

 {error && (
 <div id={errorId} className="text-xs text-danger font-medium mt-[2px]" aria-live="polite">
 {error}
 </div>
 )}
 </div>
 );
 }
);

Input.displayName = 'Input';