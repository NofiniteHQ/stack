import { Rule } from '../types';
import { fontSizes, fontWeights, leading } from '../tokens';

export const typographyRules: Rule[] = [
  // Font Family
  { pattern: /^font-sans$/, generator: () => 'font-family: var(--nui-font-sans, ui-sans-serif, system-ui, sans-serif);' },
  { pattern: /^font-serif$/, generator: () => 'font-family: var(--nui-font-serif, ui-serif, Georgia, serif);' },
  { pattern: /^font-mono$/, generator: () => 'font-family: var(--nui-font-mono, ui-monospace, SFMono-Regular, monospace);' },

  // Font Sizes
  {
    pattern: /^text-(xs|sm|base|lg|xl|[2-9]xl)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (fontSizes[val]) {
        return `font-size: var(--nui-text-${val}, ${fontSizes[val]});`;
      }
      return null;
    }
  },

  // Font Weights
  {
    pattern: /^font-(light|normal|medium|semibold|bold|extrabold)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (fontWeights[val]) {
        return `font-weight: var(--nui-weight-${val}, ${fontWeights[val]});`;
      }
      return null;
    }
  },

  // Line Height
  {
    pattern: /^leading-(none|tight|snug|normal|relaxed|loose)$/,
    generator: ({ match }) => {
      const val = match[1];
      if (leading[val]) {
        return `line-height: var(--nui-leading-${val}, ${leading[val]});`;
      }
      return null;
    }
  },
  { pattern: /^text-xs$/, generator: () => 'font-size: 0.75rem; line-height: 1rem;' },
  { pattern: /^text-sm$/, generator: () => 'font-size: 0.875rem; line-height: 1.25rem;' },
  { pattern: /^text-base$/, generator: () => 'font-size: 1rem; line-height: 1.5rem;' },
  { pattern: /^text-lg$/, generator: () => 'font-size: 1.125rem; line-height: 1.75rem;' },
  { pattern: /^text-xl$/, generator: () => 'font-size: 1.25rem; line-height: 1.75rem;' },
  { pattern: /^text-2xl$/, generator: () => 'font-size: 1.5rem; line-height: 2rem;' },
  { pattern: /^text-3xl$/, generator: () => 'font-size: 1.875rem; line-height: 2.25rem;' },
  { pattern: /^text-4xl$/, generator: () => 'font-size: 2.25rem; line-height: 2.5rem;' },
  { pattern: /^text-5xl$/, generator: () => 'font-size: 3rem; line-height: 1;' },
  { pattern: /^text-6xl$/, generator: () => 'font-size: 3.75rem; line-height: 1;' },

  // Alignment
  { pattern: /^text-left$/, generator: () => 'text-align: left;' },
  { pattern: /^text-center$/, generator: () => 'text-align: center;' },
  { pattern: /^text-right$/, generator: () => 'text-align: right;' },
  { pattern: /^text-justify$/, generator: () => 'text-align: justify;' },

  // Font Weights
  { pattern: /^font-thin$/, generator: () => 'font-weight: 100;' },
  { pattern: /^font-light$/, generator: () => 'font-weight: 300;' },
  { pattern: /^font-normal$/, generator: () => 'font-weight: 400;' },
  { pattern: /^font-medium$/, generator: () => 'font-weight: 500;' },
  { pattern: /^font-semibold$/, generator: () => 'font-weight: 600;' },
  { pattern: /^font-bold$/, generator: () => 'font-weight: 700;' },
  { pattern: /^font-extrabold$/, generator: () => 'font-weight: 800;' },

  // Font Families
  { pattern: /^font-sans$/, generator: () => 'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;' },
  { pattern: /^font-serif$/, generator: () => 'font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;' },
  { pattern: /^font-mono$/, generator: () => 'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;' },

  // Tracking (Letter Spacing)
  { pattern: /^tracking-tighter$/, generator: () => 'letter-spacing: -0.05em;' },
  { pattern: /^tracking-tight$/, generator: () => 'letter-spacing: -0.025em;' },
  { pattern: /^tracking-normal$/, generator: () => 'letter-spacing: 0em;' },
  { pattern: /^tracking-wide$/, generator: () => 'letter-spacing: 0.025em;' },
  { pattern: /^tracking-wider$/, generator: () => 'letter-spacing: 0.05em;' },
  { pattern: /^tracking-widest$/, generator: () => 'letter-spacing: 0.1em;' },

  // Text Transform
  { pattern: /^uppercase$/, generator: () => 'text-transform: uppercase;' },
  { pattern: /^lowercase$/, generator: () => 'text-transform: lowercase;' },
  { pattern: /^capitalize$/, generator: () => 'text-transform: capitalize;' },
  { pattern: /^normal-case$/, generator: () => 'text-transform: none;' },

  // Text Decoration
  { pattern: /^underline$/, generator: () => 'text-decoration-line: underline;' },
  { pattern: /^no-underline$/, generator: () => 'text-decoration-line: none;' },
  { pattern: /^line-through$/, generator: () => 'text-decoration-line: line-through;' },

  // Text Overflow
  { pattern: /^truncate$/, generator: () => 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' },
  
  // Whitespace & Wrapping
  { pattern: /^whitespace-normal$/, generator: () => 'white-space: normal;' },
  { pattern: /^whitespace-nowrap$/, generator: () => 'white-space: nowrap;' },
  { pattern: /^whitespace-pre$/, generator: () => 'white-space: pre;' },
  { pattern: /^whitespace-pre-line$/, generator: () => 'white-space: pre-line;' },
  { pattern: /^whitespace-pre-wrap$/, generator: () => 'white-space: pre-wrap;' },
  { pattern: /^text-wrap$/, generator: () => 'text-wrap: wrap;' },
  { pattern: /^text-nowrap$/, generator: () => 'text-wrap: nowrap;' },
  { pattern: /^text-balance$/, generator: () => 'text-wrap: balance;' },
  { pattern: /^text-pretty$/, generator: () => 'text-wrap: pretty;' },
  
  // Word Break
  { pattern: /^break-normal$/, generator: () => 'overflow-wrap: normal; word-break: normal;' },
  { pattern: /^break-words$/, generator: () => 'overflow-wrap: break-word;' },
  { pattern: /^break-all$/, generator: () => 'word-break: break-all;' },
  { pattern: /^break-keep$/, generator: () => 'word-break: keep-all;' },

  // Line Height
  { pattern: /^leading-none$/, generator: () => 'line-height: 1;' },
  { pattern: /^leading-tight$/, generator: () => 'line-height: 1.25;' },
  { pattern: /^leading-snug$/, generator: () => 'line-height: 1.375;' },
  { pattern: /^leading-normal$/, generator: () => 'line-height: 1.5;' },
  { pattern: /^leading-relaxed$/, generator: () => 'line-height: 1.625;' },
  { pattern: /^leading-loose$/, generator: () => 'line-height: 2;' },
];
