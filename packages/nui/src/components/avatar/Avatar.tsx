"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
 src?: string;
 alt?: string;
 name?: string;
 size?: AvatarSize;
 shape?: AvatarShape;
 status?: AvatarStatus;
 fallbackIcon?: React.ReactNode; 
 loading?: boolean; 
 className?: string;
}

/**
 * Utility to extract initials from a name string.
 * Handles single words and multi-word names appropriately.
 */
function getInitials(name?: string): string {
 if (!name) return '';
 const parts = name.trim().split(/\s+/);
 if (parts.length === 0) return '';
 if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
 return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses = {
 sm: 'w-8 h-8 text-xs',
 md: 'w-10 h-10 text-sm',
 lg: 'w-14 h-14 text-lg',
 xl: 'w-18 h-18 text-2xl',
};

const shapeClasses = {
 circle: 'rounded-full',
 rounded: 'rounded-md',
 square: 'rounded-sm',
};

const statusClasses = {
 online: 'bg-success',
 busy: 'bg-danger',
 away: 'bg-warning',
 offline: 'bg-muted',
};

/**
 * Avatar Component
 * * A visual representation of a user or entity.
 * Implements a strict fallback sequence: Image -> Initials -> Fallback Icon -> Default Icon.
 */
export function Avatar({
 src,
 alt,
 name,
 size = 'md',
 shape = 'circle',
 status,
 fallbackIcon, 
 loading, 
 className,
 ...props 
}: AvatarProps) {
 // * Native error handling: We track if the image fails to load via the native onError event
 // to seamlessly trigger the fallback UI without needing complex fetch checks.
 const [hasError, setHasError] = useState(false);
 const initials = getInitials(name);
 
 // If loading is true, we force the fallback/skeleton state by hiding the image
 const showImage = src && !hasError && !loading;

 return (
 <div
 className={cn(
 "relative inline-flex items-center justify-center shrink-0 bg-muted text-default border border-transparent overflow-hidden",
 sizeClasses[size],
 shapeClasses[shape],
 loading && "bg-muted animate-pulse cursor-wait",
 className
 )}
 role="img"
 aria-label={alt || name || "Avatar"}
 {...props} 
 >
 {showImage ? (
 <img
 src={src}
 alt={alt || name}
 className="w-full h-full object-cover rounded-[inherit]"
 onError={() => setHasError(true)}
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center font-sans font-medium uppercase rounded-[inherit]" aria-hidden="true">
 {/* Fallback Waterfall Logic */}
 {!loading && (initials || fallbackIcon || (
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
 <circle cx="12" cy="7" r="4"></circle>
 </svg>
 ))}
 </div>
 )}

 {status && (
 <span 
 className={cn(
 "absolute -bottom-0.5 -right-0.5 w-1/4 h-1/4 min-w-[8px] min-h-[8px] rounded-full border-2 border-surface",
 statusClasses[status]
 )} 
 role="status"
 aria-label={status}
 />
 )}
 </div>
 );
}