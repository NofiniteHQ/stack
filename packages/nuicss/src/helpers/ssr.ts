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

/**
 * Extracts class names and tokens from an HTML markup string.
 */
export function extractClassTokens(html: string): string[] {
  const tokens = new Set<string>();
  let match: RegExpExecArray | null;

  // Reset regex state
  CLASS_ATTR_REGEX.lastIndex = 0;

  while ((match = CLASS_ATTR_REGEX.exec(html)) !== null) {
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

  const generator = await getNuicssGenerator(options.config);
  const tokenString = tokens.join(' ');
  const { css: generatedCss } = await generator.generate(tokenString);

  let finalCss = generatedCss;
  if (options.includeBase && options.baseCss) {
    finalCss = `${options.baseCss}\n${finalCss}`;
  }

  const styleTag = finalCss
    ? `<style id="nuicss-critical" data-nuicss-ssr="true">${finalCss}</style>`
    : '';

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
