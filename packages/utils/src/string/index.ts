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

/**
 * Capitalizes the first character of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Splits a string into constituent words across camel, pascal, snake, and kebab case.
 */
function getWords(str: string): string[] {
  if (!str) return [];
  // Match word boundaries considering uppercase transitions and punctuation/spaces
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Converts a string to camelCase.
 */
export function camelCase(str: string): string {
  const words = getWords(str);
  if (words.length === 0) return '';
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  );
}

/**
 * Converts a string to PascalCase.
 */
export function pascalCase(str: string): string {
  const words = getWords(str);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

/**
 * Converts a string to kebab-case.
 */
export function kebabCase(str: string): string {
  return getWords(str)
    .map((w) => w.toLowerCase())
    .join('-');
}

/**
 * Converts a string to snake_case.
 */
export function snakeCase(str: string): string {
  return getWords(str)
    .map((w) => w.toLowerCase())
    .join('_');
}

/**
 * Options for slugify.
 */
export interface SlugifyOptions {
  lower?: boolean;
  replacement?: string;
}

/**
 * Generates a clean URL slug from a string, handling Unicode diacritics and special characters.
 */
export function slugify(str: string, options: SlugifyOptions = {}): string {
  const { lower = true, replacement = '-' } = options;
  if (!str) return '';

  let slug = str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Strip diacritics
    .trim();

  if (lower) {
    slug = slug.toLowerCase();
  }

  // Replace non-alphanumeric characters with replacement and trim boundary delimiters
  slug = slug.replace(/[^a-zA-Z0-9]+/g, replacement);
  if (replacement.length > 0) {
    while (slug.startsWith(replacement)) {
      slug = slug.slice(replacement.length);
    }
    while (slug.endsWith(replacement)) {
      slug = slug.slice(0, -replacement.length);
    }
  }

  return slug;
}

/**
 * Truncates a string to a given length, appending an optional suffix.
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (!str) return '';
  if (length <= 0) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
};

/**
 * Escapes HTML characters (&, <, >, ", ') to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => HTML_ESCAPE_MAP[m] ?? m);
}

/**
 * Unescapes HTML entities back to their raw characters.
 */
export function unescapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(
    /&(?:amp|lt|gt|quot|#39|#x27);/g,
    (m) => HTML_UNESCAPE_MAP[m] ?? m
  );
}

/**
 * Strips all HTML tags from a string cleanly via fixed-point multi-pass sanitization.
 */
export function stripTags(html: string): string {
  if (!html) return '';
  let result = html;
  let prev: string;
  do {
    prev = result;
    result = result.replace(/<[^<>]*>/g, '');
  } while (result !== prev);
  return result;
}

/**
 * Sanitizes URLs to protect against javascript:, data:, and vbscript: XSS vectors.
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Reject control characters using character code check (immune to no-control-regex)
  for (let i = 0; i < trimmed.length; i++) {
    const code = trimmed.charCodeAt(i);
    if ((code >= 0 && code <= 31) || (code >= 127 && code <= 159)) {
      return 'about:blank';
    }
  }

  // Match protocol
  const protocolMatch = trimmed.match(/^([a-zA-Z0-9+.-]+):/);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    if (['javascript', 'vbscript', 'data'].includes(protocol)) {
      return 'about:blank';
    }
  }

  return trimmed;
}
