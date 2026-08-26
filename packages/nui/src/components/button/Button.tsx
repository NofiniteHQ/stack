"use client";

import React from 'react';
import { cn, Slot, Slottable } from '../../utils';

export type ButtonVariant = 'default' | 'primary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: ButtonVariant;
 size?: ButtonSize;
 isLoading?: boolean;
 iconLeft?: React.ReactNode;
 iconRight?: React.ReactNode;
 asChild?: boolean;
}

const buttonVariants = {
  variant: {
    default: "bg-surface text-default border border-solid border-subtle hover:bg-subtle",
    primary: "bg-primary text-primary-fg border-solid border-transparent hover:bg-primary/90",
    outline: "bg-transparent border border-solid border-strong text-default hover:bg-subtle",
    ghost: "bg-transparent text-default border border-solid border-transparent hover:bg-subtle",
    danger: "bg-danger text-danger-fg border-solid border-transparent hover:bg-danger/90",
    link: "text-primary border border-solid border-transparent underline-offset-4 hover:underline"
  },
  size: {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-9 px-4 text-sm rounded-md",
    lg: "h-11 px-8 text-sm rounded-md",
    icon: "h-9 w-9 p-0 rounded-md"
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ 
 className, 
 variant = 'default', 
 size = 'md', 
 isLoading = false, 
 iconLeft,
 iconRight,
 asChild = false,
 children, 
 disabled,
 onClick,
 ...props 
 }, ref) => {
 
 const isDisabled = disabled || isLoading;
 const Comp = asChild ? Slot : "button";

 return (
 <Comp
 ref={ref}
 disabled={asChild ? undefined : isDisabled}
 aria-disabled={isDisabled ? "true" : undefined}
 data-disabled={isDisabled ? "" : undefined}
 onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
   if (isDisabled) {
     e.preventDefault();
     return;
   }
   onClick?.(e);
 }}
  className={cn(
  "inline-flex items-center justify-center whitespace-nowrap gap-2 font-sans font-medium transition-all duration-200 active:scale-[0.98]",
  // Ultra-minimalist native outline focus state, absolutely no blue rings or complex shadows
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  buttonVariants.variant[variant],
  buttonVariants.size[size],
  className
  )}
 {...props}
 >
 {isLoading && (
 <svg 
 className="w-4 h-4 animate-spin" 
 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
 aria-hidden="true"
 >
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 )}

 {!isLoading && iconLeft && <span className="flex items-center justify-center">{iconLeft}</span>}
 
 <Slottable>
 {asChild ? children : <span>{children}</span>}
 </Slottable>
 
 {!isLoading && iconRight && <span className="flex items-center justify-center">{iconRight}</span>}
 </Comp>
 );
 }
);

Button.displayName = "Button";