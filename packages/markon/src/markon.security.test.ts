// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { jsonToHtml, renderMarkon, extractTOC } from './core/renderer';
import {
  sanitizeUrl,
  sanitizeHtml,
  MARKON_DOMPURIFY_CONFIG,
  escapeHtml,
} from './index';
import { markdownToHtml } from './core/markdown';
import { renderLinkPopoverHtml } from './core/linkPopover';
import { isAllowedVideoEmbedUrl, VideoBlock } from './core/video';
import { FileAttachment } from './core/fileAttachment';
import { UploadPlaceholder } from './core/uploadPlaceholder';
import { MarkonEditor } from './react';
import { renderToString } from 'react-dom/server';
import React from 'react';

describe('MARKON Security & Remediation Regression Suite (M2)', () => {
  it('MARKON-M1-02: bounds AST recursion depth to prevent stack overflow DoS', () => {
    // Construct a deeply nested TipTap AST (500 levels deep)
    let deepAst: any = { type: 'text', text: 'Deep leaf text' };
    for (let i = 0; i < 500; i++) {
      deepAst = {
        type: 'blockquote',
        content: [deepAst],
      };
    }
    const rootDoc = {
      type: 'doc',
      content: [deepAst],
    };

    // Must execute cleanly without RangeError: Maximum call stack size exceeded
    expect(() => jsonToHtml(rootDoc)).not.toThrow();
    const result = jsonToHtml(rootDoc);
    expect(typeof result).toBe('string');
  });

  it('MARKON-M1-03: decodes HTML entities and blocks obfuscated javascript/vbscript/data URLs', () => {
    // Decimal entity-encoded javascript
    expect(sanitizeUrl('&#106;avascript:alert(1)')).toBe('#');
    // Hex entity-encoded javascript
    expect(sanitizeUrl('&#x6A;avascript:alert(1)')).toBe('#');
    // Obfuscated with whitespace and control characters
    expect(sanitizeUrl('java\0script:alert(1)')).toBe('#');
    // VBScript
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
    // Data HTML
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');

    // Safe protocols remain intact
    expect(sanitizeUrl('https://nofinite.com')).toBe('https://nofinite.com');
    expect(sanitizeUrl('mailto:security@nofinite.com')).toBe(
      'mailto:security@nofinite.com'
    );
    expect(sanitizeUrl('/docs/getting-started')).toBe('/docs/getting-started');
  });

  it('MARKON-M1-03: sanitizeHtml cleans entity-encoded hrefs and dangerous tags', () => {
    const dirty =
      '<a href="&#106;avascript:alert(1)">Click Me</a><script>evil()</script>';
    const cleaned = sanitizeHtml(dirty);

    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('javascript:');
    expect(cleaned).toContain('href="#"');
    expect(cleaned).toContain('Click Me');
  });

  it('MARKON-M1-05: verifies security sanitizers are re-exported at package root', () => {
    expect(typeof sanitizeUrl).toBe('function');
    expect(typeof sanitizeHtml).toBe('function');
    expect(typeof MARKON_DOMPURIFY_CONFIG).toBe('object');
    expect(typeof escapeHtml).toBe('function');
  });

  it('SSR: renders Markon publication and MarkonEditor cleanly to static HTML', () => {
    const result = renderMarkon({
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Markon Production Document' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Server rendered content block.' }],
          },
        ],
      },
      format: 'json',
      metadata: {
        title: 'SSR Article',
        author: 'Nofinite Team',
      },
    });

    expect(result.html).toBeTruthy();
    expect(result.html).toContain('Markon Production Document');
    expect(result.html).toContain('Server rendered content block.');

    const editorHtml = renderToString(
      React.createElement(MarkonEditor, {
        value: 'Hello SSR',
      })
    );
    expect(editorHtml).toBeTruthy();
  });
});

