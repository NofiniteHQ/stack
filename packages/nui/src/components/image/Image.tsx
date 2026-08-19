"use client";

import React, { useState, useEffect, forwardRef } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../utils';
import { Skeleton } from '../skeleton/Skeleton';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallback?: React.ReactNode;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      className,
      fallbackSrc,
      fallback,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
      if (!src) {
        setStatus('error');
        return;
      }
      setStatus('loading');
    }, [src]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('loaded');
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('error');
      onError?.(e);
    };

    if (status === 'error' && !fallbackSrc) {
      if (fallback) {
        return <div className={cn("flex items-center justify-center bg-subtle text-muted rounded-md overflow-hidden", className)}>{fallback}</div>;
      }
      return (
        <div 
          className={cn("flex flex-col items-center justify-center bg-subtle text-muted rounded-md overflow-hidden", className)}
          title={alt}
        >
          <ImageOff className="w-[30%] max-w-[24px] max-h-[24px] min-w-[12px] min-h-[12px] opacity-40 shrink-0" />
          {alt && <span className="text-xs text-center truncate w-full px-2 mt-1.5 opacity-60">{alt}</span>}
        </div>
      );
    }

    return (
      <div className={cn("relative overflow-hidden rounded-md flex items-center justify-center", className)}>
        {status === 'loading' && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        <img
          ref={ref}
          src={status === 'error' ? fallbackSrc : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            status === 'loaded' || (status === 'error' && fallbackSrc) ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      </div>
    );
  }
);

Image.displayName = 'Image';
