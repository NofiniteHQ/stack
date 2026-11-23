/**
 * @nofinite/markon - Security & Sanitization Primitives
 * Protects against stored XSS, script injection, mXSS, and protocol manipulation.
 * Powered by DOMPurify with the authoritative MARKON_DOMPURIFY_CONFIG allowlist.
 */

import DOMPurify from 'dompurify';

export const MARKON_DOMPURIFY_CONFIG = {
  // 1. Authoritative Element Allowlist (36 permitted elements)
  ALLOWED_TAGS: [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'strike',
    'del',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'hr',
    'br',
    'details',
    'summary',
    'span',
    'div',
    'sup',
    'sub',
  ],

  // 2. Authoritative Attribute Allowlist (explicit attributes only)
  ALLOWED_ATTR: [
    'href',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'name',
    'target',
    'rel',
  ],

  // 3. Data Attribute Handling: Enabled via built-in flag (not wildcard string)
  ALLOW_DATA_ATTR: true,

  // 4. Strict Protocol Validation: Allow only http, https, mailto, tel, and relative paths

  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,

  // 5. Embedded Content & SVG Policy: Strip all SVG and MathML in markdown body
  USE_PROFILES: { html: true, svg: false, mathMl: false },
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'style',
    'svg',
    'math',
    'animate',
    'set',
  ],

  // 6. Style Handling: Forbid inline style attributes to prevent CSS exfiltration
  FORBID_ATTR: ['style'],

  // 7. Security Invariants
  ALLOW_UNKNOWN_PROTOCOLS: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
};

export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decodeEntities(str: string): string {
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
 * Allows safe protocols: http, https, mailto, tel, safe raster data:image/, and relative/anchor paths (#, /, ./, ../).
 * Rejects javascript:, vbscript:, file:, data:image/svg+xml, non-image data URIs, and protocol-relative // URLs.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';

  let decoded = decodeEntities(trimmed);
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Ignore malformed URI components
  }

  // Strip control characters, null bytes, and non-printable characters
  // eslint-disable-next-line no-control-regex
  const sanitized = decoded.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');
  if (!sanitized) return '#';

  // Reject protocol-relative URLs (e.g. //evil.com)
  if (sanitized.startsWith('//')) {
    return '#';
  }

  // Allow anchor fragments and safe relative paths
  if (
    sanitized.startsWith('#') ||
    sanitized.startsWith('/') ||
    sanitized.startsWith('./') ||
    sanitized.startsWith('../')
  ) {
    return sanitized;
  }

  // Disallow javascript:, vbscript:, file:, and dangerous schemes
  const lower = sanitized.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  // Restrict data: URIs strictly to safe raster image formats (reject svg+xml and text/*)
  if (lower.startsWith('data:')) {
    if (lower.startsWith('data:image/svg+xml')) {
      return '#';
    }
    if (
      lower.startsWith('data:image/png') ||
      lower.startsWith('data:image/jpeg') ||
      lower.startsWith('data:image/jpg') ||
      lower.startsWith('data:image/gif') ||
      lower.startsWith('data:image/webp')
    ) {
      return sanitized;
    }
    return '#';
  }

  // Verify protocol if URL format has a scheme
  const protoMatch = lower.match(/^([a-z0-9+.-]+):/);
  if (protoMatch) {
    const proto = protoMatch[1];
    if (
      proto === 'http' ||
      proto === 'https' ||
      proto === 'mailto' ||
      proto === 'tel'
    ) {
      return sanitized;
    }
    return '#';
  }

  // If no scheme is present and no colons exist, allow as a safe relative path
  if (!sanitized.includes(':')) {
    return sanitized;
  }

  return '#';
}

let _purifierInstance: any = null;

function isRealBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  if (
    (window as any).__happy_dom__ ||
    (window as any).__jsdom ||
    (typeof process !== 'undefined' && Boolean(process.versions?.node))
  ) {
    return false;
  }
  return true;
}

function getPurifier(): any {
  if (_purifierInstance) return _purifierInstance;

  if (isRealBrowser()) {
    _purifierInstance =
      typeof DOMPurify === 'function' ? (DOMPurify as any)(window) : DOMPurify;
  } else {
    try {
      // Node.js SSR / Vitest: use JSDOM for authoritative standards-compliant HTML5 parsing

      const { JSDOM } = require('jsdom');
      _purifierInstance = (DOMPurify as any)(new JSDOM('').window);
    } catch {
      if (typeof window !== 'undefined') {
        _purifierInstance =
          typeof DOMPurify === 'function'
            ? (DOMPurify as any)(window)
            : DOMPurify;
      }
    }
  }

  if (_purifierInstance && typeof _purifierInstance.addHook === 'function') {
    _purifierInstance.addHook('afterSanitizeAttributes', (node: any) => {
      // If an anchor had its href stripped or omitted, neutralize with '#'
      if (node && node.tagName === 'A' && !node.hasAttribute('href')) {
        node.setAttribute('href', '#');
      }
    });
  }

  return _purifierInstance;
}

/**
 * Sanitizes untrusted HTML using DOMPurify with the approved MARKON_DOMPURIFY_CONFIG.
 * Strips dangerous tags (script, iframe, object, style, svg animations) and event handlers.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  const purifier = getPurifier();
  let clean = html;
  if (purifier && typeof purifier.sanitize === 'function') {
    clean = purifier.sanitize(html, MARKON_DOMPURIFY_CONFIG) as string;
  }

  // Defense-in-depth: Ensure NO residual executable script, iframe, or object tags slip through parser quirks
  return clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<script\b[^>]*>/gi, '')
    .replace(/<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<animate\b[^>]*>/gi, '')
    .replace(/<set\b[^>]*>/gi, '')
    .replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
}
