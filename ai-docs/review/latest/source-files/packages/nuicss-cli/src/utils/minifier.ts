import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Custom error class thrown when CSS input is syntactically malformed
 * and cannot be safely minified.
 */
export class MinificationError extends Error {
  line: number;
  column: number;

  constructor(message: string, line: number, column: number) {
    super(`Malformed CSS: ${message} at line ${line}, column ${column}`);
    this.name = 'MinificationError';
    this.line = line;
    this.column = column;
  }
}

export type TokenType =
  | 'whitespace'
  | 'comment'
  | 'string'
  | 'url'
  | 'at-keyword'
  | 'ident'
  | 'number'
  | 'dimension'
  | 'percentage'
  | 'hash'
  | 'symbol';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface MinifyOptions {
  /**
   * If true, bypasses native lightningcss and forces the pure CSS-aware JS engine.
   * Useful for testing, standalone binary execution, or when native addon loading is restricted.
   */
  forceJs?: boolean;
}

const MATH_FUNCTIONS = new Set([
  'calc',
  'min',
  'max',
  'clamp',
  'round',
  'mod',
  'rem',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'atan2',
  'pow',
  'sqrt',
  'hypot',
  'log',
  'exp',
  'abs',
  'sign',
]);

let cachedLightningCssTransform:
  | ((options: Record<string, unknown>) => { code: Buffer })
  | null
  | undefined;

function getLightningCss():
  | ((options: Record<string, unknown>) => { code: Buffer })
  | null {
  if (cachedLightningCssTransform !== undefined) {
    return cachedLightningCssTransform;
  }
  try {
    const { transform } = require('lightningcss');
    cachedLightningCssTransform = transform;
    return transform;
  } catch {
    cachedLightningCssTransform = null;
    return null;
  }
}

/**
 * Tokenize CSS according to CSS Syntax Module Level 3 with accurate source locations.
 */
