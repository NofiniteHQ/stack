"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccordionItem {
 id: string;
 title: string;
 content: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
 /** Array of items for Smart Default mode */
 data?: AccordionItem[];
 /** ID of the item that should be open by default */
 defaultOpenId?: string;
 /** If true, allows multiple accordion panels to remain open simultaneously */
 multiple?: boolean;
 children?: React.ReactNode;
}

interface AccordionContextValue {
 openIds: string[];
 toggle: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
 const ctx = React.useContext(AccordionContext);
 if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
 return ctx;
}

const ItemContext = React.createContext<string | null>(null);
function ItemContextConsumer({ children }: { children: (value: string) => React.ReactNode }) {
 const value = React.useContext(ItemContext);
 if (value === null) throw new Error('Must be used within AccordionItem');
 return <>{children(value)}</>;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
 value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({
 value,
 className,
 children,
 ...props
}, ref) => {
 const { openIds } = useAccordion();
 const open = openIds.includes(value);

 return (
  <div 
   ref={ref}
   className={cn("group border-b border-default", className)}
   data-state={open ? 'open' : 'closed'}
   data-value={value}
   {...props}
  >
   {children}
  </div>
 );
});
AccordionItem.displayName = 'Accordion.Item';

const AccordionItemWithProvider = React.forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => (
 <ItemContext.Provider value={props.value}>
  <AccordionItem ref={ref} {...props} />
 </ItemContext.Provider>
));
AccordionItemWithProvider.displayName = 'Accordion.Item';

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(({
 data,
 defaultOpenId,
 multiple = false,
 className,
 children,
 ...props
}, ref) => {
 const [openIds, setOpenIds] = useState<string[]>(
  defaultOpenId ? [defaultOpenId] : []
 );

 const toggle = (id: string) => {
  setOpenIds((prev) => {
   const isOpen = prev.includes(id);
   if (multiple) {
    return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
   } else {
    return isOpen ? [] : [id];
   }
  });
 };

 return (
  <AccordionContext.Provider value={{ openIds, toggle }}>
   <div ref={ref} className={cn("w-full border-t border-default bg-surface text-default", className)} {...props}>
    {data ? data.map((item) => (
     <AccordionItemWithProvider key={item.id} value={item.id}>
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.content}</AccordionContent>
     </AccordionItemWithProvider>
    )) : children}
   </div>
  </AccordionContext.Provider>
 );
});
AccordionRoot.displayName = 'Accordion';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(({
 className,
 children,
 onClick,
 ...props
}, ref) => {
 const { toggle, openIds } = useAccordion();
 return (
  <ItemContextConsumer>
   {(value) => {
    const open = openIds.includes(value);
    return (
     <button
      ref={ref}
      type="button"
      className={cn("flex justify-between items-center w-full px-4 py-3 bg-transparent border-none cursor-pointer text-left text-default outline-none hover:text-primary transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}
      aria-expanded={open}
      aria-controls={`panel-${value}`}
      id={`accordion-${value}`}
      onClick={(e) => {
       toggle(value);
       onClick?.(e);
      }}
      {...props}
     >
      <span className="font-sans text-base font-medium">{children}</span>
      <svg 
       className="text-muted transition-transform duration-200 ease-in-out w-4 h-4 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" 
       width="20" height="20" viewBox="0 0 24 24" 
       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true"
      >
       <path d="m6 9 6 6 6-6"/>
      </svg>
     </button>
    );
   }}
  </ItemContextConsumer>
 );
});
AccordionTrigger.displayName = 'Accordion.Trigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(({
 className,
 children,
 ...props
}, ref) => {
 const { openIds } = useAccordion();
 return (
  <ItemContextConsumer>
   {(value) => {
    const open = openIds.includes(value);
    return (
     <AnimatePresence initial={false}>
      {open && (
       <motion.div
        ref={ref as any}
        id={`panel-${value}`}
        role="region"
        aria-labelledby={`accordion-${value}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
       >
        <div className={cn("text-muted font-sans text-base leading-relaxed px-4 pb-4", className)} {...props}>
         {children}
        </div>
       </motion.div>
      )}
     </AnimatePresence>
    );
   }}
  </ItemContextConsumer>
 );
});
AccordionContent.displayName = 'Accordion.Content';

export const Accordion = Object.assign(AccordionRoot, {
 Item: AccordionItemWithProvider,
 Trigger: AccordionTrigger,
 Content: AccordionContent,
});