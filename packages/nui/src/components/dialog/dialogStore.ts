// src/components/dialog/dialogStore.ts
import React from 'react';

/* -------------------------------------------------------------------------- */
/* DIALOG LOGIC (Untouched) */
/* -------------------------------------------------------------------------- */
export type DialogType = 'alert' | 'confirm';

export interface DialogOptions {
 title?: string;
 message: React.ReactNode;
 confirmText?: string;
 cancelText?: string;
 isDanger?: boolean;
}

export interface DialogState extends DialogOptions {
 isOpen: boolean;
 type: DialogType;
 resolve: ((value: boolean) => void) | null;
}

let dialogListeners: Array<() => void> = [];
let dialogState: DialogState = {
 isOpen: false,
 type: 'alert',
 message: '',
 resolve: null,
};

export const dialogStore = {
 getState: () => dialogState,
 subscribe: (listener: () => void) => {
 dialogListeners.push(listener);
 return () => {
 dialogListeners = dialogListeners.filter((l) => l !== listener);
 };
 },
 setState: (newState: Partial<DialogState>) => {
 dialogState = { ...dialogState, ...newState };
 dialogListeners.forEach((listener) => listener());
 },
};

/* -------------------------------------------------------------------------- */
/* TOAST EVENT BRIDGE */
/* -------------------------------------------------------------------------- */

// 1. Define the strictly typed options we expect from the user
export interface ExternalToastOptions {
 duration?: number;
 description?: React.ReactNode;
}

// 2. Use the strict interface in the payload instead of 'any'
type ToastEventPayload = {
 variant: 'default' | 'success' | 'error' | 'warning';
 message: React.ReactNode;
 options?: ExternalToastOptions;
};

let toastListeners: Array<(payload: ToastEventPayload) => void> = [];

export const toastEmitter = {
 subscribe: (listener: (payload: ToastEventPayload) => void) => {
 toastListeners.push(listener);
 return () => {
 toastListeners = toastListeners.filter((l) => l !== listener);
 };
 },
 emit: (payload: ToastEventPayload) => {
 toastListeners.forEach((listener) => listener(payload));
 },
};

/* -------------------------------------------------------------------------- */
/* UNIFIED NUI API */
/* -------------------------------------------------------------------------- */
export const nui = {
 // Dialogs
 confirm: (
 message: React.ReactNode,
 options?: Omit<DialogOptions, 'message'>
 ): Promise<boolean> => {
 return new Promise((resolve) => {
 dialogStore.setState({
 isOpen: true,
 type: 'confirm',
 message,
 title: options?.title || 'Confirm',
 confirmText: options?.confirmText || 'Confirm',
 cancelText: options?.cancelText || 'Cancel',
 isDanger: options?.isDanger || false,
 resolve,
 });
 });
 },

 alert: (
 message: React.ReactNode,
 options?: Omit<DialogOptions, 'message'>
 ): Promise<boolean> => {
 return new Promise((resolve) => {
 dialogStore.setState({
 isOpen: true,
 type: 'alert',
 message,
 title: options?.title || 'Alert',
 confirmText: options?.confirmText || 'OK',
 isDanger: options?.isDanger || false,
 resolve,
 });
 });
 },

 // Toasts (Fires events to be caught by the DialogProvider)
 toast: (message: React.ReactNode, options?: ExternalToastOptions) =>
 toastEmitter.emit({ variant: 'default', message, options }),

 success: (message: React.ReactNode, options?: ExternalToastOptions) =>
 toastEmitter.emit({ variant: 'success', message, options }),

 error: (message: React.ReactNode, options?: ExternalToastOptions) =>
 toastEmitter.emit({ variant: 'error', message, options }),

 warn: (message: React.ReactNode, options?: ExternalToastOptions) =>
 toastEmitter.emit({ variant: 'warning', message, options }),
};
