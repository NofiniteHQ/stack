/**
 * @nofinite/charts - Color & Style Security Utilities (CHARTS-M3-03)
 * Provides strict validation and sanitization for colors and SVG stroke dash patterns.
 */

/**
 * Validates and sanitizes a CSS color string to neutralize CSS injection and exfiltration vectors.
 *
 * Supported formats:
 * - Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 * - RGB / RGBA: rgb(...), rgba(...)
 * - HSL / HSLA: hsl(...), hsla(...)
 * - Modern Color Spaces: oklch(...), oklab(...), lab(...), lch(...)
 * - CSS Variables: var(--[a-zA-Z0-9_-]+), including safe nested var() and color fallbacks
 * - Standard Named Colors: transparent, currentColor, red, blue, etc.
 *
 * Rejects:
 * - Injection tokens: semicolons, quotes, braces, angle brackets, backslashes, comments
 * - Active functions: url(), expression(), @import, javascript:
 */
export function parseSafeColor(
  color: unknown,
  fallback = 'var(--color-primary)'
): string {
  if (typeof color !== 'string') {
    return fallback;
  }
  const trimmed = color.trim();
  if (!trimmed) {
    return fallback;
  }

  // Reject control characters and injection tokens: semicolons, quotes, angle brackets, backslashes, comments
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F-\u009F;"'<>\\]|\/\*|\*\//.test(trimmed)) {
    return fallback;
  }

  // Reject active / dangerous CSS constructs
  if (/url\s*\(|expression\s*\(|@import|javascript:|vbscript:/i.test(trimmed)) {
    return fallback;
  }

  // 1. Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
  if (/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return trimmed;
  }

  // 2. rgb() / rgba()
  if (
    /^rgba?\(\s*[\d.]+%?(?:\s*,\s*|\s+)[\d.]+%?(?:\s*,\s*|\s+)[\d.]+%?(?:\s*(?:,|\/)\s*[\d.]+%?)?\s*\)$/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  // 3. hsl() / hsla()
  if (
    /^hsla?\(\s*[\d.]+(?:deg|rad|turn)?(?:\s*,\s*|\s+)[\d.]+%?(?:\s*,\s*|\s+)[\d.]+%?(?:\s*(?:,|\/)\s*[\d.]+%?)?\s*\)$/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  // 4. oklch() / oklab() / lab() / lch()
  if (
    /^(?:oklch|oklab|lab|lch)\(\s*[\d.]+%?\s+[\d.]+%?\s+[\d.]+(?:deg|rad|turn)?(?:\s*\/\s*[\d.]+%?)?\s*\)$/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  // 5. CSS variables: var(--name) or var(--name, fallback)
  // Recursively supports safe nested var() like var(--chart-1, var(--color-primary)) or var(--color-danger, #ef4444)
  if (
    /^var\(--[a-zA-Z0-9_-]+(?:\s*,\s*(?:var\(--[a-zA-Z0-9_-]+(?:\s*,\s*[^;()<>"']+)?\)|#[0-9a-fA-F]{3,8}|[a-zA-Z0-9_-]+))?\)$/.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  // 6. Named standard colors: transparent, currentColor, etc.
  if (/^(?:transparent|currentColor|[a-zA-Z]{3,20})$/i.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

/**
 * Validates and sanitizes SVG stroke-dasharray values (CHARTS-M3-03).
 *
 * Accepts space- or comma-separated non-negative numbers (e.g., '4,4', '5 5', '10, 5, 2, 5', 'none').
 * Rejects semicolons, quotes, CSS expressions, and non-numeric payloads.
 */
export function parseSafeStrokeDasharray(
  val: unknown,
  fallback = '4,4'
): string {
  if (typeof val !== 'string') return fallback;
  const trimmed = val.trim();
  if (trimmed === 'none') return 'none';

  // Allow comma- or space-separated non-negative numbers
  if (/^\d+(?:\.\d+)?(?:[\s,]+\d+(?:\.\d+)?)*$/.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}
