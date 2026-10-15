/**
 * @nofinite/markon - React Publication Renderer Component
 * High-performance, publication-grade React renderer wrapping MarkonRenderer.
 * Renders TipTap JSON, Markdown, or HTML with full metadata, sticky TOC,
 * code copy buttons, KaTeX formulas, and responsive NUICSS layouts.
 */

import React, { useMemo, useEffect, useRef } from 'react';
import {
  type MarkonLayout,
  type MarkonMetadata,
  type TOCItem,
  type RenderResult,
  renderMarkon,
  MarkonRenderer,
} from '../core/renderer';

export interface MarkonRenderProps {
  /**
   * Content to render: TipTap JSONContent, HTML string, or Markdown string.
   */
  content: any;

  /**
   * Content format. If omitted, format is automatically detected.
   */
  format?: 'json' | 'html' | 'markdown' | 'auto';

  /**
   * Publication metadata: title, subtitle, cover image, author, date, reading time, tags, category.
   */
  metadata?: MarkonMetadata;

  /**
   * Publication layout mode:
   * - 'article': Blog/article with hero cover, author byline, sticky TOC, and tags.
   * - 'document': Technical docs with header breadcrumbs, updated timestamp, and side TOC.
   * - 'newsroom': Editorial press release with bold kicker, headline, and dateline.
   * - 'minimal': Bare prose container without chrome.
   * @default 'article'
   */
  layout?: MarkonLayout;

  /**
   * Whether to show sticky Table of Contents.
   * @default true
   */
  showTOC?: boolean;

  /**
   * Custom TOC title label.
   * @default 'On this page'
   */
  tocTitle?: string;

  /**
   * Whether to include the self-contained publication stylesheet.
   * @default true
   */
  includeStyles?: boolean;

  /**
   * Whether to perform syntax highlighting on code blocks.
   * @default true
   */
  highlightCode?: boolean;

  /**
   * Whether to pre-render KaTeX math formulas.
   * @default true
   */
  renderMath?: boolean;

  /**
   * Custom class name applied to container.
   */
  className?: string;

  /**
   * Callback fired when rendering finishes with TOC, reading time, and word count.
   */
  onRendered?: (result: RenderResult) => void;
}

export const MarkonRender: React.FC<MarkonRenderProps> = ({
  content,
  format = 'auto',
  metadata,
  layout = 'article',
  showTOC = true,
  tocTitle = 'On this page',
  includeStyles = true,
  highlightCode = true,
  renderMath = true,
  className = '',
  onRendered,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute rendered HTML and publication metadata
  const result: RenderResult = useMemo(() => {
    return renderMarkon({
      content,
      format,
      metadata,
      layout,
      showTOC,
      tocTitle,
      includeStyles,
      highlightCode,
      renderMath,
      className,
    });
  }, [
    content,
    format,
    metadata,
    layout,
    showTOC,
    tocTitle,
    includeStyles,
    highlightCode,
    renderMath,
    className,
  ]);

  // Notify parent of rendered result (TOC, reading time, word count)
  useEffect(() => {
    if (onRendered) {
      onRendered(result);
    }
  }, [result, onRendered]);

  // Hydrate client-side interactivity (clipboard copy button & smooth TOC scrolling)
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    const cleanup = MarkonRenderer.mount(containerRef.current);
    return () => {
      cleanup();
    };
  }, [result.html]);

  return (
    <div
      ref={containerRef}
      className={`markon-render-container ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: result.html }}
    />
  );
};

export type { MarkonLayout, MarkonMetadata, TOCItem, RenderResult };
