/**
 * @nofinite/charts - Data & Chart Export Utilities
 * Export charts to CSV, SVG, or PNG format.
 */

import type { ChartSeries } from './math';
import { normalizeData } from './normalize';

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

  const headers = ['Category', ...seriesList.map((s) => `"${s.name}"`)];
  const rows: string[] = [headers.join(',')];

  for (const xLabel of xLabels) {
    const rowValues = [
      `"${xLabel}"`,
      ...normalizedSeries.map((s) => {
        const pt = s.data.find((d) => d.label === xLabel);
        return pt ? String(pt.y) : '';
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
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const bbox = svgElement.getBoundingClientRect();
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
      const bbox = svgElement.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.width = (bbox.width || 600) * scale;
      canvas.height = (bbox.height || 300) * scale;

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
