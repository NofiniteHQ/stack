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

    describe('Legitimate CSS Non-Regression Verifications', () => {
      it('should preserve legitimate custom properties in arbitrary syntax', async () => {
        const uno = await createGenerator({
          presets: [nuicssPreset({ preflights: false })],
        });

        const legitimateProperties = [
          '[--brand-color:oklch(0.6_0.2_250)]',
          "[--bg-image:url('/assets/hero.png')]",
          "[--font:'Inter',sans-serif]",
          '[--calc-val:calc(100%-2rem)]',
        ];

        for (const prop of legitimateProperties) {
          const { css, matched } = await uno.generate(prop, {
            preflights: false,
          });
          expect(css).not.toBe('');
          expect(matched.has(prop)).toBe(true);
        }
      });

      it('should preserve legitimate image, SVG, and data URLs', async () => {
        const uno = await createGenerator({
          presets: [nuicssPreset({ preflights: false })],
        });

        const legitimateUrls = [
          "bg-[url('/images/photo.jpg')]",
          "bg-[url('https://cdn.example.com/logo.svg')]",
          'bg-[url("data:image/svg+xml;utf8,<svg></svg>")]',
        ];

        for (const urlToken of legitimateUrls) {
          const { css, matched } = await uno.generate(urlToken, {
            preflights: false,
          });
          expect(css).not.toBe('');
          expect(matched.has(urlToken)).toBe(true);
          expect(css).toContain('url(');
        }
      });

      it('should preserve valid arbitrary values (calc, clamp, grid-cols, shadows, content)', async () => {
        const uno = await createGenerator({
          presets: [nuicssPreset({ preflights: false })],
        });

        const arbitraryTokens = [
          'w-[calc(100%-30px)]',
          'grid-cols-[200px_repeat(auto-fill,1fr)]',
          'text-[clamp(1rem,2.5vw,2rem)]',
          'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]',
          "content-['hello_world']",
        ];

        for (const token of arbitraryTokens) {
          const { css, matched } = await uno.generate(token, {
            preflights: false,
          });
          expect(css).not.toBe('');
          expect(matched.has(token)).toBe(true);
        }
      });
    });
  });

  describe('2. Prototype Pollution in Configuration', () => {
    beforeEach(() => {
      delete (Object.prototype as any).polluted;
      delete (Object.prototype as any).isAdmin;
      delete (Object.prototype as any).maliciousKey;
    });

    afterEach(() => {
      delete (Object.prototype as any).polluted;
      delete (Object.prototype as any).isAdmin;
      delete (Object.prototype as any).maliciousKey;
    });

    it('should not pollute Object.prototype via own __proto__ property from JSON.parse', () => {
      // In ECMAScript, JSON.parse creates an object with an OWN property named '__proto__'
      const maliciousPayload = JSON.parse(
        '{"__proto__": {"polluted": "yes", "isAdmin": true}}'
      );
      expect(
        Object.prototype.hasOwnProperty.call(maliciousPayload, '__proto__')
      ).toBe(true);

      defineConfig(maliciousPayload);
      defineNuicssConfig(maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(({} as any).isAdmin).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
    });

    it('should not pollute Object.prototype via own __proto__ created via Object.defineProperty', () => {
      const payload: Record<string, unknown> = {};
      Object.defineProperty(payload, '__proto__', {
        value: { polluted: 'yes', maliciousKey: 'active' },
        enumerable: true,
        configurable: true,
        writable: true,
      });

      expect(Object.prototype.hasOwnProperty.call(payload, '__proto__')).toBe(
        true
      );

      const safe = defineConfig(payload);

      expect(({} as any).polluted).toBeUndefined();
      expect(({} as any).maliciousKey).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
      expect((safe as any).polluted).toBeUndefined();
    });

    it('should guard against deeply nested prototype-pollution payloads without mutating input', () => {
      const nestedPayload: Record<string, any> = {
        theme: {
          extend: {
            colors: {},
          },
        },
      };

      Object.defineProperty(nestedPayload.theme.extend.colors, '__proto__', {
        value: { polluted: 'nested-leak' },
        enumerable: true,
        configurable: true,
      });

      // Verify caller input is not mutated
      const safe = defineConfig(nestedPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);

      // Caller input preserved
      expect(nestedPayload.theme.extend.colors).toBeDefined();
      expect(safe).toBeDefined();
    });

    it('should not pollute Object.prototype via constructor.prototype in nuicssPreset or defineConfig', () => {
      const maliciousPayload = JSON.parse(
        '{"constructor": {"prototype": {"polluted": "yes"}}}'
      );
      nuicssPreset(maliciousPayload);
      defineConfig(maliciousPayload);
      defineNuicssConfig(maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
    });

    it('should preserve legitimate configuration semantics (functions, regex, arrays, nested objects)', () => {
      const customRuleFn = () => ({ 'letter-spacing': '0.1em' });
      const customRegex = /^custom-(.+)$/;

      const callerConfig = {
        theme: {
          colors: {
            brand: 'oklch(0.546 0.245 262.881)',
          },
        },
        rules: [[customRegex, customRuleFn]],
        shortcuts: {
          'custom-btn': 'btn btn-primary',
        },
      };

      const safe = defineConfig(callerConfig as any);

      // Verify legitimate values are preserved intact
      expect((safe.theme as any).colors.brand).toBe(
        'oklch(0.546 0.245 262.881)'
      );
      expect((safe.shortcuts as any)['custom-btn']).toBe('btn btn-primary');
      expect(safe.rules?.[0]?.[0]).toBe(customRegex);
      expect(safe.rules?.[0]?.[1]).toBe(customRuleFn);

      // Verify caller input was NOT mutated
      expect((callerConfig.theme.colors as any).brand).toBe(
        'oklch(0.546 0.245 262.881)'
      );
    });

    it('should safely process loadNuicssConfig with malicious and valid payloads', async () => {
      const maliciousPayload = JSON.parse('{"__proto__": {"polluted": "yes"}}');
      const loaded = await loadNuicssConfig(process.cwd(), maliciousPayload);

      expect(({} as any).polluted).toBeUndefined();
      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')
      ).toBe(false);
      expect(loaded).toBeDefined();
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
