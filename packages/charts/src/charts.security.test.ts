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
            { label: '-cmd|calc', y: 300 },
            { label: 'Normal "Quoted" Label', y: 400 },
          ],
        },
      ];

      const csv = exportToCSV(maliciousSeries as any, '');

      // Formula triggers must be prefixed with a single quote (') to prevent DDE execution
      expect(csv).toContain("\"'=cmd|' /C calc'!A0\"");
      expect(csv).toContain('"\'@SUM(1+1)",100');
      expect(csv).toContain('"\'+cmd|exploit",200');
      expect(csv).toContain('"\'-cmd|calc",300');

      // RFC 4180 double-quote escaping: internal quotes must be doubled
      expect(csv).toContain('"Normal ""Quoted"" Label",400');

      // Must not contain raw un-neutralized formula headers
      expect(csv).not.toContain('"=cmd');
      expect(csv).not.toContain('"@SUM');
    });

    it('CHARTS-M3-01: neutralizes CSV formula triggers preceded by whitespace, tabs, carriage returns, or control characters', () => {
      const maliciousSeries = [
        {
          name: '   =cmd|exploit',
          data: [
            { label: '\t=SUM(1+1)', y: 10 },
            { label: '\r=2+2', y: 20 },
            { label: '\n=3+3', y: 30 },
            { label: '\x00=4+4', y: 40 },
            { label: '|calc|exploit', y: 50 },
            { label: '%TOTAL_FORMULA', y: 60 },
          ],
        },
      ];

      const csv = exportToCSV(maliciousSeries as any, '');

      // All formula triggers preceded by whitespace or control chars must be prefixed with single quote (')
      expect(csv).toContain('"\'   =cmd|exploit"');
      expect(csv).toContain('"\'\t=SUM(1+1)",10');
      expect(csv).toContain('"\'\r=2+2",20');
      expect(csv).toContain('"\'\n=3+3",30');
      expect(csv).toContain('"\'\x00=4+4",40');
      expect(csv).toContain('"\'|calc|exploit",50');
      expect(csv).toContain('"\'%TOTAL_FORMULA",60');
    });

    it('CHARTS-M3-01: preserves genuine numeric values and RFC 4180 delimiters while escaping quotes and line breaks', () => {
      const series = [
        {
          name: 'Series "A", with, commas and \n newlines',
          data: [
            { label: '-50', y: -50 }, // Genuine negative number
            { label: '+12.5', y: 12.5 }, // Genuine positive float
            { label: '0', y: 0 }, // Zero
            { label: '-cmd|not-a-number', y: -99.9 }, // String with - trigger vs number
            { label: 'Empty and Null Tests', y: null as any },
          ],
        },
      ];

      const csv = exportToCSV(series as any, '');

      // Genuine numeric data points must be emitted as raw numbers (not quoted formulas)
      expect(csv).toContain(',-50');
      expect(csv).toContain(',12.5');
      expect(csv).toContain(',0');
      expect(csv).toContain(',-99.9');

      // Genuine numeric string "-50" preserved without quote prefix
      expect(csv).toContain('"-50",-50');

      // String starting with "-" that is NOT a pure number must be neutralized
      expect(csv).toContain('"\'-cmd|not-a-number",-99.9');

      // RFC 4180: quotes in series name must be doubled
      expect(csv).toContain('"Series ""A"", with, commas and \n newlines"');
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

    it('CHARTS-M3-02: neutralizes CSS @import, external url(), animation elements, case variations, and active data URIs', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '600');
      svg.setAttribute('height', '400');
      // Root element with mixed-case event handler
      svg.setAttribute('ONLOAD', 'alert("root-xss")');

      // 1. Malicious <style> with @import
      const badStyle1 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'style'
      );
      badStyle1.textContent = '@import url("https://evil.com/leak.css");';
      svg.appendChild(badStyle1);

      // 2. Malicious <style> with external url() tracking
      const badStyle2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'style'
      );
      badStyle2.textContent =
        'body { background: url("http://evil.com/tracker.png"); }';
      svg.appendChild(badStyle2);

      // 3. Legitimate <style> with clean chart classes (must be preserved)
      const goodStyle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'style'
      );
      goodStyle.textContent = '.chart-line { stroke: #3b82f6; fill: none; }';
      svg.appendChild(goodStyle);

      // 4. SVG Animation elements (<animate>, <set>)
      const animateEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );
      animateEl.setAttribute('attributeName', 'href');
      animateEl.setAttribute('values', 'javascript:alert(1)');
      svg.appendChild(animateEl);

      const setEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'set'
      );
      setEl.setAttribute('attributeName', 'onload');
      setEl.setAttribute('to', 'alert(1)');
      svg.appendChild(setEl);

      // 5. Active SVG data URI in <image>
      const imageEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'image'
      );
      imageEl.setAttribute(
        'href',
        'data:image/svg+xml;utf8,<svg onload="alert(1)"></svg>'
      );
      svg.appendChild(imageEl);

      // 6. External <use> element reference
      const useExternal = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
      useExternal.setAttribute('href', 'https://evil.com/icons.svg#icon');
      svg.appendChild(useExternal);

      // 7. Legitimate local <use> reference (must be preserved)
      const useLocal = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
      useLocal.setAttribute('href', '#local-marker');
      svg.appendChild(useLocal);

      // 8. Legitimate gradient fill with local fragment reference (must be preserved)
      const rectLocalGradient = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rectLocalGradient.setAttribute('fill', 'url(#blue-gradient)');
      svg.appendChild(rectLocalGradient);

      // 9. Element with inline style using external url()
      const rectBadStyle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rectBadStyle.setAttribute(
        'style',
        'background: url("http://evil.com/x"); fill: red;'
      );
      svg.appendChild(rectBadStyle);

      // 10. Namespace variation (xlink:HREF with javascript)
      const linkXlink = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'a'
      );
      linkXlink.setAttribute('xlink:href', 'javascript:alert(99)');
      svg.appendChild(linkXlink);

      const exportedSvg = exportToSVG(svg, '');

      // Verify all active vectors stripped
      expect(exportedSvg).not.toContain('root-xss');
      expect(exportedSvg).not.toContain('ONLOAD');
      expect(exportedSvg).not.toContain('@import');
      expect(exportedSvg).not.toContain('evil.com');
      expect(exportedSvg).not.toContain('<animate');
      expect(exportedSvg).not.toContain('<set');
      expect(exportedSvg).not.toContain('data:image/svg+xml');
      expect(exportedSvg).not.toContain('javascript:');

      // Verify legitimate chart visual elements preserved
      expect(exportedSvg).toContain(
        '.chart-line { stroke: #3b82f6; fill: none; }'
      );
      expect(exportedSvg).toContain('href="#local-marker"');
      expect(exportedSvg).toContain('fill="url(#blue-gradient)"');
    });
  });
});
