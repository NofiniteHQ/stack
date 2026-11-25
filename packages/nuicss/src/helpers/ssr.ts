/**
 * @nofinite/nuicss/ssr
 * Critical CSS extraction and injection helpers for Server-Side Rendering (SSR).
 * Zero FOUC (Flash of Unstyled Content) and instantaneous First Contentful Paint.
 * Compatible with Next.js, Astro, SvelteKit, Remix, Nuxt, and vanilla SSR.
 */

import { createGenerator } from '@unocss/core';
import type { UnoGenerator } from '@unocss/core';
import { nuicssPreset } from '../plugin/preset';

export interface CriticalNuicssOptions {
  /**
   * Whether to include base CSS variables (colors, typography, container queries).
   * Default: false (assumes base styles or @nofinite/nuicss/styles.css is already linked).
   */
  includeBase?: boolean;

  /**
   * Custom base CSS string to prepend if includeBase is true.
   */
  baseCss?: string;

  /**
   * Custom UnoCSS/NUICSS config override.
   */
  config?: any;
}

export interface CriticalNuicssResult {
  /** The extracted minimal CSS string */
  css: string;
  /** Ready-to-inject HTML style tag: `<style id="nuicss-critical">...</style>` */
  html: string;
  /** List of matched superclasses and utility tokens found in the HTML */
  tokens: string[];
}

let cachedGenerator: UnoGenerator | null = null;
const MAX_CACHE_SIZE = 1000;
const tokenCssCache = new Map<string, string>();

/**
 * Clears the internal SSR CSS cache (primarily used in tests or dynamic theme updates).
 */
export function clearCriticalNuicssCache(): void {
  tokenCssCache.clear();
}

/**
 * Wraps generated CSS into a standard NUICSS SSR style tag.
 */
export function createCriticalStyleTag(
  css: string,
  id = 'nuicss-critical'
): string {
  if (!css) return '';
  return `<style id="${id}" data-nuicss-ssr="true">${css}</style>`;
}

export async function getNuicssGenerator(
  customConfig?: any
): Promise<UnoGenerator> {
  if (customConfig) {
    return await createGenerator(customConfig);
  }
  if (!cachedGenerator) {
    cachedGenerator = await createGenerator(nuicssPreset());
  }
  return cachedGenerator;
}

const CLASS_ATTR_REGEX = /(?:class|className)\s*=\s*["']([^"']+)["']/g;

function stripHtmlBlockTag(html: string, tagName: 'script' | 'style'): string {
  const lower = html.toLowerCase();
  const openToken = `<${tagName}`;
  const closeToken = `</${tagName}`;
  let out = '';
  let cursor = 0;

  while (cursor < html.length) {
    const openIdx = lower.indexOf(openToken, cursor);
    if (openIdx === -1) {
      out += html.slice(cursor);
      break;
    }

    const afterName = openIdx + openToken.length;
    const nextChar = lower[afterName];
    if (
      nextChar !== undefined &&
      nextChar !== '>' &&
      nextChar !== '/' &&
      !/\s/.test(nextChar)
    ) {
      out += html.slice(cursor, afterName);
      cursor = afterName;
      continue;
    }

    out += html.slice(cursor, openIdx);

    const openEnd = html.indexOf('>', afterName);
    if (openEnd === -1) {
      break;
    }

    // Find matching closing tag allowing optional whitespace/garbage before '>'
    let closeSearch = openEnd + 1;
    let nextCursor = html.length;
    while (closeSearch < html.length) {
      const closeIdx = lower.indexOf(closeToken, closeSearch);
      if (closeIdx === -1) {
        break;
      }
      let endPos = closeIdx + closeToken.length;
      const closeNext = lower[endPos];
      if (
        closeNext === '>' ||
        (closeNext !== undefined && /\s/.test(closeNext))
      ) {
        while (endPos < html.length && html[endPos] !== '>') {
          endPos++;
        }
        nextCursor = endPos < html.length ? endPos + 1 : html.length;
        break;
      }
      closeSearch = closeIdx + closeToken.length;
    }
    cursor = nextCursor;
  }

  return out;
}

