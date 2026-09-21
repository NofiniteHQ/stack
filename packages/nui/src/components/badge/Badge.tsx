import React from 'react';
import { cn, Slot } from '../../utils';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';
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

  // 2. Compute Classes via Canonical NUICSS Superclasses
  const variantMap: Record<BadgeVariant, string> = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    outline: 'badge-outline',
  };

  const sizeMap: Record<BadgeSize, string> = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  const classes = cn(
    'badge',
    variant && (variantMap[variant] || `badge-${variant}`),
    !dot && size && (sizeMap[size] || `badge-${size}`),
    pill && 'badge-pill',
    dot && 'badge-dot',
    (href || onClick) && 'cursor-pointer hover:opacity-80',
    className
  );

  // 3. Render Inner Content
  const inner = (
    <>
      {iconLeft && (
        <span className="mr-1 flex items-center justify-center">
          {iconLeft}
        </span>
      )}
      {!dot && content}
      {iconRight && (
        <span className="ml-1 flex items-center justify-center">
          {iconRight}
        </span>
      )}
    </>
  );

  // 4. Render Component
  const Comp = asChild ? Slot : href ? 'a' : onClick ? 'button' : 'span';
  const typeProps =
    !asChild && !href && onClick ? { type: 'button' as const } : {};

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
