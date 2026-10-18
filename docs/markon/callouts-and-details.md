# Callouts and Collapsible Sections

**Nofinite Markon** provides first-class support for callout advisory boxes and Notion-style collapsible accordions.

Both components are styled using **NUICSS** semantic color tokens and designed to highlight critical instructions, warnings, or deep-dive technical appendices without disrupting reading flow.

```ts
// Framework-Agnostic Core
import { MarkonEditor, renderMarkdown } from '@nofinite/markon';

// React Adapter
import {
  MarkonEditor as ReactMarkonEditor,
  MarkonRender,
} from '@nofinite/markon/react';
```

---

## Callout Advisory Boxes

Callouts wrap content inside an attention-grabbing box with a semantic SVG icon and soft background tint.

### The 4 Semantic Variants

| Variant       | Theme Color                    | Markdown Syntax      | Recommended Use Case                                                     |
| :------------ | :----------------------------- | :------------------- | :----------------------------------------------------------------------- |
| **`info`**    | `var(--color-info)` (Blue)     | `:::info ... :::`    | Informational notes, tips, contextual background, and helpful hints      |
| **`success`** | `var(--color-success)` (Green) | `:::success ... :::` | Best practices, successful validations, and verified architectural steps |
| **`warning`** | `var(--color-warning)` (Amber) | `:::warning ... :::` | Deprecation notices, operational caveats, and non-destructive gotchas    |
| **`danger`**  | `var(--color-danger)` (Red)    | `:::danger ... :::`  | Security vulnerabilities, data loss risks, and destructive commands      |

---

## 1. Framework-Agnostic Core Usage

### Parsing & Rendering via `renderMarkdown`

In pure Node.js, Astro, or browser TypeScript, compile Markdown callouts and details blocks into semantic HTML:

```ts
import { renderMarkdown } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const markdown = `
# Production Deployment Protocol

:::info
Automated deployments occur every Tuesday at 02:00 UTC during the low-traffic maintenance window.
:::

:::danger
Running DROP TABLE without a verified PITR snapshot will result in permanent data loss.
:::

<details>
  <summary>View Database Migration SQL</summary>
  \`\`\`sql
  ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
  \`\`\`
</details>
`;

const html = renderMarkdown(markdown);
document.getElementById('content')!.innerHTML = html;
```

---

## 2. React Adapter Usage

In React applications, render interactively in either `<MarkonEditor />` or `<MarkonRender />`:

```tsx
import React, { useState } from 'react';
import { MarkonEditor, MarkonRender } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const guideContent = `
# Production Deployment Protocol

:::info
Automated deployments occur every Tuesday at 02:00 UTC during the low-traffic maintenance window.
:::
`;

export function CalloutDemo() {
  const [content, setContent] = useState(guideContent);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm space-y-4">
      <MarkonEditor content={content} onChange={setContent} />
      <MarkonRender content={content} layout="document" />
    </div>
  );
}
```
