import React from 'react';
import { cn } from '../../utils';

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
 const sizeStyles = {
 xs: 'h-3',
 sm: 'h-4',
 md: 'h-5',
 lg: 'h-6',
 xl: 'h-8',
 };

 return (
 <span
 ref={ref}
 aria-hidden={ariaHidden}
 role="presentation"
 className={cn(
 'block bg-muted',
 !circle && sizeStyles[size],
 circle ? 'rounded-full' : 'rounded-md',
 animated && 'animate-pulse',
 className
 )}
 style={{
 width: formatSize(width),
 height: formatSize(height),
 ...(circle && formatSize(width) ? { height: formatSize(width) } : {}),
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
 className={cn("flex flex-col gap-2", className)} 
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
 className={cn("rounded-md", className)}
 {...props}
 />
 );
}

function Card({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div 
 aria-hidden="true" 
 className={cn("rounded-xl border border-default p-4", className)} 
 style={style}
 {...props}
 >
 <div className="mb-4 flex items-center gap-3">
 <Avatar size={48} />
 <div className="flex flex-1 flex-col gap-2">
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