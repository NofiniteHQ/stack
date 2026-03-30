import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@nofinite/nuicss Engine', () => {
  const distPath = path.resolve(__dirname, '../dist');
  let cleanCss = '';
  let prefixedCss = '';

  beforeAll(() => {
    try {
      cleanCss = fs.readFileSync(path.join(distPath, 'index.css'), 'utf-8');
      prefixedCss = fs.readFileSync(
        path.join(distPath, 'prefixed.css'),
        'utf-8'
      );
    } catch {
      throw new Error(
        'CSS files not found. Did you run `pnpm nx build nuicss` before testing?'
      );
    }
  });

  describe('Clean Architecture (index.css)', () => {
    it('should generate base layout utilities', () => {
      // \s*\{ means "any amount of whitespace (or none) followed by an opening bracket"
      expect(cleanCss).toMatch(/\.flex\s*\{/);
      expect(cleanCss).toMatch(/\.flex-col\s*\{/);
      expect(cleanCss).toMatch(/\.justify-between\s*\{/);
    });

    it('should generate spacing utilities with correct variable mapping', () => {
      expect(cleanCss).toMatch(/\.p-4\s*\{/);
      expect(cleanCss).toMatch(/padding:\s*var\(--nui-space-4/);
    });

    it('should generate semantic color utilities', () => {
      expect(cleanCss).toContain('.bg-surface');
      expect(cleanCss).toContain('.text-primary');
    });

    it('should successfully escape and generate 2xl breakpoints', () => {
      // Hex escapes in CSS often leave a trailing space, \s? accounts for it
      expect(cleanCss).toMatch(/\.\\32\s?xl\\:flex\s*\{/);
    });
  });

  describe('Enterprise Prefix Architecture (prefixed.css)', () => {
    it('should securely prefix all base utilities', () => {
      expect(prefixedCss).toMatch(/\.nui-flex\s*\{/);
      expect(prefixedCss).not.toMatch(/\.flex\s*\{/); // Ensures no global leakage
    });

    it('should securely prefix pseudo-classes (hover)', () => {
      expect(prefixedCss).toMatch(/\.nui-hover\\?:bg-surface:hover\s*\{/);
    });

    it('should securely prefix responsive utilities', () => {
      expect(prefixedCss).toMatch(/\.md\\:nui-flex-col\s*\{/);
      expect(prefixedCss).toMatch(/\.lg\\:nui-p-8\s*\{/);
    });
  });

  describe('Cascade Source-Order Enforcement', () => {
    it('should place media queries physically after base classes', () => {
      // Use search() with Regex to find the index regardless of minification
      const baseIndex = cleanCss.search(/\.flex\s*\{/);
      const mediaQueryIndex = cleanCss.search(
        /@media\s*\(\s*min-width:\s*768px\s*\)/
      );

      expect(baseIndex).not.toBe(-1);
      expect(mediaQueryIndex).not.toBe(-1);

      expect(baseIndex).toBeLessThan(mediaQueryIndex);
    });
  });
});
