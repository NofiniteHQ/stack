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
  default: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50",
  primary: "bg-blue-600 text-white border-transparent shadow-sm hover:bg-blue-700",
  outline: "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50",
  ghost: "bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white border-transparent shadow-sm hover:bg-red-700",
  link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline"
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
 ...props 
 }, ref) => {
 
 const isDisabled = disabled || isLoading;
 const Comp = asChild ? Slot : "button";

 return (
 <Comp
 ref={ref}
 disabled={isDisabled}
  className={cn(
  "inline-flex items-center justify-center whitespace-nowrap gap-2 font-sans font-medium transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
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