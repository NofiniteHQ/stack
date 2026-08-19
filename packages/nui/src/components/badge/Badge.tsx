import React from 'react';
import { cn, Slot } from '../../utils';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
 children?: React.ReactNode;
 /** Displays a numerical count inside the badge */
 count?: number;
 /** The maximum number to display before showing a '+' (e.g., 99+) */
 max?: number;
 variant?: BadgeVariant;
 size?: BadgeSize;
 /** Rounds the edges to create a pill shape */
 pill?: boolean;
 /** Renders a small, empty circular indicator instead of text */
 dot?: boolean;
 
 /** If provided, renders the badge as an <a> tag */
 href?: string;
 /** If provided, renders the badge as a <button> tag */
 onClick?: React.MouseEventHandler<HTMLElement>;
 
 iconLeft?: React.ReactNode;
 iconRight?: React.ReactNode;
 /** Renders the component using its child element */
 asChild?: boolean;
}

/**
 * Badge Component
 * * A small status descriptor for UI elements.
 * Architecture Note: Dynamically renders as a <span>, <a>, or <button> based on
 * the presence of `href` or `onClick` props to ensure strict semantic HTML.
 */
export function Badge({
 children,
 count,
 max = 99,
 variant = 'default',
 size = 'md',
 pill = false,
 dot = false,
 href,
 onClick,
 className,
 iconLeft,
 iconRight,
 asChild,
 ...props
}: BadgeProps) {
 
 // 1. Calculate Display Content
 let content = children;
 
 if (count !== undefined) {
 if (dot) {
 content = null; 
 } else {
 content = count > max ? `${max}+` : count;
 }
 }

 // 2. Compute Classes
 const variantStyles = {
 default: 'bg-subtle text-default border border-default',
 primary: 'bg-primary text-inverse border border-transparent',
 success: 'bg-success-subtle text-success border border-success',
 warning: 'bg-warning-subtle text-warning border border-warning',
 danger: 'bg-danger-subtle text-danger border border-danger',
 outline: 'bg-surface text-default border border-default',
 };
 const sizeStyles = {
 sm: 'text-xs px-2 py-0.5',
 md: 'text-sm px-2.5 py-0.5',
 lg: 'text-base px-3 py-1',
 };

 const classes = cn(
 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]',
 pill ? 'rounded-full' : 'rounded-md',
 variantStyles[variant],
 !dot && sizeStyles[size],
 dot && 'h-2 w-2 p-0 rounded-full',
 (href || onClick) && 'cursor-pointer hover:opacity-80',
 className
 );

 // 3. Render Inner Content
 const inner = (
 <>
 {iconLeft && <span className="mr-1 flex items-center justify-center">{iconLeft}</span>}
 {!dot && content}
 {iconRight && <span className="ml-1 flex items-center justify-center">{iconRight}</span>}
 </>
 );

 // 4. Render Component
 const Comp = asChild ? Slot : href ? 'a' : onClick ? 'button' : 'span';
 const typeProps = !asChild && !href && onClick ? { type: 'button' as const } : {};

 return (
 <Comp
 className={classes}
 href={href}
 onClick={onClick as React.MouseEventHandler<HTMLElement>}
 {...typeProps}
 {...props}
 >
 {inner}
 </Comp>
 );
}