/**
 * @nofinite/markon - Universal Content & Publication Renderer
 * Framework-agnostic, isomorphic AST-to-HTML publication engine.
 * Renders TipTap JSONContent, Markdown, or HTML into beautiful, production-ready
 * documents, blogs, newsroom articles, and handbooks.
 *
 * 100% styled with @nofinite/nuicss tokens and superclasses.
 * Zero DOM dependency for SSR / Node.js / Edge execution.
 */

import katex from 'katex';
import { lowlight, SUPPORTED_LANGUAGES, normalizeLanguage } from './codeBlock';
import { markdownToHtml, stripHtmlTags } from './markdown';

export interface MarkonAuthor {
  name: string;
  avatar?: string;
  title?: string;
  url?: string;
}

export interface MarkonCover {
  src: string;
  alt?: string;
  caption?: string;
}

export interface MarkonMetadata {
  title?: string;
  subtitle?: string;
  description?: string;
  cover?: MarkonCover | string;
  author?: MarkonAuthor | string;
  publishedAt?: string | Date;
  readingTime?: number | string;
  tags?: string[];
  category?: string;
  badge?: string;
}

export type MarkonLayout = 'article' | 'document' | 'newsroom' | 'minimal';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface MarkonRenderOptions {
  content: any; // TipTap JSONContent | string (HTML or Markdown)
  format?: 'json' | 'html' | 'markdown' | 'auto';
  metadata?: MarkonMetadata;
  layout?: MarkonLayout;
  showTOC?: boolean;
  tocTitle?: string;
  className?: string;
  highlightCode?: boolean;
  renderMath?: boolean;
  includeStyles?: boolean; // Default true: embeds self-contained stylesheet
}

export interface RenderResult {
  html: string;
  toc: TOCItem[];
  readingTimeMinutes: number;
  wordCount: number;
}

// Language label map
const LANG_LABEL_MAP: Record<string, string> = {
  plaintext: 'Plain Text',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  markdown: 'Markdown',
  sql: 'SQL',
  bash: 'Bash',
  rust: 'Rust',
  go: 'Go',
  cpp: 'C++',
  csharp: 'C#',
  java: 'Java',
  yaml: 'YAML',
};

// Alert SVG icons
const ALERT_ICONS: Record<string, string> = {
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-info shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  success:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-success shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  warning:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-warning shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  danger:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-danger shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
};

/**
 * Built-in publication stylesheet using NUICSS design tokens.
 * Guarantees crisp, publication-grade aesthetics and responsive layouts in any host application.
 */
