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

function safeCodePoint(code: number): string {
  return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
    ? String.fromCodePoint(code)
    : '';
}

export function decodeEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
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

const HTML_PROFILE_SAFE_LAYOUT_TAGS = [
  'article',
  'aside',
  'header',
  'footer',
  'section',
  'nav',
  'main',
  'figure',
  'figcaption',
  'button',
  'mark',
  'time',
  'video',
  'source',
];

const ALLOWED_TAG_SET = new Set([
  ...MARKON_DOMPURIFY_CONFIG.ALLOWED_TAGS,
  ...(MARKON_DOMPURIFY_CONFIG.USE_PROFILES?.html
    ? HTML_PROFILE_SAFE_LAYOUT_TAGS
    : []),
]);
const ALLOWED_ATTR_SET = new Set(MARKON_DOMPURIFY_CONFIG.ALLOWED_ATTR);
const FORBID_TAG_SET = new Set(MARKON_DOMPURIFY_CONFIG.FORBID_TAGS);
const VOID_TAG_SET = new Set(['br', 'hr', 'img', 'source']);
const CONTAINER_FORBID_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'svg',
  'math',
]);
const DATA_ATTR_NAME_RE = /^data-[a-z0-9._-]+$/i;

let _purifierInstance: any = null;
let _purifierWindowRef: any = null;

function hasRealBrowserDom(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  const win = window as any;
  if (
    win.__happy_dom__ ||
    win.happyDOM ||
    (typeof process !== 'undefined' && Boolean(process.versions?.node))
  ) {
    return false;
  }
  return true;
}

