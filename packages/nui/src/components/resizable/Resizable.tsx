"use client";

import React, { createContext, useContext, useRef, useCallback, useLayoutEffect, forwardRef } from 'react';
import { cn } from '../../utils';
import './Resizable.css';

/* ============================================================
 * Context
 * ============================================================ */

interface ResizableContextValue {
  direction: 'horizontal' | 'vertical';
  startDrag: (handleElement: HTMLElement, e: React.PointerEvent) => void;
  keyboardResize: (handleElement: HTMLElement, e: React.KeyboardEvent) => void;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizable() {
  const ctx = useContext(ResizableContext);
  if (!ctx) throw new Error('Resizable components must be used within <Resizable>');
  return ctx;
}

/* ============================================================
 * 1. Resizable Group (Root)
 * ============================================================ */

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The flex layout direction. Defaults to 'horizontal'. */
  direction?: 'horizontal' | 'vertical';
  /** Callback fired when the user completes a resize action, providing an array of panel sizes (percentages) */
  onLayout?: (sizes: number[]) => void;
}

/**
 * Resizable Component (Root)
 * * A Compound Component wrapper that manages the complex math and event delegation 
 * required to dynamically resize panels via pointer or keyboard.
 */
const ResizableRoot = forwardRef<HTMLDivElement, ResizableProps>(({
  direction = 'horizontal',
  onLayout,
  className,
  children,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We store current sizes in a ref rather than state to avoid constant React re-renders during dragging (60fps performance!)
  const currentSizes = useRef<number[]>([]);

  /* ----------------------------------------------------
     Core Math Engine
  ---------------------------------------------------- */
  const resizePanels = useCallback((handleIndex: number, deltaPct: number) => {
    const container = containerRef.current;
    if (!container) return false;

    const panels = Array.from(container.querySelectorAll('[data-resizable-panel]')) as HTMLElement[];
    const handles = Array.from(container.querySelectorAll('[data-resizable-handle]')) as HTMLElement[];

    const panelA = panels[handleIndex];
    const panelB = panels[handleIndex + 1];
    if (!panelA || !panelB) return false;

    const startSizes = currentSizes.current;
    
    // Read constraints from DOM attributes
    const minA = parseFloat(panelA.dataset.minSize || '0');
    const maxA = parseFloat(panelA.dataset.maxSize || '100');
    const minB = parseFloat(panelB.dataset.minSize || '0');
    const maxB = parseFloat(panelB.dataset.maxSize || '100');

    // Calculate maximum allowable movement based on panel constraints
    const maxDeltaRight = Math.min(maxA - startSizes[handleIndex], startSizes[handleIndex + 1] - minB);
    const maxDeltaLeft = Math.max(minA - startSizes[handleIndex], startSizes[handleIndex + 1] - maxB);

    // Clamp the requested delta to the allowed range
    const allowedDelta = Math.max(maxDeltaLeft, Math.min(maxDeltaRight, deltaPct));

    if (allowedDelta !== 0) {
      startSizes[handleIndex] += allowedDelta;
      startSizes[handleIndex + 1] -= allowedDelta;

      // Apply sizes directly to DOM for performance
      panelA.style.flexGrow = startSizes[handleIndex].toString();
      panelB.style.flexGrow = startSizes[handleIndex + 1].toString();
      
      // Update WAI-ARIA states
      handles[handleIndex]?.setAttribute('aria-valuenow', startSizes[handleIndex].toFixed(0));
      return true;
    }
    return false;
  }, []);

  /* ----------------------------------------------------
     Pointer Event Listeners
  ---------------------------------------------------- */
  const startDrag = useCallback((handleElement: HTMLElement, e: React.PointerEvent) => {
    e.preventDefault();
    
    // Because preventDefault() stops the browser from naturally focusing the element,
    // we MUST manually force focus so the user's arrow keys start working immediately!
    handleElement.focus(); 
    
    const container = containerRef.current;
    if (!container) return;

    const handles = Array.from(container.querySelectorAll('[data-resizable-handle]')) as HTMLElement[];
    const handleIndex = handles.indexOf(handleElement);
    if (handleIndex === -1) return;

    const isHorizontal = direction === 'horizontal';
    const availablePx = isHorizontal ? container.clientWidth : container.clientHeight;
    
    // We must subtract the size of the handles themselves so the math calculates percentage of *free* space
    const totalHandlePx = handles.reduce((acc, h) => acc + (isHorizontal ? h.offsetWidth : h.offsetHeight), 0);
    const flexAvailable = availablePx - totalHandlePx;

    let lastPos = isHorizontal ? e.clientX : e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const deltaPx = currentPos - lastPos;
      
      // Convert physical pixel delta to a percentage of the flex container
      const deltaPct = (deltaPx / flexAvailable) * 100;

      resizePanels(handleIndex, deltaPct);
      lastPos = currentPos;
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      
      // Restore default cursor interactions
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      handleElement.removeAttribute('data-dragging');
      
      if (onLayout) onLayout([...currentSizes.current]);
    };

    // Attach listeners to document so drag continues even if mouse leaves the handle hitbox
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    handleElement.setAttribute('data-dragging', 'true');
  }, [direction, onLayout, resizePanels]);

  /* ----------------------------------------------------
     Keyboard Navigation Engine (WAI-ARIA)
  ---------------------------------------------------- */
  const keyboardResize = useCallback((handleElement: HTMLElement, e: React.KeyboardEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    const handles = Array.from(container.querySelectorAll('[data-resizable-handle]')) as HTMLElement[];
    const handleIndex = handles.indexOf(handleElement);
    if (handleIndex === -1) return;

    let deltaPct = 0;
    const step = e.shiftKey ? 10 : 2; // Modern UX: Shift + Arrow jumps by 10%

    // 1. Directional locking
    if (direction === 'horizontal') {
      if (e.key === 'ArrowRight') deltaPct = step;
      if (e.key === 'ArrowLeft') deltaPct = -step;
    } else {
      if (e.key === 'ArrowDown') deltaPct = step;
      if (e.key === 'ArrowUp') deltaPct = -step;
    }

    // 2. Absolute limits (Home/End)
    if (e.key === 'Home') deltaPct = -100; // Will be mathematically clamped by resizePanels
    if (e.key === 'End') deltaPct = 100;

    if (deltaPct !== 0) {
      resizePanels(handleIndex, deltaPct);
      if (onLayout) onLayout([...currentSizes.current]);
    }
  }, [direction, onLayout, resizePanels]);

  /* ----------------------------------------------------
     Initialization
  ---------------------------------------------------- */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = Array.from(container.querySelectorAll('[data-resizable-panel]')) as HTMLElement[];
    const handles = Array.from(container.querySelectorAll('[data-resizable-handle]')) as HTMLElement[];

    // Only initialize if we haven't already (or if the number of panels changes)
    if (currentSizes.current.length !== panels.length) {
      const initial = panels.map(p => parseFloat(p.dataset.defaultSize || '0'));
      const total = initial.reduce((a, b) => a + b, 0);
      const unassignedCount = initial.filter(s => s === 0).length;

      // Distribute remaining space evenly among panels without a defaultSize
      if (unassignedCount > 0) {
        const share = Math.max(0, 100 - total) / unassignedCount;
        for (let i = 0; i < initial.length; i++) {
          if (initial[i] === 0) initial[i] = share;
        }
      }
      currentSizes.current = initial;
    }

    // Apply initialized sizes
    panels.forEach((p, i) => {
      p.style.flexGrow = currentSizes.current[i].toString();
      p.style.flexBasis = '0px'; 
    });

    handles.forEach((h, i) => {
      h.setAttribute('aria-valuenow', currentSizes.current[i].toFixed(0));
    });
  }, [children]);

  return (
    <ResizableContext.Provider value={{ direction, startDrag, keyboardResize }}>
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        data-direction={direction}
        className={cn("nui-resizable-group", className)}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
});
ResizableRoot.displayName = 'Resizable';

