# Markon Publication Examples

Below are production-ready, copy-paste implementations of **Nofinite Markon** showcasing the universal publication renderer across all major layout modes and architectures.

---

## Example 1: Engineering Blog Post with Hero Cover & TOC

This example renders an in-depth technical article with a full-bleed hero cover image, author avatar and title, reading time estimate, pre-rendered KaTeX mathematics, and a sticky Table of Contents.

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const postMarkdown = `
# Designing Perceptually Uniform UI Systems with OKLCH

Modern digital interfaces require color systems that behave predictably across dark and light modes. Traditional sRGB and HSL color models suffer from non-uniform perceived brightness, causing yellow hues to appear drastically brighter than blue hues at identical lightness values.

## The Mathematical Foundation of OKLCH

In 2020, Ottosson formulated the Oklab color space to address perceptual anomalies in CIELAB. The cylindrical projection OKLCH represents color via three coordinates:

- **$L$ (Lightness):** Perceived brightness from $0$ (pure black) to $1$ (pure white)
- **$C$ (Chroma):** Purity and saturation from $0$ (neutral gray) to $\\sim 0.37$
- **$H$ (Hue):** Angular color wheel direction from $0^{\\circ}$ to $360^{\\circ}$

The Euclidean distance between two colors in OKLCH correlates directly to human ocular differentiation:

$$\\Delta E_{ok} = \\sqrt{(L_1 - L_2)^2 + (a_1 - a_2)^2 + (b_1 - b_2)^2}$$

## Implementing Dynamic Tokens with NUICSS

In **NUICSS**, tokens leverage CSS \`color-mix()\` in the OKLAB color space to generate harmonious surface tints and contrast borders:

\`\`\`css
:root {
  --color-primary: oklch(0.62 0.24 255);
  --color-primary-hover: oklch(0.55 0.26 255);
  --color-surface: oklch(0.98 0.01 240);
  --border-subtle: color-mix(in oklab, var(--color-primary) 15%, transparent);
}

[data-theme="dark"] {
  --color-surface: oklch(0.14 0.02 240);
  --border-subtle: color-mix(in oklab, var(--color-primary) 25%, transparent);
}
\`\`\`

## Performance Implications

By moving color calculation to native browser CSS engines, downstream client bundles eliminate megabytes of color math libraries.
`;

export function EngineeringArticlePage() {
  return (
    <div className="min-h-screen bg-surface text-default">
      <MarkonRender
        content={postMarkdown}
        format="markdown"
        layout="article"
        metadata={{
          title: 'Designing Perceptually Uniform UI Systems with OKLCH',
          subtitle:
            'Why modern design systems are abandoning sRGB for cylindrical perceptual models',
          cover: {
            src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200',
            alt: 'Spectrogram visualization of visible light frequencies',
            caption:
              'Perceptual uniformity ensures equal contrast across all palette steps.',
          },
          author: {
            name: 'Dr. Elena Rostova',
            title: 'Lead Color Scientist & Design Systems Architect',
            avatar:
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            url: 'https://github.com/erostova',
          },
          publishedAt: '2026-10-14',
          category: 'Color Architecture',
          tags: ['Color Science', 'OKLCH', 'NUICSS', 'Design Tokens'],
        }}
        showTOC={true}
        tocTitle="On this page"
      />
    </div>
  );
}
```

---

## Example 2: Technical API Reference Handbook

This example renders an API handbook with top navigation breadcrumbs, structured parameter tables, method badges, and a sticky sidebar Table of Contents with active scrollspy.

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const apiHandbookContent = `
# Edge Session Verification API

The Session Verification API enables microservices to validate asymmetric cryptographic signatures issued by identity providers without making network database roundtrips.

## Authentication Headers

Every request to the verification cluster must provide an authorized bearer token:

