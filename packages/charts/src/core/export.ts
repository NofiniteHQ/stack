/**
 * @nofinite/charts - Data & Chart Export Utilities
 * Export charts to CSV, SVG, or PNG format.
 */

import type { ChartSeries } from './math';
import { normalizeData } from './normalize';

/**
 * Sanitizes a CSV cell to neutralize CSV Formula Injection / DDE Injection (CWE-1236)
 * and conforms to RFC 4180 double-quote escaping.
 *
 * Formula trigger characters (=, +, -, @, \t, \r, |) are prefixed with a single quote (')
 * so that spreadsheet programs (Excel, LibreOffice, Google Sheets) interpret them
 * strictly as string literals rather than executable expressions or DDE commands.
 */
function sanitizeCSVCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Neutralize formula trigger characters
  if (/^[=+\-@\t\r|]/.test(str)) {
    str = "'" + str;
  }

  // RFC 4180: escape internal double quotes by doubling them
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

    // Security sanitization (CHARTS-M3-02): Strip dangerous active elements & event handlers
    const dangerousEls = clone.querySelectorAll(
      'script, foreignObject, iframe, object, embed, audio, video'
    );
    for (let j = 0; j < dangerousEls.length; j++) {
      dangerousEls[j]?.remove();
    }

    const allEls = [clone, ...Array.from(clone.querySelectorAll('*'))];
    for (const el of allEls) {
      if (el instanceof Element) {
        const attrNames =
          typeof el.getAttributeNames === 'function'
            ? el.getAttributeNames()
            : [];
        for (const attr of attrNames) {
          const lower = attr.toLowerCase();
          if (lower.startsWith('on')) {
            el.removeAttribute(attr);
          } else if (lower === 'href' || lower === 'xlink:href') {
            const val = el.getAttribute(attr) || '';
            if (/^\s*(javascript|vbscript|data:text\/html)/i.test(val)) {
              el.removeAttribute(attr);
            }
          }
        }
      }
    }

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
