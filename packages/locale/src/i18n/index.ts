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

import { getPluralCategory } from '../format';

export type Messages = Record<string, unknown>;

export interface TranslateOptions {
  count?: number;
  [key: string]: unknown;
}

export interface TranslatorConfig {
  locale?: string;
  fallbackLocale?: string;
  messages?: Record<string, Messages>;
  missingKeyHandler?: (key: string, locale: string) => string;
}

export interface Translator {
  readonly locale: string;
  t: (key: string, params?: TranslateOptions) => string;
  setLocale: (newLocale: string) => void;
  addMessages: (locale: string, messages: Messages) => void;
}

function deepMergeMessages(target: Messages, source: Messages): Messages {
  const output: Messages = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = output[key];
    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      output[key] = deepMergeMessages(
        targetVal as Messages,
        sourceVal as Messages
      );
    } else {
      output[key] = sourceVal;
    }
  }
  return output;
}

function resolveNestedKey(obj: unknown, key: string): unknown {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return undefined;
  }

  // Check direct property first
  if (key in (obj as Record<string, unknown>)) {
    return (obj as Record<string, unknown>)[key];
  }

  // Traversal by dot
  const parts = key.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function interpolate(template: string, params?: TranslateOptions): string {
  if (!params) return template;
  return template.replace(/\{([a-zA-Z0-9_$]+)\}/g, (_, name) => {
    return params[name] !== undefined ? String(params[name]) : `{${name}}`;
  });
}

/**
 * Creates an internationalization translator instance with pluralization, variable interpolation,
 * and nested key path resolution.
 */
export function createTranslator(config: TranslatorConfig = {}): Translator {
  let currentLocale = config.locale || 'en-US';
  const fallbackLocale = config.fallbackLocale || 'en-US';
  const messageStore: Record<string, Messages> = {};

  if (config.messages) {
    for (const [loc, msgs] of Object.entries(config.messages)) {
      messageStore[loc] = deepMergeMessages({}, msgs);
    }
  }

  function getRawMessage(key: string, targetLocale: string): unknown {
    const localeDict = messageStore[targetLocale];
    return localeDict ? resolveNestedKey(localeDict, key) : undefined;
  }

  function translate(key: string, params?: TranslateOptions): string {
    let resolved: unknown;

    // Handle pluralization if params.count is defined
    if (params && typeof params.count === 'number') {
      const pluralCategory = getPluralCategory(
        params.count,
        undefined,
        currentLocale
      );

      // Check key + '.' + pluralCategory (e.g. 'items.one', 'items.other')
      resolved =
        getRawMessage(`${key}.${pluralCategory}`, currentLocale) ??
        getRawMessage(`${key}.other`, currentLocale);

      if (resolved === undefined) {
        // Check if key resolves to an object with plural rule keys
        const candidate = getRawMessage(key, currentLocale);
        if (candidate && typeof candidate === 'object') {
          resolved =
            (candidate as Record<string, unknown>)[pluralCategory] ??
            (candidate as Record<string, unknown>)['other'];
        }
      }

      // Try fallback locale for plural
      if (resolved === undefined && fallbackLocale !== currentLocale) {
        resolved =
          getRawMessage(`${key}.${pluralCategory}`, fallbackLocale) ??
          getRawMessage(`${key}.other`, fallbackLocale);

        if (resolved === undefined) {
          const candidate = getRawMessage(key, fallbackLocale);
          if (candidate && typeof candidate === 'object') {
            resolved =
              (candidate as Record<string, unknown>)[pluralCategory] ??
              (candidate as Record<string, unknown>)['other'];
          }
        }
      }
    }

    // Standard non-plural or unresolved plural lookup
    if (resolved === undefined) {
      resolved = getRawMessage(key, currentLocale);
    }

    // Fallback locale lookup
    if (resolved === undefined && fallbackLocale !== currentLocale) {
      resolved = getRawMessage(key, fallbackLocale);
    }

    // Missing key handler or default key return
    if (resolved === undefined || typeof resolved !== 'string') {
      if (config.missingKeyHandler) {
        return config.missingKeyHandler(key, currentLocale);
      }
      return key;
    }

    return interpolate(resolved, params);
  }

  return {
    get locale() {
      return currentLocale;
    },
    setLocale(newLocale: string) {
      if (newLocale) {
        currentLocale = newLocale;
      }
    },
    addMessages(locale: string, messages: Messages) {
      messageStore[locale] = deepMergeMessages(
        messageStore[locale] || {},
        messages
      );
    },
    t: translate,
  };
}
