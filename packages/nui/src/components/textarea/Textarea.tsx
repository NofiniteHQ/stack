"use client";

import React, {
 useRef,
 useEffect,
 useCallback,
 useState,
 forwardRef,
} from 'react';
import { cn } from '../../utils';

export interface TextareaProps
 extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
 showCount?: boolean;
 autoGrow?: boolean;
 error?: boolean;
 helperId?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
 (
 {
 value,
 defaultValue,
 onChange,
 className,
 maxLength,
 showCount = false,
 autoGrow = true,
 disabled = false,
 readOnly = false,
 required = false,
 error = false,
 id,
 name,
 placeholder,
 helperId,
 rows = 3,
 ...rest
 },
 ref 
 ) => {
 const innerRef = useRef<HTMLTextAreaElement | null>(null);
 const isControlled = value !== undefined;
 
 const [internalValue, setInternalValue] = useState<string>(
 () => (defaultValue as string) || ''
 );
 const currentValue = isControlled ? value : internalValue;
 
 const safeValue = String(currentValue ?? '');

 const setRefs = useCallback(
 (node: HTMLTextAreaElement | null) => {
 innerRef.current = node;
 if (typeof ref === 'function') {
 ref(node);
 } else if (ref) {
 (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
 }
 },
 [ref]
 );

 const resize = useCallback(() => {
 if (!autoGrow || !innerRef.current) return;
 
 const el = innerRef.current;
 const scrollY = window.scrollY;
 
 el.style.height = 'auto';
 el.style.height = `${el.scrollHeight + 2}px`;
 
 window.scrollTo(0, scrollY);
 }, [autoGrow]);

 useEffect(() => {
 resize();
 window.addEventListener('resize', resize);
 return () => window.removeEventListener('resize', resize);
 }, [resize]);

 useEffect(() => {
 resize();
 }, [safeValue, resize]);

 const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
 if (!isControlled) setInternalValue(e.target.value);
 onChange?.(e);
 if (autoGrow) resize();
 };

 const countId = id ? `${id}-count` : undefined;
 const describedBy = [helperId, (showCount || maxLength) ? countId : undefined].filter(Boolean).join(' ') || undefined;

 return (
 <div className={cn("flex flex-col w-full font-sans", className)}>
 <textarea
 ref={setRefs}
 id={id}
 name={name}
 value={currentValue}
 defaultValue={!isControlled ? undefined : defaultValue}
 onChange={handleChange}
 maxLength={maxLength}
 disabled={disabled}
 readOnly={readOnly}
 required={required}
 aria-invalid={error ? "true" : "false"}
 aria-required={required ? "true" : "false"}
 aria-disabled={disabled ? "true" : "false"}
 aria-readonly={readOnly ? "true" : "false"}
 aria-describedby={describedBy}
 placeholder={placeholder}
 rows={rows}
 className={cn(
 "w-full box-border px-3 py-2 bg-surface text-default font-inherit text-sm leading-relaxed border border-default rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus placeholder:text-subtle hover:bg-subtle disabled:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:resize-none read-only:bg-subtle read-only:cursor-default",
 autoGrow ? "resize-none overflow-hidden" : "resize-y min-h-[2.25rem]",
 error && "border-error focus-visible:ring-error",
 )}
 {...rest}
 />

 {(showCount || maxLength) && (
 <div 
 id={countId} 
 className="mt-1 text-xs font-medium text-muted text-right select-none" 
 aria-live="polite"
 >
 {safeValue.length}
 {maxLength ? ` / ${maxLength}` : ''}
 </div>
 )}
 </div>
 );
 }
);

Textarea.displayName = 'Textarea';