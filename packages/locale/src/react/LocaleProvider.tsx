/**
 * @license
 * Copyright (C) 2025 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext, useContext, useMemo } from 'react';
import {
  formatDate,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
} from '../core';

export interface LocaleContextValue {
  locale: string;
  formatDate: (
    date: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatCurrency: (
    amount: number,
    currency: string,
    options?: Intl.NumberFormatOptions
  ) => string;
  formatRelativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export interface LocaleProviderProps {
  locale?: string;
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  locale = 'en-US',
  children,
}) => {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      formatDate: (date, options) => formatDate(date, options, locale),
      formatCurrency: (amount, currency, options) =>
        formatCurrency(amount, currency, options, locale),
      formatRelativeTime: (value, unit, options) =>
        formatRelativeTime(value, unit, options, locale),
      formatNumber: (value, options) => formatNumber(value, options, locale),
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    const defaultLocale =
      typeof globalThis !== 'undefined' && 'navigator' in globalThis
        ? (globalThis as any).navigator?.language || 'en-US'
        : 'en-US';
    return {
      locale: defaultLocale,
      formatDate: (date, options) => formatDate(date, options, defaultLocale),
      formatCurrency: (amount, currency, options) =>
        formatCurrency(amount, currency, options, defaultLocale),
      formatRelativeTime: (value, unit, options) =>
        formatRelativeTime(value, unit, options, defaultLocale),
      formatNumber: (value, options) =>
        formatNumber(value, options, defaultLocale),
    };
  }
  return context;
}