export const MARKON_RENDERER_CSS = `
.markon-render {
  color: var(--fg-default);
  font-family: var(--font-sans, inherit);
  box-sizing: border-box;
}
.markon-render *, .markon-render *::before, .markon-render *::after {
  box-sizing: inherit;
}
.markon-article {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
.markon-header {
  max-width: 768px;
  margin: 0 auto 2rem;
}
.markon-body {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 1.5rem;
}
.markon-content {
  max-width: 768px;
  flex: 1 1 auto;
  min-width: 0;
}
.markon-content p {
  line-height: 1.75;
  margin: 1rem 0;
  color: var(--fg-default);
  font-size: 1rem;
}
.markon-content ul:not(.task-list) {
  list-style-type: disc;
  margin: 1rem 0;
  padding-left: 1.625rem;
}
.markon-content ol {
  list-style-type: decimal;
  margin: 1rem 0;
  padding-left: 1.625rem;
}
.markon-content li {
  margin: 0.35rem 0;
  line-height: 1.7;
}
.markon-content ul ul {
  list-style-type: circle;
  margin: 0.25rem 0;
}
.markon-content ol ol {
  list-style-type: lower-alpha;
  margin: 0.25rem 0;
}
.markon-content ul.task-list {
  list-style: none !important;
  padding-left: 0 !important;
  margin: 1rem 0;
}
.markon-content li.task-item {
  list-style: none !important;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  margin: 0.35rem 0;
}
.markon-content li.task-item input[type="checkbox"] {
  margin-top: 0.35rem;
  accent-color: var(--color-primary);
  cursor: default;
}
.markon-content blockquote {
  border-left: 4px solid var(--color-primary, oklch(0.65 0.22 260));
  background-color: var(--bg-subtle, oklch(0.96 0.01 260));
  color: var(--fg-muted, oklch(0.45 0.02 260));
  font-style: italic;
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
}
.markon-content hr {
  border: none;
  border-top: 1px solid var(--border-default, oklch(0.88 0.01 260));
  margin: 2rem 0;
}
.markon-content code:not(pre code) {
  background-color: var(--bg-subtle, oklch(0.95 0.01 260));
  color: var(--color-primary, oklch(0.6 0.22 260));
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.85em;
  border: 1px solid var(--border-default, oklch(0.9 0.01 260));
}
.markon-heading {
  font-weight: 700;
  line-height: 1.3;
  scroll-margin-top: 4rem;
  display: flex;
  align-items: center;
  color: var(--fg-default);
}
.markon-heading:hover .heading-anchor {
  opacity: 1;
}
.heading-anchor {
  opacity: 0;
  transition: opacity 0.15s ease;
  color: var(--fg-muted);
  text-decoration: none;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  font-weight: normal;
  user-select: none;
}
.heading-anchor:hover {
  color: var(--color-primary);
}
h1.markon-heading { font-size: 2.25rem; margin: 2rem 0 1rem; }
h2.markon-heading { font-size: 1.625rem; margin: 1.75rem 0 0.875rem; }
h3.markon-heading { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
h4.markon-heading { font-size: 1.125rem; margin: 1.25rem 0 0.5rem; }
h5.markon-heading { font-size: 1rem; margin: 1rem 0 0.5rem; }
h6.markon-heading { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); margin: 1rem 0 0.5rem; }

.markon-byline {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 0;
  margin: 1.5rem 0;
  border-top: 1px solid var(--border-default);
  border-bottom: 1px solid var(--border-default);
}
.markon-byline-avatar {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-subtle);
  flex-shrink: 0;
}
.markon-byline-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.markon-byline-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}
.markon-byline-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.9375rem;
}
.markon-byline-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--fg-muted);
}
.markon-hero-cover {
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-default);
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.markon-hero-cover img {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: cover;
  display: block;
}
.markon-hero-caption {
  padding: 0.625rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--fg-muted);
  background-color: var(--bg-subtle);
  border-top: 1px solid var(--border-default);
}
.markon-toc-aside {
  width: 260px;
  min-width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}
.markon-toc-card {
  padding: 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.markon-toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--fg-muted);
  margin: 0 0 0.75rem 0;
}
.markon-toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.markon-toc-link {
  display: block;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: var(--fg-muted);
  font-size: 0.875rem;
  transition: all 0.15s ease;
  line-height: 1.4;
}
.markon-toc-link:hover {
  color: var(--color-primary);
  background-color: var(--bg-subtle);
}
.markon-toc-link[data-level="1"] {
  font-weight: 600;
  color: var(--fg-default);
}
.markon-toc-link[data-level="2"] {
  padding-left: 0.875rem;
}
.markon-toc-link[data-level="3"] {
  padding-left: 1.5rem;
  font-size: 0.8125rem;
}
.markon-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-default);
}
.markon-code-block {
  position: relative;
  border-radius: 0.75rem;
  border: 1px solid var(--border-default);
  background-color: var(--bg-subtle);
  overflow: hidden;
  margin: 1.5rem 0;
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.markon-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  user-select: none;
}
.markon-code-lang {
  font-size: 0.75rem;
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  color: var(--fg-muted);
}
.markon-code-copy-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border-default);
  background-color: var(--bg-subtle);
  color: var(--fg-muted);
  font-size: 0.75rem;
  transition: all 0.15s ease;
}
.markon-code-copy-btn:hover {
  color: var(--fg-default);
  background-color: var(--bg-surface);
}
.markon-code-block pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  line-height: 1.6;
  color: var(--fg-default);
}
/* Code syntax highlighting via Lowlight (OKLCH token harmony) */
.markon-code-block .hljs-keyword,
.markon-code-block .hljs-selector-tag,
.markon-code-block .hljs-built_in {
  color: oklch(0.55 0.22 300);
  font-weight: 600;
}
.markon-code-block .hljs-string,
.markon-code-block .hljs-attribute,
.markon-code-block .hljs-symbol {
  color: oklch(0.58 0.18 150);
}
.markon-code-block .hljs-title,
.markon-code-block .hljs-section,
.markon-code-block .hljs-function {
  color: oklch(0.55 0.18 240);
  font-weight: 600;
}
.markon-code-block .hljs-comment,
.markon-code-block .hljs-quote {
  color: var(--fg-muted, oklch(0.55 0.02 260));
  font-style: italic;
}
.markon-code-block .hljs-number,
.markon-code-block .hljs-literal {
  color: oklch(0.62 0.19 55);
}
.markon-code-block .hljs-variable,
.markon-code-block .hljs-template-variable {
  color: oklch(0.58 0.15 200);
}
.markon-code-block .hljs-type,
.markon-code-block .hljs-class .hljs-title {
  color: oklch(0.65 0.18 85);
  font-weight: 600;
}
.markon-code-block .hljs-tag,
.markon-code-block .hljs-name {
  color: oklch(0.55 0.22 25);
}
.markon-code-block .hljs-attr {
  color: oklch(0.58 0.16 230);
}

/* Dark mode syntax tokens */
[data-theme="dark"] .markon-code-block .hljs-keyword,
[data-theme="dark"] .markon-code-block .hljs-selector-tag,
[data-theme="dark"] .markon-code-block .hljs-built_in,
.dark .markon-code-block .hljs-keyword,
.dark .markon-code-block .hljs-selector-tag,
.dark .markon-code-block .hljs-built_in {
  color: oklch(0.78 0.2 300);
}
[data-theme="dark"] .markon-code-block .hljs-string,
[data-theme="dark"] .markon-code-block .hljs-attribute,
[data-theme="dark"] .markon-code-block .hljs-symbol,
.dark .markon-code-block .hljs-string,
.dark .markon-code-block .hljs-attribute,
.dark .markon-code-block .hljs-symbol {
  color: oklch(0.78 0.17 150);
}
[data-theme="dark"] .markon-code-block .hljs-title,
[data-theme="dark"] .markon-code-block .hljs-section,
[data-theme="dark"] .markon-code-block .hljs-function,
.dark .markon-code-block .hljs-title,
.dark .markon-code-block .hljs-section,
.dark .markon-code-block .hljs-function {
  color: oklch(0.78 0.16 235);
}
[data-theme="dark"] .markon-code-block .hljs-comment,
[data-theme="dark"] .markon-code-block .hljs-quote,
.dark .markon-code-block .hljs-comment,
.dark .markon-code-block .hljs-quote {
  color: oklch(0.65 0.02 260);
}
[data-theme="dark"] .markon-code-block .hljs-number,
[data-theme="dark"] .markon-code-block .hljs-literal,
.dark .markon-code-block .hljs-number,
.dark .markon-code-block .hljs-literal {
  color: oklch(0.8 0.18 60);
}
[data-theme="dark"] .markon-code-block .hljs-variable,
[data-theme="dark"] .markon-code-block .hljs-template-variable,
.dark .markon-code-block .hljs-variable,
.dark .markon-code-block .hljs-template-variable {
  color: oklch(0.78 0.15 200);
}
[data-theme="dark"] .markon-code-block .hljs-type,
.dark .markon-code-block .hljs-type {
  color: oklch(0.82 0.16 85);
}
[data-theme="dark"] .markon-code-block .hljs-tag,
[data-theme="dark"] .markon-code-block .hljs-name,
.dark .markon-code-block .hljs-tag,
.dark .markon-code-block .hljs-name {
  color: oklch(0.76 0.2 25);
}
[data-theme="dark"] .markon-code-block .hljs-attr,
.dark .markon-code-block .hljs-attr {
  color: oklch(0.78 0.16 230);
}

.markon-math-block {
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-default);
  background-color: var(--bg-subtle);
  text-align: center;
  margin: 1.5rem 0;
  overflow-x: auto;
}
.markon-math-block .katex-display {
  display: block;
  margin: 0.5rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: center;
}
.markon-render .katex {
  font-size: 1.15em;
  text-rendering: auto;
  font-family: KaTeX_Main, "Times New Roman", serif;
  line-height: 1.2;
}
.markon-render .katex .katex-html {
  display: inline-block;
}
.markon-render .katex .base {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  width: min-content;
}
.markon-render .katex .frac-line {
  display: inline-block;
  width: 100%;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.markon-callout {
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  border: 1px solid var(--border-default);
}
/* Standalone Callout variant fallbacks */
.markon-callout.alert-info {
  background-color: var(--color-info-subtle, oklch(0.96 0.03 235));
  border-color: var(--color-info-muted, oklch(0.86 0.08 235));
}
.markon-callout.alert-info .alert-icon {
  color: var(--color-info, oklch(0.55 0.18 235));
}
.markon-callout.alert-success {
  background-color: var(--color-success-subtle, oklch(0.96 0.04 150));
  border-color: var(--color-success-muted, oklch(0.86 0.08 150));
}
.markon-callout.alert-success .alert-icon {
  color: var(--color-success, oklch(0.55 0.18 150));
}
.markon-callout.alert-warning {
  background-color: var(--color-warning-subtle, oklch(0.97 0.05 85));
  border-color: var(--color-warning-muted, oklch(0.88 0.1 85));
}
.markon-callout.alert-warning .alert-icon {
  color: var(--color-warning, oklch(0.6 0.18 85));
}
.markon-callout.alert-danger {
  background-color: var(--color-danger-subtle, oklch(0.96 0.04 25));
  border-color: var(--color-danger-muted, oklch(0.86 0.1 25));
}
.markon-callout.alert-danger .alert-icon {
  color: var(--color-danger, oklch(0.55 0.22 25));
}
.markon-callout.alert-tip {
  background-color: var(--color-primary-subtle, oklch(0.96 0.04 260));
  border-color: var(--color-primary-muted, oklch(0.86 0.1 260));
}
.markon-callout.alert-tip .alert-icon {
  color: var(--color-primary, oklch(0.6 0.22 260));
}

[data-theme="dark"] .markon-callout.alert-info,
.dark .markon-callout.alert-info {
  background-color: oklch(0.22 0.04 235);
  border-color: oklch(0.35 0.08 235);
}
[data-theme="dark"] .markon-callout.alert-success,
.dark .markon-callout.alert-success {
  background-color: oklch(0.22 0.04 150);
  border-color: oklch(0.35 0.08 150);
}
[data-theme="dark"] .markon-callout.alert-warning,
.dark .markon-callout.alert-warning {
  background-color: oklch(0.23 0.05 85);
  border-color: oklch(0.38 0.09 85);
}
[data-theme="dark"] .markon-callout.alert-danger,
.dark .markon-callout.alert-danger {
  background-color: oklch(0.22 0.05 25);
  border-color: oklch(0.36 0.09 25);
}
[data-theme="dark"] .markon-callout.alert-tip,
.dark .markon-callout.alert-tip {
  background-color: oklch(0.22 0.04 260);
  border-color: oklch(0.35 0.08 260);
}
.markon-details {
  border-radius: 0.75rem;
  border: 1px solid var(--border-default);
  padding: 0.875rem 1.25rem;
  margin: 1.25rem 0;
  background-color: var(--bg-surface);
  transition: background-color 0.15s ease;
}
.markon-details[open] {
  background-color: var(--bg-subtle);
}
.markon-summary {
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  color: var(--fg-default);
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.markon-summary:hover {
  color: var(--color-primary);
}
.markon-details-content {
  padding-top: 0.75rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-primary);
  margin-top: 0.5rem;
}
.table-container {
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid var(--border-default);
  margin: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.table-container table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.table-container th {
  border: 1px solid var(--border-default);
  padding: 0.75rem 1rem;
  text-align: left;
  background-color: var(--bg-subtle);
  font-weight: 600;
  color: var(--fg-default);
}
.table-container td {
  border: 1px solid var(--border-default);
  padding: 0.75rem 1rem;
  color: var(--fg-default);
}
.markon-file-attachment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  margin: 1rem 0;
  transition: background-color 0.15s ease;
}
.markon-file-attachment:hover {
  background-color: var(--bg-subtle);
}
.markon-document {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
.markon-doc-header {
  border-bottom: 1px solid var(--border-default);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}
.markon-doc-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.markon-doc-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
}
.markon-doc-updated {
  font-size: 0.8125rem;
  color: var(--fg-muted);
}
.markon-newsroom {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
.markon-newsroom-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}
.markon-newsroom-headline {
  font-size: 2.75rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
  color: var(--fg-default);
}
.markon-newsroom-dateline {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--fg-muted);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-default);
}
.markon-newsroom .markon-content > p:first-of-type {
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 500;
  color: var(--fg-default);
  margin-bottom: 1.5rem;
}
@media (max-width: 1024px) {
  .markon-body {
    flex-direction: column;
  }
  .markon-toc-aside {
    display: none;
  }
}
`;

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hastToHtml(node: any): string {
  if (!node) return '';
  if (node.type === 'text') {
    return escapeHtml(node.value || '');
  }
  if (node.type === 'element') {
    const tagName = node.tagName || 'span';
    const props = node.properties || {};
    let attrs = '';
    for (const [k, v] of Object.entries(props)) {
      if (k === 'className' && Array.isArray(v)) {
        attrs += ` class="${escapeHtml(v.join(' '))}"`;
      } else if (Array.isArray(v)) {
        attrs += ` ${k}="${escapeHtml(v.join(' '))}"`;
      } else if (v === true) {
        attrs += ` ${k}`;
      } else if (v !== false && v != null) {
        attrs += ` ${k}="${escapeHtml(String(v))}"`;
      }
    }
    const children = (node.children || []).map(hastToHtml).join('');
    return `<${tagName}${attrs}>${children}</${tagName}>`;
  }
  if (node.children) {
    return node.children.map(hastToHtml).join('');
  }
  return '';
}

