import React from 'react';
import { cn } from '../../utils'; 
import { AvatarSize, AvatarProps } from './Avatar'; 

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
 children?: React.ReactNode;
 /** Maximum number of avatars to display before truncating */
 max?: number;
 /** Size passed down to all nested Avatar components */
 size?: AvatarSize;
 className?: string;
}

const sizeClasses = {
 sm: 'w-8 h-8 text-xs',
 md: 'w-10 h-10 text-sm',
 lg: 'w-14 h-14 text-lg',
 xl: 'w-18 h-18 text-2xl',
};

/**
 * AvatarGroup Component
 * * Visually groups multiple Avatar components together, handling truncation and overlapping.
 */
export function AvatarGroup({
 children,
 max = 3,
 size = 'md',
 className,
 ...props
}: AvatarGroupProps) {
 const items = React.Children.toArray(children);
 const visibleItems = items.slice(0, max);
 const extraCount = items.length - max;

 return (
 <div 
 className={cn("flex items-center", className)} 
 {...props}
 >
 {visibleItems.map((child, index) => {
 // * Library Architecture: We strictly check and cast children to ensure we are only
 // injecting props into valid Avatar elements, preventing runtime crashes if users
 // accidentally pass text or invalid DOM nodes as children.
 if (React.isValidElement(child)) {
 const avatarChild = child as React.ReactElement<AvatarProps>;
 
 return React.cloneElement(avatarChild, { 
 size,
 className: cn(
 "ring-2 ring-surface transition-transform duration-200 hover:-translate-y-1 hover:z-50",
 index > 0 ? "-ml-3" : "ml-0",
 avatarChild.props.className
 ),
 style: { ...avatarChild.props.style, zIndex: 50 - index }
 });
 }
 return child;
 })}

 {/* Overflow Indicator */}
 {extraCount > 0 && (
 <div 
 className={cn(
 "relative inline-flex items-center justify-center shrink-0 rounded-full bg-muted text-default border border-surface overflow-visible select-none text-[0.8em]",
 sizeClasses[size],
 "ring-2 ring-surface -ml-3 z-0"
 )}
 >
 <span className="w-full h-full flex items-center justify-center font-sans font-medium uppercase rounded-[inherit]">+{extraCount}</span>
 </div>
 )}
 </div>
 );
}