export function tokenizeCss(css: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let line = 1;
  let column = 1;
  const len = css.length;

  function advance(count = 1): string {
    const start = index;
    for (let i = 0; i < count && index < len; i++) {
      if (css[index] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
      index++;
    }
    return css.slice(start, index);
  }

  function peek(offset = 0): string {
    return index + offset < len ? css[index + offset] : '';
  }

  function isWhitespace(ch: string): boolean {
    return (
      ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n' || ch === '\f'
    );
  }

  function isIdentStartChar(ch: string): boolean {
    return (
      (ch >= 'a' && ch <= 'z') ||
      (ch >= 'A' && ch <= 'Z') ||
      ch === '_' ||
      ch === '\\' ||
      ch.charCodeAt(0) >= 0x80
    );
  }

  function startsIdent(ch: string, p1: string): boolean {
    if (ch === '-') {
      // Custom property (--foo) or vendor prefix (-webkit-)
      return p1 === '-' || isIdentStartChar(p1);
    }
    return isIdentStartChar(ch);
  }

  function isIdentChar(ch: string): boolean {
    return isIdentStartChar(ch) || ch === '-' || (ch >= '0' && ch <= '9');
  }

  while (index < len) {
    const startLine = line;
    const startCol = column;
    const ch = css[index];
    const p1 = peek(1);
    const p2 = peek(2);

    // 1. Whitespace
    if (isWhitespace(ch)) {
      let ws = '';
      while (index < len && isWhitespace(css[index])) {
        ws += advance();
      }
      tokens.push({
        type: 'whitespace',
        value: ws,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 2. Comments
    if (ch === '/' && p1 === '*') {
      advance(2); // Skip /*
      let closed = false;
      while (index < len) {
        if (css[index] === '*' && peek(1) === '/') {
          advance(2);
          closed = true;
          break;
        }
        advance();
      }
      if (!closed) {
        throw new MinificationError('Unclosed comment', startLine, startCol);
      }
      tokens.push({
        type: 'comment',
        value: '',
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 3. Strings (double or single quoted)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let str = advance(); // Include starting quote
      let closed = false;
      while (index < len) {
        const curr = css[index];
        if (curr === '\\') {
          str += advance(); // consume \
          if (index < len) {
            if (css[index] === '\r' && peek(1) === '\n') {
              str += advance(2);
            } else {
              str += advance();
            }
          }
        } else if (curr === '\n' || curr === '\r') {
          // Unescaped raw newline inside string literal is invalid CSS
          throw new MinificationError('Unclosed string', startLine, startCol);
        } else if (curr === quote) {
          str += advance(); // consume closing quote
          closed = true;
          break;
        } else {
          str += advance();
        }
      }
      if (!closed) {
        throw new MinificationError('Unclosed string', startLine, startCol);
      }
      tokens.push({
        type: 'string',
        value: str,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 4. url(...) function (quoted or unquoted, data URIs)
    if (
      (ch === 'u' || ch === 'U') &&
      css.slice(index, index + 4).toLowerCase() === 'url(' &&
      (tokens.length === 0 || tokens[tokens.length - 1].type !== 'ident')
    ) {
      advance(4); // consume url(
      while (index < len && isWhitespace(css[index])) {
        advance();
      }
      let urlToken = 'url(';
      if (index < len && (css[index] === '"' || css[index] === "'")) {
        const quote = css[index];
        let str = advance();
        let closed = false;
        while (index < len) {
          const curr = css[index];
          if (curr === '\\') {
            str += advance();
            if (index < len) str += advance();
          } else if (curr === quote) {
            str += advance();
            closed = true;
            break;
          } else {
            str += advance();
          }
        }
        if (!closed) {
          throw new MinificationError(
            'Unclosed string in url',
            startLine,
            startCol
          );
        }
        while (index < len && isWhitespace(css[index])) {
          advance();
        }
        if (index >= len || css[index] !== ')') {
          throw new MinificationError(
            "Unclosed url function (missing ')')",
            startLine,
            startCol
          );
        }
        advance(); // consume )
        urlToken += str + ')';
      } else {
        let rawContent = '';
        let closed = false;
        while (index < len) {
          const curr = css[index];
          if (curr === '\\') {
            rawContent += advance();
            if (index < len) rawContent += advance();
          } else if (curr === ')') {
            advance(); // consume )
            closed = true;
            break;
          } else if (curr === '(') {
            throw new MinificationError(
              "Unclosed url function (unexpected '(')",
              startLine,
              startCol
            );
          } else {
            rawContent += advance();
          }
        }
        if (!closed) {
          throw new MinificationError(
            "Unclosed url function (missing ')')",
            startLine,
            startCol
          );
        }
        urlToken += rawContent.trim() + ')';
      }
      tokens.push({
        type: 'url',
        value: urlToken,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 5. At-keyword: @media, @keyframes, @supports, @container, etc.
    if (ch === '@') {
      let atVal = advance();
      while (index < len && isIdentChar(css[index])) {
        if (css[index] === '\\') {
          atVal += advance();
          if (index < len) atVal += advance();
        } else {
          atVal += advance();
        }
      }
      tokens.push({
        type: 'at-keyword',
        value: atVal,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 6. Hash / Hex color / ID selector: #ident
    if (ch === '#') {
      let hashVal = advance();
      while (index < len && isIdentChar(css[index])) {
        if (css[index] === '\\') {
          hashVal += advance();
          if (index < len) hashVal += advance();
        } else {
          hashVal += advance();
        }
      }
      tokens.push({
        type: 'hash',
        value: hashVal,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 7. Numbers, Dimensions, Percentages
    const isSign = ch === '+' || ch === '-';
    const nextChar = isSign ? p1 : ch;
    const isDigit = nextChar >= '0' && nextChar <= '9';
    const isDotDigit =
      nextChar === '.' &&
      (isSign ? p2 >= '0' && p2 <= '9' : p1 >= '0' && p1 <= '9');

    if (isDigit || isDotDigit) {
      let numVal = '';
      if (isSign) numVal += advance();
      if (css[index] === '.') numVal += advance();
      while (index < len && css[index] >= '0' && css[index] <= '9') {
        numVal += advance();
      }
      if (css[index] === '.' && !numVal.includes('.')) {
        numVal += advance();
        while (index < len && css[index] >= '0' && css[index] <= '9') {
          numVal += advance();
        }
      }
      if (
        (css[index] === 'e' || css[index] === 'E') &&
        ((peek(1) >= '0' && peek(1) <= '9') ||
          ((peek(1) === '+' || peek(1) === '-') &&
            peek(2) >= '0' &&
            peek(2) <= '9'))
      ) {
        numVal += advance(); // e
        if (css[index] === '+' || css[index] === '-') numVal += advance();
        while (index < len && css[index] >= '0' && css[index] <= '9') {
          numVal += advance();
        }
      }
      if (css[index] === '%') {
        numVal += advance();
        tokens.push({
          type: 'percentage',
          value: numVal,
          line: startLine,
          column: startCol,
        });
        continue;
      }
      if (index < len && startsIdent(css[index], peek(1))) {
        while (index < len && isIdentChar(css[index])) {
          if (css[index] === '\\') {
            numVal += advance();
            if (index < len) numVal += advance();
          } else {
            numVal += advance();
          }
        }
        tokens.push({
          type: 'dimension',
          value: numVal,
          line: startLine,
          column: startCol,
        });
        continue;
      }
      tokens.push({
        type: 'number',
        value: numVal,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 8. Identifiers (including custom properties --*, escapes .\!container, .café)
    if (startsIdent(ch, p1)) {
      let identVal = '';
      while (index < len && isIdentChar(css[index])) {
        if (css[index] === '\\') {
          identVal += advance();
          if (index < len) {
            let hex = '';
            while (
              index < len &&
              hex.length < 6 &&
              ((css[index] >= '0' && css[index] <= '9') ||
                (css[index] >= 'a' && css[index] <= 'f') ||
                (css[index] >= 'A' && css[index] <= 'F'))
            ) {
              hex += advance();
            }
            identVal += hex;
            if (hex.length > 0 && index < len && isWhitespace(css[index])) {
              identVal += advance();
            } else if (hex.length === 0 && index < len) {
              identVal += advance();
            }
          }
        } else {
          identVal += advance();
        }
      }
      tokens.push({
        type: 'ident',
        value: identVal,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 9. Multi-char Symbols: ~=, |=, ^=, $=, *=, ||
    const twoChars = ch + p1;
    if (['~=', '|=', '^=', '$=', '*=', '||'].includes(twoChars)) {
      advance(2);
      tokens.push({
        type: 'symbol',
        value: twoChars,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 10. Single-char Symbols: { } ( ) [ ] ; : , > + - * / & = . ~
    advance(1);
    tokens.push({
      type: 'symbol',
      value: ch,
      line: startLine,
      column: startCol,
    });
  }

  return tokens;
}

/**
 * Validate token structure (braces, parens, brackets balance).
 */
export function validateCssStructure(tokens: Token[]): void {
  let braceDepth = 0;

  let parenDepth = 0;
  let bracketDepth = 0;

  for (const token of tokens) {
    if (token.type === 'symbol') {
      if (token.value === '{') braceDepth++;
      else if (token.value === '}') {
        braceDepth--;
        if (braceDepth < 0) {
          throw new MinificationError(
            "Unexpected closing brace '}'",
            token.line,
            token.column
          );
        }
      } else if (token.value === '(') parenDepth++;
      else if (token.value === ')') {
        parenDepth--;
        if (parenDepth < 0) {
          throw new MinificationError(
            "Unexpected closing parenthesis ')'",
            token.line,
            token.column
          );
        }
      } else if (token.value === '[') bracketDepth++;
      else if (token.value === ']') {
        bracketDepth--;
        if (bracketDepth < 0) {
          throw new MinificationError(
            "Unexpected closing bracket ']'",
            token.line,
            token.column
          );
        }
      }
    }
  }

  const lastToken = tokens[tokens.length - 1] || { line: 1, column: 1 };
  if (braceDepth > 0) {
    throw new MinificationError(
      "Unclosed block (missing '}')",
      lastToken.line,
      lastToken.column
    );
  }
  if (parenDepth > 0) {
    throw new MinificationError(
      "Unclosed parenthesis (missing ')')",
      lastToken.line,
      lastToken.column
    );
  }
  if (bracketDepth > 0) {
    throw new MinificationError(
      "Unclosed bracket (missing ']')",
      lastToken.line,
      lastToken.column
    );
  }
}

/**
 * Pure JavaScript CSS-aware minifier using a token stream state machine.
 * Correctly preserves strings, data URLs, math function operators, custom properties,
 * nested rules, at-rules, escaped selectors, and unicode.
 */
export function cssAwareMinify(css: string): string {
  if (!css || !css.trim()) {
    return '';
  }

  const tokens = tokenizeCss(css);
  validateCssStructure(tokens);

  interface ProcessedToken {
    type: TokenType;
    value: string;
    hasLeadingSpace: boolean;
    line: number;
    column: number;
  }

  const cleanTokens: ProcessedToken[] = [];
  let pendingSpace = false;

  for (const token of tokens) {
    if (token.type === 'comment') {
      pendingSpace = true;
      continue;
    }
    if (token.type === 'whitespace') {
      pendingSpace = true;
      continue;
    }
    cleanTokens.push({
      type: token.type,
      value: token.value,
      hasLeadingSpace: pendingSpace,
      line: token.line,
      column: token.column,
    });
    pendingSpace = false;
  }

  if (cleanTokens.length === 0) {
    return '';
  }

  let output = '';
  const parenStack: { name: string; isMath: boolean }[] = [];

  let bracketDepth = 0;

  for (let i = 0; i < cleanTokens.length; i++) {
    const prev = i > 0 ? cleanTokens[i - 1] : null;
    const curr = cleanTokens[i];
    const next = i + 1 < cleanTokens.length ? cleanTokens[i + 1] : null;

    const inMath = parenStack.some((p) => p.isMath);

    // Track state transitions before emitting curr
    if (curr.type === 'symbol') {
      if (curr.value === '[') bracketDepth++;
      else if (curr.value === ']') bracketDepth--;
      else if (curr.value === '(') {
        const funcName =
          prev && prev.type === 'ident' && !curr.hasLeadingSpace
            ? prev.value.toLowerCase()
            : '';
        const isMathFunc = MATH_FUNCTIONS.has(funcName) || inMath;
        parenStack.push({ name: funcName, isMath: isMathFunc });
      }
    }

    let spaceNeeded = false;

    if (prev && curr.hasLeadingSpace) {
      if (inMath) {
        if (
          curr.type === 'symbol' &&
          (curr.value === '+' || curr.value === '-')
        ) {
          const isBinary =
            prev.type === 'number' ||
            prev.type === 'dimension' ||
            prev.type === 'percentage' ||
            prev.type === 'ident' ||
            (prev.type === 'symbol' && prev.value === ')');
          if (isBinary) {
            spaceNeeded = true;
          }
        } else if (
          prev.type === 'symbol' &&
          (prev.value === '+' || prev.value === '-')
        ) {
          spaceNeeded = true;
        } else if (
          (prev.type === 'ident' ||
            prev.type === 'number' ||
            prev.type === 'dimension' ||
            prev.type === 'percentage') &&
          (curr.type === 'ident' ||
            curr.type === 'number' ||
            curr.type === 'dimension' ||
            curr.type === 'percentage')
        ) {
          spaceNeeded = true;
        }
      } else if (bracketDepth > 0) {
        if (prev.type === 'string' && curr.type === 'ident') {
          spaceNeeded = true;
        }
      } else {
        const prevIsWord =
          prev.type === 'ident' ||
          prev.type === 'number' ||
          prev.type === 'dimension' ||
          prev.type === 'percentage' ||
          prev.type === 'string' ||
          prev.type === 'url' ||
          prev.type === 'hash' ||
          prev.type === 'at-keyword';

        const currIsWord =
          curr.type === 'ident' ||
          curr.type === 'number' ||
          curr.type === 'dimension' ||
          curr.type === 'percentage' ||
          curr.type === 'string' ||
          curr.type === 'url' ||
          curr.type === 'hash';

        if (prevIsWord && currIsWord) {
          spaceNeeded = true;
        } else if (
          prev.type === 'symbol' &&
          (prev.value === ')' || prev.value === ']') &&
          currIsWord
        ) {
          spaceNeeded = true;
        } else if (
          prev.type === 'at-keyword' &&
          (curr.type === 'ident' ||
            curr.type === 'string' ||
            (curr.type === 'symbol' && curr.value === '('))
        ) {
          spaceNeeded = true;
        } else if (
          prev.type === 'ident' &&
          curr.type === 'symbol' &&
          curr.value === '('
        ) {
          spaceNeeded = true;
        } else if (
          (prev.type === 'ident' ||
            prev.type === 'hash' ||
            (prev.type === 'symbol' &&
              (prev.value === ']' ||
                prev.value === ')' ||
                prev.value === '&' ||
                prev.value === '*'))) &&
          (curr.type === 'ident' ||
            (curr.type === 'symbol' &&
              (curr.value === '.' ||
                curr.value === '#' ||
                curr.value === '&' ||
                curr.value === '*' ||
                curr.value === '[' ||
                curr.value === ':')))
        ) {
          spaceNeeded = true;
        }
      }
    }

    // Mandatory spaces around binary + and - inside math expressions
    if (
      inMath &&
      curr.type === 'symbol' &&
      (curr.value === '+' || curr.value === '-')
    ) {
      const isBinary =
        prev &&
        (prev.type === 'number' ||
          prev.type === 'dimension' ||
          prev.type === 'percentage' ||
          prev.type === 'ident' ||
          (prev.type === 'symbol' && prev.value === ')'));
      if (isBinary) {
        if (!output.endsWith(' ')) output += ' ';
        spaceNeeded = false;
      }
    }

    // Semicolon optimization: omit ';' before '}'
    if (curr.type === 'symbol' && curr.value === ';') {
      if (next && next.type === 'symbol' && next.value === '}') {
        continue;
      }
    }

    if (spaceNeeded && !output.endsWith(' ')) {
      output += ' ';
    }

    output += curr.value;

    // Ensure space after binary + or - in math expressions
    if (
      inMath &&
      curr.type === 'symbol' &&
      (curr.value === '+' || curr.value === '-')
    ) {
      const isBinary =
        prev &&
        (prev.type === 'number' ||
          prev.type === 'dimension' ||
          prev.type === 'percentage' ||
          prev.type === 'ident' ||
          (prev.type === 'symbol' && prev.value === ')'));
      if (isBinary && !output.endsWith(' ')) {
        output += ' ';
      }
    }

    // Track pop after emitting closing parenthesis
    if (curr.type === 'symbol' && curr.value === ')') {
      parenStack.pop();
    }
  }

  return output.trim();
}

/**
 * Minify CSS using lightningcss if available and not forced to JS,
 * falling back to the built-in zero-dependency CSS-aware JavaScript minifier.
 */
export function minifyCss(css: string, options?: MinifyOptions): string {
  if (!css || !css.trim()) {
    return '';
  }

  const transform = options?.forceJs ? null : getLightningCss();
  if (transform) {
    try {
      const { code } = transform({
        filename: 'output.css',
        code: Buffer.from(css),
        minify: true,
      });
      return code.toString();
    } catch {
      // If lightningcss throws (e.g. native error), fall back to built-in pure JS minifier
      return cssAwareMinify(css);
    }
  }

  return cssAwareMinify(css);
}

export default minifyCss;
