"use client";

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
 checked?: boolean; 
 defaultChecked?: boolean;
 indeterminate?: boolean;
 onChange?: (checked: boolean) => void;
 label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
 (
 {
 checked,
 defaultChecked,
 indeterminate = false,
 onChange,
 label,
 disabled = false,
 className,
 ...props
 },
 ref
 ) => {
 const internalRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 if (typeof ref === 'function') {
 ref(internalRef.current);
 } else if (ref) {
 (ref as React.MutableRefObject<HTMLInputElement | null>).current = internalRef.current;
 }
 }, [ref]);

 const isControlled = checked !== undefined;
 const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
 const currentChecked = isControlled ? checked : internalChecked;

 useEffect(() => {
 if (internalRef.current) {
 internalRef.current.indeterminate = indeterminate;
 }
 }, [indeterminate]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (disabled) return;
 const newVal = e.target.checked;
 if (!isControlled) setInternalChecked(newVal);
 onChange?.(newVal);
 };

 return (
 <label 
 className={cn(
 "inline-flex items-start gap-2 cursor-pointer select-none", 
 disabled && "cursor-not-allowed opacity-50", 
 className
 )}
 >
 <div className="relative flex items-center justify-center w-4 h-4 mt-[2px]">
 <input
 ref={internalRef}
 type="checkbox"
 className="peer appearance-none w-full h-full m-0 bg-white dark:bg-[#0a0a0b] border border-solid border-slate-300 dark:border-slate-700 rounded shadow-sm transition-all duration-200 cursor-inherit hover:border-slate-400 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500 checked:bg-blue-600 checked:border-blue-600 checked:text-white data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:opacity-50"
 disabled={disabled}
 checked={currentChecked}
 onChange={handleChange}
 aria-checked={indeterminate ? 'mixed' : currentChecked ? "true" : "false"}
 data-state={
 indeterminate ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked'
 }
 {...props}
 />
 
 <AnimatePresence>
 {(currentChecked || indeterminate) && (
 <motion.span 
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.5 }}
 transition={{ duration: 0.15 }}
 className="absolute inset-0 flex items-center justify-center pointer-events-none text-white" 
 aria-hidden="true"
 >
 {indeterminate ? (
 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
 <line x1="5" y1="12" x2="19" y2="12"></line>
 </svg>
 ) : (
 <motion.svg 
 width="10" 
 height="10" 
 viewBox="0 0 24 24" 
 fill="none" 
 stroke="currentColor" 
 strokeWidth="4" 
 strokeLinecap="round" 
 strokeLinejoin="round"
 >
 <motion.polyline 
 initial={{ pathLength: 0 }} 
 animate={{ pathLength: 1 }} 
 transition={{ duration: 0.2, delay: 0.05 }}
 points="20 6 9 17 4 12"
 />
 </motion.svg>
 )}
 </motion.span>
 )}
 </AnimatePresence>
 </div>

 {label && <span className="font-sans text-sm text-slate-900 dark:text-slate-100 leading-normal">{label}</span>}
 </label>
 );
 }
);

Checkbox.displayName = 'Checkbox';