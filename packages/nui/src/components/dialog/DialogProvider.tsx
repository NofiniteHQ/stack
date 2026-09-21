// src/components/dialog/DialogProvider.tsx
'use client';

import { useSyncExternalStore, useEffect } from 'react';
import { cn } from '../../utils';
import { dialogStore, toastEmitter } from './dialogStore';
import { Modal } from '../modal/Modal';
import { Button } from '../button/Button';
import { useToast } from '../toast/Toast';

export const DialogProvider = () => {
  /* --- 1. DIALOG LOGIC --- */
  const state = useSyncExternalStore(
    dialogStore.subscribe,
    dialogStore.getState,
    dialogStore.getState
  );

  const handleClose = (result: boolean) => {
    if (state.resolve) state.resolve(result);
    dialogStore.setState({ isOpen: false, resolve: null });
  };

  const handleModalClose = () => {
    handleClose(state.type === 'alert' ? true : false);
  };

  /* --- 2. TOAST EVENT BRIDGE LOGIC --- */
  // We grab the show function from your existing untouched ToastProvider
  const { show } = useToast();

  useEffect(() => {
    // Whenever a developer calls nui.success() in vanilla JS, this catches it
    const unsubscribe = toastEmitter.subscribe((payload) => {
      // And passes it to your untouched React Toast system!
      show(payload.message, { variant: payload.variant, ...payload.options });
    });

    return unsubscribe;
  }, [show]);

  /* --- 3. RENDER --- */
  return (
    <Modal
      open={state.isOpen}
      onClose={handleModalClose}
      title={state.title}
      disableClickOutside={state.type === 'confirm'}
      hideCloseButton={true}
      className="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          {state.type === 'confirm' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClose(false)}
            >
              {state.cancelText || 'Cancel'}
            </Button>
          )}
          <Button
            variant={state.isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={() => handleClose(true)}
          >
            {state.confirmText || 'Confirm'}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5',
            state.isDanger
              ? 'bg-danger/10 text-danger border border-danger/20'
              : state.type === 'confirm'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-subtle text-default border border-default'
          )}
        >
          {state.isDanger ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </div>
        <div className="text-sm text-muted leading-relaxed flex-1 pt-0.5">
          {state.message}
        </div>
      </div>
    </Modal>
  );
};
