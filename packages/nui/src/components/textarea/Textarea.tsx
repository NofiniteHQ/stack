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

 const hasCounter = showCount || maxLength;

 return (
 <div className={cn("relative flex flex-col w-full font-sans", className)}>
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
 "w-full box-border px-3 py-2 bg-surface text-default font-inherit text-sm leading-relaxed border border-solid border-default rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] focus-visible:border-focus placeholder:text-subtle hover:border-strong disabled:bg-subtle disabled:text-muted disabled:cursor-not-allowed disabled:resize-none read-only:bg-subtle read-only:cursor-default",
 autoGrow ? "resize-none overflow-hidden" : "resize-y min-h-[2.5rem]",
 hasCounter && "pb-7",
 error && "border-danger hover:border-danger focus-visible:ring-danger focus-visible:border-danger",
 )}
 {...rest}
 />

 {hasCounter && (
 <div 
 id={countId} 
 className="absolute bottom-2 right-2 text-[11px] font-medium text-muted bg-surface/90 backdrop-blur-sm px-1 pointer-events-none select-none rounded" 
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