export function slugify(
  text: string,
  existingSlugs: Map<string, number>
): string {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');

  let start = 0;
  while (start < clean.length && clean[start] === '-') start++;
  let end = clean.length;
  while (end > start && clean[end - 1] === '-') end--;

  const base = clean.slice(start, end) || 'heading';
  const count = existingSlugs.get(base) || 0;
  existingSlugs.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function calculateReadingTime(text: string): {
  words: number;
  minutes: number;
} {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function formatDate(d: string | Date | undefined): string {
  if (!d) return '';
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return escapeHtml(String(d));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return escapeHtml(String(d));
  }
}

/**
 * Traverses a TipTap AST and produces pure, isomorphic HTML along with TOC items and text.
 */
export function jsonToHtml(
  node: any,
  options: {
    highlightCode?: boolean;
    renderMath?: boolean;
    slugMap?: Map<string, number>;
    toc?: TOCItem[];
    plainTextBuffer?: string[];
  } = {}
): string {
  if (!node) return '';

  const slugMap = options.slugMap || new Map<string, number>();
  const toc = options.toc || [];
  const textBuf = options.plainTextBuffer || [];
  const highlightCode = options.highlightCode !== false;
  const renderMath = options.renderMath !== false;

  // Handle Text Node
  if (node.type === 'text') {
    let text = escapeHtml(node.text || '');
    textBuf.push(node.text || '');

    // Apply inline marks in order
    if (Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        const markType = mark.type;
        const attrs = mark.attrs || {};

        switch (markType) {
          case 'bold':
            text = `<strong>${text}</strong>`;
            break;
          case 'italic':
            text = `<em>${text}</em>`;
            break;
          case 'strike':
            text = `<s>${text}</s>`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'code':
            text = `<code class="bg-subtle px-1.5 py-0.5 rounded font-mono text-xs text-primary">${text}</code>`;
            break;
          case 'subscript':
            text = `<sub>${text}</sub>`;
            break;
          case 'superscript':
            text = `<sup>${text}</sup>`;
            break;
          case 'link': {
            const href = escapeHtml(attrs.href || '#');
            const target = escapeHtml(attrs.target || '_blank');
            text = `<a href="${href}" target="${target}" rel="noopener noreferrer" class="link">${text}</a>`;
            break;
          }
          case 'highlight': {
            const color = attrs.color
              ? ` style="background-color: ${escapeHtml(attrs.color)};"`
              : '';
            text = `<mark class="bg-warning/25 px-1 rounded text-inherit"${color}>${text}</mark>`;
            break;
          }
          case 'textStyle': {
            const styles: string[] = [];
            if (attrs.color) styles.push(`color: ${attrs.color}`);
            if (attrs.fontSize) styles.push(`font-size: ${attrs.fontSize}`);
            if (attrs.fontFamily)
              styles.push(`font-family: ${attrs.fontFamily}`);
            if (styles.length > 0) {
              text = `<span style="${escapeHtml(
                styles.join('; ')
              )}">${text}</span>`;
            }
            break;
          }
        }
      }
    }
    return text;
  }

  // Helper to render child nodes
  const renderChildren = (content?: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    return content
      .map((c) =>
        jsonToHtml(c, {
          highlightCode,
          renderMath,
          slugMap,
          toc,
          plainTextBuffer: textBuf,
        })
      )
      .join('');
  };

  // Helper to extract raw text content of a node
  const getRawText = (n: any): string => {
    if (!n) return '';
    if (n.type === 'text') return n.text || '';
    if (Array.isArray(n.content)) return n.content.map(getRawText).join('');
    return '';
  };

  const attrs = node.attrs || {};
  const alignClass =
    attrs.textAlign === 'center'
      ? 'text-center'
      : attrs.textAlign === 'right'
      ? 'text-right'
      : attrs.textAlign === 'justify'
      ? 'text-justify'
      : '';

  switch (node.type) {
    case 'doc':
      return renderChildren(node.content);

    case 'paragraph': {
      const inner = renderChildren(node.content);
      const content = inner.trim() ? inner : '&nbsp;';
      const cls = ['leading-relaxed my-3 text-default', alignClass]
        .filter(Boolean)
        .join(' ');
      return `<p class="${cls}">${content}</p>`;
    }

    case 'heading': {
      const level = Math.min(6, Math.max(1, attrs.level || 1));
      const rawText = getRawText(node);
      const slug = slugify(rawText, slugMap);
      toc.push({ id: slug, text: rawText, level });

      const sizeClasses: Record<number, string> = {
        1: 'text-3xl font-extrabold tracking-tight mt-8 mb-4',
        2: 'text-2xl font-bold tracking-tight mt-6 mb-3',
        3: 'text-xl font-bold tracking-tight mt-5 mb-2',
        4: 'text-lg font-semibold mt-4 mb-2',
        5: 'text-base font-semibold mt-3 mb-1',
        6: 'text-sm font-semibold uppercase tracking-wider text-muted mt-3 mb-1',
      };
      const sizeCls = sizeClasses[level] || sizeClasses[1];
      const cls = [
        'markon-heading text-default group scroll-mt-20 flex items-center',
        sizeCls,
        alignClass,
      ]
        .filter(Boolean)
        .join(' ');

      const inner = renderChildren(node.content);
      const anchor = `<a href="#${slug}" class="heading-anchor opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-opacity ml-2 no-underline text-base font-normal select-none" aria-label="Link to section">#</a>`;
      return `<h${level} id="${slug}" class="${cls}"><span>${inner}</span>${anchor}</h${level}>`;
    }

    case 'blockquote':
      return `<blockquote class="border-l-4 border-primary/60 pl-4 py-1.5 my-4 text-muted italic bg-subtle/30 rounded-r-lg">${renderChildren(
        node.content
      )}</blockquote>`;

    case 'bulletList':
      return `<ul class="list-disc list-outside pl-6 my-3 space-y-1.5">${renderChildren(
        node.content
      )}</ul>`;

    case 'orderedList': {
      const startAttr = attrs.start ? ` start="${attrs.start}"` : '';
      return `<ol class="list-decimal list-outside pl-6 my-3 space-y-1.5"${startAttr}>${renderChildren(
        node.content
      )}</ol>`;
    }

    case 'listItem':
      return `<li>${renderChildren(node.content)}</li>`;

    case 'taskList':
      return `<ul class="task-list list-none p-0 my-3 space-y-2">${renderChildren(
        node.content
      )}</ul>`;

    case 'taskItem': {
      const checked = !!attrs.checked;
      const inner = renderChildren(node.content);
      return `<li class="task-item flex items-start gap-2.5 my-1" data-checked="${checked}"><input type="checkbox" ${
        checked ? 'checked' : ''
      } disabled class="checkbox checkbox-sm checkbox-primary mt-1" /><div class="flex-1 ${
        checked ? 'line-through text-muted' : 'text-default'
      }">${inner}</div></li>`;
    }

    case 'codeBlock': {
      const rawLang = (attrs.language || 'plaintext').toLowerCase();
      const lang = normalizeLanguage(rawLang);
      const codeText = getRawText(node);
      const langLabel =
        LANG_LABEL_MAP[lang] ||
        SUPPORTED_LANGUAGES.find((l) => l.value === lang)?.label ||
        lang;

      let highlightedHtml = '';
      if (highlightCode) {
        try {
          if (lang && lowlight.registered(lang)) {
            const hastTree = lowlight.highlight(lang, codeText);
            highlightedHtml = hastToHtml(hastTree);
          } else {
            highlightedHtml = escapeHtml(codeText);
          }
        } catch {
          highlightedHtml = escapeHtml(codeText);
        }
      } else {
        highlightedHtml = escapeHtml(codeText);
      }

      return `<div class="markon-code-block relative rounded-xl border border-default bg-subtle my-4 overflow-hidden font-mono text-xs shadow-sm"><div class="markon-code-header flex items-center justify-between px-3.5 py-2 border-b border-default/40 bg-surface select-none"><span class="markon-code-lang text-xs text-muted font-mono font-medium">${escapeHtml(
        langLabel
      )}</span><button type="button" class="markon-code-copy-btn btn btn-ghost btn-xs flex items-center gap-1.5 text-muted hover:text-default" data-code="${escapeHtml(
        codeText
      )}" title="Copy code"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copy</span></button></div><pre class="p-3.5 overflow-x-auto text-default m-0 leading-relaxed font-mono"><code class="hljs language-${escapeHtml(
        lang
      )}">${highlightedHtml}</code></pre></div>`;
    }

    case 'mathBlock': {
      const equation = attrs.equation || 'E = mc^2';
      let katexHtml = escapeHtml(equation);
      if (renderMath) {
        try {
          katexHtml = katex.renderToString(equation, {
            throwOnError: false,
            displayMode: true,
          });
        } catch {
          katexHtml = escapeHtml(equation);
        }
      }
      return `<div class="markon-math-block my-4 p-4 rounded-xl border border-default bg-subtle/40 text-center overflow-x-auto select-none" data-math-block="" data-equation="${escapeHtml(
        equation
      )}">${katexHtml}</div>`;
    }

    case 'callout': {
      const type = (attrs.type || 'info').toLowerCase();
      const icon = ALERT_ICONS[type] || ALERT_ICONS.info;
      const inner = renderChildren(node.content);
      return `<div class="markon-callout alert alert-${type} my-4 rounded-xl border p-4 flex items-start gap-3" data-callout="" data-callout-type="${type}"><div class="alert-icon shrink-0 mt-0.5">${icon}</div><div class="alert-content flex-1 min-w-0">${inner}</div></div>`;
    }

    case 'details': {
      const open = attrs.open !== false;
      return `<details class="markon-details rounded-xl border border-default p-3.5 my-3 bg-subtle/20 group open:bg-subtle/30 transition-all"${
        open ? ' open' : ''
      }>${renderChildren(node.content)}</details>`;
    }

    case 'detailsSummary':
      return `<summary class="markon-summary font-semibold text-sm cursor-pointer select-none text-default hover:text-primary list-none flex items-center gap-2 py-1">${renderChildren(
        node.content
      )}</summary>`;

    case 'detailsContent':
      return `<div class="markon-details-content pt-2 pl-4 border-l-2 border-primary/40 mt-1 space-y-2">${renderChildren(
        node.content
      )}</div>`;

    case 'table':
      return `<div class="table-container my-4 overflow-x-auto rounded-xl border border-default shadow-sm"><table class="table w-full text-sm"><tbody>${renderChildren(
        node.content
      )}</tbody></table></div>`;

    case 'tableRow':
      return `<tr>${renderChildren(node.content)}</tr>`;

    case 'tableHeader':
      return `<th class="border border-default p-2.5 text-left bg-subtle font-semibold text-default">${renderChildren(
        node.content
      )}</th>`;

    case 'tableCell':
      return `<td class="border border-default p-2.5 text-default">${renderChildren(
        node.content
      )}</td>`;

    case 'image': {
      const src = escapeHtml(attrs.src || '');
      const alt = escapeHtml(attrs.alt || '');
      const title = escapeHtml(attrs.title || '');
      const width = attrs.width || '100%';
      const alignment = attrs.alignment || 'center';
      const imgAlignClass =
        alignment === 'left'
          ? 'mr-auto'
          : alignment === 'right'
          ? 'ml-auto'
          : 'mx-auto';
      const caption = attrs.caption ? escapeHtml(attrs.caption) : '';

      return `<figure class="markon-rendered-image my-4 ${imgAlignClass}" style="width: ${width}; max-width: 100%;"><img src="${src}" alt="${alt}" title="${title}" class="rounded-xl border border-default shadow-sm w-full h-auto block" loading="lazy" />${
        caption
          ? `<figcaption class="text-xs text-muted text-center mt-2">${caption}</figcaption>`
          : ''
      }</figure>`;
    }

    case 'videoBlock': {
      const src = escapeHtml(attrs.src || '');
      const service = attrs.service || 'custom';
      const alignment = attrs.alignment || 'center';
      const width = attrs.width || '100%';
      const videoAlignClass =
        alignment === 'left'
          ? 'mr-auto'
          : alignment === 'right'
          ? 'ml-auto'
          : 'mx-auto';

      let mediaTag = '';
      if (service === 'custom') {
        mediaTag = `<video src="${src}" controls playsinline class="w-full aspect-video rounded-xl border border-default bg-subtle object-cover shadow-sm"></video>`;
      } else {
        mediaTag = `<iframe src="${src}" class="w-full aspect-video rounded-xl border border-default shadow-sm" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      }

      return `<div class="markon-video-block my-4 ${videoAlignClass}" style="width: ${width}; max-width: 100%;"><div class="relative aspect-video w-full rounded-xl overflow-hidden border border-default bg-subtle shadow-sm">${mediaTag}</div></div>`;
    }

    case 'fileAttachment': {
      const src = escapeHtml(attrs.src || '');
      const name = escapeHtml(attrs.name || 'Attachment');
      const size = escapeHtml(attrs.size || '');

      return `<div class="markon-file-attachment file-item my-3 p-3 rounded-xl border border-default bg-surface hover:bg-subtle transition-colors flex items-center justify-between gap-3" data-file-attachment="" data-src="${src}" data-name="${name}" data-size="${size}"><div class="flex items-center gap-3 overflow-hidden min-w-0"><div class="w-8 h-8 rounded-lg bg-subtle border border-default text-primary flex items-center justify-center shrink-0"><svg width="16" height="16" class="w-4 h-4 block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div><div class="flex flex-col min-w-0 overflow-hidden"><span class="text-xs font-semibold text-default truncate">${name}</span><span class="text-[11px] text-muted">${
        size || 'Attachment'
      }</span></div></div><a href="${src}" download="${name}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm text-xs text-primary font-medium hover:underline inline-flex items-center gap-1 shrink-0"><svg width="14" height="14" class="w-3.5 h-3.5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>Download</span></a></div>`;
    }

    case 'horizontalRule':
      return '<hr class="my-6 border-default" />';

    case 'hardBreak':
      return '<br />';

    default:
      return renderChildren(node.content);
  }
}

