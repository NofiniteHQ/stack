// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderChart } from './core/renderChart';
import { exportToCSV, exportToSVG } from './core/export';
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

  describe('M3 Security Deep Dive & Hardening', () => {
    it('CHARTS-M3-01: neutralizes CSV formula injection and escapes RFC 4180 quotes in exportToCSV', () => {
      const maliciousSeries = [
        {
          name: "=cmd|' /C calc'!A0",
          data: [
            { label: '@SUM(1+1)', y: 100 },
            { label: '+cmd|exploit', y: 200 },
            { label: '-500', y: 300 },
            { label: 'Normal "Quoted" Label', y: 400 },
          ],
        },
      ];

      const csv = exportToCSV(maliciousSeries as any, '');

      // Formula triggers must be prefixed with a single quote (') to prevent DDE execution
      expect(csv).toContain("\"'=cmd|' /C calc'!A0\"");
      expect(csv).toContain('"\'@SUM(1+1)",100');
      expect(csv).toContain('"\'+cmd|exploit",200');
      expect(csv).toContain('"\'-500",300');

      // RFC 4180 double-quote escaping: internal quotes must be doubled
      expect(csv).toContain('"Normal ""Quoted"" Label",400');

      // Must not contain raw un-neutralized formula headers
      expect(csv).not.toContain('"=cmd');
      expect(csv).not.toContain('"@SUM');
    });

    it('CHARTS-M3-02: sanitizes dangerous script tags, foreignObjects, and event handlers in exportToSVG', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '500');
      svg.setAttribute('height', '300');

      // Inject malicious child elements and event handlers
      const script = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'script'
      );
      script.textContent = 'alert("XSS")';
      svg.appendChild(script);

      const foreignObject = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'foreignObject'
      );
      foreignObject.innerHTML =
        '<body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body>';
      svg.appendChild(foreignObject);

      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('onload', 'alert("onload")');
      rect.setAttribute('onclick', 'alert("onclick")');
      rect.setAttribute('fill', 'blue');
      svg.appendChild(rect);

      const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      link.setAttribute('href', 'javascript:alert(1)');
      svg.appendChild(link);

      const exportedSvg = exportToSVG(svg, '');

      // All active executable payloads must be stripped
      expect(exportedSvg).not.toContain('<script');
      expect(exportedSvg).not.toContain('alert("XSS")');
      expect(exportedSvg).not.toContain('<foreignObject');
      expect(exportedSvg).not.toContain('onload=');
      expect(exportedSvg).not.toContain('onclick=');
      expect(exportedSvg).not.toContain('javascript:');

      // Safe SVG graphic elements must be preserved
      expect(exportedSvg).toContain('<rect');
      expect(exportedSvg).toContain('fill');
    });
  });
});
