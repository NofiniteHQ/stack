/**
 * @nofinite/charts - Data & Chart Export Utilities
 * Export charts to CSV, SVG, or PNG format.
 */

import type { ChartSeries } from './math';
import { normalizeData } from './normalize';

/**
 * Sanitizes a CSV cell to neutralize CSV Formula Injection (CWE-1236, CHARTS-M3-04)
 * while preserving valid numeric and text data per RFC 4180.
 *
 * Formula injection occurs when a spreadsheet application (Excel, LibreOffice, Google Sheets)
 * interprets leading characters (=, +, -, @, |, %, and Unicode fullwidth variants ＝, ＋, －, ＠)
 * as active formulas or expressions.
 * When formula trigger characters appear at the start of a cell—or immediately following
 * leading whitespace, tabs, carriage returns, or non-breaking spaces (\u00A0)—they are
 * neutralized by prepending a single quote (').
 *
 * Genuine numeric values (e.g., negative numbers like -50 or floats) are preserved as numbers
 * and not neutralized with a quote.
 */
export function sanitizeCSVCell(value: unknown): string {
  // 1. Handle empty / null / undefined
  if (value === null || value === undefined) {
    return '""';
  }

  // 2. Handle genuine numbers: preserve unquoted numeric literals
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '""';
    return String(value);
  }

  // 3. Handle boolean values
  if (typeof value === 'boolean') {
    return String(value);
  }

  // 4. Convert all other types to string
  let str = String(value);

  // Empty string
  if (str.length === 0) {
    return '""';
  }

  // 5. Distinguish pure numeric strings from formula triggers:
  // e.g. "-50", "+12.5", "100" are pure numbers and do not execute formulas.
  const trimmed = str.trim();
  const isPureNumber =
    /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/.test(trimmed) &&
    !Number.isNaN(Number(trimmed));

  // If it is NOT a pure number, check for formula triggers:
  // Neutralize ASCII (=, +, -, @, |, %) and Unicode fullwidth triggers (＝ \uFF1D, ＋ \uFF0B, － \uFF0D, ＠ \uFF20)
  // as well as triggers preceded by whitespace, tabs, carriage returns, or non-breaking spaces (\u00A0) (CHARTS-M3-04).
  if (!(isPureNumber && trimmed === str)) {
    const triggerRegex = /^[=+\-@|%\uFF1D\uFF0B\uFF0D\uFF20]/;
    // Strip leading ASCII/Unicode whitespace, control characters (0x00-0x1F, 0x7F-0x9F), and NBSP (\u00A0)

    const trimmedControl = str.replace(
      // eslint-disable-next-line no-control-regex
      /^[\s\u0000-\u0020\u007F-\u009F\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/,
      ''
    );
    const hasLeadingTrigger = triggerRegex.test(str);
    const hasTriggerAfterWhitespace =
      trimmedControl.length > 0 && triggerRegex.test(trimmedControl);

    if (hasLeadingTrigger || hasTriggerAfterWhitespace) {
      str = "'" + str;
    }
  }

  // 6. RFC 4180: escape internal double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

export function exportToCSV(
  seriesList: ChartSeries[],
  filename = 'chart-data.csv'
): string {
  if (!seriesList || seriesList.length === 0) return '';

  const normalizedSeries = seriesList.map((s) => ({
    name: s.name,
    hidden: s.hidden,
    data: normalizeData(s.data || []),
  }));

  const xLabels: string[] = [];
  for (const s of normalizedSeries) {
    for (const d of s.data) {
      if (d.label && !xLabels.includes(d.label)) {
        xLabels.push(d.label);
      }
    }
  }

  const headers = [
    'Category',
    ...seriesList.map((s) => sanitizeCSVCell(s.name)),
  ];
  const rows: string[] = [headers.join(',')];

  for (const xLabel of xLabels) {
    const rowValues = [
      sanitizeCSVCell(xLabel),
      ...normalizedSeries.map((s) => {
        const pt = s.data.find((d) => d.label === xLabel);
        if (!pt || pt.y === undefined || pt.y === null || Number.isNaN(pt.y)) {
          return '';
        }
        return typeof pt.y === 'number' ? String(pt.y) : sanitizeCSVCell(pt.y);
      }),
    ];
    rows.push(rowValues.join(','));
  }

  const csvContent = rows.join('\n');

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return csvContent;
}

/**
 * Comprehensive DOM-based SVG sanitizer (CHARTS-M3-02, CHARTS-M3-05).
 * Uses DOM traversal as the primary security boundary:
 * 1. Removes all executable or active elements: script, foreignObject, iframe,
 *    object, embed, audio, video, animate, set, animateTransform, animateMotion.
 * 2. Neutralizes <style> elements containing @import, expression(), or external url() references.
 * 3. Strips all inline event handlers (on* attributes in any case/namespace).
 * 4. Sanitizes href / xlink:href attributes against javascript:, vbscript:,
 *    data:text/*, data:image/svg+xml, foreign resource links, and non-local <use> targets.
 * 5. Sanitizes inline style attributes against external url() and expression().
 * 6. Validates both root <svg> element and all descendants while preserving
 *    legitimate chart presentation attributes and local fragment gradient fills.
 */
export function sanitizeSVGElement(svg: SVGElement): void {
  // 1. Remove dangerous active elements (case-insensitive via querySelectorAll)
  const dangerousSelectors = [
    'script',
    'foreignObject',
    'iframe',
    'object',
    'embed',
    'audio',
    'video',
    'animate',
    'set',
    'animateTransform',
    'animateMotion',
  ].join(', ');

  const dangerousEls = svg.querySelectorAll(dangerousSelectors);
  for (let i = 0; i < dangerousEls.length; i++) {
    dangerousEls[i]?.remove();
  }

  // 2. Sanitize <style> elements
  const styleEls = svg.querySelectorAll('style');
  for (let i = 0; i < styleEls.length; i++) {
    const styleEl = styleEls[i];
    const cssText = styleEl.textContent || '';
    if (
      /@import\b/i.test(cssText) ||
      /url\s*\(\s*['"]?(?!#)(?:https?:|\/\/|data:)/i.test(cssText) ||
      /expression\s*\(/i.test(cssText) ||
      /-moz-binding\b/i.test(cssText)
    ) {
      styleEl.remove();
    }
  }

  // 3. Inspect root element and all descendants
  const allElements = [svg, ...Array.from(svg.querySelectorAll('*'))];
  for (const el of allElements) {
    if (!(el instanceof Element)) continue;

    const attrNames =
      typeof el.getAttributeNames === 'function' ? el.getAttributeNames() : [];

    for (const attr of attrNames) {
      const lowerAttr = attr.toLowerCase();

      // Strip event handlers (e.g. onload, onclick, onerror, onmouseover)
      if (lowerAttr.startsWith('on')) {
        el.removeAttribute(attr);
        continue;
      }

      // Check href and xlink:href (case-insensitive)
      if (lowerAttr === 'href' || lowerAttr.endsWith(':href')) {
        const val = el.getAttribute(attr) || '';
        const trimmedVal = val.trim();

        // Disallow dangerous URI schemes
        if (
          /^(?:javascript|vbscript|data:\s*text|data:\s*image\/svg\+xml)/i.test(
            trimmedVal
          )
        ) {
          el.removeAttribute(attr);
          continue;
        }

        // For <use> elements, restrict href strictly to local fragment references (#id)
        if (el.tagName.toLowerCase() === 'use' && !trimmedVal.startsWith('#')) {
          el.removeAttribute(attr);
          continue;
        }

        // For <a> elements, forbid dangerous schemes and foreign resource links (CHARTS-M3-05)
        if (el.tagName.toLowerCase() === 'a') {
          if (
            /^(?:javascript|vbscript|data:|file:)/i.test(trimmedVal) ||
            /^(?:https?:|\/\/)/i.test(trimmedVal)
          ) {
            el.removeAttribute(attr);
            continue;
          }
        }

        // For <image> elements, block SVG data URIs or javascript
        if (el.tagName.toLowerCase() === 'image') {
          if (
            /^(?:javascript|vbscript|data:\s*image\/svg\+xml)/i.test(trimmedVal)
          ) {
            el.removeAttribute(attr);
            continue;
          }
        }
      }

      // Sanitize inline style attribute
      if (lowerAttr === 'style') {
        const styleVal = el.getAttribute(attr) || '';
        if (
          /url\s*\(\s*['"]?(?!#)(?:https?:|\/\/|data:)/i.test(styleVal) ||
          /expression\s*\(/i.test(styleVal) ||
          /@import\b/i.test(styleVal)
        ) {
          el.removeAttribute(attr);
          continue;
        }
      }

      // Strip dangerous attributes (e.g. formaction, form)
      if (lowerAttr === 'formaction' || lowerAttr === 'action') {
        el.removeAttribute(attr);
      }
    }
  }
}

const DANGEROUS_SVG_TAGS = [
  'script',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'audio',
  'video',
  'animate',
  'set',
  'animatetransform',
  'animatemotion',
] as const;

function stripSvgElementBlocks(source: string, tagName: string): string {
  const lower = source.toLowerCase();
  const openToken = `<${tagName}`;
  const closeToken = `</${tagName}`;
  let out = '';
  let cursor = 0;

  while (cursor < source.length) {
    const openIdx = lower.indexOf(openToken, cursor);
    if (openIdx === -1) {
      out += source.slice(cursor);
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
      out += source.slice(cursor, afterName);
      cursor = afterName;
      continue;
    }

    out += source.slice(cursor, openIdx);

    const openEnd = source.indexOf('>', afterName);
    if (openEnd === -1) {
      break;
    }
    if (source[openEnd - 1] === '/') {
      cursor = openEnd + 1;
      continue;
    }

    let closeSearch = openEnd + 1;
    let nextCursor = source.length;
    while (closeSearch < source.length) {
      const closeIdx = lower.indexOf(closeToken, closeSearch);
      if (closeIdx === -1) break;
      let endPos = closeIdx + closeToken.length;
      const closeNext = lower[endPos];
      if (
        closeNext === '>' ||
        (closeNext !== undefined && /\s/.test(closeNext))
      ) {
        while (endPos < source.length && source[endPos] !== '>') {
          endPos++;
        }
        nextCursor = endPos < source.length ? endPos + 1 : source.length;
        break;
      }
      closeSearch = closeIdx + closeToken.length;
    }
    cursor = nextCursor;
  }

  return out;
}

/**
 * Isomorphic string-level SVG sanitizer for SSR / headless mode (CHARTS-M3-06).
 */
export function sanitizeSVGString(source: string): string {
  if (!source || typeof source !== 'string') return '';
  let result = source;

  // 1. Remove dangerous active container blocks deterministically and repeat tag strip until fixed point
  for (const tag of DANGEROUS_SVG_TAGS) {
    result = stripSvgElementBlocks(result, tag);
  }
  let prev: string;
  do {
    prev = result;
    result = result.replace(
      /<\/?(?:script|foreignObject|iframe|object|embed|audio|video|animate|set|animateTransform|animateMotion)\b[^>]*>/gi,
      ''
    );
    // 2. Strip event handlers (onload=, onclick=, etc.)
    result = result.replace(
      /(?:^|(?<=[\s"'/]))on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ''
    );
  } while (result !== prev);

  // 3. For <use> elements, restrict href to local fragment references (#id)
  result = result.replace(/<use\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleanAttrs = attrs.replace(
      /(\s(?:xlink:)?href\s*=\s*["'])(?!#)[^"']*(["'])/gi,
      '$1#sanitized$2'
    );
    return `<use${cleanAttrs}>`;
  });

  // 4. For <a> elements, strip dangerous or foreign resource hrefs
  result = result.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleanAttrs = attrs.replace(
      /\s(?:xlink:)?href\s*=\s*["']\s*(?:javascript:|vbscript:|data:|https?:|\/\/)[^"']*["']/gi,
      ''
    );
    return `<a${cleanAttrs}>`;
  });

  // 5. For <image> elements, strip dangerous data URIs or javascript
  result = result.replace(/<image\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleanAttrs = attrs.replace(
      /\s(?:xlink:)?href\s*=\s*["']\s*(?:javascript:|vbscript:|data:\s*image\/svg\+xml)[^"']*["']/gi,
      ''
    );
    return `<image${cleanAttrs}>`;
  });

  // 6. Neutralize dangerous <style> blocks
  result = result.replace(
    /<style\b[^>]*>([^<]*(?:<(?!\/style)[^<]*)*)<\/style[^>]*>/gi,
    (match, css) => {
      if (
        /@import\b/i.test(css) ||
        /url\s*\(\s*['"]?(?!#)(?:https?:|\/\/|data:)/i.test(css) ||
        /expression\s*\(/i.test(css) ||
        /-moz-binding\b/i.test(css)
      ) {
        return '';
      }
      return match;
    }
  );

  // 7. Neutralize inline style attributes containing external url(), expression(), or @import
  do {
    prev = result;
    result = result.replace(
      /\sstyle\s*=\s*(?:"[^"]*(?:url\s*\(\s*['"]?(?!#)(?:https?:|\/\/|data:)|expression\s*\(|@import|-moz-binding)[^"]*"|'[^']*(?:url\s*\(\s*['"]?(?!#)(?:https?:|\/\/|data:)|expression\s*\(|@import|-moz-binding)[^']*')/gi,
      ''
    );
  } while (result !== prev);

  return result;
}

export function exportToSVG(
  svgElement: SVGElement | string,
  filename = 'chart.svg'
): string {
  let source = '';

  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof (svgElement as any)?.cloneNode === 'function'
  ) {
    const origElement = svgElement as SVGElement;
    const clone = origElement.cloneNode(true) as SVGElement;

    if (typeof window.getComputedStyle === 'function') {
      const origEls = [
        origElement,
        ...Array.from(origElement.querySelectorAll('*')),
      ];
      const cloneEls = [clone, ...Array.from(clone.querySelectorAll('*'))];
      const propsToInline = [
        'fill',
        'stroke',
        'stroke-width',
        'stroke-dasharray',
        'stroke-linecap',
        'stroke-linejoin',
        'opacity',
        'font-family',
        'font-size',
        'font-weight',
        'text-anchor',
        'dominant-baseline',
      ];

      for (let i = 0; i < origEls.length; i++) {
        const orig = origEls[i];
        const dest = cloneEls[i];
        if (
          !orig ||
          !dest ||
          !(orig instanceof Element) ||
          !(dest instanceof SVGElement)
        )
          continue;
        try {
          const computed = window.getComputedStyle(orig);
          for (const prop of propsToInline) {
            const val = computed.getPropertyValue(prop);
            if (val && val !== 'normal' && val !== 'auto') {
              dest.style.setProperty(prop, val);
            }
          }
        } catch {
          // Ignore DOM exceptions during computed style reading in mocked environments
        }
      }
    }

    const bbox =
      typeof origElement.getBoundingClientRect === 'function'
        ? origElement.getBoundingClientRect()
        : { width: 600, height: 300 };
    const w = bbox.width || 600;
    const h = bbox.height || 300;

    if (!clone.getAttribute('width')) {
      clone.setAttribute('width', String(w));
    }
    if (!clone.getAttribute('height')) {
      clone.setAttribute('height', String(h));
    }
    if (!clone.getAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }

    // Comprehensive DOM-based security sanitization (CHARTS-M3-02, CHARTS-M3-05)
    sanitizeSVGElement(clone);

    const serializer = new XMLSerializer();
    source = serializer.serializeToString(clone);
  } else if (typeof svgElement === 'string') {
    source = svgElement;
  } else if (svgElement && typeof (svgElement as any).outerHTML === 'string') {
    source = (svgElement as any).outerHTML;
  } else if (typeof XMLSerializer !== 'undefined' && svgElement) {
    try {
      source = new XMLSerializer().serializeToString(svgElement as any);
    } catch {
      source = String(svgElement);
    }
  } else {
    source = String(svgElement || '');
  }

  // Universal defense-in-depth string sanitization (isomorphic fallback) (CHARTS-M3-06)
  source = sanitizeSVGString(source);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const bbox =
    typeof (svgElement as any)?.getBoundingClientRect === 'function'
      ? (svgElement as SVGElement).getBoundingClientRect()
      : { width: 600, height: 300 };
  const w = bbox.width || 600;
  const h = bbox.height || 300;
  if (!source.includes('width=')) {
    source = source.replace(/^<svg/, `<svg width="${w}"`);
  }
  if (!source.includes('height=')) {
    source = source.replace(/^<svg/, `<svg height="${h}"`);
  }

  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    filename
  ) {
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return source;
}

export function exportToPNG(
  svgElement: SVGElement,
  filename = 'chart.png',
  scale = 2
): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(null);
      return;
    }

    // Bound export resolution multiplier and maximum dimension to prevent DoS (CHARTS-M3-08)
    const MAX_SCALE = 4;
    const MAX_DIMENSION = 8192;
    const safeScale = Math.max(
      0.1,
      Math.min(Number.isFinite(scale) ? scale : 2, MAX_SCALE)
    );

    const svgString = exportToSVG(svgElement, '');
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const bbox =
        typeof svgElement.getBoundingClientRect === 'function'
          ? svgElement.getBoundingClientRect()
          : { width: 600, height: 300 };
      const rawW = Math.max(1, bbox.width || 600);
      const rawH = Math.max(1, bbox.height || 300);

      let targetW = Math.round(rawW * safeScale);
      let targetH = Math.round(rawH * safeScale);

      if (targetW > MAX_DIMENSION || targetH > MAX_DIMENSION) {
        const aspect = targetW / targetH;
        if (targetW >= targetH) {
          targetW = MAX_DIMENSION;
          targetH = Math.max(1, Math.round(MAX_DIMENSION / aspect));
        } else {
          targetH = MAX_DIMENSION;
          targetW = Math.max(1, Math.round(MAX_DIMENSION * aspect));
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0, targetW, targetH);
        canvas.toBlob((blob) => {
          if (blob && filename) {
            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
          }
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/png');
      } else {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}
