"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';
import './Avatar.css';

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
        "nui-avatar", 
        loading && "nui-avatar--loading", 
        className
      )}
      data-size={size}
      data-shape={shape}
      role="img"
      aria-label={alt || name || "Avatar"}
      {...props} 
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          className="nui-avatar__image"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="nui-avatar__fallback" aria-hidden="true">
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
          className="nui-avatar__status" 
          data-status={status} 
          role="status"
          aria-label={status}
        />
      )}
    </div>
  );
}