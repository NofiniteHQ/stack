/**
 * @nofinite/markon - Security & ReDoS Adversarial Verification Suite
 * Tests against catastrophic backtracking and polynomial algorithmic complexity.
 */

import { describe, it, expect } from 'vitest';
import { htmlToMarkdown, markdownToHtml } from './core/markdown';
import { slugify, extractTOC, renderMarkon } from './core/renderer';
import { parseVideoUrl } from './core/video';

describe('Markon Security & ReDoS Invariants', () => {
  it('htmlToMarkdown resolves pathological unclosed tags in linear time (< 15ms)', () => {
    // 25,000 character unclosed heading attack payload
    const attackPayload = '<h1>' + 'a'.repeat(25000);
    const start = performance.now();
    const result = htmlToMarkdown(attackPayload);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(15);
    expect(typeof result).toBe('string');
  });

  it('slugify resolves 50,000 repeated dashes in linear time (< 5ms)', () => {
    const attackPayload =
      '-'.repeat(25000) + 'enterprise-test' + '-'.repeat(25000);
    const start = performance.now();
    const slugMap = new Map<string, number>();
    const slug = slugify(attackPayload, slugMap);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(5);
    expect(slug).toBe('enterprise-test');
  });

  it('extractTOC resolves pathological unclosed heading tags in linear time (< 15ms)', () => {
    // Pathological string that triggers ReDoS in flawed heading regexes
    const attackPayload = '<h1' + '='.repeat(15000) + ' ' + 'a'.repeat(15000);
    const start = performance.now();
    const toc = extractTOC(attackPayload);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(15);
    expect(Array.isArray(toc)).toBe(true);
  });

  it('renderMarkon heading injection handles unclosed tags in linear time (< 20ms)', () => {
    const attackPayload =
      '<h2' + '<h2'.repeat(5000) + ' ' + 'title'.repeat(500);
    const start = performance.now();
    const res = renderMarkon({ content: attackPayload });
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(20);
    expect(typeof res.html).toBe('string');
  });

  it('parseVideoUrl resolves pathological YouTube URLs in linear time (< 5ms)', () => {
    const attackPayload =
      'https://youtube.com/' + '/./'.repeat(5000) + 'watch?v=123';
    const start = performance.now();
    const res = parseVideoUrl(attackPayload);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(5);
    expect(res.service).toBe('custom');
  });

  it('fuzzes random malformed tag permutations without hanging', () => {
    const tokens = ['<h1', '</h1>', '<p>', '</p>', '-', '|', '#', ' ', 'a'];
    for (let i = 0; i < 50; i++) {
      let randomStr = '';
      for (let j = 0; j < 500; j++) {
        randomStr += tokens[Math.floor(Math.random() * tokens.length)];
      }
      const start = performance.now();
      markdownToHtml(randomStr);
      htmlToMarkdown(randomStr);
      renderMarkon({ content: randomStr });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    }
  });
});
