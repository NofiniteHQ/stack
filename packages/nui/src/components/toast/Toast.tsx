"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils';
import { Portal } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================
 * Types
 * ============================================================ */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface ToastOptions {
 /** Time in milliseconds before the toast auto-dismisses. Set to Infinity to disable. Defaults to 4000. */
 duration?: number;
 /** The semantic visual variant of the toast. Defaults to 'default'. */
 variant?: ToastVariant;
 /** Secondary descriptive text displayed below the main message. */
 description?: React.ReactNode;
}

export interface ToastData extends ToastOptions {
 id: string;
 message: React.ReactNode;
}

interface ToastContextValue {
 /** Displays a new toast notification and returns its unique ID */
 show: (message: React.ReactNode, options?: ToastOptions) => string;
 /** Programmatically triggers the exit animation and removes the toast by ID */
 dismiss: (id: string) => void;
}

/* ============================================================
 * Context
 * ============================================================ */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
 const ctx = useContext(ToastContext);
 if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>');
 return ctx;
}

/* ============================================================
 * 1. Provider & Container
 * ============================================================ */

/**
 * Toast Provider
 * * Wraps your application to provide the `useToast` hook.
 * * Automatically manages the WAI-ARIA live region Portal for rendering notifications.
 * * Note: Does not use `forwardRef` as it strictly returns a Context Provider and a Portal.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
 const [toasts, setToasts] = useState<ToastData[]>([]);
 const [isMounted, setIsMounted] = useState(false);

 // Prevent SSR Hydration mismatch for the Portal by only mounting the region on the client
 useEffect(() => {
 setIsMounted(true);
 }, []);

 const show = useCallback((message: React.ReactNode, options?: ToastOptions) => {
 // Generate a secure, unique ID without relying on math.random() alone
 const id = typeof crypto !== 'undefined' && crypto.randomUUID 
 ? crypto.randomUUID() 
 : `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

 setToasts((prev) => [...prev, { id, message, ...options }]);
 return id;
 }, []);

 const dismiss = useCallback((id: string) => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 }, []);

 const remove = useCallback((id: string) => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 }, []);

 return (
 <ToastContext.Provider value={{ show, dismiss }}>
 {children}

 {isMounted && (
 <Portal>
 <div
 className="fixed bottom-5 right-5 flex flex-col items-end gap-3 z-[9999] pointer-events-none"
 aria-live="polite"
 aria-atomic="true"
 role="region"
 aria-label="Notifications"
 >
 <AnimatePresence>
 {toasts.map((toast) => (
 <ToastItem 
 key={toast.id} 
 toast={toast} 
 onDismiss={() => dismiss(toast.id)} 
 onRemove={() => remove(toast.id)} 
 />
 ))}
 </AnimatePresence>
 </div>
 </Portal>
 )}
 </ToastContext.Provider>
 );
}

/* ============================================================
 * 2. Individual Toast Item (Smart Component)
 * ============================================================ */

interface ToastItemProps {
 toast: ToastData;
 onDismiss: () => void;
 onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
 const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Duration defaults to 4000ms. Set to Infinity to disable auto-close.
 const duration = toast.duration !== undefined ? toast.duration : 4000;

 // 1. Handle Animation and Removal
 const triggerExit = useCallback(() => {
 onRemove();
 }, [onRemove]);

 // 2. Timer Management (Pause on Hover)
 const startTimer = useCallback(() => {
 if (duration === Infinity) return;
 timerRef.current = setTimeout(() => {
 triggerExit();
 }, duration);
 }, [duration, triggerExit]);

 const clearTimer = useCallback(() => {
 if (timerRef.current) clearTimeout(timerRef.current);
 }, []);

 // Start timer on mount
 useEffect(() => {
 startTimer();
 return clearTimer;
 }, [startTimer, clearTimer]);

 // 3. Render
 // Critical WAI-ARIA logic: Errors must use role="alert" to interrupt screen readers immediately.
 const role = toast.variant === 'error' ? 'alert' : 'status';

 const variantClasses = {
  default: 'bg-glass border-default text-default',
  success: 'bg-glass border-success text-success',
  error: 'bg-glass border-danger text-danger',
  warning: 'bg-glass border-warning text-warning',
 };

 return (
 <motion.div
 layout
 initial={{ opacity: 0, x: 50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.2 }}
 className={cn(
 'pointer-events-auto flex items-start justify-between w-full min-w-[300px] max-w-[380px] p-4 rounded-md backdrop-blur-md font-sans border-l-4 border-t border-b border-r shadow-lg',
 variantClasses[toast.variant || 'default']
 )}
 onMouseEnter={clearTimer}
 onMouseLeave={startTimer}
 role={role}
 >
 <div className="flex flex-col gap-1 pr-4">
 <strong className="text-sm font-bold leading-[1.4] m-0">{toast.message}</strong>
 {toast.description && (
 <p className="text-sm text-muted m-0 leading-[1.4]">{toast.description}</p>
 )}
 </div>

 <button
 type="button"
 aria-label="Close notification"
 className="shrink-0 flex items-center justify-center w-6 h-6 rounded-sm text-muted transition-all duration-200 bg-transparent border-none cursor-pointer p-0 hover:bg-muted hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
 onClick={(e) => {
 e.preventDefault();
 clearTimer();
 triggerExit();
 }}
 >
 {/* Simple crisp SVG close icon */}
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <line x1="18" y1="6" x2="6" y2="18"></line>
 <line x1="6" y1="6" x2="18" y2="18"></line>
 </svg>
 </button>
 </motion.div>
 );
}