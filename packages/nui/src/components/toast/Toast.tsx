"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils';
import { Portal } from '../../utils';
import './Toast.css';

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
    // We don't remove it from the array immediately. 
    // Flagging it triggers the ToastItem's CSS exit animation, which then calls remove() safely.
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t)));
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
            className="nui-toast-region"
            aria-live="polite"
            aria-atomic="true"
            role="region"
            aria-label="Notifications"
          >
            {toasts.map((toast) => (
              <ToastItem 
                key={toast.id} 
                toast={toast} 
                onDismiss={() => dismiss(toast.id)} 
                onRemove={() => remove(toast.id)} 
              />
            ))}
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
  toast: ToastData & { isClosing?: boolean };
  onDismiss: () => void;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duration defaults to 4000ms. Set to Infinity to disable auto-close.
  const duration = toast.duration !== undefined ? toast.duration : 4000;

  // 1. Handle Animation and Removal
  const triggerExit = useCallback(() => {
    setIsExiting(true);
    // Wait for the CSS exit animation to finish before destroying the DOM node (matches CSS 0.2s duration)
    setTimeout(() => {
      onRemove();
    }, 200); 
  }, [onRemove]);

  // If the provider tells us to close programmatically, trigger exit
  useEffect(() => {
    if (toast.isClosing) triggerExit();
  }, [toast.isClosing, triggerExit]);

  // 2. Timer Management (Pause on Hover)
  const startTimer = useCallback(() => {
    if (duration === Infinity || isExiting) return;
    timerRef.current = setTimeout(() => {
      triggerExit();
    }, duration);
  }, [duration, isExiting, triggerExit]);

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

  return (
    <div
      className={cn(
        'nui-toast',
        `nui-toast--${toast.variant || 'default'}`,
      )}
      data-state={isExiting ? 'closed' : 'open'}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      role={role}
    >
      <div className="nui-toast__content">
        <strong className="nui-toast__title">{toast.message}</strong>
        {toast.description && (
          <p className="nui-toast__description">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        aria-label="Close notification"
        className="nui-toast__close"
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
    </div>
  );
}