| Header | Format | Required | Description |
| :--- | :--- | :---: | :--- |
| \`Authorization\` | \`Bearer <jwt>\` | Yes | Signed Ed25519 identity token |
| \`X-Cluster-Region\`| \`us-east-1\` | No | Target edge region for routing optimization |
| \`X-Request-Nonce\` | \`uuidv4\` | Yes | Cryptographic nonce preventing replay attacks |

## Endpoint: Verify Session Token

\`POST /v2/sessions/verify\`

Evaluates signature validity, revocations, and claims freshness.

### Example Request

\`\`\`bash
curl -X POST https://auth.nofinite.io/v2/sessions/verify \\
  -H "Authorization: Bearer eyJhbGciOiJFZERTQ..." \\
  -H "X-Request-Nonce: 4b28c894-39f2-45e3-99b8-e565985b8fa8"
\`\`\`

### Example JSON Response

\`\`\`json
{
  "valid": true,
  "subject": "usr_99248201",
  "organizationId": "org_enterprise_alpha",
  "role": "admin",
  "expiresAt": 1792019482,
  "signatureAlgorithm": "Ed25519"
}
\`\`\`

## Error Responses

| HTTP Status | Error Code | Remedy |
| :--- | :--- | :--- |
| \`401 Unauthorized\` | \`TOKEN_EXPIRED\` | Refresh session token via the refresh grant endpoint |
| \`403 Forbidden\` | \`INSUFFICIENT_PERMISSIONS\` | Verify user role has necessary cluster access scopes |
| \`429 Too Many Requests\` | \`RATE_LIMIT_EXCEEDED\` | Exponentially back off; default limit is 5,000 req/min |
`;

export function ApiDocumentationPage() {
  return (
    <div className="min-h-screen bg-surface">
      <MarkonRender
        content={apiHandbookContent}
        format="markdown"
        layout="document"
        metadata={{
          title: 'Session Verification API Reference',
          subtitle:
            'Stateless Ed25519 signature evaluation and claims validation',
          category: 'Security Infrastructure',
          publishedAt: '2026-10-01',
        }}
        showTOC={true}
        tocTitle="Sections"
      />
    </div>
  );
}
```

---

## Example 3: Editorial Press Release

This example uses the `'newsroom'` layout for high-impact company news, product releases, and corporate announcements.

```tsx
import React from 'react';
import { MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const pressRelease = `
# Nofinite Unveils Single-Engine Styling Invariant Across Open Source Ecosystem

Today, Nofinite announced the completion of its architectural standardization initiative, establishing **NUICSS** as the sole, absolute design token and styling engine for all domain packages.

Under this standard, downstream libraries including **Nofinite Kanban**, **Nofinite Charts**, **Nofinite Media**, and **Nofinite Markon** eliminate independent CSS bundles, ensuring zero stylesheet collisions, zero duplicate class declarations, and guaranteed visual consistency across enterprise web applications.

## Key Architectural Principles

1. **Zero Downstream CSS Invariant:** Secondary packages deliver headless or pure React/TypeScript logic that apply unified NUICSS superclasses.
2. **Perceptually Uniform OKLCH Theming:** Automatic dark mode switching without muddy contrast degradation.
3. **High-Frequency Performance:** 60 FPS fluid interactions across complex kanban boards and animated D3 vector charts.

## Availability & Migration

The updated packages are available immediately via npm under the \`@nofinite\` scope. Existing projects can upgrade by removing secondary package stylesheets and importing \`@nofinite/nuicss/styles.css\` at their root layout.
`;

export function PressReleasePage() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <MarkonRender
        content={pressRelease}
        format="markdown"
        layout="newsroom"
        metadata={{
          badge: 'FOR IMMEDIATE RELEASE',
          title:
            'Nofinite Unveils Single-Engine Styling Invariant Across Open Source Ecosystem',
          publishedAt: '2026-10-15',
          author: 'Nofinite Communications Bureau',
          tags: ['Open Source', 'Architecture', 'Design Systems'],
        }}
        showTOC={false}
      />
    </div>
  );
}
```

---

## Example 4: Next.js App Router Server-Side Rendered Blog

This example demonstrates how to render Markon documents in Next.js Server Components with **zero client JavaScript overhead**:

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { renderMarkon } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

// Fetch markdown data from filesystem, CMS, or database
async function fetchPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostServerPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchPost(params.slug);

  if (!post) {
    notFound();
  }

  // Pre-render HTML, Math, Code Highlighting, and Table of Contents on the server
  const { html, readingTimeMinutes, wordCount } = renderMarkon({
    content: post.bodyMarkdown,
    format: 'markdown',
    layout: 'article',
    metadata: {
      title: post.title,
      subtitle: post.summary,
      publishedAt: post.date,
      author: post.author,
      cover: post.coverImageUrl,
      category: post.category,
      tags: post.tags,
    },
    showTOC: true,
  });

  return (
    <main className="min-h-screen bg-surface">
      {/* Zero JS Server-Rendered Document */}
      <div
        className="markon-render-container w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
```
