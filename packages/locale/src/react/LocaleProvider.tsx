/**
 * @license
 * Copyright (C) 2026 Nofinite
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

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  formatDate,
  formatDateRange,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
  formatList,
  getPluralCategory,
  type DateInput,
} from '../format';
import { getDirection } from '../bcp47';
import {
  createTranslator,
  type Messages,
  type TranslateOptions,
} from '../i18n';

export interface LocaleContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  supportedLocales?: string[];
  setLocale: (newLocale: string) => void;
  t: (key: string, params?: TranslateOptions) => string;
  formatDate: (date: DateInput, options?: Intl.DateTimeFormatOptions) => string;
  formatDateRange: (
    start: DateInput,
    end: DateInput,
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
  formatList: (items: string[], options?: Intl.ListFormatOptions) => string;
  getPluralCategory: (
    count: number,
    options?: Intl.PluralRulesOptions
  ) => Intl.LDMLPluralRule;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export interface LocaleProviderProps {
  locale?: string;
  defaultLocale?: string;
  supportedLocales?: string[];
  messages?: Record<string, Messages>;
  syncDom?: boolean;
  children?: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  locale: controlledLocale,
  defaultLocale = 'en-US',
  supportedLocales,
  messages,
  syncDom = false,
  children,
}) => {
  const [activeLocale, setActiveLocale] = useState<string>(
    controlledLocale || defaultLocale
  );

  useEffect(() => {
    if (controlledLocale !== undefined) {
      setActiveLocale(controlledLocale);
    }
  }, [controlledLocale]);

  const direction = useMemo<'ltr' | 'rtl'>(
    () => getDirection(activeLocale),
    [activeLocale]
  );

  // Sync with document element when enabled
  useEffect(() => {
    if (
      syncDom &&
      typeof document !== 'undefined' &&
      document.documentElement
    ) {
      document.documentElement.setAttribute('lang', activeLocale);
      document.documentElement.setAttribute('dir', direction);
    }
  }, [syncDom, activeLocale, direction]);

  const translator = useMemo(() => {
    return createTranslator({
      locale: activeLocale,
      fallbackLocale: defaultLocale,
      messages,
    });
  }, [activeLocale, defaultLocale, messages]);

  const handleSetLocale = useCallback((newLocale: string) => {
    if (newLocale && typeof newLocale === 'string') {
      setActiveLocale(newLocale);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: activeLocale,
      direction,
      supportedLocales,
      setLocale: handleSetLocale,
      t: (key: string, params?: TranslateOptions) => translator.t(key, params),
      formatDate: (date, options) => formatDate(date, options, activeLocale),
      formatDateRange: (start, end, options) =>
        formatDateRange(start, end, options, activeLocale),
      formatCurrency: (amount, currency, options) =>
        formatCurrency(amount, currency, options, activeLocale),
      formatRelativeTime: (valueOffset, unit, options) =>
        formatRelativeTime(valueOffset, unit, options, activeLocale),
      formatNumber: (val, options) => formatNumber(val, options, activeLocale),
      formatList: (items, options) => formatList(items, options, activeLocale),
      getPluralCategory: (count, options) =>
        getPluralCategory(count, options, activeLocale),
    }),
    [activeLocale, direction, supportedLocales, handleSetLocale, translator]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    const globalNav =
      typeof globalThis !== 'undefined' && 'navigator' in globalThis
        ? (globalThis as { navigator?: { language?: string } }).navigator
        : undefined;
    const defaultLocale = globalNav?.language || 'en-US';
    const direction = getDirection(defaultLocale);

    return {
      locale: defaultLocale,
      direction,
      supportedLocales: undefined,
      setLocale: () => {
        /* no-op when rendered outside LocaleProvider */
      },
      t: (key: string, params?: TranslateOptions) => {
        if (!params) return key;
        return key.replace(/\{([a-zA-Z0-9_$]+)\}/g, (_, name) =>
          params[name] !== undefined ? String(params[name]) : `{${name}}`
        );
      },
      formatDate: (date, options) => formatDate(date, options, defaultLocale),
      formatDateRange: (start, end, options) =>
        formatDateRange(start, end, options, defaultLocale),
      formatCurrency: (amount, currency, options) =>
        formatCurrency(amount, currency, options, defaultLocale),
      formatRelativeTime: (value, unit, options) =>
        formatRelativeTime(value, unit, options, defaultLocale),
      formatNumber: (value, options) =>
        formatNumber(value, options, defaultLocale),
      formatList: (items, options) => formatList(items, options, defaultLocale),
      getPluralCategory: (count, options) =>
        getPluralCategory(count, options, defaultLocale),
    };
  }
  return context;
}

export interface UseTranslationResult {
  t: (key: string, params?: TranslateOptions) => string;
  locale: string;
  direction: 'ltr' | 'rtl';
}

export function useTranslation(namespace?: string): UseTranslationResult {
  const { t, locale, direction } = useLocale();

  const scopedT = useCallback(
    (key: string, params?: TranslateOptions): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey, params);
    },
    [t, namespace]
  );

  return {
    t: scopedT,
    locale,
    direction,
  };
}
