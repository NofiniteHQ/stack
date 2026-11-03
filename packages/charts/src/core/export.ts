/**
 * @nofinite/charts - Data & Chart Export Utilities
 * Export charts to CSV, SVG, or PNG format.
 */

import type { ChartSeries } from './math';
import { normalizeData } from './normalize';

/**
 * Sanitizes a CSV cell to neutralize CSV Formula Injection (CWE-1236)
 * while preserving valid numeric and text data per RFC 4180.
 *
 * Formula injection occurs when a spreadsheet application (Excel, LibreOffice, Google Sheets)
 * interprets leading characters (=, +, -, @, |, %) as active formulas or expressions.
 * When formula trigger characters appear at the start of a cell—or immediately following
 * leading whitespace/control characters—they are neutralized by prepending a single quote (').
 *
 * Genuine numeric values (e.g., negative numbers like -50 or floats) are preserved as numbers
 * and not neutralized with a quote.
 */
function sanitizeCSVCell(value: unknown): string {
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
  // Check if string starts with formula triggers (=, +, -, @, |, %)
  // OR if after stripping leading whitespace and control characters (0x00-0x1F, 0x7F),
  // it starts with a formula trigger (=, +, -, @, |, %).
  if (!(isPureNumber && trimmed === str)) {
    let startIdx = 0;
    while (startIdx < str.length) {
      const code = str.charCodeAt(startIdx);
      if ((code >= 0 && code <= 32) || code === 127) {
        startIdx++;
      } else {
        break;
      }
    }
    const trimmedControl = str.slice(startIdx);
    const hasLeadingTrigger = /^[=+\-@|%]/.test(str);
    const hasTriggerAfterWhitespace =
      trimmedControl.length > 0 && /^[=+\-@|%]/.test(trimmedControl);

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
 * Comprehensive DOM-based SVG sanitizer (CHARTS-M3-02).
 * Uses DOM traversal as the primary security boundary:
 * 1. Removes all executable or active elements: script, foreignObject, iframe,
 *    object, embed, audio, video, animate, set, animateTransform, animateMotion.
 * 2. Neutralizes <style> elements containing @import, expression(), or external url() references.
 * 3. Strips all inline event handlers (on* attributes in any case/namespace).
 * 4. Sanitizes href / xlink:href attributes against javascript:, vbscript:,
 *    data:text/*, data:image/svg+xml, and non-local <use> targets.
 * 5. Sanitizes inline style attributes against external url() and expression().
 * 6. Validates both root <svg> element and all descendants while preserving
 *    legitimate chart presentation attributes and local fragment gradient fills.
 */
function sanitizeSVGElement(svg: SVGElement): void {
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

        // For <use> elements, restrict href to local fragment references (#id)
        if (el.tagName.toLowerCase() === 'use' && !trimmedVal.startsWith('#')) {
          el.removeAttribute(attr);
          continue;
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

export function exportToSVG(
  svgElement: SVGElement,
  filename = 'chart.svg'
): string {
  let targetSvg: SVGElement = svgElement;

  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof svgElement.cloneNode === 'function'
  ) {
    const clone = svgElement.cloneNode(true) as SVGElement;

    if (typeof window.getComputedStyle === 'function') {
      const origEls = [
        svgElement,
        ...Array.from(svgElement.querySelectorAll('*')),
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
      typeof svgElement.getBoundingClientRect === 'function'
        ? svgElement.getBoundingClientRect()
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

    // Comprehensive DOM-based security sanitization (CHARTS-M3-02)
    sanitizeSVGElement(clone);

    targetSvg = clone;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(targetSvg);

  // Defense-in-depth string-level filter against script injection
  source = source.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const bbox =
    typeof svgElement.getBoundingClientRect === 'function'
      ? svgElement.getBoundingClientRect()
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
      const w = bbox.width || 600;
      const h = bbox.height || 300;
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
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