/**
 * Extracts class names and tokens from an HTML markup string.
 * Automatically sanitizes <script> and <style> blocks to prevent
 * executable code or embedded styles from leaking into critical CSS.
 */
export function extractClassTokens(html: string): string[] {
  if (!html) return [];
  const tokens = new Set<string>();
  let match: RegExpExecArray | null;

  // Strip script and style blocks deterministically in linear time
  const cleanHtml = stripHtmlBlockTag(
    stripHtmlBlockTag(html, 'script'),
    'style'
  );

  // Reset regex state
  CLASS_ATTR_REGEX.lastIndex = 0;

  while ((match = CLASS_ATTR_REGEX.exec(cleanHtml)) !== null) {
    const classStr = match[1];
    if (classStr) {
      const parts = classStr.split(/\s+/);
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed && !trimmed.startsWith('{') && !trimmed.endsWith('}')) {
          tokens.add(trimmed);
        }
      }
    }
  }

  return Array.from(tokens);
}

/**
 * Extracts critical NUICSS styles directly from a list or Set of class tokens.
 * Highly optimized for JSX ASTs, template parsers, and component render trees.
 */
export async function extractCriticalCssForTokens(
  tokens: string[] | Set<string>,
  options: CriticalNuicssOptions = {}
): Promise<string> {
  const tokenArray = Array.isArray(tokens) ? tokens : Array.from(tokens);
  if (tokenArray.length === 0) return '';

  const cacheKey = options.config ? null : tokenArray.slice().sort().join(' ');
  if (cacheKey) {
    const cached = tokenCssCache.get(cacheKey);
    if (cached !== undefined) {
      if (options.includeBase && options.baseCss) {
        return `${options.baseCss}\n${cached}`;
      }
      return cached;
    }
  }

  const generator = await getNuicssGenerator(options.config);
  const { css: generatedCss } = await generator.generate(tokenArray.join(' '));

  if (cacheKey) {
    if (tokenCssCache.size >= MAX_CACHE_SIZE) {
      const firstKey = tokenCssCache.keys().next().value;
      if (firstKey) tokenCssCache.delete(firstKey);
    }
    tokenCssCache.set(cacheKey, generatedCss);
  }

  if (options.includeBase && options.baseCss) {
    return `${options.baseCss}\n${generatedCss}`;
  }
  return generatedCss;
}

/**
 * Extracts critical NUICSS styles used in the provided HTML string.
 *
 * @example
 * const { css, html } = await extractCriticalNuicss(renderedHtml);
 * // Inject `html` into <head> of the SSR document
 */
export async function extractCriticalNuicss(
  html: string,
  options: CriticalNuicssOptions = {}
): Promise<CriticalNuicssResult> {
  const tokens = extractClassTokens(html);
  if (tokens.length === 0) {
    return { css: '', html: '', tokens: [] };
  }

  const finalCss = await extractCriticalCssForTokens(tokens, options);
  const styleTag = createCriticalStyleTag(finalCss);

  return {
    css: finalCss,
    html: styleTag,
    tokens,
  };
}

/**
 * Injects critical NUICSS styles directly into the `<head>` of an HTML document string.
 *
 * @example
 * const fullHtml = await injectCriticalNuicss(ssrPageHtml);
 */
export async function injectCriticalNuicss(
  html: string,
  options: CriticalNuicssOptions = {}
): Promise<string> {
  const { html: styleTag } = await extractCriticalNuicss(html, options);
  if (!styleTag) return html;

  if (html.includes('</head>')) {
    return html.replace('</head>', `  ${styleTag}\n</head>`);
  }
  return `${styleTag}\n${html}`;
}
