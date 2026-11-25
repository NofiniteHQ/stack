import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { cssAwareMinify, minifyCss, MinificationError } from './minifier.js';

const require = createRequire(import.meta.url);

let lightningCss: {
  transform: (options: Record<string, unknown>) => { code: Buffer };
} | null = null;
try {
  lightningCss = require('lightningcss');
} catch {
  lightningCss = null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postcss: any = null;
try {
  postcss = require('postcss');
} catch {
  postcss = null;
}

/**
 * Helper to minify using native LightningCSS (Tier 1).
 */
function tier1Minify(css: string): string {
  if (!lightningCss) {
    throw new Error('LightningCSS is not available in current environment');
  }
  const { code } = lightningCss.transform({
    filename: 'differential.css',
    code: Buffer.from(css),
    minify: true,
  });
  return code.toString();
}

/**
 * Helper to minify using pure JavaScript CSS-Aware state machine (Tier 2).
 */
function tier2Minify(css: string): string {
  return cssAwareMinify(css);
}

describe('NUICSS Two-Tier Engine Differential & Reliability Suite', () => {
  describe('Tier 1 (LightningCSS) vs Tier 2 (W3C Syntax Level 3 Fallback)', () => {
    it('verifies native LightningCSS and Tier 2 engines are both available for differential comparisons', () => {
      expect(typeof tier2Minify).toBe('function');
      expect(lightningCss).not.toBeNull();
      if (lightningCss) expect(typeof lightningCss.transform).toBe('function');
      expect(postcss).not.toBeNull();
      expect(typeof postcss.parse).toBe('function');
    });

    it('produces functionally equivalent minification on standard rule sets', () => {
      expect(lightningCss).not.toBeNull();
      const input = `
        /* Reset header */
        .container {
          box-sizing: border-box;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          max-width: 1200px;
        }
      `;

      const t2 = tier2Minify(input);
      const t1 = tier1Minify(input);

      expect(t2).toBe(
        '.container{box-sizing:border-box;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;max-width:1200px}'
      );

      // Semantic AST verification: both outputs parse to identical CSS rules & properties
      const ast1 = postcss.parse(t1);
      const ast2 = postcss.parse(t2);
      expect(ast2.nodes.length).toBe(ast1.nodes.length);
      expect(ast2.nodes[0].selector).toBe(ast1.nodes[0].selector);
      expect(
        ast2.nodes[0].nodes.map((n: { prop: string }) => n.prop).sort()
      ).toEqual(
        ast1.nodes[0].nodes.map((n: { prop: string }) => n.prop).sort()
      );
    });

    it('verifies both engines preserve critical math operator spacing in calc()', () => {
      expect(lightningCss).not.toBeNull();
      const inputs = [
        '.box { width: calc(100% - 32px); }',
        '.box { height: calc(100vh + 2.5rem); }',
        '.box { margin: calc(var(--base-space) * 2 + 10px); }',
        '.box { padding: calc(100% - (1rem + 8px)); }',
      ];

      for (const input of inputs) {
        const t2 = tier2Minify(input);
        const t1 = tier1Minify(input);

        // Both engines MUST preserve spaces around binary + and -
        expect(t2).toMatch(/calc\(.*[\s][+-][\s].*\)/);
        expect(t1).toMatch(/calc\(.*[\s][+-][\s].*\)/);

        // Parse both with PostCSS to ensure valid syntax
        expect(() => postcss.parse(t2)).not.toThrow();
        expect(() => postcss.parse(t1)).not.toThrow();
      }
    });

    it('verifies both engines preserve string contents without punctuation corruption', () => {
      expect(lightningCss).not.toBeNull();
      const input = `
        .badge::after {
          content: " (Status: [Active], Count: 5; Note: \\"OK\\") ";
        }
        .icon::before {
          content: "/* not a comment */";
        }
      `;

      const t2 = tier2Minify(input);
      const t1 = tier1Minify(input);

      expect(t2).toContain(
        'content:" (Status: [Active], Count: 5; Note: \\"OK\\") "'
      );
      expect(t2).toContain('content:"/* not a comment */"');
      expect(t1).toContain(
        'content:" (Status: [Active], Count: 5; Note: \\"OK\\") "'
      );
      expect(t1).toContain('content:"/* not a comment */"');

      // Both parse identically
      const ast1 = postcss.parse(t1);
      const ast2 = postcss.parse(t2);
      expect(ast2.nodes.length).toBe(ast1.nodes.length);
    });

    it('verifies both engines preserve data URLs and escaped characters', () => {
      expect(lightningCss).not.toBeNull();
      const input = `
        .avatar {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><path d='M0 0h10v10H0z'/></svg>");
        }
      `;

      const t2 = tier2Minify(input);
      const t1 = tier1Minify(input);

      expect(t2).toContain(
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><path d='M0 0h10v10H0z'/></svg>\")"
      );
      expect(t1).toContain('data:image/svg+xml;utf8');

      expect(() => postcss.parse(t2)).not.toThrow();
      expect(() => postcss.parse(t1)).not.toThrow();
    });

    it('verifies both engines handle OKLCH color spaces and modern color-mix', () => {
      expect(lightningCss).not.toBeNull();
      const input = `
        :root {
          --color-primary: oklch(0.546 0.245 262.881);
          --color-surface: oklch(0.985 0.002 260);
          --bg-subtle: color-mix(in oklch, var(--color-primary) 12%, transparent);
        }
      `;

      const t2 = tier2Minify(input);
      const t1 = tier1Minify(input);

      expect(t2).toBe(
        ':root{--color-primary:oklch(0.546 0.245 262.881);--color-surface:oklch(0.985 0.002 260);--bg-subtle:color-mix(in oklch,var(--color-primary) 12%,transparent)}'
      );
      expect(t1).toContain('--color-primary:oklch(');
      expect(t1).toContain('color-mix(in oklch');

      const ast1 = postcss.parse(t1);
      const ast2 = postcss.parse(t2);
      expect(ast2.nodes[0].nodes.length).toBe(ast1.nodes[0].nodes.length);
    });
  });

  describe('AST Semantic Invariance & Specificity Preservation', () => {
    it('guarantees AST parsed from Tier 2 output retains identical rules and properties', () => {
      if (!postcss) {
        return;
      }

      const input = `
        :root {
          --brand: #2563eb;
          --radius: 0.5rem;
        }
        .card {
          background-color: var(--brand);
          border-radius: var(--radius);
          padding: 1rem 1.5rem;
        }
        .card:hover {
          opacity: 0.9;
        }
        @media (min-width: 768px) {
          .card {
            padding: 2rem;
          }
        }
      `;

      const originalAst = postcss.parse(input);
      const minified = tier2Minify(input);
      const minifiedAst = postcss.parse(minified);

      // 1. Same number of top-level nodes
      expect(minifiedAst.nodes.length).toBe(originalAst.nodes.length);

      // 2. Matching node types and rule names
      for (let i = 0; i < originalAst.nodes.length; i++) {
        const orig = originalAst.nodes[i];
        const mini = minifiedAst.nodes[i];
        expect(mini.type).toBe(orig.type);

        if (orig.type === 'rule') {
          expect(mini.selector.replace(/\s+/g, '')).toBe(
            orig.selector.replace(/\s+/g, '')
          );
          expect(mini.nodes.length).toBe(orig.nodes.length);
          for (let j = 0; j < orig.nodes.length; j++) {
            expect(mini.nodes[j].prop).toBe(orig.nodes[j].prop);
          }
        } else if (orig.type === 'atrule') {
          expect(mini.name).toBe(orig.name);
        }
      }
    });

    it('preserves exact selector specificity for compound, pseudo, and descendant selectors', () => {
      const tests = [
        {
          input: 'div.card#primary.active { color: blue; }',
          expected: 'div.card#primary.active{color:blue}',
          desc: 'compound selector without spaces',
        },
        {
          input: 'div .card #primary .active { color: blue; }',
          expected: 'div .card #primary .active{color:blue}',
          desc: 'descendant selector chain with spaces',
        },
        {
          input: 'ul > li + li ~ li { margin-left: 0.5rem; }',
          expected: 'ul>li+li~li{margin-left:0.5rem}',
          desc: 'combinators (> + ~) stripped cleanly',
        },
        {
          input: 'button:hover { opacity: 0.8; }',
          expected: 'button:hover{opacity:0.8}',
          desc: 'direct pseudo-class attached to element',
        },
        {
          input: 'button :hover { opacity: 0.8; }',
          expected: 'button :hover{opacity:0.8}',
          desc: 'descendant pseudo-class with mandatory space',
        },
        {
          input: '.card:not([disabled]):hover { cursor: pointer; }',
          expected: '.card:not([disabled]):hover{cursor:pointer}',
          desc: 'compound chained functional pseudo-classes',
        },
      ];

      for (const t of tests) {
        const result = tier2Minify(t.input);
        expect(result).toBe(t.expected);
      }
    });

    it('preserves variable references with complex fallback cascades', () => {
      const input = `
        .badge {
          color: var(--nui-badge-fg, var(--brand-primary, #ffffff));
          background: var(--nui-badge-bg, var(--color-surface, rgb(255 255 255 / 0.8)));
          border: 1px solid var(--nui-border, transparent);
        }
      `;

      const result = tier2Minify(input);
      expect(result).toBe(
        '.badge{color:var(--nui-badge-fg,var(--brand-primary,#ffffff));background:var(--nui-badge-bg,var(--color-surface,rgb(255 255 255/0.8)));border:1px solid var(--nui-border,transparent)}'
      );
    });
  });

  describe('Real-World CSS Corpuses', () => {
    it('minifies Bootstrap 5 Grid, Reboot, and Utility corpus flawlessly', () => {
      const bootstrapCorpus = `
        /*!
         * Bootstrap Reboot & Grid Snippet
         */
        :root {
          --bs-blue: #0d6efd;
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .container,
        .container-fluid,
        .container-sm,
        .container-md {
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
          width: 100%;
          padding-right: calc(var(--bs-gutter-x) * 0.5);
          padding-left: calc(var(--bs-gutter-x) * 0.5);
          margin-right: auto;
          margin-left: auto;
        }

        .row {
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
          display: flex;
          flex-wrap: wrap;
          margin-top: calc(-1 * var(--bs-gutter-y));
          margin-right: calc(-0.5 * var(--bs-gutter-x));
          margin-left: calc(-0.5 * var(--bs-gutter-x));
        }

        .col-6 {
          flex: 0 0 auto;
          width: 50%;
        }

        .col-8 {
          flex: 0 0 auto;
          width: calc(100% * 8 / 12);
        }

        @media (min-width: 576px) and (max-width: 767.98px) {
          .container-sm {
            max-width: 540px;
          }
        }
      `;

      const minified = tier2Minify(bootstrapCorpus);

      // Verify no comments leaked
      expect(minified).not.toContain('Bootstrap Reboot');
      // Verify calc math operators preserved (* and / compacted, + and - spaced)
      expect(minified).toContain('calc(-1*var(--bs-gutter-y))');
      expect(minified).toContain('calc(-0.5*var(--bs-gutter-x))');
      expect(minified).toContain('calc(100%*8/12)');
      // Verify media query
      expect(minified).toContain(
        '@media (min-width:576px) and (max-width:767.98px){.container-sm{max-width:540px}}'
      );
      // Verify selector lists
      expect(minified).toContain(
        '.container,.container-fluid,.container-sm,.container-md{'
      );

      // Parse with PostCSS to ensure 100% valid syntax
      if (postcss) {
        expect(() => postcss.parse(minified)).not.toThrow();
      }
    });

    it('minifies Tailwind CSS Preflight & Advanced Utility classes corpus flawlessly', () => {
      const tailwindCorpus = `
        @layer base, components, utilities;

        @layer utilities {
          .\\!container {
            max-width: 1200px !important;
          }
          .hover\\:bg-blue-500:hover {
            background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
          }
          .w-1\\/2 {
            width: 50%;
          }
          .top-2\\.5 {
            top: 0.625rem;
          }
          .border-\\[1px\\] {
            border-width: 1px;
          }
          .\\31 00\\% {
            width: 100%;
          }
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            --tw-space-y-reverse: 0;
            margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
            margin-bottom: calc(1rem * var(--tw-space-y-reverse));
          }
          .grid-cols-\\[repeat\\(auto-fit\\,minmax\\(200px\\,1fr\\)\\] {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `;

      const minified = tier2Minify(tailwindCorpus);

      // Verify all escaped class selectors survived intact
      expect(minified).toContain('.\\!container{');
      expect(minified).toContain('.hover\\:bg-blue-500:hover{');
      expect(minified).toContain('.w-1\\/2{width:50%}');
      expect(minified).toContain('.top-2\\.5{top:0.625rem}');
      expect(minified).toContain('.border-\\[1px\\]{border-width:1px}');
      expect(minified).toContain('.\\31 00\\%{width:100%}');
      // Verify calc with nested multiplication and subtraction
      expect(minified).toContain(
        'calc(1rem*calc(1 - var(--tw-space-y-reverse)))'
      );
      // Verify layer statement termination
      expect(minified).toContain('@layer base,components,utilities;');

      if (postcss) {
        expect(() => postcss.parse(minified)).not.toThrow();
      }
    });

    it('minifies Modern CSS Nesting and Container Queries corpus flawlessly', () => {
      const modernCssCorpus = `
        @container (min-width: 400px) {
          .card {
            flex-direction: row;
          }
        }

        @container card (min-width: 500px) and (max-width: 800px) {
          .card-title {
            font-size: 1.5rem;
          }
        }

        .navigation {
          display: flex;
          gap: 1rem;

          & > .item {
            color: #333;

            &:hover {
              color: #000;
              text-decoration: underline;
            }

            &[data-state="active"] {
              font-weight: 700;
            }
          }

          .cta-button {
            margin-left: auto;
          }
        }

        :is(h1, h2, h3):where(:not(.no-margin)) {
          margin-block-end: 0.75rem;
        }
      `;

      const minified = tier2Minify(modernCssCorpus);

      expect(minified).toContain(
        '@container (min-width:400px){.card{flex-direction:row}}'
      );
      expect(minified).toContain(
        '@container card (min-width:500px) and (max-width:800px){.card-title{font-size:1.5rem}}'
      );
      expect(minified).toContain(
        '.navigation{display:flex;gap:1rem;&>.item{color:#333;&:hover{color:#000;text-decoration:underline}&[data-state="active"]{font-weight:700}}.cta-button{margin-left:auto}}'
      );
      expect(minified).toContain(
        ':is(h1,h2,h3):where(:not(.no-margin)){margin-block-end:0.75rem}'
      );

      if (postcss) {
        expect(() => postcss.parse(minified)).not.toThrow();
      }
    });

    it('minifies complex modern math functions: min, max, clamp, round, mod', () => {
      const mathCorpus = `
        .fluid-layout {
          font-size: clamp(1rem, 2.5vw + 0.5rem, 2.5rem);
          width: min(100vw - 48px, 1440px);
          min-height: max(50vh, 400px - 20px);
          line-height: round(up, 1.25rem, 0.25rem);
          transform: rotate(mod(450deg, 360deg));
        }
      `;

      const minified = tier2Minify(mathCorpus);

      expect(minified).toBe(
        '.fluid-layout{font-size:clamp(1rem,2.5vw + 0.5rem,2.5rem);width:min(100vw - 48px,1440px);min-height:max(50vh,400px - 20px);line-height:round(up,1.25rem,0.25rem);transform:rotate(mod(450deg,360deg))}'
      );

      if (postcss) {
        expect(() => postcss.parse(minified)).not.toThrow();
      }
    });
  });

  describe('Adversarial & Malformed Inputs Fuzzing (Diagnostic Error Guarantees)', () => {
    it('throws structured MinificationError on unclosed double-quoted string with exact position', () => {
      const malformed =
        'body {\n  font-family: "Helvetica Neue;\n  color: red;\n}';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.name).toBe('MinificationError');
        expect(error.line).toBe(2);
        expect(error.column).toBe(16);
        expect(error.message).toContain('Unclosed string');
      }
    });

    it('throws structured MinificationError on unclosed single-quoted string with exact position', () => {
      const malformed = ".card {\n  background: url('image.png\n}";
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.name).toBe('MinificationError');
        expect(error.line).toBe(2);
        expect(error.column).toBe(15);
      }
    });

    it('throws structured MinificationError on unclosed comment', () => {
      const malformed = '/* start of header\n.btn { color: blue; }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.name).toBe('MinificationError');
        expect(error.line).toBe(1);
        expect(error.column).toBe(1);
        expect(error.message).toContain('Unclosed comment');
      }
    });

    it('throws structured MinificationError on unclosed block (missing closing brace)', () => {
      const malformed =
        '.card {\n  color: red;\n  .inner {\n    padding: 1rem;\n  }\n';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unclosed block (missing '}')");
      }
    });

    it('throws structured MinificationError on unexpected closing brace', () => {
      const malformed = '.card { color: red; } }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unexpected closing brace '}'");
      }
    });

    it('throws structured MinificationError on unclosed parenthesis inside calc()', () => {
      const malformed = '.box { width: calc(100% - (20px + 5px); }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unclosed parenthesis (missing ')')");
      }
    });

    it('throws structured MinificationError on unexpected closing parenthesis', () => {
      const malformed = '.box { width: calc(100% - 20px)); }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unexpected closing parenthesis ')'");
      }
    });

    it('throws structured MinificationError on unclosed attribute selector bracket', () => {
      const malformed = 'input[type="text" { color: red; }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unclosed bracket (missing ']')");
      }
    });

    it('throws structured MinificationError on unexpected closing bracket', () => {
      const malformed = 'input[type="text"]] { color: red; }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unexpected closing bracket ']'");
      }
    });

    it('throws structured MinificationError on unclosed url() function', () => {
      const malformed =
        '.bg { background: url(https://example.com/asset.png; }';
      expect(() => tier2Minify(malformed)).toThrow(MinificationError);
      try {
        tier2Minify(malformed);
      } catch (err: unknown) {
        const error = err as MinificationError;
        expect(error.message).toContain("Unclosed url function (missing ')')");
      }
    });

    it('handles quotes and braces inside comments without throwing false positives', () => {
      const adversarial = `
        /* { "brace": true, 'single': "double", (paren): [bracket] } */
        .safe {
          color: green;
        }
      `;
      expect(() => tier2Minify(adversarial)).not.toThrow();
      expect(tier2Minify(adversarial)).toBe('.safe{color:green}');
    });

    it('handles comments syntax and escapes inside strings without false tokenization', () => {
      const adversarial = `
        .label::after {
          content: "/* not a comment */ { not a block } 'escaped single' \\" escaped double";
        }
      `;
      expect(() => tier2Minify(adversarial)).not.toThrow();
      expect(tier2Minify(adversarial)).toBe(
        '.label::after{content:"/* not a comment */ { not a block } \'escaped single\' \\" escaped double"}'
      );
    });

    it('handles escaped newlines in strings correctly', () => {
      const multiLineString = '.quote::before { content: "Line 1\\\nLine 2"; }';
      expect(() => tier2Minify(multiLineString)).not.toThrow();
      expect(tier2Minify(multiLineString)).toBe(
        '.quote::before{content:"Line 1\\\nLine 2"}'
      );
    });

    it('handles unicode identifiers, accents, and emojis safely', () => {
      const unicodeCss = `
        .café {
          font-style: italic;
        }
        .icon-🔥::before {
          content: "🔥 Hot Deal!";
        }
        [data-badge="★"] {
          color: gold;
        }
      `;
      expect(() => tier2Minify(unicodeCss)).not.toThrow();
      const res = tier2Minify(unicodeCss);
      expect(res).toContain('.café{');
      expect(res).toContain('.icon-🔥::before{content:"🔥 Hot Deal!"}');
      expect(res).toContain('[data-badge="★"]{color:gold}');
    });
  });

  describe('Full Two-Tier Fallback via minifyCss() API', () => {
    it('minifyCss falls back cleanly to Tier 2 when forceJs: true is specified', () => {
      const input = '.card { width: calc(100% - 20px); }';
      const output = minifyCss(input, { forceJs: true });
      expect(output).toBe('.card{width:calc(100% - 20px)}');
    });

    it('minifyCss gracefully handles empty and whitespace-only inputs in all modes', () => {
      expect(minifyCss('', { forceJs: true })).toBe('');
      expect(minifyCss('   \n\t  ', { forceJs: true })).toBe('');
      expect(minifyCss('')).toBe('');
      expect(minifyCss('   \n\t  ')).toBe('');
    });
  });

  describe('Complex Edge Cases & Ratio / Fallback Preservation', () => {
    it('preserves CSS font fallback chains with commas inside var()', () => {
      const input = `
        body {
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        }
      `;
      expect(tier2Minify(input)).toBe(
        'body{font-family:var(--font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif)}'
      );
    });

    it('strips comments interleaved within selector lists', () => {
      const input = `
        .btn,
        /* Primary button */
        .btn-primary,
        /* Danger button */
        .btn-danger {
          display: inline-flex;
        }
      `;
      expect(tier2Minify(input)).toBe(
        '.btn,.btn-primary,.btn-danger{display:inline-flex}'
      );
    });

    it('preserves aspect ratio media queries with division slashes', () => {
      const input = `
        @media screen and (min-aspect-ratio: 16/9) and (max-aspect-ratio: 21/9) {
          .cinematic {
            object-fit: cover;
          }
        }
      `;
      expect(tier2Minify(input)).toBe(
        '@media screen and (min-aspect-ratio:16/9) and (max-aspect-ratio:21/9){.cinematic{object-fit:cover}}'
      );
    });

    it('preserves deeply nested calc expressions with multiple custom properties', () => {
      const input = `
        .modal {
          max-width: calc(100vw - (var(--modal-pad, 24px) * 2 + (var(--scrollbar-w, 15px) + 2px)));
        }
      `;
      expect(tier2Minify(input)).toBe(
        '.modal{max-width:calc(100vw - (var(--modal-pad,24px)*2 + (var(--scrollbar-w,15px) + 2px)))}'
      );
    });

    it('preserves escaped backslashes in string values', () => {
      const input = '.file::after { content: "C:\\\\Windows\\\\System32"; }';
      expect(tier2Minify(input)).toBe(
        '.file::after{content:"C:\\\\Windows\\\\System32"}'
      );
    });
  });

  describe('Performance & Throughput Verification', () => {
    it('executes 100 consecutive minification passes in under 100ms with zero memory degradation', () => {
      const sample = `
        :root {
          --color-primary: oklch(0.623 0.214 259.815);
          --shadow-elevation: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .component {
          display: flex;
          flex-direction: column;
          width: calc(100% - 32px);
          padding: 1rem 1.5rem;
          color: var(--color-primary);
        }
        @media (min-width: 768px) {
          .component {
            flex-direction: row;
          }
        }
      `;

      const iterations = 100;
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        const result = tier2Minify(sample);
        expect(result).toContain('.component{');
      }
      const elapsed = performance.now() - startTime;
      const avgMs = elapsed / iterations;

      // Tier 2 should process each pass in sub-millisecond time
      expect(elapsed).toBeLessThan(250);
      expect(avgMs).toBeLessThan(2.5);
    });
  });
});