function getPurifier(): any {
  if (!hasRealBrowserDom()) return null;
  if (_purifierInstance && _purifierWindowRef === window) {
    return _purifierInstance;
  }

  _purifierWindowRef = window;
  _purifierInstance =
    typeof DOMPurify === 'function' ? (DOMPurify as any)(window) : DOMPurify;

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

interface ParsedAttr {
  name: string;
  value: string;
  hasValue: boolean;
}

function parseAttributes(
  input: string,
  startPos: number
): {
  attrs: ParsedAttr[];
  endPos: number;
  closed: boolean;
  selfClosing: boolean;
} {
  const len = input.length;
  let pos = startPos;
  const attrs: ParsedAttr[] = [];
  let selfClosing = false;

  while (pos < len) {
    while (pos < len && /[\s/]/.test(input[pos])) {
      if (input[pos] === '/' && input[pos + 1] === '>') {
        selfClosing = true;
        return { attrs, endPos: pos + 1, closed: true, selfClosing };
      }
      pos++;
    }

    if (pos >= len) {
      return { attrs, endPos: len, closed: false, selfClosing };
    }

    if (input[pos] === '>') {
      return { attrs, endPos: pos, closed: true, selfClosing };
    }

    const nameStart = pos;
    while (pos < len && !/[\s=/>]/.test(input[pos])) {
      pos++;
    }
    const rawName = input.slice(nameStart, pos);

    while (pos < len && /\s/.test(input[pos])) {
      pos++;
    }

    let rawValue = '';
    let hasValue = false;
    if (pos < len && input[pos] === '=') {
      hasValue = true;
      pos++;
      while (pos < len && /\s/.test(input[pos])) {
        pos++;
      }
      if (pos < len && (input[pos] === '"' || input[pos] === "'")) {
        const quote = input[pos++];
        const valStart = pos;
        while (pos < len && input[pos] !== quote) {
          pos++;
        }
        rawValue = input.slice(valStart, pos);
        if (pos < len && input[pos] === quote) {
          pos++;
        } else {
          // Unclosed quoted attribute before EOF
          if (rawName) attrs.push({ name: rawName, value: rawValue, hasValue });
          return { attrs, endPos: len, closed: false, selfClosing };
        }
      } else {
        const valStart = pos;
        while (pos < len && !/[\s>]/.test(input[pos])) {
          pos++;
        }
        rawValue = input.slice(valStart, pos);
      }
    }

    if (rawName) {
      attrs.push({ name: rawName, value: rawValue, hasValue });
    }
  }

  return { attrs, endPos: len, closed: false, selfClosing };
}

function findMatchingCloseTagEnd(
  input: string,
  fromPos: number,
  tagName: string
): number {
  const lower = input.toLowerCase();
  const target = tagName.toLowerCase();
  let searchPos = fromPos;

  while (searchPos < input.length) {
    const closeStart = lower.indexOf('</', searchPos);
    if (closeStart === -1) return input.length;

    let namePos = closeStart + 2;
    while (namePos < input.length && /\s/.test(input[namePos])) {
      namePos++;
    }
    if (lower.startsWith(target, namePos)) {
      let afterName = namePos + target.length;
      while (afterName < input.length && /\s/.test(input[afterName])) {
        afterName++;
      }
      if (afterName < input.length && input[afterName] === '>') {
        return afterName + 1;
      }
    }
    searchPos = closeStart + 2;
  }

  return input.length;
}

function sanitizeAllowedAttributes(
  tagName: string,
  rawAttrs: ParsedAttr[]
): string {
  const kept = new Map<string, { value: string; hasValue: boolean }>();

  for (const attr of rawAttrs) {
    const attrName = attr.name.toLowerCase();
    if (!attrName || attrName === 'style' || attrName.startsWith('on')) {
      continue;
    }
    const isAllowed =
      ALLOWED_ATTR_SET.has(attrName) ||
      (MARKON_DOMPURIFY_CONFIG.ALLOW_DATA_ATTR &&
        DATA_ATTR_NAME_RE.test(attrName));
    if (!isAllowed || kept.has(attrName)) {
      continue;
    }

    if (attrName === 'href' || attrName === 'src') {
      const safeUrl = sanitizeUrl(decodeEntities(attr.value));
      kept.set(attrName, { value: safeUrl, hasValue: true });
    } else {
      kept.set(attrName, {
        value: attr.hasValue ? decodeEntities(attr.value) : '',
        hasValue: attr.hasValue,
      });
    }
  }

  if (tagName === 'a' && !kept.has('href')) {
    kept.set('href', { value: '#', hasValue: true });
  }

  let out = '';
  for (const [name, entry] of kept.entries()) {
    if (entry.hasValue) {
      out += ` ${name}="${escapeHtml(entry.value)}"`;
    } else {
      out += ` ${name}`;
    }
  }
  return out;
}

/**
 * Deterministic zero-dependency HTML allowlist tokenizer & sanitizer for Node / SSR / Edge.
 * Enforces MARKON_DOMPURIFY_CONFIG without external DOM emulator dependencies.
 */
export function sanitizeHtmlSsr(html: string): string {
  const len = html.length;
  let out = '';
  let i = 0;

  while (i < len) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      out += html.slice(i);
      break;
    }
    if (lt > i) {
      out += html.slice(i, lt);
    }

    if (html.startsWith('<!--', lt)) {
      const commentEnd = html.indexOf('-->', lt + 4);
      if (commentEnd === -1) break;
      i = commentEnd + 3;
      continue;
    }

    if (html[lt + 1] === '!' || html[lt + 1] === '?') {
      const declEnd = html.indexOf('>', lt + 2);
      if (declEnd === -1) break;
      i = declEnd + 1;
      continue;
    }

    if (html[lt + 1] === '/') {
      let nameStart = lt + 2;
      while (nameStart < len && /[\s/]/.test(html[nameStart])) {
        nameStart++;
      }
      let nameEnd = nameStart;
      while (nameEnd < len && /[a-zA-Z0-9_-]/.test(html[nameEnd])) {
        nameEnd++;
      }
      const closeTagName = html.slice(nameStart, nameEnd).toLowerCase();
      const gt = html.indexOf('>', nameEnd);
      if (gt === -1) break;
      if (
        ALLOWED_TAG_SET.has(closeTagName) &&
        !VOID_TAG_SET.has(closeTagName)
      ) {
        out += `</${closeTagName}>`;
      }
      i = gt + 1;
      continue;
    }

    const firstTagChar = html[lt + 1];
    if (!firstTagChar || !/[a-zA-Z]/.test(firstTagChar)) {
      out += '&lt;';
      i = lt + 1;
      continue;
    }

    let nameEnd = lt + 1;
    while (nameEnd < len && /[a-zA-Z0-9_-]/.test(html[nameEnd])) {
      nameEnd++;
    }
    const tagName = html.slice(lt + 1, nameEnd).toLowerCase();
    const parsed = parseAttributes(html, nameEnd);

    if (!parsed.closed) {
      // Unclosed tag before EOF: drop unclosed forbid/disallowed tags completely
      if (FORBID_TAG_SET.has(tagName) || !ALLOWED_TAG_SET.has(tagName)) {
        break;
      }
      break;
    }

    i = parsed.endPos + 1;

    if (CONTAINER_FORBID_TAGS.has(tagName)) {
      if (!parsed.selfClosing) {
        i = findMatchingCloseTagEnd(html, i, tagName);
      }
      continue;
    }

    if (FORBID_TAG_SET.has(tagName) || !ALLOWED_TAG_SET.has(tagName)) {
      continue;
    }

    const attrStr = sanitizeAllowedAttributes(tagName, parsed.attrs);
    out += `<${tagName}${attrStr}>`;
  }

  return out;
}

/**
 * Sanitizes untrusted HTML using DOMPurify (browser DOM) or the zero-dependency SSR tokenizer (Node/Edge).
 * Strips dangerous tags (script, iframe, object, embed, style, svg animations) and event handlers.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  const purifier = getPurifier();
  if (purifier && typeof purifier.sanitize === 'function') {
    const clean = purifier.sanitize(html, MARKON_DOMPURIFY_CONFIG) as string;
    return sanitizeHtmlSsr(clean);
  }

  return sanitizeHtmlSsr(html);
}
