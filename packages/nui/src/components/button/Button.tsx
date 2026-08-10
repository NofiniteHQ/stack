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
 default: "bg-surface text-default border border-default shadow-sm hover:bg-muted",
 primary: "bg-primary text-inverse border-transparent shadow-sm hover:opacity-90",
 outline: "bg-transparent border border-default text-default hover:bg-subtle",
 ghost: "bg-transparent text-default hover:bg-subtle",
 danger: "bg-danger text-inverse border-transparent shadow-sm hover:opacity-90",
 link: "text-primary underline-offset-4 hover:underline"
 },
 size: {
 sm: "h-8 px-3 text-xs",
 md: "h-10 px-4 text-sm",
 lg: "h-12 px-6 text-base",
 icon: "h-10 w-10 p-0"
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
 "inline-flex items-center justify-center whitespace-nowrap gap-2 font-sans font-medium leading-none rounded-md border transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
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