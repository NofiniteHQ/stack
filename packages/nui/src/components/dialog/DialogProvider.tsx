// src/components/dialog/DialogProvider.tsx
"use client";

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
 style={{ maxWidth: '400px' }} 
 >
 <div 
 className={cn("text-muted text-sm leading-relaxed mb-6")} 
 >
 {state.message}
 </div>

 <div 
 className={cn("flex justify-end gap-3")} 
 >
 {state.type === 'confirm' && (
 <Button variant="outline" onClick={() => handleClose(false)}>
 {state.cancelText}
 </Button>
 )}

 <Button
 variant={state.isDanger ? 'danger' : 'primary'}
 onClick={() => handleClose(true)}
 >
 {state.confirmText}
 </Button>
 </div>
 </Modal>
 );
};