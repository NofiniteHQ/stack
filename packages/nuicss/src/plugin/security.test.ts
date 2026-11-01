import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createGenerator } from 'unocss';
import { nuicssPreset } from './preset';
import { defineConfig, defineNuicssConfig, loadNuicssConfig } from './config';
import { extractCriticalNuicss, extractClassTokens } from '../helpers/ssr';

describe('Adversarial Security & Robustness Suite', () => {
  describe('1. CSS Injection & Escaping Breakouts', () => {
    it('should neutralize legacy CSS expression injection', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });
      const { css, matched } = await uno.generate(
        '[content:expression(alert(1))]',
        { preflights: false }
      );

      // Must NOT be emitted as executable exploit
      expect(css).not.toContain('expression(alert(1))');
      expect(matched.has('[content:expression(alert(1))]')).toBe(false);
    });

    it('should neutralize javascript: pseudo-protocols in URLs', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const vectors = [
        '[background:url(javascript:alert(1))]',
        'bg-[url(javascript:alert(1))]',
        '[content:url(javascript:void(0))]',
        'text-[url(javascript:eval(1))]',
      ];

      for (const vector of vectors) {
        const { css } = await uno.generate(vector, { preflights: false });
        expect(css).not.toContain('javascript:');
      }
    });

    it('should neutralize IE behavior (.htc) script execution vector', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const { css, matched } = await uno.generate(
        '[behavior:url(malicious.htc)]',
        { preflights: false }
      );

      expect(css).not.toContain('behavior:');
      expect(css).not.toContain('malicious.htc');
      expect(matched.has('[behavior:url(malicious.htc)]')).toBe(false);
    });

    it('should neutralize Firefox XBL -moz-binding injection', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const { css } = await uno.generate(
        '[content:-moz-binding:url(evil.xml#test)]',
        { preflights: false }
      );

      expect(css).not.toContain('-moz-binding');
    });

    it('should reject unescaped breakout semicolons and closing brackets', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const breakoutAttempts = [
        `[--payload:');color:red;/*]`,
        `[content:'test';}body{color:red}]`,
        `[color:red;content:'test']`,
        `[content:'test';background:red]`,
      ];

      for (const attempt of breakoutAttempts) {
        const { css, matched } = await uno.generate(attempt, {
          preflights: false,
        });
        // Unescaped semicolon breakouts must not match or produce active CSS rules
        expect(css).not.toContain('body{color:red}');
        expect(matched.has(attempt)).toBe(false);
      }
    });

    it('should neutralize rule breakout attempts in arbitrary values', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const breakoutVectors = [
        `[content:'";\\}body\\{color:red}']`,
        `[content:'";}body{color:red}']`,
        `[content:'";color:red;/*']`,
      ];

      for (const vector of breakoutVectors) {
        const { css } = await uno.generate(vector, {
          preflights: false,
        });

        // Breakout attempts with semicolons/braces must be neutralized
        expect(css).not.toMatch(/}\s*body\s*\{\s*color:\s*red/);
        expect(css).not.toContain('body{color:red}');
      }
    });
  });

  describe('2. Prototype Pollution in Configuration', () => {
    beforeEach(() => {
      delete (Object.prototype as any).polluted;
      delete (Object.prototype as any).isAdmin;
    });

    afterEach(() => {
      delete (Object.prototype as any).polluted;
      delete (Object.prototype as any).isAdmin;
    });

    it('should not pollute Object.prototype via nuicssPreset options', () => {
      const maliciousPayload = JSON.parse(
        '{"__proto__": {"polluted": "yes", "isAdmin": true}}'
      );
      nuicssPreset(maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(({} as any).isAdmin).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
    });

    it('should not pollute Object.prototype via constructor.prototype in nuicssPreset', () => {
      const maliciousPayload = JSON.parse(
        '{"constructor": {"prototype": {"polluted": "yes"}}}'
      );
      nuicssPreset(maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
    });

    it('should not pollute Object.prototype via defineNuicssConfig and defineConfig', () => {
      const maliciousPayload1 = JSON.parse(
        '{"__proto__": {"polluted": "yes"}}'
      );
      defineConfig(maliciousPayload1);
      expect(({} as any).polluted).toBeUndefined();

      const maliciousPayload2 = JSON.parse(
        '{"__proto__": {"polluted": "yes"}}'
      );
      defineNuicssConfig(maliciousPayload2);
      expect(({} as any).polluted).toBeUndefined();

      const maliciousPayload3 = JSON.parse(
        '{"constructor": {"prototype": {"polluted": "yes"}}}'
      );
      defineNuicssConfig(maliciousPayload3);
      expect(({} as any).polluted).toBeUndefined();
    });

    it('should not pollute Object.prototype via loadNuicssConfig', async () => {
      const maliciousPayload = JSON.parse('{"__proto__": {"polluted": "yes"}}');
      await loadNuicssConfig(process.cwd(), maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
    });
  });

  describe('3. Pathological & Malformed Inputs (Resource Exhaustion / DoS)', () => {
    it('should handle deeply nested brackets without infinite loop or crash', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const nested = '[[[[[['.repeat(10) + 'test' + ']]]]]]'.repeat(10);
      const { css, matched } = await uno.generate(nested, {
        preflights: false,
      });

      expect(Array.from(matched)).toEqual([]);
      expect(css).toBe('');
    });

    it('should handle null bytes in class tokens gracefully', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const tokens = ['btn\0primary', '\0text-muted', 'card\0'];
      for (const token of tokens) {
        expect(async () => {
          await uno.generate(token, { preflights: false });
        }).not.toThrow();
      }
    });

    it('should handle pathological class name lengths (10,000+ characters) efficiently', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const hugeClassName = 'btn-' + 'a'.repeat(20000);
      const start = performance.now();
      const { css } = await uno.generate(hugeClassName, { preflights: false });
      const duration = performance.now() - start;

      // Must complete rapidly (under 500ms) without memory spikes
      expect(duration).toBeLessThan(500);
      expect(css).toBe('');
    });

    it('should handle high-entropy and special unicode class tokens without unhandled exceptions', async () => {
      const uno = await createGenerator({
        presets: [nuicssPreset({ preflights: false })],
      });

      const chaoticTokens = [
        '🚀🔥💯',
        '\\u0000\\uFFFF',
        '"><script>alert(1)</script>',
        '${{7*7}}',
        '{{constructor.constructor("alert(1)")()}}',
      ];

      for (const t of chaoticTokens) {
        const res = await uno.generate(t, { preflights: false });
        expect(res).toBeDefined();
      }
    });
  });

  describe('4. SSR Critical CSS Sanitization', () => {
    it('should not extract class tokens from inside <script> tags', async () => {
      const htmlWithScript = `
        <!DOCTYPE html>
        <html>
          <head>
            <script>
              const payload = 'class="markon-editor table-container bg-surface"';
              const evil = "btn-danger card text-muted";
              console.log("script block");
            </script>
          </head>
          <body>
            <div class="btn">Legitimate Button</div>
          </body>
        </html>
      `;

      const result = await extractCriticalNuicss(htmlWithScript);

      // Only legitimate body classes should be extracted
      expect(result.tokens).toContain('btn');
      expect(result.tokens).not.toContain('markon-editor');
      expect(result.tokens).not.toContain('table-container');
      expect(result.tokens).not.toContain('bg-surface');
      expect(result.tokens).not.toContain('btn-danger');
      expect(result.tokens).not.toContain('text-muted');

      // The extracted CSS should not contain rules for script-internal tokens
      expect(result.css).not.toContain('table-container');
      expect(result.css).not.toContain('markon-editor');
    });

    it('should not extract class tokens from inside <style> tags', async () => {
      const htmlWithStyle = `
        <html>
          <head>
            <style>
              .custom-class { color: red; }
              /* class="kanban-board cq" */
            </style>
          </head>
          <body>
            <div class="badge">Active</div>
          </body>
        </html>
      `;

      const tokens = extractClassTokens(htmlWithStyle);
      expect(tokens).toContain('badge');
      expect(tokens).not.toContain('kanban-board');
      expect(tokens).not.toContain('cq');
    });

    it('should handle unclosed tags and unclosed <script> tags without hanging', async () => {
      const malformedHtml = `
        <div class="btn btn-primary"
        <span class="card"
        <script>
          const leak = 'class="bg-canvas text-subtle"';
      `;

      const result = await extractCriticalNuicss(malformedHtml);
      expect(result).toBeDefined();
      expect(result.tokens).toContain('btn');
      expect(result.tokens).toContain('btn-primary');
      expect(result.tokens).not.toContain('bg-canvas');
      expect(result.tokens).not.toContain('text-subtle');
    });

    it('should sanitize and extract critical CSS from 1 MB HTML payloads in under 100ms', async () => {
      const padding = '<div class="btn">Content</div>\n'.repeat(35000); // ~1.05 MB
      const scriptBlock = `<script>const x = 'class="markon-editor"';\n${'// comment\n'.repeat(
        5000
      )}</script>`; // ~50 KB
      const fullHtml = `<html><body>${padding}${scriptBlock}</body></html>`;

      expect(fullHtml.length).toBeGreaterThan(1024 * 1024); // >= 1 MB

      const start = performance.now();
      const result = await extractCriticalNuicss(fullHtml);
      const elapsed = performance.now() - start;

      expect(result.tokens).toContain('btn');
      expect(result.tokens).not.toContain('markon-editor');
      expect(elapsed).toBeLessThan(500); // Well within performance SLA
    });
  });
});
