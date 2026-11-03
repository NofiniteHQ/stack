// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { jsonToHtml, renderMarkon } from './core/renderer';
import { sanitizeUrl, sanitizeHtml } from './index';
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
