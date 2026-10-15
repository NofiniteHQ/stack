import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function fallbackMinify(css: string): string {
  return (
    css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Normalize newlines and consecutive whitespace
      .replace(/\s+/g, ' ')
      // Remove space around delimiters
      .replace(/\s*([{};,])\s*/g, '$1')
      // Remove unnecessary trailing semicolons before closing brace
      .replace(/;}/g, '}')
      .trim()
  );
}

/**
 * Minify CSS using lightningcss if available, falling back to regex minification.
 */
export function minifyCss(css: string): string {
  try {
    const { transform } = require('lightningcss');
    const { code } = transform({
      filename: 'output.css',
      code: Buffer.from(css),
      minify: true,
    });
    return code.toString();
  } catch {
    return fallbackMinify(css);
  }
}