describe('Phase 3 Milestone 3 (Specialist S2) Markon Security Suite (MARKON-M3-01 to MARKON-M3-09)', () => {
  it('MARKON-M3-01: strips event handlers across slash delimiters, control chars, and whitespace variants', () => {
    const adversarialPayloads = [
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)></svg>',
      '<body onload=alert(1)>',
      '<div/onclick=alert(1)>Click</div>',
      '<div\tonclick=alert(1)>Click</div>',
      '<div\nonclick=alert(1)>Click</div>',
      '<div\ronclick=alert(1)>Click</div>',
      '<a\fonclick=alert(1)>Link</a>',
      '<img src="x" onerror="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<object data="javascript:alert(1)"></object>',
    ];

    for (const payload of adversarialPayloads) {
      const sanitized = sanitizeHtml(payload);
      expect(sanitized).not.toMatch(/<[a-z0-9_-]+\s+[^>]*\bon[a-z]+\s*=/i);
      expect(sanitized).not.toContain('alert(1)');
      expect(sanitized).not.toContain('<script');
      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).not.toContain('<object');
    }
  });

  it('MARKON-M3-02: UploadPlaceholder escapes name, errorMessage, and size preventing stored DOM XSS', () => {
    const maliciousName = '<img src=x onerror=alert("name-xss")>';
    const maliciousError = '<script>alert("error-xss")</script>';
    const maliciousSize = '12 KB" onmouseover="alert(1)';

    const nodeViewFn = (UploadPlaceholder.config as any).addNodeView?.();
    expect(typeof nodeViewFn).toBe('function');

    const view = nodeViewFn({
      node: {
        type: { name: 'uploadPlaceholder' },
        attrs: {
          name: maliciousName,
          status: 'error',
          errorMessage: maliciousError,
          size: maliciousSize,
        },
      },
      getPos: () => 0,
      editor: { isEditable: true, view: {} },
    });

    expect(view.dom).toBeDefined();
    // Zero child <img> or <script> elements injected by payload
    expect(view.dom.querySelector('img[src="x"]')).toBeNull();
    expect(view.dom.querySelector('script')).toBeNull();
    // Content is properly HTML entity-escaped
    expect(view.dom.innerHTML).toContain(
      '&lt;img src=x onerror=alert("name-xss")&gt;'
    );
    expect(view.dom.innerHTML).toContain(
      '&lt;script&gt;alert("error-xss")&lt;/script&gt;'
    );
  });

  it('MARKON-M3-03: fileAttachment neutralizes javascript: and data: text schemes in renderHTML and jsonToHtml', () => {
    const docWithJsAttachment = {
      type: 'doc',
      content: [
        {
          type: 'fileAttachment',
          attrs: {
            src: 'javascript:alert(document.cookie)',
            name: 'invoice.pdf',
            size: '240 KB',
          },
        },
      ],
    };

    const html = jsonToHtml(docWithJsAttachment);
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('href="#"');
    expect(html).toContain('invoice.pdf');

    // Extension renderHTML contract test
    const renderHtmlFn = (FileAttachment.config as any).renderHTML;
    const output = renderHtmlFn({
      node: {
        attrs: {
          src: 'javascript:alert(1)',
          name: 'payload.exe',
          size: '1 MB',
        },
      },
      HTMLAttributes: {},
    });
    // Locate anchor in ProseMirror DOM spec array
    const anchorSpec = output.find(
      (item: any) => Array.isArray(item) && item[0] === 'a'
    );
    expect(anchorSpec).toBeDefined();
    expect(anchorSpec[1].href).toBe('#');
  });

  it('MARKON-M3-04: videoBlock restricts iframes strictly to allowlisted domains and enforces sandbox', () => {
    // 1. URL allowlist validator verification
    expect(
      isAllowedVideoEmbedUrl(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
      )
    ).toBe(true);
    expect(
      isAllowedVideoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ).toBe(true);
    expect(isAllowedVideoEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    expect(
      isAllowedVideoEmbedUrl('https://player.vimeo.com/video/123456789')
    ).toBe(true);
    expect(isAllowedVideoEmbedUrl('https://vimeo.com/123456789')).toBe(true);

    // Untrusted domains rejected
    expect(isAllowedVideoEmbedUrl('https://attacker.com/malicious.html')).toBe(
      false
    );
    expect(isAllowedVideoEmbedUrl('https://evil-youtube.com/embed/x')).toBe(
      false
    );
    expect(isAllowedVideoEmbedUrl('javascript:alert(1)')).toBe(false);
    expect(
      isAllowedVideoEmbedUrl('data:text/html,<script>alert(1)</script>')
    ).toBe(false);

    // 2. jsonToHtml rejection of untrusted video sources
    const untrustedDoc = {
      type: 'doc',
      content: [
        {
          type: 'videoBlock',
          attrs: {
            src: 'https://attacker.com/exploit.html',
            service: 'youtube',
          },
        },
      ],
    };
    const untrustedHtml = jsonToHtml(untrustedDoc);
    expect(untrustedHtml).not.toContain('<iframe');
    expect(untrustedHtml).toContain('Invalid video source');

    // 3. jsonToHtml acceptance of trusted YouTube with sandbox attribute
    const trustedDoc = {
      type: 'doc',
      content: [
        {
          type: 'videoBlock',
          attrs: {
            src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            service: 'youtube',
          },
        },
      ],
    };
    const trustedHtml = jsonToHtml(trustedDoc);
    expect(trustedHtml).toContain('<iframe');
    expect(trustedHtml).toContain(
      'sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"'
    );
    expect(trustedHtml).toContain(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
    );

    // 4. Custom video tag with sanitized src
    const customDoc = {
      type: 'doc',
      content: [
        {
          type: 'videoBlock',
          attrs: {
            src: 'javascript:alert(1)',
            service: 'custom',
          },
        },
      ],
    };
    const customHtml = jsonToHtml(customDoc);
    expect(customHtml).toContain('<video src="#"');
    expect(customHtml).not.toContain('javascript:alert(1)');
  });

  it('MARKON-M3-05: markdownToHtml escapes image alt, title, and link href preventing attribute breakout', () => {
    // Image alt breakout attack
    const mdAltBreakout =
      '![malicious" onerror="alert(1)](https://example.com/pic.png)';
    const htmlAlt = markdownToHtml(mdAltBreakout);
    expect(htmlAlt).not.toContain('alt="malicious" onerror="alert(1)"');
    expect(htmlAlt).toContain('alt="malicious&quot; onerror=&quot;alert(1)"');

    // Image title breakout attack
    const mdTitleBreakout =
      '![alt](https://example.com/pic.png "title" onmouseover="alert(1)")';
    const htmlTitle = markdownToHtml(mdTitleBreakout);
    expect(htmlTitle).not.toContain('onmouseover="alert(1)"');

    // Link title breakout attack
    const mdLinkBreakout =
      '[click](https://example.com "link title" onclick="alert(1)")';
    const htmlLink = markdownToHtml(mdLinkBreakout);
    expect(htmlLink).not.toContain('onclick="alert(1)"');

    // Math block equation escaping
    const mdMath = '$$ <img src=x onerror=alert(1)> $$';
    const htmlMath = markdownToHtml(mdMath);
    expect(htmlMath).not.toContain('<img src=x');
    expect(htmlMath).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('MARKON-M3-06: link popover escapes href and display text preventing DOM XSS', () => {
    const popoverBreakout = '"><img src=x onerror=alert(1)>';
    const html = renderLinkPopoverHtml(popoverBreakout);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;');

    const jsUrl = 'javascript:alert("popover")';
    const jsHtml = renderLinkPopoverHtml(jsUrl);
    expect(jsHtml).toContain('href="#"');
    expect(jsHtml).not.toContain('href="javascript:');
  });

  it('MARKON-M3-07: sanitizeHtml strips unclosed <script> and <iframe> tags', () => {
    const unclosedScript = '<script src="https://evil.com/payload.js"';
    const cleanedScript = sanitizeHtml(unclosedScript);
    expect(cleanedScript).not.toContain('<script');
    expect(cleanedScript).not.toContain('evil.com');

    const unclosedIframe = '<iframe src="https://evil.com/embed"';
    const cleanedIframe = sanitizeHtml(unclosedIframe);
    expect(cleanedIframe).not.toContain('<iframe');
    expect(cleanedIframe).not.toContain('evil.com');
  });

  it('MARKON-M3-08: sanitizeHtml strips <style> tags and SVG animation vectors', () => {
    const styleAttack =
      '<style>body { background: black !important; }</style><p>Paragraph</p>';
    const cleanedStyle = sanitizeHtml(styleAttack);
    expect(cleanedStyle).not.toContain('<style');
    expect(cleanedStyle).not.toContain('background: black');
    expect(cleanedStyle).toContain('<p>Paragraph</p>');

    const svgAnimate =
      '<svg><animate onbegin="alert(1)" attributeName="x"/></svg>';
    const cleanedAnimate = sanitizeHtml(svgAnimate);
    expect(cleanedAnimate).not.toContain('<animate');
    expect(cleanedAnimate).not.toContain('alert(1)');

    const svgSet =
      '<svg><set attributeName="onmouseover" to="alert(1)"/></svg>';
    const cleanedSet = sanitizeHtml(svgSet);
    expect(cleanedSet).not.toContain('<set');
  });

  it('MARKON-M3-09: extractTOC bounds recursion depth and detects cycles without stack overflow DoS', () => {
    // 1. Deep recursion test (7,000 levels)
    let deepNode: any = {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Deep Leaf Heading' }],
    };
    for (let i = 0; i < 7000; i++) {
      deepNode = {
        type: 'blockquote',
        content: [deepNode],
      };
    }
    const deepRoot = { type: 'doc', content: [deepNode] };

    expect(() => extractTOC(deepRoot)).not.toThrow();

    // 2. Cyclic AST test
    const cyclicHeading: any = {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Cyclic Node' }],
    };
    const cyclicParent: any = {
      type: 'blockquote',
      content: [cyclicHeading],
    };
    cyclicParent.content.push(cyclicParent); // Introduce cyclical reference

    expect(() => extractTOC(cyclicParent)).not.toThrow();
    const toc = extractTOC(cyclicParent);
    expect(toc.length).toBeGreaterThanOrEqual(1);
    expect(toc[0].text).toBe('Cyclic Node');
  });
});
