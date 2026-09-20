import { describe, it, expect } from 'vitest';
import {
  extractClassTokens,
  extractCriticalNuicss,
  injectCriticalNuicss,
  extractCriticalCssForTokens,
  clearCriticalNuicssCache,
  createCriticalStyleTag,
} from './ssr';

describe('Critical CSS SSR Helpers', () => {
  it('extracts class tokens from HTML strings', () => {
    const html = `
      <div class="btn btn-primary card-responsive">
        <span className="text-fluid-lg text-muted">Title</span>
        <button class="btn-ghost">Action</button>
      </div>
    `;

    const tokens = extractClassTokens(html);
    expect(tokens).toContain('btn');
    expect(tokens).toContain('btn-primary');
    expect(tokens).toContain('card-responsive');
    expect(tokens).toContain('text-fluid-lg');
    expect(tokens).toContain('text-muted');
    expect(tokens).toContain('btn-ghost');
  });

  it('extracts critical CSS for matched tokens', async () => {
    const html = '<button class="btn btn-primary">Click Me</button>';
    const result = await extractCriticalNuicss(html);

    expect(result.tokens).toEqual(['btn', 'btn-primary']);
    expect(result.css).toContain('btn');
    expect(result.html).toContain('<style id="nuicss-critical"');
    expect(result.html).toContain('</style>');
  });

  it('returns empty results when HTML has no classes', async () => {
    const html = '<div><p>Hello world</p></div>';
    const result = await extractCriticalNuicss(html);

    expect(result.tokens).toEqual([]);
    expect(result.css).toBe('');
    expect(result.html).toBe('');
  });

  it('injects critical CSS into document head', async () => {
    const documentHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR Page</title>
        </head>
        <body>
          <div class="btn btn-secondary">Test</div>
        </body>
      </html>
    `;

    const injected = await injectCriticalNuicss(documentHtml);
    expect(injected).toContain(
      '<style id="nuicss-critical" data-nuicss-ssr="true">'
    );
    expect(injected).toContain('</style>\n</head>');
  });

  it('extracts critical CSS directly from token arrays or sets', async () => {
    const tokens = ['card', 'badge', 'badge-primary'];
    const css = await extractCriticalCssForTokens(tokens);

    expect(css).toContain('card');
    expect(css).toContain('badge');
  });

  it('leverages memory cache on subsequent calls and can be cleared', async () => {
    clearCriticalNuicssCache();
    const html = '<div class="alert alert-info">Notice</div>';

    const t1 = performance.now();
    const res1 = await extractCriticalNuicss(html);
    const duration1 = performance.now() - t1;

    const t2 = performance.now();
    const res2 = await extractCriticalNuicss(html);
    const duration2 = performance.now() - t2;

    expect(res1.css).toEqual(res2.css);
    // Cached response should execute virtually instantaneously
    expect(duration2).toBeLessThanOrEqual(duration1 + 5);

    clearCriticalNuicssCache();
  });

  it('creates formatted critical style tags', () => {
    const styleTag = createCriticalStyleTag(
      '.test { color: red; }',
      'custom-critical'
    );
    expect(styleTag).toBe(
      '<style id="custom-critical" data-nuicss-ssr="true">.test { color: red; }</style>'
    );
    expect(createCriticalStyleTag('')).toBe('');
  });
});
