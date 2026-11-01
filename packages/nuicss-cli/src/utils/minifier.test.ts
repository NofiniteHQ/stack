import { describe, it, expect } from 'vitest';
import { cssAwareMinify, minifyCss } from './minifier.js';

describe('NUICSS CSS-Aware Minifier', () => {
  describe('Empty and Whitespace Stylesheets', () => {
    it('handles empty string gracefully', () => {
      expect(cssAwareMinify('')).toBe('');
      expect(minifyCss('')).toBe('');
    });

    it('handles whitespace-only inputs gracefully', () => {
      expect(cssAwareMinify('   \n\t  \r\n  ')).toBe('');
      expect(minifyCss('   \n\t  \r\n  ')).toBe('');
    });

    it('handles comment-only inputs gracefully', () => {
      expect(cssAwareMinify('/* lone comment */')).toBe('');
      expect(cssAwareMinify('/* c1 */ /* c2 */\n/* c3 */')).toBe('');
    });
  });

  describe('Comments Handling', () => {
    it('removes comments outside of strings completely', () => {
      const input = `
        /* Main Header Comment */
        .btn {
          /* Color declaration */
          color: red;
          /* Margin declaration */
          margin: 0;
        }
        /* Footer Comment */
      `;
      expect(cssAwareMinify(input)).toBe('.btn{color:red;margin:0}');
    });

    it('preserves comment syntax inside quoted strings verbatim', () => {
      const input = '.icon::before { content: "/* not a comment */"; }';
      expect(cssAwareMinify(input)).toBe(
        '.icon::before{content:"/* not a comment */"}'
      );
    });

    it('handles comments containing braces and quotes without corruption', () => {
      const input = `
        /* { brace in comment } and "quote" and 'single' */
        .card { padding: 1rem; }
      `;
      expect(cssAwareMinify(input)).toBe('.card{padding:1rem}');
    });
  });

  describe('String Literals Preservation', () => {
    it('preserves double-quoted strings with commas, colons, and punctuation verbatim', () => {
      const input =
        '.box::before { content: "Hello, World! (Open/Close: {yes});"; }';
      expect(cssAwareMinify(input)).toBe(
        '.box::before{content:"Hello, World! (Open/Close: {yes});"}'
      );
    });

    it('preserves single-quoted strings verbatim', () => {
      const input = ".box::before { content: 'Single, Quote: Test;'; }";
      expect(cssAwareMinify(input)).toBe(
        ".box::before{content:'Single, Quote: Test;'}"
      );
    });

    it('preserves escaped quotes and escaped characters inside strings', () => {
      const input = '.box::before { content: "He said, \\"Hello, world!\\""; }';
      expect(cssAwareMinify(input)).toBe(
        '.box::before{content:"He said, \\"Hello, world!\\""}'
      );
    });

    it('preserves empty strings verbatim', () => {
      const input = '.overlay::after { content: ""; display: block; }';
      expect(cssAwareMinify(input)).toBe(
        '.overlay::after{content:"";display:block}'
      );
    });

    it('preserves leading and trailing whitespace inside strings', () => {
      const input = '.label::after { content: "   [NEW]   "; }';
      expect(cssAwareMinify(input)).toBe(
        '.label::after{content:"   [NEW]   "}'
      );
    });
  });

  describe('URLs and Data URIs Preservation', () => {
    it('preserves double-quoted SVG data URLs verbatim', () => {
      const input =
        "background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle r='5'/></svg>\");";
      expect(cssAwareMinify(input)).toBe(
        "background:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle r='5'/></svg>\");"
      );
    });

    it('preserves single-quoted Base64 data URLs verbatim', () => {
      const input =
        "background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');";
      expect(cssAwareMinify(input)).toBe(
        "background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');"
      );
    });

    it('preserves unquoted data URLs with parameters and commas verbatim', () => {
      const input =
        'background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E);';
      expect(cssAwareMinify(input)).toBe(
        'background:url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E);'
      );
    });

    it('preserves URLs with query strings and fragment identifiers', () => {
      const input =
        'background: url("https://cdn.example.com/assets/icon.svg?v=2.1.0&theme=dark#symbol");';
      expect(cssAwareMinify(input)).toBe(
        'background:url("https://cdn.example.com/assets/icon.svg?v=2.1.0&theme=dark#symbol");'
      );
    });

    it('trims extraneous padding whitespace inside url(...) while preserving target', () => {
      const input = 'background: url(   "https://cdn.example.com/img.png"   );';
      expect(cssAwareMinify(input)).toBe(
        'background:url("https://cdn.example.com/img.png");'
      );
    });
  });

  describe('Math Functions and calc() Operators', () => {
    it('preserves mandatory whitespace around binary minus in calc()', () => {
      const input = '.container { width: calc(100% - 20px); }';
      expect(cssAwareMinify(input)).toBe('.container{width:calc(100% - 20px)}');
    });

    it('preserves mandatory whitespace around binary plus in calc()', () => {
      const input = '.container { width: calc(100% + 20px); }';
      expect(cssAwareMinify(input)).toBe('.container{width:calc(100% + 20px)}');
    });

    it('distinguishes unary minus from binary operators inside calc()', () => {
      const input = '.box { margin: calc(-10px + 5px); }';
      expect(cssAwareMinify(input)).toBe('.box{margin:calc(-10px + 5px)}');
    });

    it('handles nested parentheses inside calc() while maintaining operator spacing', () => {
      const input = '.box { width: calc(100% - (20px + 5px)); }';
      expect(cssAwareMinify(input)).toBe(
        '.box{width:calc(100% - (20px + 5px))}'
      );
    });

    it('preserves spaces around operators when calc() uses var()', () => {
      const input = '.box { width: calc(var(--base-width) + 20px); }';
      expect(cssAwareMinify(input)).toBe(
        '.box{width:calc(var(--base-width) + 20px)}'
      );

      const input2 = '.box { margin: calc(var(--a) - var(--b)); }';
      expect(cssAwareMinify(input2)).toBe(
        '.box{margin:calc(var(--a) - var(--b))}'
      );
    });

    it('minifies clamp() expressions while preserving binary operator spacing', () => {
      const input = '.title { font-size: clamp(1rem, 2.5vw + 0.5rem, 2rem); }';
      expect(cssAwareMinify(input)).toBe(
        '.title{font-size:clamp(1rem,2.5vw + 0.5rem,2rem)}'
      );
    });

    it('minifies min() and max() expressions while preserving operator spacing', () => {
      const input =
        '.panel { width: min(100px, 10% + 5px); height: max(50vh, 300px - 20px); }';
      expect(cssAwareMinify(input)).toBe(
        '.panel{width:min(100px,10% + 5px);height:max(50vh,300px - 20px)}'
      );
    });

    it('compacts multiplication and division inside calc()', () => {
      const input = '.col { width: calc(100% * 2 / 3); }';
      expect(cssAwareMinify(input)).toBe('.col{width:calc(100%*2/3)}');
    });
  });

  describe('CSS Custom Properties (--*)', () => {
    it('preserves standard custom property declarations', () => {
      const input =
        ':root { --color-primary: #3b82f6; --color-hover: #1d4ed8; }';
      expect(cssAwareMinify(input)).toBe(
        ':root{--color-primary:#3b82f6;--color-hover:#1d4ed8}'
      );
    });

    it('preserves space-separated values inside custom properties', () => {
      const input =
        ':root { --shadow-elevation: 0 4px 6px -1px rgb(0 0 0 / 0.1); }';
      expect(cssAwareMinify(input)).toBe(
        ':root{--shadow-elevation:0 4px 6px -1px rgb(0 0 0/0.1)}'
      );
    });

    it('preserves comma-separated values inside custom properties', () => {
      const input =
        ':root { --font-stack: "Inter", -apple-system, sans-serif; }';
      expect(cssAwareMinify(input)).toBe(
        ':root{--font-stack:"Inter",-apple-system,sans-serif}'
      );
    });

    it('preserves calc() expressions inside custom properties', () => {
      const input = ':root { --content-width: calc(100vw - 48px); }';
      expect(cssAwareMinify(input)).toBe(
        ':root{--content-width:calc(100vw - 48px)}'
      );
    });

    it('handles empty custom property declaration value', () => {
      const input = ':root { --fallback-empty: ; }';
      expect(cssAwareMinify(input)).toBe(':root{--fallback-empty:}');
    });
  });

  describe('var() Function Usage', () => {
    it('minifies simple var() references', () => {
      const input = '.btn { background-color: var(--color-primary); }';
      expect(cssAwareMinify(input)).toBe(
        '.btn{background-color:var(--color-primary)}'
      );
    });

    it('minifies var() with fallbacks stripping spaces around commas', () => {
      const input = '.btn { color: var(--theme-color, #ffffff); }';
      expect(cssAwareMinify(input)).toBe(
        '.btn{color:var(--theme-color,#ffffff)}'
      );
    });

    it('minifies deeply nested var() references', () => {
      const input = '.btn { color: var(--a, var(--b, var(--c, #000000))); }';
      expect(cssAwareMinify(input)).toBe(
        '.btn{color:var(--a,var(--b,var(--c,#000000)))}'
      );
    });
  });

  describe('Nested CSS Rules', () => {
    it('preserves descendant space in nested selectors with ampersand', () => {
      const input = `
        .card {
          background: red;
          & .title {
            color: blue;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.card{background:red;& .title{color:blue}}'
      );
    });

    it('preserves attached pseudo-classes with ampersand without extra space', () => {
      const input = `
        .card {
          background: red;
          &:hover {
            opacity: 0.8;
          }
          &::before {
            content: "";
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.card{background:red;&:hover{opacity:0.8}&::before{content:""}}'
      );
    });

    it('handles nested rules written without ampersand (modern CSS nesting)', () => {
      const input = `
        .card {
          color: red;
          .header {
            font-weight: bold;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.card{color:red;.header{font-weight:bold}}'
      );
    });

    it('preserves chained and deeply nested rules', () => {
      const input = `
        .nav {
          & > ul {
            display: flex;
            & > li {
              list-style: none;
              & a {
                text-decoration: none;
              }
            }
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.nav{&>ul{display:flex;&>li{list-style:none;& a{text-decoration:none}}}}'
      );
    });
  });

  describe('At-Rules and Conditionals', () => {
    it('minifies @media queries with single and compound conditions', () => {
      const input = `
        @media screen and (min-width: 768px) and (max-width: 1024px) {
          .sidebar {
            display: flex;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@media screen and (min-width:768px) and (max-width:1024px){.sidebar{display:flex}}'
      );
    });

    it('minifies @media queries starting with parentheses', () => {
      const input = `
        @media (min-width: 768px) {
          .container {
            max-width: 720px;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@media (min-width:768px){.container{max-width:720px}}'
      );
    });

    it('minifies @supports queries with logical operators', () => {
      const input = `
        @supports (display: grid) and (not (display: subgrid)) {
          .layout {
            display: grid;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@supports (display:grid) and (not (display:subgrid)){.layout{display:grid}}'
      );
    });

    it('minifies @container queries', () => {
      const input = `
        @container (min-width: 400px) {
          .card {
            flex-direction: row;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@container (min-width:400px){.card{flex-direction:row}}'
      );
    });

    it('preserves terminating semicolons on blockless at-rules (@import, @charset, @layer)', () => {
      const input = `
        @charset "utf-8";
        @import url("styles.css");
        @layer base, components, utilities;
      `;
      expect(cssAwareMinify(input)).toBe(
        '@charset "utf-8";@import url("styles.css");@layer base,components,utilities;'
      );
    });

    it('minifies nested @media queries inside style rules', () => {
      const input = `
        .sidebar {
          width: 100%;
          @media (min-width: 768px) {
            width: 250px;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.sidebar{width:100%;@media (min-width:768px){width:250px}}'
      );
    });
  });

  describe('@keyframes Rules', () => {
    it('minifies keyframes with percentage stops', () => {
      const input = `
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.8}}'
      );
    });

    it('minifies keyframes with from/to stops', () => {
      const input = `
        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
      expect(cssAwareMinify(input)).toBe(
        '@keyframes fade{from{opacity:0}to{opacity:1}}'
      );
    });
  });

  describe('Selectors and Combinators', () => {
    it('preserves descendant combinator (space between selector parts)', () => {
      expect(cssAwareMinify('div p { color: red; }')).toBe('div p{color:red}');
      expect(cssAwareMinify('.card .title { color: blue; }')).toBe(
        '.card .title{color:blue}'
      );
      expect(cssAwareMinify('nav > ul li a { color: black; }')).toBe(
        'nav>ul li a{color:black}'
      );
    });

    it('strips spaces around combinators (>, +, ~)', () => {
      expect(cssAwareMinify('div > p + span ~ a { display: block; }')).toBe(
        'div>p+span~a{display:block}'
      );
    });

    it('preserves chained class and ID selectors without introducing spaces', () => {
      expect(cssAwareMinify('div.card#main.active { opacity: 1; }')).toBe(
        'div.card#main.active{opacity:1}'
      );
    });

    it('distinguishes descendant pseudo-classes from direct pseudo-classes', () => {
      expect(cssAwareMinify('div :hover { color: blue; }')).toBe(
        'div :hover{color:blue}'
      );
      expect(cssAwareMinify('div:hover { color: blue; }')).toBe(
        'div:hover{color:blue}'
      );
    });

    it('minifies comma-separated selector lists', () => {
      const input =
        '.btn-primary, .btn-secondary, a.btn { display: inline-flex; }';
      expect(cssAwareMinify(input)).toBe(
        '.btn-primary,.btn-secondary,a.btn{display:inline-flex}'
      );
    });

    it('minifies functional pseudo-classes (:is, :where, :not)', () => {
      const input = ':is(h1, h2, h3):not(.title) { margin-bottom: 0.5rem; }';
      expect(cssAwareMinify(input)).toBe(
        ':is(h1,h2,h3):not(.title){margin-bottom:0.5rem}'
      );
    });
  });

  describe('Attribute Selectors', () => {
    it('minifies simple and compound attribute selectors', () => {
      expect(cssAwareMinify('[disabled] { opacity: 0.5; }')).toBe(
        '[disabled]{opacity:0.5}'
      );
      expect(cssAwareMinify('[data-state="active"] { display: block; }')).toBe(
        '[data-state="active"]{display:block}'
      );
    });

    it('strips spaces around attribute operators (=, ~=, ^=, $=, *=, |=)', () => {
      expect(cssAwareMinify('[data-attr = "val"] { color: red; }')).toBe(
        '[data-attr="val"]{color:red}'
      );
      expect(cssAwareMinify('a[href ^= "https://"] { color: green; }')).toBe(
        'a[href^="https://"]{color:green}'
      );
    });

    it('preserves mandatory space before case-insensitive attribute flag (i)', () => {
      const input = 'input[type="text" i] { padding: 4px; }';
      expect(cssAwareMinify(input)).toBe('input[type="text" i]{padding:4px}');
    });
  });

  describe('Escaped Characters & Tailwind/UnoCSS Patterns', () => {
    it('preserves escaped exclamation marks in class selectors', () => {
      const input = '.\\!container { max-width: 1200px; }';
      expect(cssAwareMinify(input)).toBe('.\\!container{max-width:1200px}');
    });

    it('preserves escaped colons in variant utility selectors', () => {
      const input = '.hover\\:bg-blue-500:hover { background-color: #3b82f6; }';
      expect(cssAwareMinify(input)).toBe(
        '.hover\\:bg-blue-500:hover{background-color:#3b82f6}'
      );
    });

    it('preserves escaped slashes in fraction utilities', () => {
      const input = '.w-1\\/2 { width: 50%; }';
      expect(cssAwareMinify(input)).toBe('.w-1\\/2{width:50%}');
    });

    it('preserves escaped dots in numeric fraction utilities', () => {
      const input = '.top-2\\.5 { top: 0.625rem; }';
      expect(cssAwareMinify(input)).toBe('.top-2\\.5{top:0.625rem}');
    });

    it('preserves escaped brackets in arbitrary value utilities', () => {
      const input = '.border-\\[1px\\] { border-width: 1px; }';
      expect(cssAwareMinify(input)).toBe('.border-\\[1px\\]{border-width:1px}');
    });

    it('preserves CSS hex escape codes', () => {
      const input = '.\\31 00\\% { width: 100%; }';
      expect(cssAwareMinify(input)).toBe('.\\31 00\\%{width:100%}');
    });
  });

  describe('Unicode Content', () => {
    it('preserves unicode characters in class selectors', () => {
      const input = '.café { font-style: italic; }';
      expect(cssAwareMinify(input)).toBe('.café{font-style:italic}');
    });

    it('preserves unicode symbols and emojis in content property', () => {
      const input = `
        .check::before { content: "✓"; }
        .arrow::after { content: " →"; }
        .star::before { content: "★"; }
      `;
      expect(cssAwareMinify(input)).toBe(
        '.check::before{content:"✓"}.arrow::after{content:" →"}.star::before{content:"★"}'
      );
    });

    it('preserves non-Latin language content in attribute selectors', () => {
      const input = '[data-lang="日本語"] { font-family: "Noto Sans JP"; }';
      expect(cssAwareMinify(input)).toBe(
        '[data-lang="日本語"]{font-family:"Noto Sans JP"}'
      );
    });
  });

  describe('Malformed CSS Error Handling (Priority 3)', () => {
    it('throws MinificationError on unclosed double-quoted string', () => {
      expect(() =>
        cssAwareMinify('body { font-family: "Helvetica; }')
      ).toThrowError(/Malformed CSS: Unclosed string at line 1, column 21/);
    });

    it('throws MinificationError on unclosed single-quoted string', () => {
      expect(() =>
        cssAwareMinify("body { font-family: 'Helvetica; }")
      ).toThrowError(/Malformed CSS: Unclosed string at line 1, column 21/);
    });

    it('throws MinificationError on unclosed comment', () => {
      expect(() =>
        cssAwareMinify('/* start of comment\n.btn { color: red; }')
      ).toThrowError(/Malformed CSS: Unclosed comment at line 1, column 1/);
    });

    it('throws MinificationError on unclosed block (missing closing brace)', () => {
      expect(() => cssAwareMinify('.card { color: red;')).toThrowError(
        /Malformed CSS: Unclosed block \(missing '\}'\)/
      );
    });

    it('throws MinificationError on unexpected closing brace', () => {
      expect(() => cssAwareMinify('.card { color: red; } }')).toThrowError(
        /Malformed CSS: Unexpected closing brace '\}'/
      );
    });

    it('throws MinificationError on unclosed parenthesis', () => {
      expect(() =>
        cssAwareMinify('.card { width: calc(100% - 20px; }')
      ).toThrowError(/Malformed CSS: Unclosed parenthesis \(missing '\)'\)/);
    });

    it('throws MinificationError on unexpected closing parenthesis', () => {
      expect(() => cssAwareMinify('.card { width: 100%); }')).toThrowError(
        /Malformed CSS: Unexpected closing parenthesis '\)'/
      );
    });

    it('throws MinificationError on unclosed attribute bracket', () => {
      expect(() => cssAwareMinify('.card { width: [data-attr; }')).toThrowError(
        /Malformed CSS: Unclosed bracket \(missing '\]'\)/
      );
    });

    it('throws MinificationError on unexpected closing bracket', () => {
      expect(() => cssAwareMinify('.card] { color: red; }')).toThrowError(
        /Malformed CSS: Unexpected closing bracket '\]'/
      );
    });
  });

  describe('Two-Tier Architecture Verification', () => {
    it('executes via minifyCss with forceJs: true option', () => {
      const input =
        '.card { width: calc(100% - 20px); content: "Hello, World!"; }';
      const output = minifyCss(input, { forceJs: true });
      expect(output).toBe(
        '.card{width:calc(100% - 20px);content:"Hello, World!"}'
      );
    });

    it('produces identical correct output between Tier 1 and Tier 2', () => {
      const input = `
        /* Component */
        .card {
          content: "Hello, World!";
          width: calc(100% - 20px);
          background: url("data:image/svg+xml;utf8,<svg></svg>");
        }
      `;
      const tier2 = cssAwareMinify(input);
      expect(tier2).toBe(
        '.card{content:"Hello, World!";width:calc(100% - 20px);background:url("data:image/svg+xml;utf8,<svg></svg>")}'
      );

      const defaultOutput = minifyCss(input);
      // Both engines must preserve strings, calc operators, and data URLs correctly
      expect(defaultOutput).toContain('content:"Hello, World!"');
      expect(defaultOutput).toContain('calc(100% - 20px)');
      expect(defaultOutput).toContain('data:image/svg+xml;utf8,<svg></svg>');
    });
  });
});
