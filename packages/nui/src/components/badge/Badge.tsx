import React from 'react';
import { cn } from '../../utils';
import './Badge.css';

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
  const classes = cn(
    'nui-badge',
    `nui-badge--${variant}`,
    `nui-badge--${size}`,
    pill && 'nui-badge--pill',
    dot && 'nui-badge--dot',
    (href || onClick) && 'nui-badge--interactive',
    className
  );

  // 3. Render Inner Content
  const inner = (
    <>
      {iconLeft && <span className="nui-badge__icon">{iconLeft}</span>}
      {!dot && content}
      {iconRight && <span className="nui-badge__icon">{iconRight}</span>}
    </>
  );

  // 4. Render as Link (Semantic Anchor)
  if (href) {
    return (
      <a 
        href={href} 
        className={classes} 
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  // 5. Render as Button (Semantic Interactive Element)
  if (onClick) {
    return (
      <button 
        type="button" 
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} 
        className={classes} 
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }

  // 6. Default Span (Static Indicator)
  return (
    <span className={classes} {...props}>
      {inner}
    </span>
  );
}