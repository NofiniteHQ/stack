"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/* ============================================================
 * Types
 * ============================================================ */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NUIProviderProps {
 children: React.ReactNode;
 /** The default theme if nothing is in local storage. Defaults to 'system'. */
 defaultTheme?: ThemeMode;
 /** The local storage key used to persist the theme preference. Defaults to 'nui-theme'. */
 storageKey?: string;
}

export interface ThemeContextState {
 /** The user's selected preference (includes 'system') */
 theme: ThemeMode;
 /** The actual calculated theme currently rendered in the DOM ('light' or 'dark') */
 resolvedTheme: 'light' | 'dark';
 /** Function to update the theme */
 setTheme: (theme: ThemeMode) => void;
}

/* ============================================================
 * Context & Hook
 * ============================================================ */

const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

/**
 * useTheme Hook
 * * Consumes the NUI Theme context to read or update the current theme.
 */
export function useTheme() {
 const context = useContext(ThemeContext);
 if (context === undefined) {
 throw new Error('useTheme must be used within a <NUIProvider>');
 }
 return context;
}

/* ============================================================
 * Component
 * ============================================================ */

/**
 * NUIProvider
 * * The root provider for the NUI component library.
 * * Manages theme state, synchronizes with localStorage, and listens for system preference changes.
 */
export function NUIProvider({
 children,
 defaultTheme = 'system',
 storageKey = 'nui-theme',
}: NUIProviderProps) {
 const [theme, setTheme] = useState<ThemeMode>(defaultTheme);
 const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
 const [isMounted, setIsMounted] = useState(false);

 // 1. Core logic to apply the theme to the DOM
 const applyTheme = useCallback((mode: ThemeMode) => {
 const root = document.documentElement;
 let finalTheme: 'light' | 'dark';

 if (mode === 'system') {
 finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
 } else {
 finalTheme = mode;
 }

 // Set standard data attribute for CSS variables
 root.setAttribute('data-theme', finalTheme);
 
 // Toggle the 'dark' class for Tailwind CSS compatibility
 if (finalTheme === 'dark') {
 root.classList.add('dark');
 } else {
 root.classList.remove('dark');
 }

 setResolvedTheme(finalTheme);
 }, []);

 // 2. Hydration & Initial Load
 useEffect(() => {
 setIsMounted(true);
 const storedTheme = window.localStorage.getItem(storageKey) as ThemeMode | null;
 
 if (storedTheme) {
 setTheme(storedTheme);
 applyTheme(storedTheme);
 } else {
 applyTheme(defaultTheme);
 }
 }, [storageKey, defaultTheme, applyTheme]);

 // 3. Sync state changes to LocalStorage
 useEffect(() => {
 if (!isMounted) return;
 window.localStorage.setItem(storageKey, theme);
 applyTheme(theme);
 }, [theme, storageKey, isMounted, applyTheme]);

 // 4. System Preference Listener
 useEffect(() => {
 if (!isMounted || theme !== 'system') return;

 const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
 const handleChange = () => applyTheme('system');

 mediaQuery.addEventListener('change', handleChange);
 return () => mediaQuery.removeEventListener('change', handleChange);
 }, [theme, isMounted, applyTheme]);

 // 5. Render Provider
 const contextValue = React.useMemo(
  () => ({ theme, resolvedTheme, setTheme }),
  [theme, resolvedTheme]
 );

 return (
 <ThemeContext.Provider value={contextValue}>
 {children}
 </ThemeContext.Provider>
 );
}