/**
 * Extracts Table of Contents from TipTap JSON, HTML, or Markdown.
 */
export function extractTOC(content: any): TOCItem[] {
  if (!content) return [];

  // TipTap JSON content
  if (typeof content === 'object') {
    const toc: TOCItem[] = [];
    const slugMap = new Map<string, number>();

    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'heading') {
        const level = Math.min(6, Math.max(1, node.attrs?.level || 1));
        const text =
          node.content
            ?.map((c: any) => (c.type === 'text' ? c.text || '' : ''))
            .join('') || '';
        const slug = slugify(text, slugMap);
        toc.push({ id: slug, text, level });
      }
      if (Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);
    return toc;
  }

  // String content (HTML or Markdown)
  const str = String(content);
  const toc: TOCItem[] = [];
  const slugMap = new Map<string, number>();

  if (str.includes('<h') && str.includes('</h')) {
    let pos = 0;
    const lower = str.toLowerCase();
    while (pos < str.length) {
      const hIdx = lower.indexOf('<h', pos);
      if (hIdx === -1) break;
      const levelChar = str[hIdx + 2];
      if (levelChar >= '1' && levelChar <= '6') {
        const level = parseInt(levelChar, 10);
        const tagEnd = str.indexOf('>', hIdx + 3);
        const closeTag = `</h${level}>`;
        if (tagEnd !== -1) {
          const closeIdx = lower.indexOf(closeTag, tagEnd);
          if (closeIdx !== -1) {
            const inner = str.slice(tagEnd + 1, closeIdx);
            const text = stripHtmlTags(inner).trim();
            const slug = slugify(text, slugMap);
            toc.push({ id: slug, text, level });
            pos = closeIdx + closeTag.length;
            continue;
          }
        }
      }
      pos = hIdx + 2;
    }
  } else {
    // Markdown headings (# Title)
    const lines = str.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        let level = 0;
        while (level < trimmed.length && trimmed[level] === '#' && level < 6) {
          level++;
        }
        if (level > 0 && level <= 6 && trimmed[level] === ' ') {
          const text = trimmed.slice(level + 1).trim();
          const slug = slugify(text, slugMap);
          toc.push({ id: slug, text, level });
        }
      }
    });
  }

  return toc;
}

