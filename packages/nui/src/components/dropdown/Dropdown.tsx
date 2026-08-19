"use client";

import React, {
 createContext,
 useState,
 useContext,
 useRef,
 useEffect,
 forwardRef,
 useCallback,
 useId,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react-dom';
import { cn, onClickOutside, restoreFocus, Portal } from '../../utils';

/* ============================================================
 * Context Types
 * ============================================================ */

interface DropdownContextProps {
 open: boolean;
 setOpen: React.Dispatch<React.SetStateAction<boolean>>;
 triggerRef: React.RefObject<HTMLButtonElement | null>;
 id: string;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

function useDropdown() {
 const ctx = useContext(DropdownContext);
 if (!ctx) throw new Error('Dropdown components must be inside <Dropdown>');
 return ctx;
}

/* ============================================================
 * 1. Types & Data Mode
 * ============================================================ */

export type DropdownDataItem = {
  label?: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'item' | 'separator';
  disabled?: boolean;
};

export interface DropdownRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  data?: DropdownDataItem[];
  align?: 'start' | 'end';
}

/* ============================================================
 * 2. Dropdown Trigger
 * ============================================================ */

export interface DropdownTriggerProps {
 children: React.ReactNode; 
}

const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
 ({ children }, ref) => {
 const { open, setOpen, triggerRef, id } = useDropdown();

 if (React.isValidElement(children)) {
 const child = children as React.ReactElement<React.HTMLProps<HTMLElement>>;
 const childRef = child.props.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

 const triggerProps: React.HTMLProps<HTMLElement> = {
 'aria-haspopup': 'menu',
 'aria-expanded': open,
 'aria-controls': `${id}-menu`,
 id: `${id}-trigger`,
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

 return (
 <button
 type="button"
 id={`${id}-trigger`}
 aria-controls={`${id}-menu`}
 className="inline-flex items-center justify-center rounded-md border border-default bg-surface px-3 py-2 text-sm font-medium text-default transition-all duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] "
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
 align?: 'start' | 'end';
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
 ({ className, children, align = 'start', ...props }, ref) => {
 const { open, setOpen, triggerRef, id } = useDropdown();
 
 const { refs, x, y, placement } = useFloating<HTMLElement>({
 open,
 placement: align === 'end' ? 'bottom-end' : 'bottom-start',
 whileElementsMounted: autoUpdate,
 middleware: [
 offset(4),
 flip({ padding: 16, fallbackPlacements: ['top-start', 'top-end'] }),
 shift({ padding: 16 }),
 ],
 });

 useEffect(() => {
 if (triggerRef.current) {
 refs.setReference(triggerRef.current);
 }
 }, [triggerRef, refs]);

 const setRefs = useCallback(
 (node: HTMLDivElement) => {
 refs.setFloating(node);
 if (typeof ref === 'function') ref(node);
 else if (ref) ref.current = node;
 },
 [ref, refs]
 );

 useEffect(() => {
 if (!open) return;
 const cleanup = onClickOutside([{ current: refs.floating.current as HTMLElement | null }, triggerRef], () => {
 setOpen(false);
 });
 return cleanup;
 }, [open, setOpen, triggerRef, refs.floating]);

 useEffect(() => {
 if (!open) return;

 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 setOpen(false);
 return;
 }

 const menuEl = refs.floating.current as HTMLElement | null;
 if (!menuEl) return;
 
 const items = Array.from(
 menuEl.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
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
 
 const timeoutId = setTimeout(() => {
 const menuEl = refs.floating.current as HTMLElement | null;
 const firstItem = menuEl?.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement;
 if (firstItem) firstItem.focus();
 }, 10);

 return () => {
 document.removeEventListener('keydown', handleKeyDown);
 clearTimeout(timeoutId);
 };
 }, [open, setOpen, refs.floating]);

 return (
 <AnimatePresence>
 {open && (
 <Portal>
 <motion.div
 ref={setRefs}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className={cn(
 "absolute z-50 min-w-[180px] overflow-hidden rounded-lg border border-glassBorder bg-surface backdrop-blur-md p-1 font-sans shadow-2xl outline-none", 
 className
 )}
 id={`${id}-menu`}
 aria-labelledby={`${id}-trigger`}
 role="menu"
 style={{
 top: y ?? 0,
 left: x ?? 0,
 transformOrigin: placement.startsWith('top') ? 'bottom left' : 'top left'
 }}
 {...props}
 >
 {children}
 </motion.div>
 </Portal>
 )}
 </AnimatePresence>
 );
 }
);
DropdownMenu.displayName = 'Dropdown.Menu';

/* ============================================================
 * 4. Dropdown Item
 * ============================================================ */

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode;
 onSelect?: () => void;
}

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
 className={cn("flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-default outline-none transition-colors duration-200 hover:bg-subtle focus-visible:bg-subtle", className)}
 role="menuitem"
 tabIndex={-1} 
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
 * 5. Dropdown Root (Smart / Primitive)
 * ============================================================ */

const DropdownRoot = forwardRef<HTMLDivElement, DropdownRootProps>(
  ({ children, className, data, align = 'start', ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const id = useId();

    useEffect(() => {
      if (!open && triggerRef.current) {
        restoreFocus(triggerRef.current);
      }
    }, [open]);

    return (
      <DropdownContext.Provider value={{ open, setOpen, triggerRef, id }}>
        <div ref={ref} className={cn("relative inline-block font-sans", className)} {...props}>
          {data ? (
            <>
              <DropdownTrigger>{children}</DropdownTrigger>
              <DropdownMenu align={align}>
                {data.map((item, index) => {
                  if (item.type === 'separator') {
                    return (
                      <div 
                        key={`separator-${index}`} 
                        className="border-b border-default my-1" 
                        role="separator" 
                      />
                    );
                  }

                  return (
                    <DropdownItem
                      key={`item-${index}`}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                          return;
                        }
                        item.onClick?.(e);
                      }}
                      aria-disabled={item.disabled}
                      className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {item.label}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </>
          ) : (
            children
          )}
        </div>
      </DropdownContext.Provider>
    );
  }
);
DropdownRoot.displayName = 'Dropdown';

/* ============================================================
 * Export
 * ============================================================ */

export const Dropdown = Object.assign(DropdownRoot, {
 Trigger: DropdownTrigger,
 Menu: DropdownMenu,
 Item: DropdownItem,
});