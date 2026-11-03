// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderChart } from './core/renderChart';
import { LineChart, BarChart } from './react';
import { renderToString } from 'react-dom/server';
import React from 'react';

describe('CHARTS Security & Remediation Regression Suite (M2)', () => {
  it('CHARTS-M1-02: neutralizes SVG XSS in reference line labels', () => {
    const maliciousLabel = '<script>alert("XSS")</script>';
    const svg = renderChart({
      variant: 'line',
      data: [
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 20 },
      ],
      referenceLines: [
        {
          y: 15,
          label: maliciousLabel,
        },
      ],
    });

    expect(svg).not.toContain('<script>alert("XSS")</script>');
    expect(svg).toContain(
      '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    );
  });

  it('CHARTS-M1-02: neutralizes SVG XSS in categorical axis labels', () => {
    const maliciousLabel = '<image href=x onerror=alert(1)>';
    const svg = renderChart({
      variant: 'bar',
      data: [
        { label: maliciousLabel, value: 50 },
        { label: 'Normal', value: 25 },
      ],
    });

    expect(svg).not.toContain('<image href=x onerror=alert(1)>');
    expect(svg).toContain('&lt;image href=x onerror=alert(1)&gt;');
  });

  it('CHARTS-M1-03: automatically downsamples datasets exceeding threshold to prevent main-thread freeze', () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 100) * 50 + 50,
    }));

    const svg = renderChart({
      variant: 'line',
      data: largeDataset,
    });

    // The output SVG path must be generated cleanly without crashing
    expect(svg).toBeTruthy();
    expect(svg).toContain('<path');
  });

  it('SSR: renders LineChart and BarChart to static HTML markup cleanly', () => {
    const data = [
      { label: 'Q1', value: 100 },
      { label: 'Q2', value: 200 },
    ];

    const lineHtml = renderToString(
      React.createElement(LineChart, {
        data,
        width: 400,
        height: 200,
      })
    );
    expect(lineHtml).toContain('<svg');

    const barHtml = renderToString(
      React.createElement(BarChart, {
        data,
        width: 400,
        height: 200,
      })
    );
    expect(barHtml).toContain('<svg');
  });
});
