/**
 * @nofinite/markon - Security & Sanitization Primitives
 * Protects against stored XSS, script injection, and protocol manipulation.
 */

/**
 * Sanitizes URLs to prevent javascript:, data:, vbscript:, and control character execution.
 * Allows safe protocols: http, https, mailto, tel, and relative/anchor paths (#, /, ./, ../).
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  const trimmed = url.trim();

  // Strip control characters and whitespace
  // eslint-disable-next-line no-control-regex
  const sanitized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');

  // Allow anchor fragments and safe relative paths
  if (
    sanitized.startsWith('#') ||
    sanitized.startsWith('/') ||
    sanitized.startsWith('./') ||
    sanitized.startsWith('../')
  ) {
    return sanitized;
  }

  // Disallow javascript:, data:, and vbscript: case-insensitively
  const lower = sanitized.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  // Verify protocol if URL format is absolute
  try {
    const parsed = new URL(sanitized, 'https://nofinite.internal');
    const proto = parsed.protocol.toLowerCase();
    if (
      proto === 'http:' ||
      proto === 'https:' ||
      proto === 'mailto:' ||
      proto === 'tel:'
    ) {
      return sanitized;
    }
  } catch {
    // If parsing fails but no unsafe protocol prefix exists, allow safe relative text
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(sanitized)) {
      return sanitized;
    }
  }

  return '#';
}

/**
 * Strips dangerous HTML tags and event handler attributes to prevent XSS.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  return (
    html
      // Remove dangerous script/iframe/object/embed/form/applet tags and contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
      .replace(/<base\b[^>]*>/gi, '')
      // Remove inline event handlers (onclick, onerror, onload, onmouseover, etc.)
      .replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
      // Sanitize javascript: inside href attributes
      .replace(/\bhref\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"')
      // Sanitize javascript: inside src attributes
      .replace(/\bsrc\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""')
  );
}
