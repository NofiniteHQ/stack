/**
 * @nofinite/markon - Security & Sanitization Primitives
 * Protects against stored XSS, script injection, and protocol manipulation.
 */

function decodeEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);?/g, (_, dec) =>
      String.fromCharCode(parseInt(dec, 10))
    )
    .replace(/&colon;/gi, ':')
    .replace(/&newline;/gi, '')
    .replace(/&tab;/gi, '')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

/**
 * Sanitizes URLs to prevent javascript:, data:, vbscript:, and control character execution.
 * Allows safe protocols: http, https, mailto, tel, safe data:image/, and relative/anchor paths (#, /, ./, ../).
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  const trimmed = url.trim();

  let decoded = decodeEntities(trimmed);
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Ignore malformed URI components
  }

  // Strip control characters and whitespace
  // eslint-disable-next-line no-control-regex
  const sanitized = decoded.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');

  // Allow anchor fragments and safe relative paths
  if (
    sanitized.startsWith('#') ||
    sanitized.startsWith('/') ||
    sanitized.startsWith('./') ||
    sanitized.startsWith('../')
  ) {
    return sanitized;
  }

  // Disallow javascript:, data: (non-image), vbscript:, and file: case-insensitively
  const lower = sanitized.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    (lower.startsWith('data:') && !lower.startsWith('data:image/'))
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
    if (proto === 'data:' && lower.startsWith('data:image/')) {
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
      // Remove dangerous script/iframe/object/embed/form/applet/meta/base tags and contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
      .replace(/<base\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '')
      // Remove inline event handlers (onclick, onerror, onload, onmouseover, etc.)
      .replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
      // Sanitize javascript:, vbscript:, and dangerous data: inside href attributes
      .replace(/\bhref\s*=\s*(["'])(.*?)\1/gi, (_, quote, val) => {
        const safe = sanitizeUrl(val);
        return `href=${quote}${safe}${quote}`;
      })
      // Sanitize javascript:, vbscript: inside src attributes
      .replace(/\bsrc\s*=\s*(["'])(.*?)\1/gi, (_, quote, val) => {
        const safe = sanitizeUrl(val);
        return `src=${quote}${safe}${quote}`;
      })
  );
}
