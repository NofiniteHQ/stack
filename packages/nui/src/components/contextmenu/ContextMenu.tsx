"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cn, Portal, onClickOutside } from '../../utils';
import './ContextMenu.css';

/* ============================================================
 * Types
 * ============================================================ */

export interface ContextMenuItem {
  label?: string;
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  type?: 'item' | 'separator';
}

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  className?: string;
  /** * If true, the ContextMenu will not wrap children in a <div>.
   * Instead, it clones the child and directly attaches the onContextMenu event.
   * Child MUST be a valid single React Element. 
   */
  asChild?: boolean; 
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * ContextMenu Component
 * * A custom right-click menu that replaces the browser's native context menu.
 */
export function ContextMenu({
  children,
  items,
  className,
  asChild = false,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ----------------------------------------------------
     Opening & Collision Detection
  ---------------------------------------------------- */
  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 1. Set initial position to exact mouse coordinates
    setPos({ top: e.clientY, left: e.clientX });
    setOpen(true);
    setActiveIndex(getFirstEnabledIndex());
  };

  // * Architecture Note: We use useLayoutEffect instead of useEffect here.
  // This runs synchronously immediately after React updates the DOM but BEFORE the browser
  // paints it to the screen. This ensures the collision-detection coordinate shift 
  // happens instantly without a visual "jump".
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;

    // 2. Adjust position if it collides with viewport edges
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { top, left } = pos;
    const padding = 8; // Keep it slightly away from the exact edge

    // Collision Right
    if (left + menuRect.width > viewportWidth - padding) {
      left = left - menuRect.width;
    }
    // Collision Bottom
    if (top + menuRect.height > viewportHeight - padding) {
      top = top - menuRect.height;
    }

    // Apply adjustments directly to the DOM to avoid triggering another React render cycle
    menuRef.current.style.top = `${top}px`;
    menuRef.current.style.left = `${left}px`;
    
    // 3. Force focus onto the menu so keyboard events (ArrowDown, etc) work immediately
    menuRef.current.focus();

  }, [open, pos]);

  /* ----------------------------------------------------
     Keyboard Navigation Helpers
  ---------------------------------------------------- */
  const getFirstEnabledIndex = () => {
    return items.findIndex((i) => i.type !== 'separator' && !i.disabled);
  };

  const getLastEnabledIndex = () => {
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.type !== 'separator' && !it.disabled) return i;
    }
    return 0;
  };

  const move = (direction: 1 | -1) => {
    let idx = activeIndex;
    const len = items.length;

    if (len === 0) return;

    // Loop until we find a valid item, preventing infinite loops
    for (let i = 0; i < len; i++) {
      idx = (idx + direction + len) % len;
      const it = items[idx];
      if (it.type !== 'separator' && !it.disabled) {
        setActiveIndex(idx);
        break;
      }
    }
  };

  /* ----------------------------------------------------
     Event Listeners
  ---------------------------------------------------- */
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (key === 'Home') {
      e.preventDefault();
      setActiveIndex(getFirstEnabledIndex());
    } else if (key === 'End') {
      e.preventDefault();
      setActiveIndex(getLastEnabledIndex());
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      const it = items[activeIndex];
      if (it && !it.disabled && it.onSelect) {
        it.onSelect();
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return onClickOutside(menuRef, () => setOpen(false));
  }, [open]);

  // Hide context menu on scroll or window resize
  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = () => setOpen(false);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open]);

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */
  
  const renderTrigger = () => {
    // * Polymorphic Architecture:
    // When asChild is true, we clone the user's React element and attach the onContextMenu 
    // event directly to it. This avoids creating unnecessary <div> wrappers in the DOM.
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        onContextMenu: (e: React.MouseEvent<Element>) => {
          handleContext(e);
          
          const childProps = children.props as React.DOMAttributes<Element>;
          if (childProps.onContextMenu) {
            childProps.onContextMenu(e);
          }
        }
      } as React.DOMAttributes<Element>);
    }

    return (
      <div onContextMenu={handleContext} className="nui-contextmenu-wrapper">
        {children}
      </div>
    );
  };

  return (
    <>
      {renderTrigger()}

      {open && (
        <Portal>
          <div
            ref={menuRef}
            className={cn("nui-contextmenu", className)}
            role="menu"
            tabIndex={-1} 
            style={{ position: 'fixed', top: pos.top, left: pos.left }}
            onKeyDown={handleKeyDown}
          >
            {items.map((item, idx) => {
              if (item.type === 'separator') {
                return <div key={`sep-${idx}`} className="nui-contextmenu-separator" role="separator" />;
              }

              const isActive = idx === activeIndex;

              return (
                <div
                  key={`item-${idx}`}
                  className={cn(
                    "nui-contextmenu-item",
                    item.disabled && "disabled",
                    item.danger && "danger",
                    isActive && "active"
                  )}
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  onMouseEnter={() => !item.disabled && setActiveIndex(idx)}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onSelect?.();
                      setOpen(false);
                    }
                  }}
                >
                  {item.icon && (
                    <span className="nui-contextmenu-icon">{item.icon}</span>
                  )}
                  <span className="nui-contextmenu-label">{item.label}</span>
                  
                  {!item.icon && <span className="nui-contextmenu-icon-placeholder" />}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}