"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../button/Button';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  showArrows?: boolean;
  showDots?: boolean;
  itemWidth?: string;
  gap?: string;
  align?: 'start' | 'center' | 'end';
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

export function Carousel({
  children,
  showArrows = true,
  showDots = true,
  itemWidth = '100%',
  gap = '1rem',
  align = 'start',
  autoPlay = false,
  interval = 3000,
  loop = false,
  className,
  ...props
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const originalLength = children.length;
  const isLooping = loop && originalLength > 1;
  const virtualChildren = isLooping ? [...children, ...children, ...children] : children;
  
  const [virtualIndex, setVirtualIndex] = useState(isLooping ? originalLength : 0);
  const activeIndex = isLooping ? virtualIndex % originalLength : virtualIndex;

  const [isAtStart, setIsAtStart] = useState(!isLooping);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(!isLooping);

  // Mouse drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  
  const isScrollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teleportTo = useCallback((targetVirtualIndex: number, currentVirtualIndex: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const currentSlide = container.children[currentVirtualIndex] as HTMLElement;
    const targetSlide = container.children[targetVirtualIndex] as HTMLElement;
    
    if (currentSlide && targetSlide) {
      const diff = targetSlide.offsetLeft - currentSlide.offsetLeft;
      
      const originalSnap = container.style.scrollSnapType;
      const originalBehavior = container.style.scrollBehavior;
      container.style.scrollSnapType = 'none';
      container.style.scrollBehavior = 'auto';
      
      container.scrollLeft += diff;
      setVirtualIndex(targetVirtualIndex);
      
      requestAnimationFrame(() => {
        container.style.scrollSnapType = originalSnap;
        container.style.scrollBehavior = originalBehavior;
      });
    }
  }, []);

  const checkBoundaries = useCallback(() => {
    if (!scrollRef.current) return;
    if (isLooping) return; // Infinite scroll has no visual boundaries
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsAtStart(scrollLeft <= 1);
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
  }, [isLooping]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    checkBoundaries();
    
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollCenter = scrollLeft + container.clientWidth / 2;
    const scrollRight = scrollLeft + container.clientWidth;

    let closestIndex = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const el = child as HTMLElement;
      let diff = Infinity;
      if (align === 'start') {
        diff = Math.abs(el.offsetLeft - scrollLeft);
      } else if (align === 'center') {
        const elCenter = el.offsetLeft + el.offsetWidth / 2;
        diff = Math.abs(elCenter - scrollCenter);
      } else {
        const elRight = el.offsetLeft + el.offsetWidth;
        diff = Math.abs(elRight - scrollRight);
      }
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    setVirtualIndex(closestIndex);

    // Triple Buffer Teleportation for Infinite Loop
    if (isLooping && !isDragging.current) {
      if (isScrollingTimeout.current) clearTimeout(isScrollingTimeout.current);
      isScrollingTimeout.current = setTimeout(() => {
        if (closestIndex < originalLength) {
          teleportTo(closestIndex + originalLength, closestIndex);
        } else if (closestIndex >= originalLength * 2) {
          teleportTo(closestIndex - originalLength, closestIndex);
        }
      }, 150);
    }
  }, [align, checkBoundaries, isLooping, originalLength, teleportTo]);

  const scrollToIndex = useCallback((targetIndex: number) => {
    if (!scrollRef.current) return;
    setVirtualIndex(targetIndex);
    const container = scrollRef.current;
    const slide = container.children[targetIndex] as HTMLElement;
    
    if (slide) {
      container.scrollTo({
        left: slide.offsetLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  const next = useCallback(() => {
    if (isAtEnd && (autoPlay || isLooping)) {
      scrollToIndex(isLooping ? originalLength : 0);
    } else {
      scrollToIndex(Math.min(virtualIndex + 1, virtualChildren.length - 1));
    }
  }, [virtualIndex, virtualChildren.length, isAtEnd, autoPlay, isLooping, originalLength, scrollToIndex]);

  const prev = useCallback(() => {
    scrollToIndex(Math.max(virtualIndex - 1, 0));
  }, [virtualIndex, scrollToIndex]);

  // Initial Loop Positioning
  useEffect(() => {
    if (isLooping && scrollRef.current && !isInitialized) {
      const container = scrollRef.current;
      const startSlide = container.children[originalLength] as HTMLElement;
      if (startSlide) {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = startSlide.offsetLeft;
        container.style.scrollBehavior = 'smooth';
        setIsInitialized(true);
      }
    }
  }, [isLooping, isInitialized, originalLength]);

  // Autoplay effect
  useEffect(() => {
    if (!autoPlay || !isInitialized) return;
    if (isHovered || isDragging.current) return;
    
    const timer = setInterval(() => {
      next();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, next, isInitialized]);

  // Intersection Observer for `aria-hidden` multi-item support
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      setVisibleSlides(prev => {
        const nextSet = new Set(prev);
        entries.forEach(entry => {
          const index = Number(entry.target.getAttribute('data-original-index'));
          if (entry.isIntersecting) {
            nextSet.add(index);
          } else {
            nextSet.delete(index);
          }
        });
        return nextSet;
      });
    }, {
      root: scrollRef.current,
      threshold: 0.1
    });

    Array.from(scrollRef.current.children).forEach(child => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [virtualChildren.length]);

  // Attach scroll listener
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  // Mouse Drag Events
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollBehavior = 'auto';
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const stopDragging = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollRef.current.style.scrollSnapType = 'x mandatory';
    handleScroll();
  };

  return (
    <div 
      className={cn("relative w-full group font-sans nui-carousel", !isInitialized && isLooping ? "opacity-0" : "opacity-100 transition-opacity duration-300", className)} 
      role="region" 
      aria-roledescription="carousel"
      aria-label="Image Carousel"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        stopDragging();
      }}
      {...props}
    >


      {/* ARIA Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Slide ${activeIndex + 1} of ${originalLength}`}
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="nui-carousel-scroll flex overflow-x-auto snap-x snap-mandatory w-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] rounded-lg cursor-grab active:cursor-grabbing scrollbar-hide"
        style={{ gap, scrollBehavior: 'smooth' }}
        tabIndex={0}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
      >
        {virtualChildren.map((child, index) => {
          const originalIndex = index % originalLength;
          return (
            <div
              key={index}
              data-index={index}
              data-original-index={originalIndex}
              className={cn(
                "shrink-0 select-none",
                align === 'start' && "snap-start",
                align === 'center' && "snap-center",
                align === 'end' && "snap-end"
              )}
              style={{ width: itemWidth }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${originalIndex + 1} of ${originalLength}`}
              aria-hidden={!visibleSlides.has(originalIndex)}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full shadow-sm bg-glass backdrop-blur-md border border-subtle text-default hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] pointer-events-auto transition-all",
                isAtStart && !isLooping && "opacity-50 cursor-not-allowed"
              )}
              onClick={prev}
              disabled={isAtStart && !isLooping}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full shadow-sm bg-glass backdrop-blur-md border border-subtle text-default hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] pointer-events-auto transition-all",
                isAtEnd && !isLooping && "opacity-50 cursor-not-allowed"
              )}
              onClick={next}
              disabled={isAtEnd && !isLooping}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {children.map((_, originalIndex) => {
            const isActive = originalIndex === activeIndex;
            return (
              <button
                key={originalIndex}
                className={cn(
                  "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface bg-current",
                  isActive 
                    ? "w-4 text-default" 
                    : "w-2 text-muted opacity-40 hover:opacity-100 hover:text-default"
                )}
                onClick={() => {
                  if (isLooping) {
                    scrollToIndex(originalLength + originalIndex);
                  } else {
                    scrollToIndex(originalIndex);
                  }
                }}
                aria-label={`Go to slide ${originalIndex + 1}`}
                aria-current={isActive}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
