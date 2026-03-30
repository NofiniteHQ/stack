"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';
import { cn, onClickOutside, restoreFocus } from '../../utils';
import './Dropdown.css';

/* ============================================================
 * Context Types
 * ============================================================ */

interface DropdownContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown components must be inside <Dropdown>');
  return ctx;
}

/* ============================================================
 * 1. Dropdown Root
 * ============================================================ */

export interface DropdownRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Dropdown Component (Root)
 * * Implements a Compound Component Architecture.
 * * Provides state and ref context to Trigger, Menu, and Items.
 */
const DropdownRoot = forwardRef<HTMLDivElement, DropdownRootProps>(
  ({ children, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Restore focus to trigger when closing for WAI-ARIA compliance
    useEffect(() => {
      if (!open && triggerRef.current) {
        restoreFocus(triggerRef.current);
      }
    }, [open]);

    return (
      <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
        <div ref={ref} className={cn("nui-dropdown", className)} {...props}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);
DropdownRoot.displayName = 'Dropdown';

/* ============================================================
 * 2. Dropdown Trigger
 * ============================================================ */

export interface DropdownTriggerProps {
  children: React.ReactNode; 
}

/**
 * Dropdown Trigger
 * * Handles click events to toggle the menu.
 * * Automatically merges refs and props if a valid React Element (like <Button>) is passed.
 */
const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  ({ children }, ref) => {
    const { open, setOpen, triggerRef } = useDropdown();

    // SCENARIO A: The user passed a single React Element (e.g., <Button>)
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<React.HTMLProps<HTMLElement>>;
      const childRef = child.props.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

      // We explicitly type the props for the cloned element here
      const triggerProps: React.HTMLProps<HTMLElement> = {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          setOpen((prev) => !prev);
          child.props.onClick?.(e);
        },
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node as HTMLButtonElement;
          
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as { current: HTMLElement | null }).current = node;

          if (typeof childRef === 'function') childRef(node);
          else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
            (childRef as { current: HTMLElement | null }).current = node;
          }
        }
      };

      return React.cloneElement(child, triggerProps);
    }

    // SCENARIO B: The user passed plain text, numbers, or multiple elements
    // We apply standard HTML attributes directly without spreading
    return (
      <button
        type="button"
        className="nui-dropdown__trigger"
        ref={(node) => {
          triggerRef.current = node;
          
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        {children}
      </button>
    );
  }
);
DropdownTrigger.displayName = 'Dropdown.Trigger';

/* ============================================================
 * 3. Dropdown Menu
 * ============================================================ */

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Aligns the popover menu relative to the trigger. Defaults to 'start' */
  align?: 'start' | 'end';
}

/**
 * Dropdown Menu
 * * The popover container.
 * * Handles Click Outside detection and Arrow Key Navigation.
 */
const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, align = 'start', ...props }, ref) => {
    const { open, setOpen, triggerRef } = useDropdown();
    const menuRef = useRef<HTMLDivElement>(null);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLDivElement) => {
        menuRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // Click outside handler
    useEffect(() => {
      if (!open) return;
      // Pass both refs in an array so clicking the trigger doesn't immediately close it via the outside listener
      const cleanup = onClickOutside([menuRef, triggerRef], () => {
        setOpen(false);
      });
      return cleanup;
    }, [open, setOpen, triggerRef]);

    // Keyboard Navigation (ESC, ArrowUp, ArrowDown)
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          return;
        }

        if (!menuRef.current) return;
        
        // Find all focusable items inside the menu
        const items = Array.from(
          menuRef.current.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
        ) as HTMLElement[];
        
        if (!items.length) return;

        const currentIndex = items.indexOf(document.activeElement as HTMLElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[nextIndex]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prevIndex]?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      // Auto-focus first item on open
      const firstItem = menuRef.current?.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement;
      if (firstItem) firstItem.focus();

      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={setRefs}
        className={cn(
          "nui-dropdown__menu", 
          align === 'end' && "nui-dropdown__menu--end", 
          className
        )}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenu.displayName = 'Dropdown.Menu';

/* ============================================================
 * 4. Dropdown Item
 * ============================================================ */

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Callback fired when the item is selected via click or keyboard */
  onSelect?: () => void;
}

/**
 * Dropdown Item
 * * Handles selection and automatically closes the parent menu.
 */
const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ children, onSelect, className, onClick, ...props }, ref) => {
    const { setOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onSelect?.();
      onClick?.(e);
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("nui-dropdown__item", className)}
        role="menuitem"
        tabIndex={-1} // -1 allows programmatic focus via arrow keys
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownItem.displayName = 'Dropdown.Item';

/* ============================================================
 * Export
 * ============================================================ */

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
});