/**
 * Renders sticky Table of Contents navigation bar.
 */
export function renderTOC(items: TOCItem[], tocTitle = 'On this page'): string {
  if (!items || items.length === 0) return '';

  const links = items
    .map((item) => {
      return `<a href="#${item.id}" class="markon-toc-link" data-level="${
        item.level
      }">${escapeHtml(item.text)}</a>`;
    })
    .join('');

  return `<aside class="markon-toc-aside">
  <div class="markon-toc-card">
    <p class="markon-toc-title">${escapeHtml(tocTitle)}</p>
    <nav class="markon-toc-nav">${links}</nav>
  </div>
</aside>`;
}

/**
 * Universal publication & document renderer.
 */
export function renderMarkon(options: MarkonRenderOptions): RenderResult {
  const {
    content,
    metadata = {},
    layout = 'article',
    showTOC = true,
    tocTitle = 'On this page',
    className = '',
    highlightCode = true,
    renderMath = true,
    includeStyles = true,
  } = options;

  let bodyHtml = '';
  const toc: TOCItem[] = [];
  const textBuffer: string[] = [];

  // Determine format & generate bodyHtml + TOC
  if (typeof content === 'object' && content !== null) {
    // TipTap JSONContent
    const slugMap = new Map<string, number>();
    bodyHtml = jsonToHtml(content, {
      highlightCode,
      renderMath,
      slugMap,
      toc,
      plainTextBuffer: textBuffer,
    });
  } else {
    // String content (HTML or Markdown)
    const raw = String(content || '');
    let html = '';
    if (
      options.format === 'markdown' ||
      (!raw.trim().startsWith('<') &&
        (raw.includes('# ') || raw.includes('**') || raw.includes('> ')))
    ) {
      html = markdownToHtml(raw);
    } else {
      html = raw;
    }

    // Process headings in HTML string to inject IDs and anchors
    const slugMap = new Map<string, number>();
    let result = '';
    let pos = 0;
    const lower = html.toLowerCase();
    while (pos < html.length) {
      const hIdx = lower.indexOf('<h', pos);
      if (hIdx === -1) {
        result += html.slice(pos);
        break;
      }
      const levelChar = html[hIdx + 2];
      if (levelChar >= '1' && levelChar <= '6') {
        const level = parseInt(levelChar, 10);
        const tagEnd = html.indexOf('>', hIdx + 3);
        const closeTag = `</h${level}>`;
        if (tagEnd !== -1) {
          const closeIdx = lower.indexOf(closeTag, tagEnd);
          if (closeIdx !== -1) {
            result += html.slice(pos, hIdx);
            const inner = html.slice(tagEnd + 1, closeIdx);
            const text = stripHtmlTags(inner).trim();
            const slug = slugify(text, slugMap);
            toc.push({ id: slug, text, level });
            result += `<h${level} id="${slug}" class="markon-heading text-default group scroll-mt-20 flex items-center"><span>${inner}</span><a href="#${slug}" class="heading-anchor opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-opacity ml-2 no-underline text-base font-normal select-none" aria-label="Link to section">#</a></h${level}>`;
            pos = closeIdx + closeTag.length;
            continue;
          }
        }
      }
      result += html.slice(pos, hIdx + 2);
      pos = hIdx + 2;
    }
    bodyHtml = result;

    textBuffer.push(stripHtmlTags(bodyHtml));
  }

  // Calculate words and reading time
  const plainText = textBuffer.join(' ');
  const { words: wordCount, minutes: computedMinutes } =
    calculateReadingTime(plainText);
  const readingTimeMinutes =
    typeof metadata.readingTime === 'number'
      ? metadata.readingTime
      : computedMinutes;
  const readingTimeText =
    typeof metadata.readingTime === 'string'
      ? metadata.readingTime
      : `${readingTimeMinutes} min read`;

  // Parse Author
  const authorName =
    typeof metadata.author === 'string'
      ? metadata.author
      : metadata.author?.name || '';
  const authorAvatar =
    typeof metadata.author === 'object' ? metadata.author.avatar : undefined;
  const authorTitle =
    typeof metadata.author === 'object' ? metadata.author.title : undefined;
  const authorUrl =
    typeof metadata.author === 'object' ? metadata.author.url : undefined;

  // Parse Cover
  const coverSrc =
    typeof metadata.cover === 'string'
      ? metadata.cover
      : metadata.cover?.src || '';
  const coverAlt =
    typeof metadata.cover === 'object' ? metadata.cover.alt || '' : '';
  const coverCaption =
    typeof metadata.cover === 'object' ? metadata.cover.caption : undefined;

  // Render Cover HTML
  const coverHtml = coverSrc
    ? `<div class="markon-hero-cover"><img src="${escapeHtml(
        coverSrc
      )}" alt="${escapeHtml(coverAlt)}" />${
        coverCaption
          ? `<div class="markon-hero-caption">${escapeHtml(coverCaption)}</div>`
          : ''
      }</div>`
    : '';

  // Render Tags
  const tagsHtml =
    metadata.tags && metadata.tags.length > 0
      ? `<div class="markon-tags select-none">${metadata.tags
          .map(
            (t) =>
              `<span class="badge badge-subtle text-xs px-2.5 py-1 rounded-full">${escapeHtml(
                t
              )}</span>`
          )
          .join('')}</div>`
      : '';

  const hasTOC = showTOC && toc.length >= 2;
  const tocAsideHtml = hasTOC ? renderTOC(toc, tocTitle) : '';

  const styleTag = includeStyles
    ? `<style data-markon-renderer="">${MARKON_RENDERER_CSS}</style>`
    : '';

  const safeClassName = className ? escapeHtml(className) : '';
  let finalHtml = '';

  // ==========================================
  // Layout 1: Minimal (Embedded / Dashboard)
  // ==========================================
  if (layout === 'minimal') {
    finalHtml = `${styleTag}<div class="markon-render markon-minimal prose max-w-none text-default ${safeClassName}">${bodyHtml}</div>`;
  }

  // ==========================================
  // Layout 2: Article (Blog / Story / Feature)
  // ==========================================
  else if (layout === 'article') {
    const badgeCategory = metadata.badge || metadata.category;
    const badgeHtml = badgeCategory
      ? `<div style="margin-bottom: 1rem;"><span class="badge badge-primary text-xs font-bold uppercase tracking-wider">${escapeHtml(
          badgeCategory
        )}</span></div>`
      : '';

    const titleHtml = metadata.title
      ? `<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-default" style="margin-bottom: 1rem; line-height: 1.2;">${escapeHtml(
          metadata.title
        )}</h1>`
      : '';

    const subtitleHtml =
      metadata.subtitle || metadata.description
        ? `<p class="text-lg sm:text-xl text-muted leading-relaxed" style="margin-bottom: 1.5rem;">${escapeHtml(
            metadata.subtitle || metadata.description || ''
          )}</p>`
        : '';

    let bylineHtml = '';
    if (authorName || metadata.publishedAt || readingTimeText) {
      const avatarHtml = authorAvatar
        ? `<div class="markon-byline-avatar"><img src="${escapeHtml(
            authorAvatar
          )}" alt="${escapeHtml(authorName)}" /></div>`
        : authorName
        ? `<div class="markon-byline-avatar" style="font-weight: 700; color: var(--color-primary);">${escapeHtml(
            authorName.charAt(0).toUpperCase()
          )}</div>`
        : '';

      const nameContent = authorUrl
        ? `<a href="${escapeHtml(
            authorUrl
          )}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; color: var(--fg-default); text-decoration: none;">${escapeHtml(
            authorName
          )}</a>`
        : `<span style="font-weight: 600; color: var(--fg-default);">${escapeHtml(
            authorName
          )}</span>`;

      bylineHtml = `<div class="markon-byline select-none">
        ${avatarHtml}
        <div class="markon-byline-info">
          <div class="markon-byline-author">
            ${nameContent}
            ${
              authorTitle
                ? `<span style="font-size: 0.8125rem; color: var(--fg-muted);">(${escapeHtml(
                    authorTitle
                  )})</span>`
                : ''
            }
          </div>
          <div class="markon-byline-meta">
            ${
              metadata.publishedAt
                ? `<span>${escapeHtml(formatDate(metadata.publishedAt))}</span>`
                : ''
            }
            ${
              metadata.publishedAt && readingTimeText
                ? '<span style="opacity: 0.4;">•</span>'
                : ''
            }
            <span>${escapeHtml(readingTimeText)}</span>
          </div>
        </div>
      </div>`;
    }

    finalHtml = `${styleTag}<article class="markon-render markon-article text-default ${safeClassName}">
      <header class="markon-header">
        ${badgeHtml}
        ${titleHtml}
        ${subtitleHtml}
        ${bylineHtml}
        ${coverHtml}
      </header>
      <div class="markon-body">
        <div class="markon-content">
          ${bodyHtml}
          ${tagsHtml}
        </div>
        ${tocAsideHtml}
      </div>
    </article>`;
  }

  // ==========================================
  // Layout 3: Document (Technical Handbook / Docs)
  // ==========================================
  else if (layout === 'document') {
    const category = metadata.category || 'Documentation';
    const titleHtml = metadata.title
      ? `<h1 class="text-3xl font-extrabold tracking-tight text-default" style="margin-bottom: 0.5rem;">${escapeHtml(
          metadata.title
        )}</h1>`
      : '';
    const descHtml =
      metadata.description || metadata.subtitle
        ? `<p class="text-base text-muted" style="margin-bottom: 1rem;">${escapeHtml(
            metadata.description || metadata.subtitle || ''
          )}</p>`
        : '';

    finalHtml = `${styleTag}<div class="markon-render markon-document text-default ${safeClassName}">
      <header class="markon-doc-header">
        <div class="markon-doc-header-top">
          <span class="markon-doc-badge">${escapeHtml(category)}</span>
          ${
            metadata.publishedAt
              ? `<span class="markon-doc-updated">Updated: ${escapeHtml(
                  formatDate(metadata.publishedAt)
                )}</span>`
              : ''
          }
        </div>
        ${titleHtml}
        ${descHtml}
      </header>
      <div class="markon-body">
        <div class="markon-content">
          ${bodyHtml}
          ${tagsHtml}
        </div>
        ${tocAsideHtml}
      </div>
    </div>`;
  }

  // ==========================================
  // Layout 4: Newsroom (Press Release / Editorial)
  // ==========================================
  else if (layout === 'newsroom') {
    const kicker = metadata.badge || metadata.category || 'PRESS RELEASE';
    const titleHtml = metadata.title
      ? `<h1 class="markon-newsroom-headline">${escapeHtml(
          metadata.title
        )}</h1>`
      : '';

    const datelineParts = [
      formatDate(metadata.publishedAt),
      authorName ? `By ${authorName}` : '',
    ].filter(Boolean);

    const datelineHtml =
      datelineParts.length > 0
        ? `<div class="markon-newsroom-dateline">${escapeHtml(
            datelineParts.join(' — ')
          )}</div>`
        : '';

    finalHtml = `${styleTag}<article class="markon-render markon-newsroom text-default ${safeClassName}">
      <header>
        <div class="markon-newsroom-kicker">${escapeHtml(kicker)}</div>
        ${titleHtml}
        ${datelineHtml}
        ${coverHtml}
      </header>
      <div class="markon-content">
        ${bodyHtml}
        ${tagsHtml}
      </div>
    </article>`;
  }

  return {
    html: finalHtml,
    toc,
    readingTimeMinutes,
    wordCount,
  };
}

