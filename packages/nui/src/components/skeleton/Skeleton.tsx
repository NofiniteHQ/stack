import React from 'react';
import { cn } from '../../utils';
import './Skeleton.css';

/* ============================================================
 * Types
 * ============================================================ */

type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The predefined height mapping for the skeleton */
  size?: SkeletonSize;
  /** Explicit width override (supports numbers as px, or strings like '100%') */
  width?: number | string;
  /** Explicit height override (supports numbers as px, or strings like '50px') */
  height?: number | string; 
  /** Enables or disables the sweeping shimmer animation. Defaults to true. */
  animated?: boolean;
  /** Forces the skeleton into a perfect circle, ignoring the size height */
  circle?: boolean;
  /** Hides the element from screen readers. Defaults to true (recommended). */
  ariaHidden?: boolean;
}

function formatSize(val?: number | string): string | undefined {
  if (val === undefined) return undefined;
  return typeof val === 'number' ? `${val}px` : val;
}

/* ============================================================
 * 1. Root Component
 * ============================================================ */

/**
 * Skeleton Component (Root)
 * * A visual placeholder used during asynchronous data fetching.
 * * WAI-ARIA Note: Skeletons are strictly visual and should remain hidden from 
 * screen readers (`aria-hidden="true"`) to prevent them from reading out 
 * dozens of "presentation" or "empty" blocks while data loads.
 */
const SkeletonRoot = React.forwardRef<HTMLSpanElement, SkeletonProps>(({
  size = 'md',
  width,
  height,
  animated = true,
  circle = false,
  ariaHidden = true,
  className,
  style,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      aria-hidden={ariaHidden}
      role="presentation"
      className={cn(
        'nui-skeleton',
        `nui-skeleton--${size}`,
        animated && 'nui-skeleton--animated',
        circle && 'nui-skeleton--circle',
        className
      )}
      style={{
        width: formatSize(width),
        height: formatSize(height),
        ...style,
      }}
      {...props}
    />
  );
});
SkeletonRoot.displayName = 'Skeleton';

/* ============================================================
 * Helper Components
 * ============================================================ */

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  size?: SkeletonSize;
}

function Text({ width = '100%', size = 'md', className, ...props }: SkeletonTextProps) {
  return <SkeletonRoot width={width} size={size} className={className} {...props} />;
}

export interface SkeletonParagraphProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  size?: SkeletonSize;
}

function Paragraph({ lines = 3, size = 'md', className, ...props }: SkeletonParagraphProps) {
  return (
    <div 
      aria-hidden="true" 
      className={cn("nui-skeleton-paragraph", className)} 
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      {...props}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonRoot 
          key={i} 
          width={i === lines - 1 ? '75%' : '100%'} 
          size={size} 
        />
      ))}
    </div>
  );
}

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
}

function Avatar({ size = 40, className, ...props }: SkeletonAvatarProps) {
  // width sets the size, the CSS aspect-ratio: 1/1 guarantees it stays a perfect circle!
  return <SkeletonRoot circle width={size} className={className} {...props} />;
}

export interface SkeletonButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
}

function Button({ width = 100, height = 40, className, ...props }: SkeletonButtonProps) {
  return (
    <SkeletonRoot
      width={width}
      height={height}
      className={cn("nui-skeleton-button", className)}
      style={{ borderRadius: '6px' }}
      {...props}
    />
  );
}

function Card({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      aria-hidden="true" 
      className={cn("nui-skeleton-card", className)} 
      style={{ padding: '16px', border: '1px solid var(--nui-border-default, #e2e8f0)', borderRadius: '12px', ...style }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Avatar size={48} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonRoot width="40%" size="md" />
          <SkeletonRoot width="20%" size="sm" />
        </div>
      </div>
      <Paragraph lines={3} />
    </div>
  );
}

/* ============================================================
 * Export
 * ============================================================ */

export const Skeleton = Object.assign(SkeletonRoot, {
  Text,
  Paragraph,
  Avatar,
  Button,
  Card,
});