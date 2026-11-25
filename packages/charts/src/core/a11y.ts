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
 * @nofinite/charts - Accessibility (a11y) Engine
 * Provides WCAG 2.1 AA screen-reader data tables and aria descriptions.
 */

import type { ChartSeries } from './math';
import { formatMetricNumber } from './axis';
import { normalizeData } from './normalize';
import { escapeHtml as utilsEscapeHtml } from '@nofinite/utils';

export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return utilsEscapeHtml(String(str));
}

export interface A11yOptions {
  title?: string;
  description?: string;
}

export function generateA11yTableHtml<T = unknown>(
  seriesList: ChartSeries<T>[],
  options?: A11yOptions
): string {
  if (!seriesList || seriesList.length === 0) return '';

  const title = options?.title || 'Data visualization summary table';
  const description =
    options?.description || 'Semantic table representation for screen readers.';

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

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

  const activeSeries = normalizedSeries.filter((s) => !s.hidden);

  return `
    <div class="sr-only chart-a11y-container" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;" aria-live="polite">
      <table class="nui-chart-sr-table chart-sr-table" aria-label="${safeTitle}">
        <caption>${safeTitle}. ${safeDescription}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            ${activeSeries
              .map((s) => `<th scope="col">${escapeHtml(s.name)}</th>`)
              .join('')}
          </tr>
        </thead>
        <tbody>
          ${xLabels
            .map(
              (xLabel) => `
            <tr>
              <th scope="row">${escapeHtml(xLabel)}</th>
              ${activeSeries
                .map((s) => {
                  const pt = s.data.find((d) => d.label === xLabel);
                  const val = pt
                    ? typeof pt.y === 'number'
                      ? formatMetricNumber(pt.y)
                      : pt.y
                    : '-';
                  return `<td>${escapeHtml(val)}</td>`;
                })
                .join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `.trim();
}
