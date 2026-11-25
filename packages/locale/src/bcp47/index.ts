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

export interface LocaleInfo {
  tag: string;
  language: string;
  script?: string;
  region?: string;
  direction: 'ltr' | 'rtl';
}

const RTL_LANGUAGES = new Set([
  'ar',
  'he',
  'fa',
  'ur',
  'ps',
  'sd',
  'ug',
  'yi',
  'dv',
  'ckb',
  'ks',
  'pnb',
]);

const RTL_SCRIPTS = new Set(['arab', 'hebr', 'thaa', 'syrc', 'mand', 'samr']);

/**
 * Determines text direction ('ltr' or 'rtl') for a given BCP 47 locale tag.
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  if (!locale || typeof locale !== 'string') {
    return 'ltr';
  }

  const trimmed = locale.trim();
  if (!trimmed) {
    return 'ltr';
  }

  // 1. Try native Intl.Locale if available
  try {
    if (typeof Intl !== 'undefined' && 'Locale' in Intl) {
      const loc = new Intl.Locale(trimmed) as unknown as {
        textInfo?: { direction?: 'ltr' | 'rtl' };
        getTextInfo?: () => { direction?: 'ltr' | 'rtl' };
      };
      const textInfo =
        loc.textInfo ??
        (typeof loc.getTextInfo === 'function' ? loc.getTextInfo() : undefined);
      if (textInfo?.direction === 'rtl' || textInfo?.direction === 'ltr') {
        return textInfo.direction;
      }
    }
  } catch {
    // If Intl.Locale constructor throws on malformed tag, fall through
  }

  const subtags = trimmed.split(/[-_]/).map((s) => s.toLowerCase());
  const langSubtag = subtags[0] || '';

  // 2. Known RTL languages
  if (RTL_LANGUAGES.has(langSubtag)) {
    return 'rtl';
  }

  // 3. Known RTL scripts
  for (const subtag of subtags.slice(1)) {
    if (RTL_SCRIPTS.has(subtag)) {
      return 'rtl';
    }
  }

  return 'ltr';
}

/**
 * Parses a BCP 47 language tag into its constituent subcomponents.
 * Defensively guarded against ReDoS / CPU spikes (LOCALE-SEC-01).
 */
export function parseLocale(locale: string): LocaleInfo {
  if (!locale || typeof locale !== 'string') {
    return {
      tag: 'en-US',
      language: 'en',
      region: 'US',
      direction: 'ltr',
    };
  }

  const sanitized = locale.trim().slice(0, 64);

  try {
    if (typeof Intl !== 'undefined' && 'Locale' in Intl) {
      const parsed = new Intl.Locale(sanitized);
      return {
        tag: parsed.baseName || sanitized,
        language: parsed.language || 'en',
        script: parsed.script || undefined,
        region: parsed.region || undefined,
        direction: getDirection(sanitized),
      };
    }
  } catch {
    // Fallback manual parser for non-standard or malformed tags
  }

  const parts = sanitized.split(/[-_]/);
  const language = parts[0]?.toLowerCase() || 'en';
  let script: string | undefined;
  let region: string | undefined;

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.length === 4 && /^[a-zA-Z]+$/.test(part) && !script) {
      script = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    } else if (
      (part.length === 2 || part.length === 3) &&
      /^[a-zA-Z0-9]+$/.test(part) &&
      !region
    ) {
      region = part.toUpperCase();
    }
  }

  return {
    tag: sanitized,
    language,
    script,
    region,
    direction: getDirection(sanitized),
  };
}

/**
 * Matches requested locale(s) against a list of supported locales according to BCP 47 matching semantics.
 */
export function matchLocale(
  requested: string | string[],
  supported: string[],
  defaultLocale: string
): string {
  if (!supported || supported.length === 0) {
    return defaultLocale;
  }

  const reqList = Array.isArray(requested) ? requested : [requested];
  const supportedParsed = supported.map((s) => ({
    raw: s,
    info: parseLocale(s),
  }));

  for (const req of reqList) {
    if (!req) continue;
    const reqInfo = parseLocale(req);

    // 1. Exact match (case-insensitive)
    const exact = supportedParsed.find(
      (s) =>
        s.raw.toLowerCase() === req.toLowerCase() ||
        s.info.tag.toLowerCase() === reqInfo.tag.toLowerCase()
    );
    if (exact) return exact.raw;

    // 2. Language + Script match
    if (reqInfo.script) {
      const scriptMatch = supportedParsed.find(
        (s) =>
          s.info.language === reqInfo.language &&
          s.info.script?.toLowerCase() === reqInfo.script?.toLowerCase()
      );
      if (scriptMatch) return scriptMatch.raw;
    }

    // 3. Language + Region match
    if (reqInfo.region) {
      const regionMatch = supportedParsed.find(
        (s) =>
          s.info.language === reqInfo.language &&
          s.info.region?.toUpperCase() === reqInfo.region?.toUpperCase()
      );
      if (regionMatch) return regionMatch.raw;
    }

    // 4. Language-only match
    const langMatch = supportedParsed.find(
      (s) => s.info.language === reqInfo.language
    );
    if (langMatch) return langMatch.raw;
  }

  return defaultLocale;
}
