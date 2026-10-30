# Markon Publication Renderer

`MarkonRender` is the **UI publication and presentation engine** of the Markon ecosystem. Rather than serving as a passive viewer, it is designed to consume compiled Markon JSON ASTs, sanitized HTML, or GitHub-Flavored Markdown and transform them into publication-grade editorial layouts, technical documentation, press releases, and structured handbooks.

Powered by **NUICSS** design tokens and superclasses, the renderer is **completely isomorphic with zero DOM dependencies**, allowing it to execute seamlessly in Next.js Server Components, Node.js scripts, and Edge workers, while hydrating interactively on the client.

```ts
// Framework-Agnostic Core (Zero-DOM Isomorphic Compiler)
import {
  renderMarkdown,
  renderMarkonContent,
  type MarkonRenderOptions,
} from '@nofinite/markon';

// React Adapter (Components)
import { MarkonRender } from '@nofinite/markon/react';
```

---

## Interactive Preview

---

## The 4 Built-In Layout Modes

| Layout Mode               | Intended Purpose                                       | Visual Chrome & Elements                                                                                                                                  |
| :------------------------ | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`article`** _(default)_ | Editorial blogs, magazines, and long-form features     | Responsive hero cover image, author byline card (avatar, title, profile link), reading time badge, category tag, and sticky interactive Table of Contents |
| **`document`**            | Technical handbooks, manuals, and API guides           | Header breadcrumbs, last-modified timestamp, and sticky sidebar TOC with active scrollspy                                                                 |
| **`newsroom`**            | Official press releases and corporate announcements    | Bold kicker badge, prominent headline, and dateline header with author credentials                                                                        |
| **`minimal`**             | Clean prose container for embeds, modals, and comments | Zero decorative chrome or header metadata; pure styled typographic container                                                                              |

---

## 1. Framework-Agnostic Core Usage

### Zero-DOM Isomorphic Execution (`renderMarkdown`)

Compile Markdown directly to production HTML in **Node.js**, **Cloudflare Workers**, **Astro**, **Svelte**, or **Vue** without running a browser DOM:

```ts
import { renderMarkdown } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const markdownSource = `
# Designing Perceptually Uniform UI Systems with OKLCH

Modern digital interfaces require color systems that behave predictably across dark and light modes.

## The Mathematical Foundation of OKLCH

Euler's identity links five fundamental constants:

$$e^{i\\pi} + 1 = 0$$

:::info
All components strictly consume tokens from \`@nofinite/nuicss\`.
:::
`;

// Compile to full editorial HTML with KaTeX and lowlight highlighting:
const html = renderMarkdown(markdownSource, {
  layout: 'article',
  metadata: {
    title: 'Designing Perceptually Uniform UI Systems with OKLCH',
    author: {
      name: 'Elena Rostova',
      title: 'Principal Systems Architect',
    },
    publishedAt: '2026-03-15',
    category: 'Architecture',
  },
  showTOC: true,
});

// Inject into response:
// res.setHeader('Content-Type', 'text/html');
// res.send(html);
```

---

## 2. React Adapter Usage

In React applications or Next.js App Router pages:

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const postMarkdown = `
# Designing Perceptually Uniform UI Systems with OKLCH

Modern digital interfaces require color systems that behave predictably across dark and light modes.

$$e^{i\\pi} + 1 = 0$$
`;

export function BlogPost() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <MarkonRender
        content={postMarkdown}
        layout="article"
        metadata={{
          title: 'Designing Perceptually Uniform UI Systems with OKLCH',
          author: {
            name: 'Elena Rostova',
            title: 'Principal Systems Architect',
          },
          publishedAt: '2026-03-15',
          category: 'Architecture',
        }}
        showTOC={true}
      />
    </div>
  );
}
```

---

## Configuration Reference

| Option          | Type                                                 | Default     | Description                                                     |
| :-------------- | :--------------------------------------------------- | :---------- | :-------------------------------------------------------------- |
| `content`       | `string \| JSONContent`                              | —           | Raw Markdown string, HTML, or TipTap JSONContent AST            |
| `layout`        | `'article' \| 'document' \| 'newsroom' \| 'minimal'` | `'article'` | Structural presentation mode                                    |
| `metadata`      | `MarkonMetadata`                                     | —           | Title, cover image, author credentials, date, and category tags |
| `showTOC`       | `boolean`                                            | `true`      | Renders sticky interactive Table of Contents with scrollspy     |
| `highlightCode` | `boolean`                                            | `true`      | AST code syntax highlighting via Lowlight across 16 languages   |
| `renderMath`    | `boolean`                                            | `true`      | Pre-compiles KaTeX LaTeX formulas into accessible HTML/SVG      |
