// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { renderChart } from './core/renderChart';
import {
  exportToCSV,
  exportToSVG,
  exportToPNG,
  sanitizeCSVCell,
  sanitizeSVGElement,
  sanitizeSVGString,
} from './core/export';
import { parseSafeColor, parseSafeStrokeDasharray } from './core/color';
import { renderTooltipHtml } from './core/tooltip';
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

    it('CHARTS-M3-03: parseSafeColor allows valid colors and rejects CSS injection vectors', () => {
      // 1. Valid color representations
      expect(parseSafeColor('#fff')).toBe('#fff');
      expect(parseSafeColor('#3b82f6')).toBe('#3b82f6');
      expect(parseSafeColor('#3b82f680')).toBe('#3b82f680');
      expect(parseSafeColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(parseSafeColor('rgba(59, 130, 246, 0.5)')).toBe(
        'rgba(59, 130, 246, 0.5)'
      );
      expect(parseSafeColor('hsl(217, 91%, 60%)')).toBe('hsl(217, 91%, 60%)');
      expect(parseSafeColor('oklch(0.7 0.15 150)')).toBe('oklch(0.7 0.15 150)');
      expect(parseSafeColor('var(--color-primary)')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor('var(--chart-1, #3b82f6)')).toBe(
        'var(--chart-1, #3b82f6)'
      );
      expect(parseSafeColor('transparent')).toBe('transparent');
      expect(parseSafeColor('currentColor')).toBe('currentColor');

      // 2. CSS injection and exfiltration payloads must fall back to var(--color-primary)
      expect(
        parseSafeColor('red; background: url("http://evil.com/leak")')
      ).toBe('var(--color-primary)');
      expect(parseSafeColor('red; } body { background: black }')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor('url(http://attacker.com/leak)')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor('expression(alert(1))')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor('@import "leak.css"')).toBe('var(--color-primary)');
      expect(parseSafeColor('javascript:alert(1)')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor('<script>alert(1)</script>')).toBe(
        'var(--color-primary)'
      );
      expect(parseSafeColor(null)).toBe('var(--color-primary)');
      expect(parseSafeColor('')).toBe('var(--color-primary)');

      // 3. parseSafeStrokeDasharray validation
      expect(parseSafeStrokeDasharray('5,5')).toBe('5,5');
      expect(parseSafeStrokeDasharray('4 4')).toBe('4 4');
      expect(parseSafeStrokeDasharray('10, 5, 2, 5')).toBe('10, 5, 2, 5');
      expect(parseSafeStrokeDasharray('none')).toBe('none');
      expect(parseSafeStrokeDasharray('5; background: url(x)')).toBe('4,4');
      expect(parseSafeStrokeDasharray('invalid-string')).toBe('4,4');
    });

    it('CHARTS-M3-04: sanitizeCSVCell neutralizes Unicode fullwidth formula triggers and NBSP', () => {
      // 1. Unicode fullwidth formula triggers
      expect(sanitizeCSVCell('\uFF1D1+1')).toBe('"\'＝1+1"'); // Fullwidth equals
      expect(sanitizeCSVCell('\uFF0B2+2')).toBe('"\'＋2+2"'); // Fullwidth plus
      expect(sanitizeCSVCell('\uFF0D3+3')).toBe('"\'－3+3"'); // Fullwidth minus
      expect(sanitizeCSVCell('\uFF20SUM(A1)')).toBe('"\'＠SUM(A1)"'); // Fullwidth at

      // 2. Non-breaking space followed by trigger
      expect(sanitizeCSVCell('\u00A0=cmd|calc')).toBe('"\'\u00A0=cmd|calc"');

      // 3. Preserves genuine numbers
      expect(sanitizeCSVCell(-50)).toBe('-50');
      expect(sanitizeCSVCell(12.5)).toBe('12.5');
      expect(sanitizeCSVCell(0)).toBe('0');
      expect(sanitizeCSVCell('-50')).toBe('"-50"');
      expect(sanitizeCSVCell('+12.5')).toBe('"+12.5"');

      // 4. Strings that start with minus but are not pure numbers must be neutralized
      expect(sanitizeCSVCell('-cmd|calc')).toBe('"\'-cmd|calc"');
    });

    it('CHARTS-M3-05: sanitizeSVGElement strips dangerous href protocols and foreign resources on <use> and <a>', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      // External <use> element reference forbidden
      const badUse = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
      badUse.setAttribute('href', 'https://evil.com/icon.svg#test');
      svg.appendChild(badUse);

      // Local <use> reference allowed
      const goodUse = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
      goodUse.setAttribute('href', '#test-marker');
      svg.appendChild(goodUse);

      // External <a> link forbidden
      const badLink = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'a'
      );
      badLink.setAttribute('href', 'https://evil.com');
      svg.appendChild(badLink);

      // Javascript <a> link forbidden
      const jsLink = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'a'
      );
      jsLink.setAttribute('href', 'javascript:alert(1)');
      svg.appendChild(jsLink);

      sanitizeSVGElement(svg);

      expect(badUse.getAttribute('href')).toBeNull();
      expect(goodUse.getAttribute('href')).toBe('#test-marker');
      expect(badLink.getAttribute('href')).toBeNull();
      expect(jsLink.getAttribute('href')).toBeNull();
    });

    it('CHARTS-M3-06: sanitizeSVGString provides isomorphic defense-in-depth sanitization for SSR / headless exports', () => {
      const maliciousSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
          <script>stealData()</script>
          <foreignObject><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject>
          <rect width="100" height="50" fill="#3b82f6" onload="alert('rect-xss')" />
          <use href="https://evil.com/icons.svg#danger" />
          <use href="#safe-symbol" />
          <a href="javascript:alert(2)"><text>Click</text></a>
          <style>@import url("https://evil.com/leak.css");</style>
        </svg>
      `;

      const sanitized = sanitizeSVGString(maliciousSvgString);

      // Malicious elements and attributes stripped
      expect(sanitized).not.toContain('<script');
      expect(sanitized).not.toContain('stealData');
      expect(sanitized).not.toContain('<foreignObject');
      expect(sanitized).not.toContain('onload=');
      expect(sanitized).not.toContain('https://evil.com/icons.svg');
      expect(sanitized).not.toContain('javascript:alert');
      expect(sanitized).not.toContain('@import');

      // Safe elements preserved
      expect(sanitized).toContain('<rect');
      expect(sanitized).toContain('fill="#3b82f6"');
      expect(sanitized).toContain('href="#safe-symbol"');
    });

    it('CHARTS-M3-07: Tooltip rendering escapes series names, values, and colors in HTML tooltip markup', () => {
      const payload = {
        title: '<script>alert("title-xss")</script>',
        items: [
          {
            label: '<img src=x onerror=alert("label-xss")>',
            value: '<b onmouseover=alert("value-xss")>500</b>',
            color: 'red; background: url(https://evil.com/leak)',
          },
        ],
      };

      const html = renderTooltipHtml(payload);

      // Raw active tags must not exist
      expect(html).not.toContain('<script>alert("title-xss")</script>');
      expect(html).not.toContain('<img src=x onerror=alert("label-xss")>');
      expect(html).not.toContain('<b onmouseover=alert("value-xss")>');
      expect(html).not.toContain('url(https://evil.com/leak)');

      // Must be safely escaped
      expect(html).toContain(
        '&lt;script&gt;alert(&quot;title-xss&quot;)&lt;/script&gt;'
      );
      expect(html).toContain(
        '&lt;img src=x onerror=alert(&quot;label-xss&quot;)&gt;'
      );
      expect(html).toContain(
        '&lt;b onmouseover=alert(&quot;value-xss&quot;)&gt;500&lt;/b&gt;'
      );
      expect(html).toContain('var(--color-primary)');
    });

    it('CHARTS-M3-08: exportToPNG bounds scale multiplier and canvas dimensions to prevent DoS', async () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '500');
      svg.setAttribute('height', '300');

      // Create a spy to check dimensions passed to canvas
      let canvasW = 0;
      let canvasH = 0;
      const originalCreateElement = document.createElement.bind(document);

      vi.spyOn(document, 'createElement').mockImplementation(
        (tagName: string) => {
          if (tagName === 'canvas') {
            const fakeCanvas = {
              width: 0,
              height: 0,
              getContext: () => ({
                drawImage: () => undefined,
              }),
              toBlob: (cb: (blob: Blob | null) => void) => {
                canvasW = fakeCanvas.width;
                canvasH = fakeCanvas.height;
                cb(new Blob(['fake-png'], { type: 'image/png' }));
              },
            } as unknown as HTMLCanvasElement;
            return fakeCanvas;
          }
          return originalCreateElement(tagName);
        }
      );

      // Simulate Image onload
      const originalImage = globalThis.Image;
      globalThis.Image = class MockImage extends originalImage {
        set src(_val: string) {
          setTimeout(() => {
            if (this.onload) {
              (this.onload as any)(new Event('load'));
            }
          }, 0);
        }
      } as any;

      try {
        // Request massive scale 100x (DoS attempt)
        await exportToPNG(svg, '', 100);

        // Bounded by MAX_SCALE = 4 -> 600 * 4 = 2400 (or bounded to 8192)
        expect(canvasW).toBeLessThanOrEqual(8192);
        expect(canvasH).toBeLessThanOrEqual(8192);
        expect(canvasW).toBe(2400); // 600 default width * 4 maxScale
        expect(canvasH).toBe(1200); // 300 default height * 4 maxScale
      } finally {
        vi.restoreAllMocks();
        globalThis.Image = originalImage;
      }
    });
  });
});