/**
 * Universal MarkonRenderer Class with static render and client hydration methods.
 */
export class MarkonRenderer {
  static render(options: MarkonRenderOptions): RenderResult {
    return renderMarkon(options);
  }

  static extractTOC(content: any): TOCItem[] {
    return extractTOC(content);
  }

  static calculateReadingTime(text: string): {
    words: number;
    minutes: number;
  } {
    return calculateReadingTime(text);
  }

  /**
   * Attaches clipboard listeners for code block copy buttons and smooth scroll for TOC anchors.
   * Returns a cleanup function that disposes all attached listeners.
   */
  static mount(container: HTMLElement): () => void {
    if (!container) {
      return () => {
        // No-op cleanup when container is null
      };
    }

    const cleanups: Array<() => void> = [];

    // 1. Code copy buttons
    const copyBtns = container.querySelectorAll<HTMLButtonElement>(
      '.markon-code-copy-btn'
    );
    copyBtns.forEach((btn) => {
      let timeout: any = null;
      const originalHtml = btn.innerHTML;

      const handler = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const code = btn.getAttribute('data-code') || '';
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(code);
            btn.innerHTML = `
              <svg class="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span class="text-primary font-medium">Copied!</span>
            `;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
              btn.innerHTML = originalHtml;
            }, 1800);
          } catch (err) {
            console.error('Clipboard copy failed', err);
          }
        }
      };

      btn.addEventListener('click', handler);
      cleanups.push(() => {
        btn.removeEventListener('click', handler);
        if (timeout) clearTimeout(timeout);
      });
    });

    // 2. Smooth scrolling for TOC anchors
    const tocLinks =
      container.querySelectorAll<HTMLAnchorElement>('.markon-toc-link');
    tocLinks.forEach((link) => {
      const handler = (e: MouseEvent) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.slice(1);
          const targetEl = container.querySelector(`#${CSS.escape(targetId)}`);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof window !== 'undefined' && window.history) {
              window.history.pushState(null, '', href);
            }
          }
        }
      };

      link.addEventListener('click', handler);
      cleanups.push(() => link.removeEventListener('click', handler));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }
}