/* ============================================================
 * 2. Resizable Panel
 * ============================================================ */

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The initial size of the panel as a percentage of the available space (0-100) */
  defaultSize?: number; 
  /** The absolute minimum size the panel can shrink to */
  minSize?: number;     
  /** The absolute maximum size the panel can grow to */
  maxSize?: number;     
}

const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(({
  defaultSize,
  minSize = 0,
  maxSize = 100,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      data-resizable-panel
      data-default-size={defaultSize}
      data-min-size={minSize}
      data-max-size={maxSize}
      className={cn("nui-resizable-panel", className)}
      {...props}
    >
      {children}
    </div>
  );
});
ResizablePanel.displayName = 'Resizable.Panel';

/* ============================================================
 * 3. Resizable Handle
 * ============================================================ */

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Renders a visual grip icon in the center of the handle */
  withIcon?: boolean; 
}

const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(({
  withIcon = false,
  className,
  ...props
}, ref) => {
  const ctx = useResizable();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Intercept standard split-view control keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      ctx.keyboardResize(e.currentTarget, e); // Pass the full event for e.shiftKey
    }
  };

  return (
    <div
      ref={ref}
      data-resizable-handle
      role="separator"
      aria-orientation={ctx.direction}
      tabIndex={0}
      onPointerDown={(e) => ctx.startDrag(e.currentTarget, e)}
      onKeyDown={handleKeyDown}
      className={cn("nui-resizable-handle", className)}
      {...props}
    >
      {withIcon && (
        <div className="nui-resizable-handle-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor">
            {ctx.direction === 'horizontal' ? (
              <path d="M5.5 4.5V10.5M9.5 4.5V10.5" strokeLinecap="round" />
            ) : (
              <path d="M4.5 5.5H10.5M4.5 9.5H10.5" strokeLinecap="round" />
            )}
          </svg>
        </div>
      )}
    </div>
  );
});
ResizableHandle.displayName = 'Resizable.Handle';

/* ============================================================
 * Export
 * ============================================================ */

export const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});